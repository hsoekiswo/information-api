/*
  Warnings:

  - You are about to drop the column `baseLevel` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `jobLevel` on the `characters` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExpType" AS ENUM ('job_first', 'job_second', 'job_third');

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "baseLevel",
DROP COLUMN "jobLevel",
ADD COLUMN     "base_level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "exp_type" "ExpType" NOT NULL DEFAULT 'job_first',
ADD COLUMN     "job_level" INTEGER NOT NULL DEFAULT 1;
