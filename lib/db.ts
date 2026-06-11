import mongoose from 'mongoose'

const DATABASE_URL = process.env.DATABASE_URL!

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  await mongoose.connect(DATABASE_URL)
}

export default mongoose
