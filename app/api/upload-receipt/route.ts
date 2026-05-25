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

    if (!requestId || !file) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}