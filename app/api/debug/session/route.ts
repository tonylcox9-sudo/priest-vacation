import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  console.log("Debug session:", JSON.stringify(session, null, 2))

  return NextResponse.json({
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    userType: session?.user?.userType || null,
    fullSession: session
  })
}