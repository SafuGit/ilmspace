/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,title]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "Note";

-- DropEnum
DROP TYPE "NoteTypes";

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT,
    "bookName" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "page1" TEXT,
    "page2" TEXT,
    "page3" TEXT,
    "page4" TEXT,
    "page5" TEXT,
    "page6" TEXT,
    "page7" TEXT,
    "page8" TEXT,
    "page9" TEXT,
    "page10" TEXT,
    "page11" TEXT,
    "page12" TEXT,
    "page13" TEXT,
    "page14" TEXT,
    "page15" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimestampNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT,
    "playlistId" TEXT,
    "videoId" TEXT,
    "content" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "TimestampNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notebook_userId_key" ON "Notebook"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Notebook_bookId_bookName_key" ON "Notebook"("bookId", "bookName");

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_title_key" ON "Book"("id", "title");

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_bookId_bookName_fkey" FOREIGN KEY ("bookId", "bookName") REFERENCES "Book"("id", "title") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampNote" ADD CONSTRAINT "TimestampNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampNote" ADD CONSTRAINT "TimestampNote_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampNote" ADD CONSTRAINT "TimestampNote_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampNote" ADD CONSTRAINT "TimestampNote_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
