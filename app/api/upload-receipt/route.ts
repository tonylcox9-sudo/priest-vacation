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

    console.log("Upload receipt called:")
    console.log("  requestId:", requestId)
    console.log("  userId:", session.user.id)
    console.log("  fileName:", fileName)
    console.log("  fileType:", fileType)
    console.log("  receiptData length:", receiptData?.length)

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
      console.log("Request not found:", requestId)
      return NextResponse.json({ error: "Request not found or not authorized" }, { status: 404 })
    }

    // For now, store the base64 data directly in the database
    // In production, you should upload to Cloudinary/S3 and store the URL
    const receiptUrl = receiptData

    await prisma.vacationRequest.update({
      where: { id: requestId },
      data: {
        status: "payment_pending",
        receiptUrl,
        receiptUploadedAt: new Date(),
      },
    })

    console.log("Receipt uploaded successfully for request:", requestId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}