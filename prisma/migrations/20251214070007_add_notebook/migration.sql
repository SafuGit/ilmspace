/*
  Warnings:

  - You are about to drop the column `bookId` on the `Notebook` table. All the data in the column will be lost.
  - You are about to drop the column `bookName` on the `Notebook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playlistId]` on the table `Notebook` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Notebook_bookId_bookName_key";

-- AlterTable
ALTER TABLE "Notebook" DROP COLUMN "bookId",
DROP COLUMN "bookName",
ADD COLUMN     "playlistId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notebook_playlistId_key" ON "Notebook"("playlistId");

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
