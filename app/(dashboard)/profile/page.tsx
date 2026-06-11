import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardBody } from '@/components/ui/Card'
import { calcPercentage, getSubjectLabel, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  const attempts = await prisma.paperAttempt.findMany({
    where: { userId: session.user.id },
  })

  const subjects = [...new Set(attempts.map((a) => a.subject))]
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + calcPercentage(a.marks, a.totalMarks), 0) / attempts.length)
    : 0

  const bestAttempt = attempts.reduce<typeof attempts[0] | null>((best, a) => {
    if (!best) return a
    return calcPercentage(a.marks, a.totalMarks) > calcPercentage(best.marks, best.totalMarks) ? a : best
  }, null)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your account and progress overview</p>
      </div>

      {/* User Info */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{user?.name}</div>
              <div className="text-slate-500 text-sm">{user?.email}</div>
              <div className="text-xs text-slate-400 mt-1">
                Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Attempts', value: attempts.length, icon: '📝' },
          { label: 'Subjects Tracked', value: subjects.length, icon: '📚' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: '📊' },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="text-center py-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Best Achievement */}
      {bestAttempt && (
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">🏆 Best Achievement</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-lg font-bold">
                {calcPercentage(bestAttempt.marks, bestAttempt.totalMarks)}%
              </div>
              <div>
                <div className="font-semibold text-slate-900">{getSubjectLabel(bestAttempt.subject)}</div>
                <div className="text-sm text-slate-500">
                  {bestAttempt.examYear} · {bestAttempt.paperType === 'paper1' ? 'Paper I' : 'Paper II'} · Attempt {bestAttempt.attemptNo}
                </div>
                <div className="text-xs text-slate-400">
                  {bestAttempt.marks}/{bestAttempt.totalMarks} marks
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Subjects */}
      {subjects.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Tracked Subjects</h2>
          </div>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <span key={s} className="bg-violet-50 text-violet-700 border border-violet-200 text-sm px-3 py-1.5 rounded-xl font-medium">
                  {getSubjectLabel(s)}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
