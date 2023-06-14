/*
  Warnings:

  - The primary key for the `participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `user1Id` on the `Match_History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user2Id` on the `Match_History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ownerId` on the `channels` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userID` on the `friends` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `friendID` on the `friends` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `msgs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userID` on the `participants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Match_History" DROP CONSTRAINT "Match_History_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match_History" DROP CONSTRAINT "Match_History_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_friendID_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_userID_fkey";

-- DropForeignKey
ALTER TABLE "msgs" DROP CONSTRAINT "msgs_userId_fkey";

-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_userID_fkey";

-- AlterTable
ALTER TABLE "Match_History" DROP COLUMN "user1Id",
ADD COLUMN     "user1Id" INTEGER NOT NULL,
DROP COLUMN "user2Id",
ADD COLUMN     "user2Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "friends" DROP COLUMN "userID",
ADD COLUMN     "userID" INTEGER NOT NULL,
DROP COLUMN "friendID",
ADD COLUMN     "friendID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "msgs" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "participants" DROP CONSTRAINT "participants_pkey",
DROP COLUMN "userID",
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "participants_pkey" PRIMARY KEY ("channelID", "userID");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Match_History" ADD CONSTRAINT "Match_History_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_History" ADD CONSTRAINT "Match_History_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendID_fkey" FOREIGN KEY ("friendID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msgs" ADD CONSTRAINT "msgs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
