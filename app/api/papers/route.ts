import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { PaperAttempt } from '@/lib/models/PaperAttempt'
import mongoose from 'mongoose'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const year = searchParams.get('year')

  await connectDB()

  const where: any = { userId: new mongoose.Types.ObjectId(session.user.id) }
  if (subject) where.subject = subject
  if (year) where.examYear = parseInt(year)

  const attempts = await PaperAttempt.find(where).sort({
    examYear: -1,
    subject: 1,
    paperType: 1,
    attemptNo: 1,
  })

  return NextResponse.json({ attempts })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { examYear, subject, paperType, attemptNo, marks, totalMarks, notes } = body

  if (!examYear || !subject || !paperType || !attemptNo || marks === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (marks < 0 || marks > (totalMarks ?? 100)) {
    return NextResponse.json({ error: 'Marks must be between 0 and total marks' }, { status: 400 })
  }

  try {
    await connectDB()

    const existing = await PaperAttempt.findOne({
      userId: session.user.id,
      examYear,
      subject,
      paperType,
      attemptNo,
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This entry already exists. Delete it first if you want to change it.' },
        { status: 409 }
      )
    }

    const attempt = await PaperAttempt.create({
      userId: session.user.id,
      examYear,
      subject,
      paperType,
      attemptNo,
      marks,
      totalMarks: totalMarks ?? 100,
      notes,
    })

    return NextResponse.json({ attempt }, { status: 201 })
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: 'This entry already exists. Delete it first if you want to change it.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await connectDB()
  await PaperAttempt.deleteOne({ _id: id, userId: session.user.id })

  return NextResponse.json({ success: true })
}
