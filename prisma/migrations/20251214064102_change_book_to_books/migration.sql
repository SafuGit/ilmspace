-- DropForeignKey
ALTER TABLE "Notebook" DROP CONSTRAINT "Notebook_bookId_bookName_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "notebookId" TEXT;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
