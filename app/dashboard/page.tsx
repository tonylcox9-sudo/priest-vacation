import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "user") {
    redirect("/login")
  }

  const requests = await prisma.vacationRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

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
    payment_pending: "Payment Pending",
    payment_verified: "Payment Verified",
    approved: "Approved",
    denied: "Denied",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">My Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session.user.name}</p>
        </div>
        <Link
          href="/request"
          className="bg-[#C9A227] text-[#2D1B4E] px-6 py-2 rounded-md font-semibold hover:bg-[#D4AF37] transition-colors"
        >
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-lg">No vacation requests yet</p>
          <p className="text-gray-300 text-sm mt-1">Create your first request for a priest</p>
          <Link href="/request" className="inline-block mt-4 text-[#C9A227] font-medium hover:underline">
            Create Request →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow-md border-l-4 border-[#2D1B4E] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2D1B4E]">Fr. {req.priestName}</h3>
                  <p className="text-gray-600 text-sm">{req.priestParish} • {req.priestDiocese}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[req.status]}`}>
                  {statusLabels[req.status] || req.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Duration</p>
                  <p className="font-medium text-gray-900">{req.duration}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {req.preferredStartDate ? new Date(req.preferredStartDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Est. Cost</p>
                  <p className="font-medium text-[#C9A227]">
                    {req.estimatedCost ? `$${req.estimatedCost.toString()}` : "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Submitted</p>
                  <p className="font-medium text-gray-900">{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {req.status === "payment_required" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <p className="text-purple-800 font-medium mb-2">Payment Required</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Please pay <strong>${req.estimatedCost?.toString()}</strong> to complete your request.
                  </p>
                  <Link
                    href={`/dashboard/pay/${req.id}`}
                    className="inline-block bg-[#2D1B4E] text-[#C9A227] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3D2B5E] transition-colors"
                  >
                    View Payment Details →
                  </Link>
                </div>
              )}

              {req.status === "payment_pending" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 font-medium mb-2">Upload Receipt</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Upload your payment receipt for verification.
                  </p>
                  <Link
                    href={`/dashboard/upload/${req.id}`}
                    className="inline-block bg-[#2D1B4E] text-[#C9A227] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3D2B5E] transition-colors"
                  >
                    Upload Receipt →
                  </Link>
                </div>
              )}

              {req.status === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✅ Approved</p>
                  <p className="text-sm text-gray-700">Your vacation request has been approved!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}