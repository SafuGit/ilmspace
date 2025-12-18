/*
  Warnings:

  - You are about to drop the column `page1` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page10` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page11` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page12` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page13` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page14` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page15` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page2` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page3` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page4` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page5` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page6` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page7` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page8` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `page9` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "page1",
DROP COLUMN "page10",
DROP COLUMN "page11",
DROP COLUMN "page12",
DROP COLUMN "page13",
DROP COLUMN "page14",
DROP COLUMN "page15",
DROP COLUMN "page2",
DROP COLUMN "page3",
DROP COLUMN "page4",
DROP COLUMN "page5",
DROP COLUMN "page6",
DROP COLUMN "page7",
DROP COLUMN "page8",
DROP COLUMN "page9",
ADD COLUMN     "line1" TEXT,
ADD COLUMN     "line10" TEXT,
ADD COLUMN     "line11" TEXT,
ADD COLUMN     "line12" TEXT,
ADD COLUMN     "line13" TEXT,
ADD COLUMN     "line14" TEXT,
ADD COLUMN     "line15" TEXT,
ADD COLUMN     "line2" TEXT,
ADD COLUMN     "line3" TEXT,
ADD COLUMN     "line4" TEXT,
ADD COLUMN     "line5" TEXT,
ADD COLUMN     "line6" TEXT,
ADD COLUMN     "line7" TEXT,
ADD COLUMN     "line8" TEXT,
ADD COLUMN     "line9" TEXT;
