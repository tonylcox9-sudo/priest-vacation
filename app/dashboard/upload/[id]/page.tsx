"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function UploadReceiptPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params?.id as string

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const acceptedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
    "image/tiff",
    "image/heic",
    "image/heif",
    "application/pdf",
  ]

  const acceptedExtensions = ".png,.jpg,.jpeg,.gif,.webp,.bmp,.svg,.tiff,.heic,.heif,.pdf"

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setError("")
    setPreview(null)

    if (!selected) return

    // Validate file type
    if (!acceptedTypes.includes(selected.type) && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Invalid file type. Please upload an image (PNG, JPG, GIF, WEBP, etc.) or PDF.")
      setFile(null)
      return
    }

    // Validate file size (max 10MB)
    if (selected.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.")
      setFile(null)
      return
    }

    // Create preview for images
    if (selected.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selected)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    if (!requestId) {
      setError("Request ID not found. Please go back and try again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const res = await fetch("/api/upload-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          receiptData: base64,
          fileName: file.name,
          fileType: file.type,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push("/dashboard")
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Something went wrong")
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
          <p className="text-xs text-gray-400 mt-1">Request ID: {requestId || "Loading..."}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#C9A227] transition-colors">
            <input
              type="file"
              accept={acceptedExtensions}
              onChange={handleFileChange}
              required
              className="hidden"
              id="receipt"
            />
            <label htmlFor="receipt" className="cursor-pointer block">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-600 font-medium">
                {file ? file.name : "Click to upload receipt"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, GIF, WEBP, BMP, SVG, TIFF, HEIC, PDF
              </p>
              <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
            </label>
          </div>

          {preview && file?.type.startsWith("image/") && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Receipt preview"
                className="max-w-full max-h-64 rounded-lg border border-gray-200"
              />
            </div>
          )}

          {file && file.type === "application/pdf" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">📄 PDF selected: {file.name}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file || !requestId}
            className="w-full bg-[#2D1B4E] text-[#C9A227] py-3 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? "Uploading..." : "Upload Receipt"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-[#2D1B4E]">
            &larr; Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}