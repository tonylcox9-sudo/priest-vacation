import VacationForm from "@/components/VacationForm"

export default function RequestPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Request Priest Vacation
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out this form to request vacation time for a priest. The diocese will review and respond within 48 hours.
        </p>
        <VacationForm />
      </div>
    </div>
  )
}