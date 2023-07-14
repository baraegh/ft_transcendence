/*
  Warnings:

  - You are about to drop the column `isOnline` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isOnline",
ADD COLUMN     "isonline" BOOLEAN NOT NULL DEFAULT false;
