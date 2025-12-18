-- AddForeignKey
ALTER TABLE "TimestampNotePages" ADD CONSTRAINT "TimestampNotePages_timestampNoteId_fkey" FOREIGN KEY ("timestampNoteId") REFERENCES "TimestampNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimestampNotePages" ADD CONSTRAINT "TimestampNotePages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
