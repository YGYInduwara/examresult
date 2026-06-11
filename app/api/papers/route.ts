import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const year = searchParams.get('year')

  const attempts = await prisma.paperAttempt.findMany({
    where: {
      userId: session.user.id,
      ...(subject && { subject }),
      ...(year && { examYear: parseInt(year) }),
    },
    orderBy: [{ examYear: 'desc' }, { subject: 'asc' }, { paperType: 'asc' }, { attemptNo: 'asc' }],
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

  if (marks < 0 || marks > totalMarks) {
    return NextResponse.json({ error: 'Marks must be between 0 and total marks' }, { status: 400 })
  }

  try {
    // Check if entry already exists
    const existing = await prisma.paperAttempt.findUnique({
      where: {
        userId_examYear_subject_paperType_attemptNo: {
          userId: session.user.id,
          examYear,
          subject,
          paperType,
          attemptNo,
        },
      },
    })

    if (existing) {
      return NextResponse.json({
        error: 'This entry already exists. Delete it first if you want to change it.'
      }, { status: 409 })
    }

    const attempt = await prisma.paperAttempt.create({
      data: {
        userId: session.user.id,
        examYear,
        subject,
        paperType,
        attemptNo,
        marks,
        totalMarks: totalMarks ?? 100,
        notes,
      },
    })

    return NextResponse.json({ attempt }, { status: 201 })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({
        error: 'This entry already exists. Delete it first if you want to change it.'
      }, { status: 409 })
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

  await prisma.paperAttempt.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
