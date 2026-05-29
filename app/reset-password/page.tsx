"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [validToken, setValidToken] = useState(true)

  useEffect(() => {
    if (!token) {
      setValidToken(false)
      setError("Invalid reset link. Please request a new one.")
    }
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-3">⛪</div>
        <h1 className="text-2xl font-bold text-[#2D1B4E] mb-4">Invalid Link</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <Link href="/forgot-password" className="text-[#C9A227] font-medium hover:underline">
          Request New Reset Link
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">⛪</div>
        <h1 className="text-2xl font-bold text-[#2D1B4E]">Reset Password</h1>
        <p className="text-gray-500 mt-1">Create a new password for your account</p>
      </div>

      {success ? (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Password reset successful!</p>
            <p className="text-sm mt-1">Redirecting to login page...</p>
          </div>
          <Link href="/login" className="text-[#C9A227] font-medium hover:underline">
            Go to Login
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
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D1B4E] text-[#C9A227] py-3 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-semibold transition-colors"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#C9A227]/20">
        <Suspense fallback={
          <div className="text-center py-8">
            <div className="text-4xl mb-3">⛪</div>
            <p className="text-gray-500">Loading...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}