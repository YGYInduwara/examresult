import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const attempts = await prisma.paperAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: [{ examYear: 'asc' }, { subject: 'asc' }],
  })

  // Group by subject for per-subject analytics
  const bySubject: Record<string, {
    years: Record<number, { paper1: number[]; paper2: number[] }>
    bestMarks: number
    totalAttempts: number
  }> = {}

  for (const a of attempts) {
    if (!bySubject[a.subject]) {
      bySubject[a.subject] = { years: {}, bestMarks: 0, totalAttempts: 0 }
    }
    if (!bySubject[a.subject].years[a.examYear]) {
      bySubject[a.subject].years[a.examYear] = { paper1: [], paper2: [] }
    }
    const pct = (a.marks / a.totalMarks) * 100
    if (a.paperType === 'paper1') {
      bySubject[a.subject].years[a.examYear].paper1.push(pct)
    } else {
      bySubject[a.subject].years[a.examYear].paper2.push(pct)
    }
    if (pct > bySubject[a.subject].bestMarks) bySubject[a.subject].bestMarks = pct
    bySubject[a.subject].totalAttempts++
  }

  // Timeline data: for each subject, each year → best attempt marks for each paper
  const timeline: Record<string, Array<{
    year: number
    paper1Best: number | null
    paper2Best: number | null
    combined: number | null
  }>> = {}

  for (const [subject, data] of Object.entries(bySubject)) {
    timeline[subject] = Object.entries(data.years)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, papers]) => {
        const p1 = papers.paper1.length ? Math.max(...papers.paper1) : null
        const p2 = papers.paper2.length ? Math.max(...papers.paper2) : null
        const combined = p1 !== null && p2 !== null ? (p1 + p2) / 2 : p1 ?? p2
        return { year: Number(year), paper1Best: p1, paper2Best: p2, combined }
      })
  }

  // Overall progress by year (average across all subjects)
  const byYear: Record<number, { sum: number; count: number }> = {}
  for (const a of attempts) {
    if (!byYear[a.examYear]) byYear[a.examYear] = { sum: 0, count: 0 }
    byYear[a.examYear].sum += (a.marks / a.totalMarks) * 100
    byYear[a.examYear].count++
  }

  const yearProgress = Object.entries(byYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, { sum, count }]) => ({
      year: Number(year),
      avgScore: Math.round(sum / count),
    }))

  const totalAttempts = attempts.length
  const subjectCount = Object.keys(bySubject).length
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.marks / a.totalMarks) * 100, 0) / attempts.length)
    : 0

  return NextResponse.json({
    timeline,
    yearProgress,
    bySubject: Object.fromEntries(
      Object.entries(bySubject).map(([k, v]) => [k, { bestMarks: Math.round(v.bestMarks), totalAttempts: v.totalAttempts }])
    ),
    stats: { totalAttempts, subjectCount, avgScore },
  })
}
