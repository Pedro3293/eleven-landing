-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "injuries" TEXT NOT NULL DEFAULT '[]',
    "equipment" TEXT NOT NULL DEFAULT '[]',
    "daysPerWeek" INTEGER NOT NULL,
    "minutesPerSession" INTEGER NOT NULL,
    "bodyweightKg" REAL,
    "heightCm" REAL,
    "birthYear" INTEGER,
    "preferences" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "secondaryMuscles" TEXT NOT NULL DEFAULT '[]',
    "equipment" TEXT NOT NULL,
    "movementPattern" TEXT NOT NULL,
    "isCompound" BOOLEAN NOT NULL DEFAULT false,
    "instructionsEs" TEXT NOT NULL DEFAULT '[]',
    "imagePath" TEXT NOT NULL,
    "gifPath" TEXT NOT NULL,
    "attribution" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT 'dev-dataset'
);

-- CreateTable
CREATE TABLE "Methodology" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "config" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "methodologyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Plan_methodologyId_fkey" FOREIGN KEY ("methodologyId") REFERENCES "Methodology" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "dayKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "totalSeconds" INTEGER,
    "effectiveSeconds" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "targetSets" INTEGER NOT NULL,
    "targetRepsMin" INTEGER NOT NULL,
    "targetRepsMax" INTEGER NOT NULL,
    "targetWeightKg" REAL,
    "restSeconds" INTEGER NOT NULL,
    "tempo" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'straight',
    "modeSeconds" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "substitutedFromId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionExercise_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SetLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionExerciseId" TEXT NOT NULL,
    "setIndex" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weightKg" REAL,
    "rpe" REAL,
    "seconds" INTEGER,
    "isWarmup" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SetLog_sessionExerciseId_fkey" FOREIGN KEY ("sessionExerciseId") REFERENCES "SessionExercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "checkInId" TEXT,
    "takenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "pose" TEXT,
    "note" TEXT,
    CONSTRAINT "ProgressPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgressPhoto_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT 'global',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "toolCalls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ChatThread" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_status_idx" ON "Session"("userId", "status");

-- CreateIndex
CREATE INDEX "SessionExercise_sessionId_order_idx" ON "SessionExercise"("sessionId", "order");

-- CreateIndex
CREATE INDEX "SetLog_sessionExerciseId_setIndex_idx" ON "SetLog"("sessionExerciseId", "setIndex");

-- CreateIndex
CREATE INDEX "CheckIn_userId_type_date_idx" ON "CheckIn"("userId", "type", "date");

-- CreateIndex
CREATE INDEX "ProgressPhoto_userId_takenAt_idx" ON "ProgressPhoto"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "ChatThread_userId_context_idx" ON "ChatThread"("userId", "context");

-- CreateIndex
CREATE INDEX "ChatMessage_threadId_createdAt_idx" ON "ChatMessage"("threadId", "createdAt");
