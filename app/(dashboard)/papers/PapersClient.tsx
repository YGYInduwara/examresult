'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSubjectLabel, getGradeBg, formatDate } from '@/lib/utils'
import { AL_SUBJECTS, EXAM_YEARS, PAPER_TYPES } from '@/types'

interface Attempt {
  id: string
  examYear: number
  subject: string
  paperType: string
  attemptNo: number
  marks: number
  totalMarks: number
  notes: string | null
  createdAt: string
  pct: number
}

export default function PapersClient({ attempts }: { attempts: Attempt[] }) {
  const [filterSubject, setFilterSubject] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterPaper, setFilterPaper] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [localAttempts, setLocalAttempts] = useState(attempts)

  const filtered = useMemo(() => {
    return localAttempts.filter((a) => {
      if (filterSubject && a.subject !== filterSubject) return false
      if (filterYear && a.examYear !== parseInt(filterYear)) return false
      if (filterPaper && a.paperType !== filterPaper) return false
      return true
    })
  }, [localAttempts, filterSubject, filterYear, filterPaper])

  async function handleDelete(id: string) {
    if (!confirm('Delete this result?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/papers?id=${id}`, { method: 'DELETE' })
      if (res.ok) setLocalAttempts((prev) => prev.filter((a) => a.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Papers</h1>
          <p className="text-slate-500 text-sm mt-0.5">{localAttempts.length} total attempts recorded</p>
        </div>
        <Link
          href="/papers/add"
          className="inline-flex items-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Result
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="px-6 py-4 flex flex-wrap gap-3">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {AL_SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">All Years</option>
            {EXAM_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={filterPaper}
            onChange={(e) => setFilterPaper(e.target.value)}
          >
            <option value="">All Papers</option>
            {PAPER_TYPES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {(filterSubject || filterYear || filterPaper) && (
            <button
              onClick={() => { setFilterSubject(''); setFilterYear(''); setFilterPaper('') }}
              className="text-sm text-slate-500 hover:text-slate-800 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No results found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or add a new result</p>
            <Link href="/papers/add" className="inline-block mt-4 text-violet-600 font-semibold text-sm hover:underline">
              Add first result →
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-4">
                {/* Grade Badge */}
                <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center flex-shrink-0 ${getGradeBg(a.pct)}`}>
                  <span className="text-lg font-bold">{a.pct}%</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{getSubjectLabel(a.subject)}</div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {a.examYear} · {a.paperType === 'paper1' ? 'Paper I (MCQ)' : 'Paper II'} · Attempt {a.attemptNo}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {a.marks}/{a.totalMarks} marks · {formatDate(a.createdAt)}
                  </div>
                  {a.notes && (
                    <div className="text-xs text-slate-500 mt-1 italic truncate">&quot;{a.notes}&quot;</div>
                  )}
                </div>

                {/* Attempt pills */}
                <div className="hidden sm:flex flex-col gap-1 flex-shrink-0">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        n === a.attemptNo
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deletingId === a.id}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Delete result"
                >
                  {deletingId === a.id ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
