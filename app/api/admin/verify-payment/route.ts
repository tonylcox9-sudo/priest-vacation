import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { sendStatusUpdate } from "@/lib/email"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const updated = await prisma.vacationRequest.update({
      where: { id: body.id },
      data: {
        status: "approved",
        paymentVerifiedAt: new Date(),
        paymentVerifiedBy: session.user?.email as string,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    })

    await sendStatusUpdate(
      updated.user.email,
      updated.priestName,
      "approved",
      updated.estimatedCost?.toString() || null,
      "Your payment has been verified. Your vacation request is now approved!"
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}