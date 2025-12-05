-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';
