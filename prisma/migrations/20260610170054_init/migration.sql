-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PaperAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "examYear" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "paperType" TEXT NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "marks" REAL NOT NULL,
    "totalMarks" REAL NOT NULL DEFAULT 100,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PaperAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "PaperAttempt_userId_subject_idx" ON "PaperAttempt"("userId", "subject");

-- CreateIndex
CREATE INDEX "PaperAttempt_userId_examYear_idx" ON "PaperAttempt"("userId", "examYear");

-- CreateIndex
CREATE UNIQUE INDEX "PaperAttempt_userId_examYear_subject_paperType_attemptNo_key" ON "PaperAttempt"("userId", "examYear", "subject", "paperType", "attemptNo");
