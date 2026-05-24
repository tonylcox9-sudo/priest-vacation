import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Catholic Diocese - Priest Vacation Requests",
  description: "Submit and manage priest vacation requests",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  )
}