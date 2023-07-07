/*
  Warnings:

  - You are about to drop the column `hosblocked` on the `channels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "channels" DROP COLUMN "hosblocked",
ADD COLUMN     "hasblocked" INTEGER;
