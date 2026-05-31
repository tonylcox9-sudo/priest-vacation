import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendRequestConfirmation } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    console.log("Session:", JSON.stringify(session, null, 2))

    if (!session) {
      return NextResponse.json({ error: "No session found. Please log in." }, { status: 401 })
    }

    if (session.user?.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized. User login required." }, { status: 401 })
    }

    if (!session.user?.id) {
      return NextResponse.json({ error: "User ID not found in session. Please log out and log back in." }, { status: 401 })
    }

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
        userId: session.user.id,
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
  } catch (error: any) {
    console.error("Request creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create request" },
      { status: 500 }
    )
  }
}