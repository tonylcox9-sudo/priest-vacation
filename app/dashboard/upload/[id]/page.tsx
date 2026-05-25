"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadReceiptPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("receipt", file)
    formData.append("requestId", params.id)

    try {
      const res = await fetch("/api/upload-receipt", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        alert("Upload failed")
      }
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-[#C9A227]/20 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2D1B4E]">Upload Payment Receipt</h1>
          <p className="text-gray-500">Upload proof of payment for verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#C9A227] transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="hidden"
              id="receipt"
            />
            <label htmlFor="receipt" className="cursor-pointer block">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-600 font-medium">
                {file ? file.name : "Click to upload receipt"}
              </p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, or PDF</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-[#2D1B4E] text-[#C9A227] py-3 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? "Uploading..." : "Upload Receipt"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-[#2D1B4E]">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}