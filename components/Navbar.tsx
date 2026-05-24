import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-[#2D1B4E] shadow-lg border-b border-[#C9A227]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛪</span>
            <Link href="/" className="text-xl font-bold text-white tracking-wide">
              Diocese <span className="text-[#C9A227]">Vacation</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/request" className="text-gray-300 hover:text-[#C9A227] transition-colors text-sm font-medium">
              New Request
            </Link>
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded-md hover:bg-[#C9A227]/20 transition-all text-sm font-medium"
            >
              Diocese Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}