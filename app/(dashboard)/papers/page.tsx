import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { getSubjectLabel, calcPercentage, getGradeBg, formatDate } from '@/lib/utils'
import { AL_SUBJECTS, EXAM_YEARS } from '@/types'
import PapersClient from './PapersClient'

export const dynamic = 'force-dynamic'

export default async function PapersPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const attempts = await prisma.paperAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: [{ examYear: 'desc' }, { subject: 'asc' }, { paperType: 'asc' }, { attemptNo: 'asc' }],
  })

  const serialized = attempts.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    pct: calcPercentage(a.marks, a.totalMarks),
  }))

  return <PapersClient attempts={serialized} />
}
