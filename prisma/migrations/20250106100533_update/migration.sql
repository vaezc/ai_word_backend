/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `WordHistory` table. All the data in the column will be lost.
  - You are about to drop the column `wordId` on the `WordHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WordHistory" DROP COLUMN "updatedAt",
DROP COLUMN "wordId";
