import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
        dioceseNotes: true,  // Make sure this is included
        bankName: true,
        accountNumber: true,
        accountName: true,
        receiptUrl: true,
        receiptUploadedAt: true,
      }
    })

    // Convert Decimal to string for JSON serialization
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