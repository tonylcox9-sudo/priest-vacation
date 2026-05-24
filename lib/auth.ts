import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        })

        if (!admin) return null

        const isValid = await bcrypt.compare(credentials.password, admin.password)
        if (!isValid) return null

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (token?.role && session.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt"
  }
}