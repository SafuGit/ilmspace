-- AlterTable
ALTER TABLE "TimestampNotePages" ADD COLUMN     "playlistId" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "order" INTEGER;

-- AddForeignKey
ALTER TABLE "TimestampNotePages" ADD CONSTRAINT "TimestampNotePages_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
