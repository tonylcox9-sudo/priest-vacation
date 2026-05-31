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
    const formData = await request.formData()
    const requestId = formData.get("requestId") as string
    const file = formData.get("receipt") as File

    console.log("Upload receipt called:")
    console.log("  requestId:", requestId)
    console.log("  userId:", session.user.id)
    console.log("  file:", file?.name)

    if (!requestId || !file) {
      return NextResponse.json({ error: "Missing requestId or receipt file" }, { status: 400 })
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

    // In production, upload to Cloudinary, S3, or UploadThing
    // For now, we'll store a placeholder URL
    const receiptUrl = `/receipts/${requestId}-${file.name}`

    // Update request status
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