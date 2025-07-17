/*
  Warnings:

  - You are about to alter the column `details` on the `infinite_content` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_infinite_content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_infinite_content" ("active", "createdAt", "description", "details", "id", "image", "order", "shortDescription", "title", "updatedAt") SELECT "active", "createdAt", "description", "details", "id", "image", "order", "shortDescription", "title", "updatedAt" FROM "infinite_content";
DROP TABLE "infinite_content";
ALTER TABLE "new_infinite_content" RENAME TO "infinite_content";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
