import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendRequestConfirmation } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Handle date properly - only convert if valid date string exists
    let startDate: Date | null = null
    if (body.preferredStartDate && body.preferredStartDate.trim() !== "") {
      const parsed = new Date(body.preferredStartDate)
      // Check if valid date (not NaN and reasonable year)
      if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1900 && parsed.getFullYear() < 2100) {
        startDate = parsed
      }
    }

    const vacationRequest = await prisma.vacationRequest.create({
      data: {
        requesterName: body.requesterName,
        requesterEmail: body.requesterEmail,
        requesterPhone: body.requesterPhone || null,
        relationship: body.relationship,
        priestName: body.priestName,
        priestParish: body.priestParish,
        priestDiocese: body.priestDiocese,
        preferredStartDate: startDate,
        duration: body.duration,
        destinationType: body.destinationType,
        specialNotes: body.specialNotes || null,
      }
    })

    // Send confirmation email
    await sendRequestConfirmation(
      body.requesterEmail,
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