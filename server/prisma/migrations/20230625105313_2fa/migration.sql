-- AlterTable
ALTER TABLE "Match_History" ADD COLUMN     "game_end" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthenticationSecret" TEXT;
