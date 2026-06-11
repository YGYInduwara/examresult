import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const session = await auth()
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-indigo-50 to-blue-50">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-900">A/L Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-violet-200">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
          GCE A/L Sri Lanka · 25 Years of Past Papers
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Track Your{' '}
          <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            A/L Journey
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Record, analyze and visualize your GCE Advanced Level past paper performance.
          Track up to <strong className="text-slate-700">3 attempts</strong> per paper across{' '}
          <strong className="text-slate-700">25 years</strong> of exam history with beautiful charts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/register"
            className="bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] text-lg"
          >
            Start Tracking Free
          </Link>
          <Link
            href="/login"
            className="bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl shadow-md border-2 border-violet-200 hover:border-violet-400 transition-all text-lg"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: '📊',
              title: 'Visual Analytics',
              desc: 'Line, area & bar charts showing your marks over 25 years of exams with grade reference lines.',
            },
            {
              icon: '🔁',
              title: '3 Attempts Per Paper',
              desc: 'Track up to 3 attempts for each paper. Compare how your score improves with each try.',
            },
            {
              icon: '📚',
              title: 'All A/L Subjects',
              desc: 'Science, Commerce & Arts streams — Combined Maths, Physics, Chemistry, Biology, Economics and more.',
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              desc: 'Fully responsive design with a native-feeling bottom navigation for mobile users.',
            },
            {
              icon: '🏆',
              title: 'Grade Tracking',
              desc: 'Automatic grade calculation (A, B, C, S, F) based on Sri Lanka A/L grading system.',
            },
            {
              icon: '🔒',
              title: 'Private & Secure',
              desc: 'Your data is yours. Secure login with encrypted passwords.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
