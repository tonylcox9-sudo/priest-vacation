import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Catholic Diocese - Priest Vacation Requests",
  description: "Submit and manage priest vacation requests for the Catholic Diocese. Streamlined vacation approval, payment tracking, and receipt management.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Catholic Diocese - Priest Vacation Requests",
    description: "Submit and manage priest vacation requests for the Catholic Diocese.",
    url: "https://diocesevacation.cam",
    siteName: "Diocese Vacation Portal",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 1200,
        alt: "Diocese Vacation Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catholic Diocese - Priest Vacation Requests",
    description: "Submit and manage priest vacation requests for the Catholic Diocese.",
    images: ["/opengraph.png"],
  },
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