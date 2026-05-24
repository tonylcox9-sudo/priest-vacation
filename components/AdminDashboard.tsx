"use client"

import { useState, useEffect } from "react"
import RequestCard from "./RequestCard"

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

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    try {
      const res = await fetch("/api/admin/requests")
      const data = await res.json()
      setRequests(data)
    } catch (error) {
      console.error("Failed to fetch:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(r => r.status === filter)

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    underReview: requests.filter(r => r.status === "under_review").length,
    approved: requests.filter(r => r.status === "approved").length,
    denied: requests.filter(r => r.status === "denied").length,
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading requests...</div>

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#2D1B4E]">{stats.total}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Under Review</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Approved</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.denied}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Denied</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "under_review", "approved", "denied"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? "bg-[#2D1B4E] text-[#C9A227]"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status === "all" ? "All Requests" : status.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-400 text-lg">No requests found.</p>
            <p className="text-gray-300 text-sm mt-1">New submissions will appear here.</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} onUpdate={fetchRequests} />
          ))
        )}
      </div>
    </div>
  )
}