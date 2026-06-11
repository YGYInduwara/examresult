import mongoose from 'mongoose'
import { User } from './User'

const PaperAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examYear: { type: Number, required: true },
    subject: { type: String, required: true },
    paperType: { type: String, required: true },
    attemptNo: { type: Number, required: true },
    marks: { type: Number, required: true },
    totalMarks: { type: Number, default: 100 },
    notes: { type: String },
  },
  { timestamps: true }
)

PaperAttemptSchema.index({ userId: 1, examYear: 1, subject: 1, paperType: 1, attemptNo: 1 }, { unique: true })
PaperAttemptSchema.index({ userId: 1, subject: 1 })
PaperAttemptSchema.index({ userId: 1, examYear: 1 })

export const PaperAttempt = mongoose.models.PaperAttempt || mongoose.model('PaperAttempt', PaperAttemptSchema)
