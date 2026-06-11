import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calcPercentage } from '@/lib/utils'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const attempts = await prisma.paperAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: [{ examYear: 'asc' }, { subject: 'asc' }],
  })

  // Group by subject → year → paper type → attempts
  const bySubject: Record<string, Record<number, { paper1: number[]; paper2: number[] }>> = {}

  for (const a of attempts) {
    if (!bySubject[a.subject]) bySubject[a.subject] = {}
    if (!bySubject[a.subject][a.examYear]) bySubject[a.subject][a.examYear] = { paper1: [], paper2: [] }
    const pct = calcPercentage(a.marks, a.totalMarks)
    if (a.paperType === 'paper1') bySubject[a.subject][a.examYear].paper1.push(pct)
    else bySubject[a.subject][a.examYear].paper2.push(pct)
  }

  // Build timeline per subject
  const subjectTimelines: Record<string, Array<{
    year: number
    paper1: number | null
    paper2: number | null
    best: number | null
  }>> = {}

  for (const [subject, years] of Object.entries(bySubject)) {
    subjectTimelines[subject] = Object.entries(years)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, papers]) => {
        const p1 = papers.paper1.length ? Math.round(Math.max(...papers.paper1)) : null
        const p2 = papers.paper2.length ? Math.round(Math.max(...papers.paper2)) : null
        const vals = [...(p1 !== null ? [p1] : []), ...(p2 !== null ? [p2] : [])]
        return {
          year: Number(year),
          paper1: p1,
          paper2: p2,
          best: vals.length ? Math.max(...vals) : null,
        }
      })
  }

  // Overall yearly average
  const yearlyAvg: Record<number, { sum: number; count: number }> = {}
  for (const a of attempts) {
    if (!yearlyAvg[a.examYear]) yearlyAvg[a.examYear] = { sum: 0, count: 0 }
    yearlyAvg[a.examYear].sum += calcPercentage(a.marks, a.totalMarks)
    yearlyAvg[a.examYear].count++
  }

  const yearlyChart = Object.entries(yearlyAvg)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, { sum, count }]) => ({
      year: Number(year),
      avg: Math.round(sum / count),
    }))

  const subjects = Object.keys(bySubject)
  const totalAttempts = attempts.length
  const avgScore = totalAttempts
    ? Math.round(attempts.reduce((s, a) => s + calcPercentage(a.marks, a.totalMarks), 0) / totalAttempts)
    : 0

  return (
    <AnalyticsClient
      subjectTimelines={subjectTimelines}
      yearlyChart={yearlyChart}
      subjects={subjects}
      stats={{ totalAttempts, avgScore, subjectCount: subjects.length }}
    />
  )
}
