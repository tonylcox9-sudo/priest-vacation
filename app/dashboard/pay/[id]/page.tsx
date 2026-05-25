import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function PayPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "user") {
    redirect("/login")
  }

  const request = await prisma.vacationRequest.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
      status: "payment_required",
    },
  })

  if (!request) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-[#C9A227]/20 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2D1B4E]">Payment Details</h1>
          <p className="text-gray-500">Complete payment for Fr. {request.priestName}&apos;s vacation</p>
        </div>

        <div className="bg-[#F8F6F1] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Estimated Cost</span>
            <span className="text-2xl font-bold text-[#2D1B4E]">${request.estimatedCost?.toString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-sm text-gray-500 mb-4">Please transfer the amount to the following account:</p>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name</span>
                <span className="font-medium text-gray-900">{request.bankName || "Catholic Diocese Bank"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium text-gray-900">{request.accountNumber || "0000000000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name</span>
                <span className="font-medium text-gray-900">{request.accountName || "Catholic Diocese Vacation Fund"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            After making payment, upload your receipt for verification.
          </p>
          <Link
            href={`/dashboard/upload/${request.id}`}
            className="inline-block bg-[#2D1B4E] text-[#C9A227] px-8 py-3 rounded-md font-semibold hover:bg-[#3D2B5E] transition-colors"
          >
            I&apos;ve Paid - Upload Receipt →
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-[#2D1B4E]">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}