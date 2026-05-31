"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Request {
  id: string
  priestName: string
  priestParish: string
  priestDiocese: string
  preferredStartDate: string | null
  duration: string
  destinationType: string
  specialNotes: string | null
  status: string
  createdAt: string
  estimatedCost: string | null
  dioceseNotes: string | null
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
  receiptUrl: string | null
  receiptUploadedAt: string | null
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/requests")
        const data = await res.json()
        setRequests(data)
      } catch (error) {
        console.error("Failed to fetch requests:", error)
      } finally {
        setLoading(false)
      }
    }
    if (session) fetchRequests()
  }, [session])

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    payment_required: "bg-purple-100 text-purple-800",
    payment_pending: "bg-orange-100 text-orange-800",
    payment_verified: "bg-teal-100 text-teal-800",
    approved: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
  }

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    payment_required: "Payment Required",
    payment_pending: "Payment Pending Verification",
    payment_verified: "Payment Verified",
    approved: "Approved",
    denied: "Denied",
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading your requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">My Vacation Requests</h1>
          <p className="text-gray-500">Track your priest vacation requests</p>
        </div>
        <Link
          href="/request"
          className="bg-[#2D1B4E] text-[#C9A227] px-4 py-2 rounded-md hover:bg-[#3D2B5E] font-medium transition-colors"
        >
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-400 text-lg">No requests yet.</p>
          <Link href="/request" className="text-[#C9A227] hover:underline mt-2 inline-block">
            Submit your first request
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow-md border-l-4 border-[#2D1B4E] p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-[#2D1B4E]">Fr. {req.priestName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[req.status]}`}>
                      {statusLabels[req.status] || req.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{req.priestParish} &bull; {req.priestDiocese}</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-[#F8F6F1] rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {req.preferredStartDate ? new Date(req.preferredStartDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                  <p className="font-medium text-gray-900">{req.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Type</p>
                  <p className="font-medium text-gray-900">{req.destinationType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Est. Cost</p>
                  <p className="font-medium text-[#C9A227]">{req.estimatedCost ? `$${req.estimatedCost}` : "Not set"}</p>
                </div>
              </div>

              {req.dioceseNotes && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-600 uppercase tracking-wider mb-1 font-bold">Message from Diocese</p>
                  <p className="text-gray-700 text-sm">{req.dioceseNotes}</p>
                </div>
              )}

              {req.bankName && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-600 uppercase tracking-wider mb-2 font-bold">Payment Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Bank</p>
                      <p className="font-medium text-gray-900">{req.bankName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Account Number</p>
                      <p className="font-medium text-gray-900">{req.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Account Name</p>
                      <p className="font-medium text-gray-900">{req.accountName}</p>
                    </div>
                  </div>
                </div>
              )}

              {req.status === "payment_required" && (
                <div className="mt-4">
                  <Link
                    href={`/dashboard/pay/${req.id}`}
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium transition-colors"
                  >
                    💳 Make Payment
                  </Link>
                </div>
              )}

              {req.status === "payment_pending" && (
                <div className="mt-4">
                  <p className="text-sm text-orange-600 mb-2">
                    ⏳ Your receipt is being reviewed by the diocese.
                  </p>
                </div>
              )}

              {req.status === "payment_verified" && (
                <div className="mt-4">
                  <p className="text-sm text-teal-600">
                    ✅ Payment verified! Awaiting final approval.
                  </p>
                </div>
              )}

              {req.status === "approved" && (
                <div className="mt-4">
                  <p className="text-sm text-green-600">
                    🎉 Approved! Your vacation request has been authorized.
                  </p>
                </div>
              )}

              {req.status === "denied" && (
                <div className="mt-4">
                  <p className="text-sm text-red-600">
                    ❌ Request denied. Contact the diocese for more information.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}