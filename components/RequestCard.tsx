"use client"

import { useState } from "react"

interface Request {
  id: string
  requesterName: string
  requesterEmail: string
  requesterPhone: string | null
  relationship: string
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
  reviewedAt: string | null
  reviewedBy: string | null
}

export default function RequestCard({ request, onUpdate }: { request: Request; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState(request.status)
  const [cost, setCost] = useState(request.estimatedCost || "")
  const [notes, setNotes] = useState(request.dioceseNotes || "")
  const [loading, setLoading] = useState(false)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    under_review: "bg-blue-100 text-blue-800 border-blue-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    denied: "bg-red-100 text-red-800 border-red-300",
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

  return (
    <div className="bg-white rounded-xl shadow-md border-l-4 border-[#2D1B4E] overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-[#2D1B4E]">
                Fr. {request.priestName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[request.status]}`}>
                {request.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600">
              {request.priestParish} • {request.priestDiocese}
            </p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
            <p className="text-xs mt-1">ID: {request.id.slice(0, 8)}...</p>
          </div>
        </div>

        {/* All Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 bg-[#F8F6F1] rounded-lg p-4">
          {/* Requester Info */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Requested By</p>
            <p className="font-semibold text-gray-900">{request.requesterName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <p className="font-medium text-gray-900">{request.requesterEmail}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
            <p className="font-medium text-gray-900">{request.requesterPhone || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Relationship</p>
            <p className="font-medium text-gray-900 capitalize">{request.relationship}</p>
          </div>

          {/* Vacation Details */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
            <p className="font-medium text-gray-900">
              {request.preferredStartDate 
                ? new Date(request.preferredStartDate).toLocaleDateString() 
                : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
            <p className="font-medium text-gray-900">{request.duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Destination Type</p>
            <p className="font-medium text-gray-900">{destinationLabels[request.destinationType] || request.destinationType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Est. Cost</p>
            <p className="font-medium text-[#C9A227]">
              {request.estimatedCost ? `$${request.estimatedCost}` : "Not set"}
            </p>
          </div>
        </div>

        {/* Special Notes */}
        {request.specialNotes && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-500 uppercase tracking-wider mb-1">Special Notes from Requester</p>
            <p className="text-gray-700 text-sm">{request.specialNotes}</p>
          </div>
        )}

        {/* Diocese Notes (if any) */}
        {request.dioceseNotes && !editing && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
            <p className="text-xs text-purple-500 uppercase tracking-wider mb-1">Diocese Notes</p>
            <p className="text-gray-700 text-sm">{request.dioceseNotes}</p>
          </div>
        )}

        {/* Review Info */}
        {request.reviewedAt && (
          <div className="mb-4 text-xs text-gray-400">
            Reviewed on {new Date(request.reviewedAt).toLocaleDateString()} 
            {request.reviewedBy && ` by ${request.reviewedBy}`}
          </div>
        )}

        {/* Edit Form */}
        {editing ? (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                <input 
                  type="number" 
                  value={cost} 
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diocese Notes</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add internal notes or instructions for the requester..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="bg-[#2D1B4E] text-[#C9A227] px-6 py-2 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-medium transition-colors"
              >
                {loading ? "Saving..." : "Save & Notify Requester"}
              </button>
              <button 
                onClick={() => {
                  setEditing(false)
                  setStatus(request.status)
                  setCost(request.estimatedCost || "")
                  setNotes(request.dioceseNotes || "")
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setEditing(true)}
            className="text-[#2D1B4E] hover:text-[#C9A227] text-sm font-semibold transition-colors flex items-center gap-1"
          >
            Review / Update Request →
          </button>
        )}
      </div>
    </div>
  )
}