import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { PaperAttempt } from '@/lib/models/PaperAttempt'
import { calcPercentage } from '@/lib/utils'
import PapersClient from './PapersClient'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export default async function PapersPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  await connectDB()
  const attempts = await PaperAttempt.find({
    userId: new mongoose.Types.ObjectId(session.user.id),
  }).sort({ examYear: -1, subject: 1, paperType: 1, attemptNo: 1 })

  const serialized = attempts.map((a) => ({
    ...a.toObject(),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    pct: calcPercentage(a.marks, a.totalMarks),
  }))

  return <PapersClient attempts={serialized} />
}
