import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AL_SUBJECTS } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubjectLabel(value: string): string {
  const subject = AL_SUBJECTS.find((s) => s.value === value)
  return subject?.label ?? value
}

export function getSubjectStream(value: string): string {
  const subject = AL_SUBJECTS.find((s) => s.value === value)
  return subject?.stream ?? 'Unknown'
}

export function calcPercentage(marks: number, total: number): number {
  if (total === 0) return 0
  return Math.round((marks / total) * 100)
}

export function getGrade(percentage: number): { grade: string; color: string } {
  if (percentage >= 75) return { grade: 'A', color: 'text-emerald-600' }
  if (percentage >= 65) return { grade: 'B', color: 'text-blue-600' }
  if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' }
  if (percentage >= 35) return { grade: 'S', color: 'text-orange-500' }
  return { grade: 'F', color: 'text-red-600' }
}

export function getGradeBg(percentage: number): string {
  if (percentage >= 75) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  if (percentage >= 65) return 'bg-blue-100 text-blue-800 border-blue-200'
  if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  if (percentage >= 35) return 'bg-orange-100 text-orange-800 border-orange-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
