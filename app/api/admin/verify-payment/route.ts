import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendStatusUpdate } from "@/lib/email"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    const vacationRequest = await prisma.vacationRequest.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!vacationRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    if (vacationRequest.status !== "payment_pending") {
      return NextResponse.json({ 
        error: "Request is not awaiting payment verification" 
      }, { status: 400 })
    }

    // Update status to payment_verified (admin confirmed receipt is valid)
    await prisma.vacationRequest.update({
      where: { id },
      data: {
        status: "payment_verified",
        paymentVerifiedAt: new Date(),
        paymentVerifiedBy: session.user.email,
      },
    })

    // Send email notification
    await sendStatusUpdate(
      vacationRequest.user.email,
      vacationRequest.priestName,
      "payment_verified",
      vacationRequest.estimatedCost ? vacationRequest.estimatedCost.toString() : null,
      "Your payment has been verified by the diocese."
    )

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified successfully" 
    })
  } catch (error: any) {
    console.error("Verify payment error:", error)
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 })
  }
}