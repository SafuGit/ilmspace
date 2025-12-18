-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('timestamp', 'note');

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "type" "PageType" NOT NULL DEFAULT 'note';
