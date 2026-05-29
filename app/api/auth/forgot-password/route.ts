import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Don't reveal if user exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset email has been sent."
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    })

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://priest-vacation.vercel.app"}/reset-password?token=${resetToken}`

    await sendPasswordResetEmail(user.email, user.name, resetUrl)

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset email has been sent."
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}