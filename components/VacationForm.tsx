"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VacationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      requesterName: formData.get("requesterName"),
      requesterEmail: formData.get("requesterEmail"),
      requesterPhone: formData.get("requesterPhone"),
      relationship: formData.get("relationship"),
      priestName: formData.get("priestName"),
      priestParish: formData.get("priestParish"),
      priestDiocese: formData.get("priestDiocese"),
      preferredStartDate: formData.get("preferredStartDate"),
      duration: formData.get("duration"),
      destinationType: formData.get("destinationType"),
      specialNotes: formData.get("specialNotes"),
    }

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push("/"), 3000)
      }
    } catch (error) {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-green-600">Request Submitted!</h2>
        <p className="text-gray-600 mt-2">
          You will receive a confirmation email shortly. The diocese will respond within 48 hours.
        </p>
      </div>
    )
  }

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"
  const selectClass = "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#C9A227] focus:ring-[#C9A227] focus:outline-none"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-[#2D1B4E] mb-4 border-b border-[#C9A227]/30 pb-2">
          Your Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input name="requesterName" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input name="requesterEmail" type="email" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input name="requesterPhone" type="tel" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relationship to Priest *</label>
            <select name="relationship" required className={selectClass}>
              <option value="">Select...</option>
              <option value="family">Family Member</option>
              <option value="parishioner">Parishioner</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#2D1B4E] mb-4 border-b border-[#C9A227]/30 pb-2">
          Priest Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Priest&apos;s Full Name *</label>
            <input name="priestName" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parish Name *</label>
            <input name="priestParish" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diocese *</label>
            <input name="priestDiocese" required placeholder="e.g., Lagos Diocese" className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#2D1B4E] mb-4 border-b border-[#C9A227]/30 pb-2">
          Vacation Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Start Date</label>
            <input name="preferredStartDate" type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration *</label>
            <select name="duration" required className={selectClass}>
              <option value="">Select...</option>
              <option value="1 week">1 Week</option>
              <option value="2 weeks">2 Weeks</option>
              <option value="1 month">1 Month</option>
              <option value="2 months">2 Months</option>
              <option value="other">Other (specify in notes)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination Type *</label>
            <select name="destinationType" required className={selectClass}>
              <option value="">Select...</option>
              <option value="retreat">Retreat / Spiritual Renewal</option>
              <option value="family_visit">Family Visit</option>
              <option value="rest">Rest & Recovery</option>
              <option value="study">Study / Conference</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Special Notes / Additional Information</label>
            <textarea name="specialNotes" rows={3} className={inputClass} placeholder="Any special requirements or information..." />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2D1B4E] text-[#C9A227] py-3 px-4 rounded-md hover:bg-[#3D2B5E] disabled:opacity-50 font-semibold text-lg transition-colors"
      >
        {loading ? "Submitting..." : "Submit Vacation Request"}
      </button>
    </form>
  )
}