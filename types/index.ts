export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  createdAt: Date
}

export interface PaperAttempt {
  id: string
  userId: string
  examYear: number
  subject: string
  paperType: 'paper1' | 'paper2'
  attemptNo: 1 | 2 | 3
  marks: number
  totalMarks: number
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export const AL_SUBJECTS = [
  // Science Stream
  { value: 'combined_maths', label: 'Combined Mathematics', stream: 'Science' },
  { value: 'physics', label: 'Physics', stream: 'Science' },
  { value: 'chemistry', label: 'Chemistry', stream: 'Science' },
  { value: 'biology', label: 'Biology', stream: 'Science' },
  { value: 'ict', label: 'Information & Communication Technology', stream: 'Science' },
  // Commerce Stream
  { value: 'economics', label: 'Economics', stream: 'Commerce' },
  { value: 'business_studies', label: 'Business Studies', stream: 'Commerce' },
  { value: 'accounting', label: 'Accounting', stream: 'Commerce' },
  { value: 'business_statistics', label: 'Business Statistics', stream: 'Commerce' },
  // Arts Stream
  { value: 'history', label: 'History', stream: 'Arts' },
  { value: 'geography', label: 'Geography', stream: 'Arts' },
  { value: 'political_science', label: 'Political Science', stream: 'Arts' },
  { value: 'logic', label: 'Logic & Scientific Method', stream: 'Arts' },
  // Common Subjects
  { value: 'sinhala', label: 'Sinhala', stream: 'Common' },
  { value: 'tamil', label: 'Tamil', stream: 'Common' },
  { value: 'english', label: 'English', stream: 'Common' },
  { value: 'general_english', label: 'General English', stream: 'Common' },
  { value: 'buddhism', label: 'Buddhism', stream: 'Common' },
  { value: 'hinduism', label: 'Hinduism', stream: 'Common' },
  { value: 'islam', label: 'Islam', stream: 'Common' },
  { value: 'christianity', label: 'Christianity / Catholicism', stream: 'Common' },
] as const

export const EXAM_YEARS = Array.from({ length: 26 }, (_, i) => 2025 - i)

export const PAPER_TYPES = [
  { value: 'paper1', label: 'Paper I (MCQ)' },
  { value: 'paper2', label: 'Paper II (Structured/Essay)' },
]

export const ATTEMPT_NUMBERS = [1, 2, 3] as const

export type SubjectValue = typeof AL_SUBJECTS[number]['value']
export type ExamYear = number
export type PaperType = 'paper1' | 'paper2'
export type AttemptNo = 1 | 2 | 3
