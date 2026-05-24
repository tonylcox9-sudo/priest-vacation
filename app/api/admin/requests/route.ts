import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { sendStatusUpdate } from "@/lib/email"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const requests = await prisma.vacationRequest.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(requests)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
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
        reviewedAt: new Date(),
        reviewedBy: session.user?.email as string,
      }
    })

    // Send email notification to requester
    await sendStatusUpdate(
      updated.requesterEmail,
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