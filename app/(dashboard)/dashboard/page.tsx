import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StatCard, Card, CardBody } from '@/components/ui/Card'
import { getSubjectLabel, calcPercentage, getGradeBg, formatDate } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [attempts, totalSubjects] = await Promise.all([
    prisma.paperAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.paperAttempt.findMany({
      where: { userId: session.user.id },
      select: { subject: true },
      distinct: ['subject'],
    }),
  ])

  const totalAttempts = attempts.length
  const avgScore = totalAttempts
    ? Math.round(attempts.reduce((s, a) => s + calcPercentage(a.marks, a.totalMarks), 0) / totalAttempts)
    : 0
  const subjectCount = totalSubjects.length
  const bestScore = totalAttempts
    ? Math.max(...attempts.map((a) => calcPercentage(a.marks, a.totalMarks)))
    : 0

  const recent = attempts.slice(0, 5)

  // Group by subject for quick overview
  const bySubject: Record<string, { marks: number[]; total: number }> = {}
  for (const a of attempts) {
    if (!bySubject[a.subject]) bySubject[a.subject] = { marks: [], total: a.totalMarks }
    bySubject[a.subject].marks.push(calcPercentage(a.marks, a.totalMarks))
  }

  const subjectSummary = Object.entries(bySubject)
    .map(([subject, { marks }]) => ({
      subject,
      avg: Math.round(marks.reduce((s, m) => s + m, 0) / marks.length),
      best: Math.max(...marks),
      count: marks.length,
    }))
    .sort((a, b) => b.avg - a.avg)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {session.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your A/L past paper progress</p>
        </div>
        <Link
          href="/papers/add"
          className="hidden sm:inline-flex items-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Result
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Attempts"
          value={totalAttempts}
          sub="Papers completed"
          color="violet"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Avg Score"
          value={`${avgScore}%`}
          sub="Across all papers"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          label="Subjects"
          value={subjectCount}
          sub="Being tracked"
          color="emerald"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label="Best Score"
          value={`${bestScore}%`}
          sub="Personal best"
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Summary */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Subject Performance</h2>
            <Link href="/analytics" className="text-xs text-violet-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          <CardBody className="p-0">
            {subjectSummary.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">No papers added yet</p>
                <Link href="/papers/add" className="text-violet-600 text-sm font-medium hover:underline mt-1 inline-block">
                  Add your first result →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {subjectSummary.slice(0, 6).map((s) => (
                  <div key={s.subject} className="px-6 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{getSubjectLabel(s.subject)}</div>
                      <div className="text-xs text-slate-400">{s.count} attempt{s.count > 1 ? 's' : ''}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500"
                          style={{ width: `${s.avg}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${getGradeBg(s.avg)}`}>
                        {s.avg}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <Link href="/papers" className="text-xs text-violet-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          <CardBody className="p-0">
            {recent.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-500 text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recent.map((a) => {
                  const pct = calcPercentage(a.marks, a.totalMarks)
                  return (
                    <div key={a.id} className="px-6 py-3 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 border ${getGradeBg(pct)}`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{getSubjectLabel(a.subject)}</div>
                        <div className="text-xs text-slate-400">
                          {a.examYear} · {a.paperType === 'paper1' ? 'Paper I' : 'Paper II'} · Attempt {a.attemptNo}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 flex-shrink-0">{formatDate(a.createdAt)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
