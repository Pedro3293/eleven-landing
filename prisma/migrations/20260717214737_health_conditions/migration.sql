-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "injuries" TEXT NOT NULL DEFAULT '[]',
    "healthConditions" TEXT NOT NULL DEFAULT '[]',
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
INSERT INTO "new_Profile" ("birthYear", "bodyweightKg", "daysPerWeek", "displayName", "equipment", "experience", "goal", "heightCm", "id", "injuries", "minutesPerSession", "preferences", "updatedAt", "userId") SELECT "birthYear", "bodyweightKg", "daysPerWeek", "displayName", "equipment", "experience", "goal", "heightCm", "id", "injuries", "minutesPerSession", "preferences", "updatedAt", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
