import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendRequestConfirmation } from "@/lib/email"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "user") {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 })
  }

  try {
    const body = await request.json()

    let startDate: Date | null = null
    if (body.preferredStartDate && body.preferredStartDate.trim() !== "") {
      const parsed = new Date(body.preferredStartDate)
      if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1900 && parsed.getFullYear() < 2100) {
        startDate = parsed
      }
    }

    const vacationRequest = await prisma.vacationRequest.create({
      data: {
        userId: session.user.id!,
        priestName: body.priestName,
        priestParish: body.priestParish,
        priestDiocese: body.priestDiocese,
        preferredStartDate: startDate,
        duration: body.duration,
        destinationType: body.destinationType,
        specialNotes: body.specialNotes || null,
      }
    })

    await sendRequestConfirmation(
      session.user.email!,
      body.priestName,
      vacationRequest.id
    )

    return NextResponse.json({ success: true, id: vacationRequest.id })
  } catch (error) {
    console.error("Request creation error:", error)
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    )
  }
}