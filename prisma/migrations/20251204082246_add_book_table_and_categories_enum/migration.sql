-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Quran', 'Tafsir', 'Hadith', 'Aqeedah', 'Fiqh', 'UsulFiqh', 'Arabic', 'Seerah', 'History', 'Tazkiyah', 'Adab', 'Duas', 'Prophets', 'Biography', 'ComparativeReligion', 'Family', 'Youth', 'Ethics', 'Spirituality', 'Dawah', 'Misc');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "language" TEXT,
    "description" TEXT,
    "category" "Categories",
    "fileUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "pageCount" INTEGER,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "thumbnailUrl" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Book_id_idx" ON "Book"("id");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
