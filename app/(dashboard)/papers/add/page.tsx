'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { AL_SUBJECTS, EXAM_YEARS, PAPER_TYPES, ATTEMPT_NUMBERS } from '@/types'
import { getGradeBg, calcPercentage } from '@/lib/utils'

const subjectOptions = AL_SUBJECTS.map((s) => ({
  value: s.value,
  label: s.label,
  group: s.stream,
}))

const yearOptions = EXAM_YEARS.map((y) => ({ value: y, label: `${y}` }))
const paperOptions = PAPER_TYPES.map((p) => ({ value: p.value, label: p.label }))
const attemptOptions = ATTEMPT_NUMBERS.map((n) => ({ value: n, label: `Attempt ${n}` }))

export default function AddPaperPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    examYear: '',
    subject: '',
    paperType: '',
    attemptNo: '',
    marks: '',
    totalMarks: '100',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const marks = parseFloat(form.marks)
  const total = parseFloat(form.totalMarks)
  const pct = !isNaN(marks) && !isNaN(total) && total > 0 ? calcPercentage(marks, total) : null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!e.currentTarget.checkValidity()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examYear: parseInt(form.examYear),
          subject: form.subject,
          paperType: form.paperType,
          attemptNo: parseInt(form.attemptNo),
          marks: parseFloat(form.marks),
          totalMarks: parseFloat(form.totalMarks),
          notes: form.notes || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setForm((f) => ({ ...f, marks: '', notes: '' }))
      }, 2000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Paper Result</h1>
        <p className="text-slate-500 text-sm mt-1">Record your marks for an A/L past paper attempt</p>
      </div>

      {/* Preview Badge */}
      {pct !== null && (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${getGradeBg(pct)}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {marks}/{total} marks → {pct}%
          {pct >= 75 && ' — Grade A'}
          {pct >= 65 && pct < 75 && ' — Grade B'}
          {pct >= 50 && pct < 65 && ' — Grade C'}
          {pct >= 35 && pct < 50 && ' — Grade S'}
          {pct < 35 && ' — Fail'}
        </div>
      )}

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Exam Year + Subject */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Exam Year"
                options={yearOptions}
                placeholder="Select year"
                value={form.examYear}
                onChange={(e) => setForm({ ...form, examYear: e.target.value })}
                required
                hint="Past 26 years (2000–2025)"
              />
              <Select
                label="Subject"
                options={subjectOptions}
                placeholder="Select subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>

            {/* Paper Type + Attempt */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Paper Type"
                options={paperOptions}
                placeholder="Select paper"
                value={form.paperType}
                onChange={(e) => setForm({ ...form, paperType: e.target.value })}
                required
              />
              <Select
                label="Attempt Number"
                options={attemptOptions}
                placeholder="Select attempt"
                value={form.attemptNo}
                onChange={(e) => setForm({ ...form, attemptNo: e.target.value })}
                required
                hint="You can attempt each paper up to 3 times"
              />
            </div>

            {/* Marks */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Marks Obtained"
                type="number"
                min="0"
                max={form.totalMarks || '100'}
                step="0.5"
                placeholder="e.g. 75"
                value={form.marks}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  const max = parseFloat(form.totalMarks) || 100
                  if (!isNaN(val) && val > max) {
                    setForm({ ...form, marks: String(max) })
                  } else {
                    setForm({ ...form, marks: e.target.value })
                  }
                }}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              />
              <Input
                label="Total Marks"
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={form.totalMarks}
                onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                required
                hint="Default is 100"
              />
            </div>
            {marks > total && total > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                ❌ Marks cannot exceed total marks ({total})
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400 transition-all resize-none"
                rows={3}
                placeholder="Any notes about this attempt..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Result saved successfully!
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading} size="lg" className="flex-1">
                Save Result
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/papers')}
              >
                View All
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Grade Guide */}
      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">A/L Grade Guide</h3>
          <div className="grid grid-cols-5 gap-2">
            {[
              { grade: 'A', range: '75%+', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
              { grade: 'B', range: '65–74%', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
              { grade: 'C', range: '50–64%', bg: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { grade: 'S', range: '35–49%', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
              { grade: 'F', range: '<35%', bg: 'bg-red-100 text-red-800 border-red-200' },
            ].map((g) => (
              <div key={g.grade} className={`text-center py-2 px-1 rounded-xl border text-xs ${g.bg}`}>
                <div className="font-bold text-base">{g.grade}</div>
                <div className="text-[10px] opacity-80">{g.range}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
