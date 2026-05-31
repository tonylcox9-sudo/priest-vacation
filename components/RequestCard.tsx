"use client"

import { useState } from "react"

interface User {
  name: string
  email: string
  phone: string | null
}

interface Request {
  id: string
  user: User
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
  reviewedAt: string | null
  reviewedBy: string | null
  paymentVerifiedAt: string | null
  paymentVerifiedBy: string | null
}

export default function RequestCard({ request, onUpdate }: { request: Request; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState(request.status)
  const [cost, setCost] = useState(request.estimatedCost || "")
  const [notes, setNotes] = useState(request.dioceseNotes || "")
  const [bankName, setBankName] = useState(request.bankName || "")
  const [accountNumber, setAccountNumber] = useState(request.accountNumber || "")
  const [accountName, setAccountName] = useState(request.accountName || "")
  const [loading, setLoading] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    under_review: "bg-blue-100 text-blue-800 border-blue-300",
    payment_required: "bg-purple-100 text-purple-800 border-purple-300",
    payment_pending: "bg-orange-100 text-orange-800 border-orange-300",
    payment_verified: "bg-teal-100 text-teal-800 border-teal-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    denied: "bg-red-100 text-red-800 border-red-300",
  }

  const statusFlow: Record<string, string> = {
    pending: "Awaiting review",
    under_review: "Under review by diocese",
    payment_required: "Payment required from requester",
    payment_pending: "Receipt uploaded, awaiting admin verification",
    payment_verified: "Payment verified, awaiting final approval",
    approved: "Approved - vacation authorized",
    denied: "Denied",
  }

  const destinationLabels: Record<string, string> = {
    retreat: "Retreat / Spiritual Renewal",
    family_visit: "Family Visit",
    rest: "Rest & Recovery",
    study: "Study / Conference",
    other: "Other",
  }

  async function handleUpdate() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: request.id,
          status,
          estimatedCost: cost ? parseFloat(cost) : null,
          dioceseNotes: notes,
          bankName: bankName || null,
          accountNumber: accountNumber || null,
          accountName: accountName || null,
        }),
      })

      if (res.ok) {
        setEditing(false)
        onUpdate()
      }
    } catch (error) {
      alert("Update failed")
    } finally {
      setLoading(false)
    }
  }

  async function verifyPayment() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: request.id }),
      })

      const data = await res.json()

      if (res.ok) {
        onUpdate()
      } else {
        alert(data.error || "Verification failed")
      }
    } catch (error) {
      alert("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  async function approveRequest() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: request.id,
          status: "approved",
        }),
      })

      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      alert("Approval failed")
    } finally {
      setLoading(false)
    }
  }

  // Detect file type from base64 data URL
  const getFileType = (url: string | null): string => {
    if (!url) return "unknown"
    if (url.startsWith("data:image/")) return "image"
    if (url.startsWith("data:application/pdf")) return "pdf"
    if (url.startsWith("data:")) return "other"
    return "url"
  }

  const fileType = getFileType(request.receiptUrl)
  const isImage = fileType === "image"
  const isPdf = fileType === "pdf"

  return (
    <div className="bg-white rounded-xl shadow-md border-l-4 border-[#2D1B4E] overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-[#2D1B4E]">Fr. {request.priestName}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[request.status]}`}>
                {request.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600">{request.priestParish} &bull; {request.priestDiocese}</p>
            <p className="text-xs text-gray-400 mt-1">{statusFlow[request.status]}</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
            <p className="text-xs mt-1">ID: {request.id.slice(0, 8)}...</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-blue-500 uppercase tracking-wider mb-2">Requested By</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Name</p>
              <p className="font-medium text-gray-900">{request.user.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="font-medium text-gray-900">{request.user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Phone</p>
              <p className="font-medium text-gray-900">{request.user.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-[#F8F6F1] rounded-lg p-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
            <p className="font-medium text-gray-900">
              {request.preferredStartDate ? new Date(request.preferredStartDate).toLocaleDateString() : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
            <p className="font-medium text-gray-900">{request.duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
            <p className="font-medium text-gray-900">{destinationLabels[request.destinationType] || request.destinationType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Est. Cost</p>
            <p className="font-medium text-[#C9A227]">{request.estimatedCost ? `$${request.estimatedCost}` : "Not set"}</p>
          </div>
        </div>

        {request.specialNotes && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Special Notes</p>
            <p className="text-gray-700 text-sm">{request.specialNotes}</p>
          </div>
        )}

        {request.receiptUrl && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-orange-600 uppercase tracking-wider font-bold">Payment Receipt Uploaded</p>
              <button
                onClick={() => setShowReceipt(!showReceipt)}
                className="text-sm text-[#2D1B4E] font-medium hover:text-[#C9A227] transition-colors"
              >
                {showReceipt ? "Hide Receipt" : "View Receipt"}
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Uploaded: {request.receiptUploadedAt ? new Date(request.receiptUploadedAt).toLocaleDateString() : "Unknown"}
            </p>

            {showReceipt && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
                {isImage ? (
                  <div>
                    <img
                      src={request.receiptUrl}
                      alt="Payment Receipt"
                      className="max-w-full max-h-96 rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-400 mt-2">Image receipt</p>
                  </div>
                ) : isPdf ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">📄 PDF Receipt</p>
                    <div className="w-full h-96 rounded-lg border border-gray-200 overflow-hidden">
                      <iframe
                        src={request.receiptUrl}
                        className="w-full h-full"
                        title="PDF Receipt"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newWindow = window.open()
                        if (newWindow) {
                          newWindow.document.write(`
                            <html>
                              <head><title>PDF Receipt</title></head>
                              <body style="margin:0">
                                <iframe src="${request.receiptUrl}" width="100%" height="100%" style="border:none"></iframe>
                              </body>
                            </html>
                          `)
                        }
                      }}
                      className="text-sm text-[#C9A227] underline"
                    >
                      Open PDF in new window
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">Receipt file uploaded</p>
                    <button
                      onClick={() => {
                        const newWindow = window.open()
                        if (newWindow && request.receiptUrl) {
                          newWindow.document.write(`
                            <html>
                              <head><title>Receipt</title></head>
                              <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5">
                                <iframe src="${request.receiptUrl}" width="90%" height="90vh" style="border:none"></iframe>
                              </body>
                            </html>
                          `)
                        }
                      }}
                      className="mt-2 text-sm bg-[#2D1B4E] text-[#C9A227] px-4 py-2 rounded-md"
                    >
                      View Receipt
                    </button>
                  </div>
                )}
              </div>
            )}

            {request.status === "payment_pending" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={verifyPayment}
                  disabled={loading}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Verifying..." : "✓ Verify Payment (Valid)"}
                </button>
                <button
                  onClick={() => { setStatus("payment_required"); setEditing(true) }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  ⚠ Request More Payment
                </button>
              </div>
            )}
          </div>
        )}

        {request.status === "payment_verified" && (
          <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-700 mb-2">
              Payment verified by {request.paymentVerifiedBy} on {request.paymentVerifiedAt ? new Date(request.paymentVerifiedAt).toLocaleDateString() : "N/A"}
            </p>
            <button
              onClick={approveRequest}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Approving..." : "✓ Final Approve Vacation"}
            </button>
          </div>
        )}

        {editing ? (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none">
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="payment_required">Payment Required</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., Chase Bank" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="0000000000" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account Holder Name" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diocese Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpdate} disabled={loading} className="bg-[#2D1B4E] text-[#C9A227] px-6 py-2 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-medium transition-colors">
                {loading ? "Saving..." : "Save & Notify Requester"}
              </button>
              <button onClick={() => setEditing(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-[#2D1B4E] hover:text-[#C9A227] text-sm font-semibold transition-colors flex items-center gap-1">
            Review / Update Request &rarr;
          </button>
        )}
      </div>
    </div>
  )
}