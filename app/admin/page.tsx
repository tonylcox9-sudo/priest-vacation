import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminDashboard from "@/components/AdminDashboard"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "admin") {
    redirect("/admin/login")
  }

  const rawRequests = await prisma.vacationRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      }
    }
  })

  const requests = rawRequests.map(req => ({
    id: req.id,
    user: req.user,
    priestName: req.priestName,
    priestParish: req.priestParish,
    priestDiocese: req.priestDiocese,
    preferredStartDate: req.preferredStartDate ? req.preferredStartDate.toISOString() : null,
    duration: req.duration,
    destinationType: req.destinationType,
    specialNotes: req.specialNotes,
    status: req.status,
    createdAt: req.createdAt.toISOString(),
    estimatedCost: req.estimatedCost ? req.estimatedCost.toString() : null,
    dioceseNotes: req.dioceseNotes,
    bankName: req.bankName,
    accountNumber: req.accountNumber,
    accountName: req.accountName,
    receiptUrl: req.receiptUrl,
    receiptUploadedAt: req.receiptUploadedAt ? req.receiptUploadedAt.toISOString() : null,
    reviewedAt: req.reviewedAt ? req.reviewedAt.toISOString() : null,
    reviewedBy: req.reviewedBy,
    paymentVerifiedAt: req.paymentVerifiedAt ? req.paymentVerifiedAt.toISOString() : null,
    paymentVerifiedBy: req.paymentVerifiedBy,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">Diocese Admin Dashboard</h1>
          <p className="text-gray-500">Manage priest vacation requests</p>
        </div>
        <div className="text-sm text-gray-500">
          Logged in as <span className="text-[#C9A227] font-medium">{session.user?.email}</span>
        </div>
      </div>
      <AdminDashboard initialRequests={requests} />
    </div>
  )
}