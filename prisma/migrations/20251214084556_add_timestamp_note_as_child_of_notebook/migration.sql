-- AlterTable
ALTER TABLE "TimestampNote" ADD COLUMN     "notebookId" TEXT;

-- AddForeignKey
ALTER TABLE "TimestampNote" ADD CONSTRAINT "TimestampNote_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
