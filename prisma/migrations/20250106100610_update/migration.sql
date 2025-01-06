/*
  Warnings:

  - Added the required column `word` to the `WordHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WordHistory" ADD COLUMN     "word" TEXT NOT NULL;
