import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { sendStatusUpdate } from "@/lib/email"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const requests = await prisma.vacationRequest.findMany({
      orderBy: { createdAt: "desc" },
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
    return NextResponse.json(requests)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const updated = await prisma.vacationRequest.update({
      where: { id: body.id },
      data: {
        status: body.status,
        estimatedCost: body.estimatedCost,
        dioceseNotes: body.dioceseNotes,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
        reviewedAt: new Date(),
        reviewedBy: session.user?.email as string,
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
      updated.status,
      updated.estimatedCost?.toString() || null,
      updated.dioceseNotes
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}