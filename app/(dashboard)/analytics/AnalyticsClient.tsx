'use client'

import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { Card, CardBody, StatCard } from '@/components/ui/Card'
import { getSubjectLabel, getGradeBg } from '@/lib/utils'
import { AL_SUBJECTS } from '@/types'

interface Props {
  subjectTimelines: Record<string, Array<{
    year: number
    paper1: number | null
    paper2: number | null
    best: number | null
  }>>
  yearlyChart: Array<{ year: number; avg: number }>
  subjects: string[]
  stats: { totalAttempts: number; avgScore: number; subjectCount: number }
}

const COLORS = {
  paper1: '#7c3aed',
  paper2: '#0ea5e9',
  best: '#10b981',
  avg: '#f59e0b',
}

function GradeRefLines() {
  return (
    <>
      <ReferenceLine y={75} stroke="#10b981" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'A (75%)', fill: '#10b981', fontSize: 10 }} />
      <ReferenceLine y={65} stroke="#3b82f6" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'B (65%)', fill: '#3b82f6', fontSize: 10 }} />
      <ReferenceLine y={50} stroke="#eab308" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'C (50%)', fill: '#eab308', fontSize: 10 }} />
      <ReferenceLine y={35} stroke="#f97316" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'S (35%)', fill: '#f97316', fontSize: 10 }} />
    </>
  )
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-slate-700 mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-slate-600">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold" style={{ color: p.color }}>{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsClient({ subjectTimelines, yearlyChart, subjects, stats }: Props) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] ?? '')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line')

  const subjectData = selectedSubject ? subjectTimelines[selectedSubject] ?? [] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Visualize your A/L past paper performance</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Attempts"
          value={stats.totalAttempts}
          color="violet"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          label="Avg Score"
          value={`${stats.avgScore}%`}
          color="blue"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <StatCard
          label="Subjects"
          value={stats.subjectCount}
          color="emerald"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>}
        />
      </div>

      {/* Overall Yearly Progress */}
      {yearlyChart.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Overall Yearly Progress</h2>
            <p className="text-xs text-slate-400 mt-0.5">Average score across all subjects by exam year</p>
          </div>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={yearlyChart} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <GradeRefLines />
                <Area
                  type="monotone"
                  dataKey="avg"
                  name="Avg Score"
                  stroke={COLORS.avg}
                  strokeWidth={2.5}
                  fill="url(#avgGrad)"
                  dot={{ fill: COLORS.avg, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      {/* Per-Subject Chart */}
      {subjects.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1">
                <h2 className="font-semibold text-slate-900">Subject Performance</h2>
                <p className="text-xs text-slate-400 mt-0.5">Best score per year · X-axis = exam year · Y-axis = percentage</p>
              </div>
              {/* Subject Selector */}
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{getSubjectLabel(s)}</option>
                ))}
              </select>
              {/* Chart Type */}
              <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-medium">
                {(['line', 'area', 'bar'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={`px-3 py-2 capitalize transition-colors ${
                      chartType === t
                        ? 'bg-violet-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <CardBody>
            {subjectData.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No data for this subject yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'bar' ? (
                  <BarChart data={subjectData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <GradeRefLines />
                    <Bar dataKey="paper1" name="Paper I" fill={COLORS.paper1} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="paper2" name="Paper II" fill={COLORS.paper2} radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={subjectData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="p1Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.paper1} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.paper1} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="p2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.paper2} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.paper2} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <GradeRefLines />
                    <Area type="monotone" dataKey="paper1" name="Paper I" stroke={COLORS.paper1} strokeWidth={2} fill="url(#p1Grad)" dot={{ r: 4, fill: COLORS.paper1 }} connectNulls />
                    <Area type="monotone" dataKey="paper2" name="Paper II" stroke={COLORS.paper2} strokeWidth={2} fill="url(#p2Grad)" dot={{ r: 4, fill: COLORS.paper2 }} connectNulls />
                  </AreaChart>
                ) : (
                  <LineChart data={subjectData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <GradeRefLines />
                    <Line type="monotone" dataKey="paper1" name="Paper I" stroke={COLORS.paper1} strokeWidth={2.5} dot={{ r: 5, fill: COLORS.paper1 }} activeDot={{ r: 7 }} connectNulls />
                    <Line type="monotone" dataKey="paper2" name="Paper II" stroke={COLORS.paper2} strokeWidth={2.5} dot={{ r: 5, fill: COLORS.paper2 }} activeDot={{ r: 7 }} connectNulls />
                    <Line type="monotone" dataKey="best" name="Best" stroke={COLORS.best} strokeWidth={1.5} strokeDasharray="5 3" dot={false} connectNulls />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      )}

      {/* Subject Comparison Bar */}
      {subjects.length > 1 && (
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Subject Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">Best score achieved per subject</p>
          </div>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-50">
              {subjects
                .map((s) => {
                  const data = subjectTimelines[s]
                  const allScores = data.flatMap((d) => [d.paper1, d.paper2].filter((v): v is number => v !== null))
                  const best = allScores.length ? Math.max(...allScores) : 0
                  return { subject: s, best }
                })
                .sort((a, b) => b.best - a.best)
                .map(({ subject, best }) => (
                  <div key={subject} className="px-6 py-3.5 flex items-center gap-4">
                    <div className="w-40 text-sm font-medium text-slate-800 truncate flex-shrink-0">
                      {getSubjectLabel(subject)}
                    </div>
                    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${best}%` }}
                      />
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${getGradeBg(best)}`}>
                      {best}%
                    </div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      )}

      {subjects.length === 0 && (
        <Card>
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No data to visualize yet</p>
            <p className="text-slate-400 text-sm mt-1">Add some paper results to see your analytics</p>
          </div>
        </Card>
      )}
    </div>
  )
}
