import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendRequestConfirmation } from "@/lib/email"

// GET - Fetch user's requests
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const requests = await prisma.vacationRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        priestName: true,
        priestParish: true,
        priestDiocese: true,
        preferredStartDate: true,
        duration: true,
        destinationType: true,
        specialNotes: true,
        status: true,
        createdAt: true,
        estimatedCost: true,
        dioceseNotes: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        receiptUrl: true,
        receiptUploadedAt: true,
      }
    })

    const serialized = requests.map(req => ({
      ...req,
      estimatedCost: req.estimatedCost ? req.estimatedCost.toString() : null,
      preferredStartDate: req.preferredStartDate ? req.preferredStartDate.toISOString() : null,
      createdAt: req.createdAt.toISOString(),
      receiptUploadedAt: req.receiptUploadedAt ? req.receiptUploadedAt.toISOString() : null,
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Fetch requests error:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

// POST - Create new request
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
  } catch (error: any) {
    console.error("Request creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create request" },
      { status: 500 }
    )
  }
}