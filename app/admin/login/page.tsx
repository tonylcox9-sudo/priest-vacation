"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    })

    if (result?.error) {
      setError("Invalid credentials")
      setLoading(false)
    } else {
      window.location.href = "/admin"
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#C9A227]/20">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⛪</div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">Diocese Admin</h1>
          <p className="text-gray-500 mt-1">Sign in to manage vacation requests</p>
        </div>

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
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D1B4E] text-[#C9A227] py-3 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Default login:</p>
          <p className="text-[#C9A227] font-medium">admin@diocese.org / changeme123</p>
        </div>
      </div>
    </div>
  )
}