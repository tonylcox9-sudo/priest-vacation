import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Cathedral Background */}
      <div className="relative h-[600px] overflow-hidden">
        <img 
          src="https://kimi-web-img.moonshot.cn/img/jaleaphotography.com/03423d4333a0120086c79f6b4e5ca19f81a530e2.jpg" 
          alt="Catholic Cathedral Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/80 via-[#2D1B4E]/60 to-[#2D1B4E]/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-[#C9A227]/20 border border-[#C9A227] rounded-full text-[#C9A227] text-sm font-medium tracking-wider uppercase">
              Official Diocese Portal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Catholic Diocese
          </h1>
          <p className="text-2xl md:text-3xl text-[#C9A227] font-light mb-6">
            Priest Vacation Request System
          </p>
          <p className="max-w-2xl text-gray-200 text-lg leading-relaxed mb-10">
            A sacred duty to care for our shepherds. Submit vacation requests for priests 
            and allow the diocese to review, approve, and provide pastoral care within 48 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/request"
              className="px-8 py-4 bg-[#C9A227] text-[#2D1B4E] rounded-lg font-semibold text-lg hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-xl"
            >
              Submit Request
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Diocese Login
            </Link>
          </div>
        </div>
      </div>

      {/* Bishop & Clergy Section */}
      <section className="py-20 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-4">
              Under the Guidance of Our Shepherds
            </h2>
            <div className="w-24 h-1 bg-[#C9A227] mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Every priest deserves time for rest, retreat, and spiritual renewal. 
              Our diocese ensures proper care and coordination for all clergy vacation requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bishop Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
              <div className="h-80 overflow-hidden">
                <img 
                  src="https://kimi-web-img.moonshot.cn/img/cdn11.bigcommerce.com/4ed79db9fd817a1ae0d2a64443e05ee172973a78.jpg" 
                  alt="Bishop Portrait"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">His Excellency</h3>
                <p className="text-[#C9A227] font-medium mb-3">The Bishop</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Overseeing the spiritual and administrative welfare of all priests 
                  within the diocese. All vacation requests receive episcopal consideration.
                </p>
              </div>
            </div>

            {/* Priest Ministry Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
              <div className="h-80 overflow-hidden">
                <img 
                  src="https://kimi-web-img.moonshot.cn/img/catholicreview.org/7fb717651299c9d3ac8d9d75a45c8c4438b1ede5.jpg" 
                  alt="Priest Pastoral Ministry"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">Our Priests</h3>
                <p className="text-[#C9A227] font-medium mb-3">Pastoral Ministry</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dedicated servants who tirelessly minister to parishes. 
                  Vacation time ensures they return renewed and spiritually refreshed.
                </p>
              </div>
            </div>

            {/* Clergy Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
              <div className="h-80 overflow-hidden">
                <img 
                  src="https://kimi-web-img.moonshot.cn/img/fundacioncarf.org/bea84cfe0091bc6c90c9818a7c57fd224d715374.webp" 
                  alt="Clergy in Ceremony"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2D1B4E] mb-2">The Clergy</h3>
                <p className="text-[#C9A227] font-medium mb-3">Diocesan Family</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A brotherhood united in service. The diocese coordinates 
                  coverage and support during each priest's time away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stained Glass Divider */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src="https://kimi-web-img.moonshot.cn/img/www.cumberlandstainedglass.com/3c23d46167dba615b6413183690b54e504354ca2.jpg" 
          alt="Stained Glass Window"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2D1B4E]/70 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-[#C9A227] text-lg font-medium tracking-widest uppercase mb-2">Matthew 11:28</p>
            <p className="text-white text-2xl md:text-3xl font-light italic max-w-3xl">
              "Come to me, all you who labor and are burdened, and I will give you rest."
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] mb-4">
              How the Process Works
            </h2>
            <div className="w-24 h-1 bg-[#C9A227] mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Simple, respectful, and efficient coordination for priest vacation requests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 bg-[#F8F6F1] rounded-2xl border border-[#C9A227]/20">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center text-[#2D1B4E] font-bold text-xl shadow-lg">
                1
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Submit Request</h3>
                <p className="text-gray-600 leading-relaxed">
                  Families, parishioners, or friends complete the request form 
                  with priest details and preferred vacation dates.
                </p>
              </div>
            </div>

            <div className="relative p-8 bg-[#F8F6F1] rounded-2xl border border-[#C9A227]/20">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center text-[#2D1B4E] font-bold text-xl shadow-lg">
                2
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Diocese Reviews</h3>
                <p className="text-gray-600 leading-relaxed">
                  The diocese office reviews within 48 hours, checks parish coverage, 
                  and calculates any associated costs or arrangements.
                </p>
              </div>
            </div>

            <div className="relative p-8 bg-[#F8F6F1] rounded-2xl border border-[#C9A227]/20">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center text-[#2D1B4E] font-bold text-xl shadow-lg">
                3
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Receive Approval</h3>
                <p className="text-gray-600 leading-relaxed">
                  Requester receives email confirmation with approval status, 
                  estimated costs, and pastoral care instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cathedral Banner CTA */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://kimi-web-img.moonshot.cn/img/i.insider.com/423f729278024f42cc66e0fdf5be38e769643278" 
          alt="Grand Cathedral"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2D1B4E]/85" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Care for Those Who Care for Us
          </h2>
          <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">
            Our priests serve tirelessly. Ensuring they have proper rest and renewal 
            is a responsibility we all share as a faith community.
          </p>
          <Link
            href="/request"
            className="inline-block px-10 py-4 bg-[#C9A227] text-[#2D1B4E] rounded-lg font-bold text-lg hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-2xl"
          >
            Begin a Vacation Request
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D1B4E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#C9A227] mb-4">Catholic Diocese</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dedicated to the spiritual welfare of our clergy and the faithful 
                communities they serve across all parishes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#C9A227] mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link href="/request" className="hover:text-[#C9A227] transition-colors">Submit Request</Link></li>
                <li><Link href="/admin" className="hover:text-[#C9A227] transition-colors">Diocese Admin</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#C9A227] mb-4">Contact</h3>
              <p className="text-gray-300 text-sm">
                Diocese Chancery Office<br />
                For pastoral emergencies and inquiries<br />
                <span className="text-[#C9A227]">admin@diocese.org</span>
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 Catholic Diocese. All rights reserved. | Priest Vacation Request System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}