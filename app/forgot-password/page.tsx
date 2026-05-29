"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#C9A227]/20">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⛪</div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">Forgot Password</h1>
          <p className="text-gray-500 mt-1">Enter your email to reset your password</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">Reset email sent!</p>
              <p className="text-sm mt-1">Check your inbox for the password reset link. The link expires in 1 hour.</p>
            </div>
            <Link href="/login" className="text-[#C9A227] font-medium hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  autoComplete="off"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D1B4E] text-[#C9A227] py-3 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-semibold transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <Link href="/login" className="text-[#C9A227] font-medium hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}