import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminDashboard from "@/components/AdminDashboard"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

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
      <AdminDashboard />
    </div>
  )
}