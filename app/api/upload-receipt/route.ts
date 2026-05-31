import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { requestId, receiptData, fileName, fileType } = await request.json()

    if (!requestId || !receiptData) {
      return NextResponse.json({ error: "Missing requestId or receipt data" }, { status: 400 })
    }

    // Verify the request exists and belongs to this user
    const existingRequest = await prisma.vacationRequest.findFirst({
      where: {
        id: requestId,
        userId: session.user.id,
      }
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found or not authorized" }, { status: 404 })
    }

    // Only allow upload if status is payment_required
    if (existingRequest.status !== "payment_required") {
      return NextResponse.json({ 
        error: "Cannot upload receipt. Request status is not awaiting payment." 
      }, { status: 400 })
    }

    // Update request: status = payment_pending (waiting for admin verification)
    await prisma.vacationRequest.update({
      where: { id: requestId },
      data: {
        status: "payment_pending",  // NOT approved - waiting for admin review
        receiptUrl: receiptData,
        receiptUploadedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: "Receipt uploaded. Waiting for admin verification." 
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}