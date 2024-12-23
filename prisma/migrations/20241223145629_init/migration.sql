/*
  Warnings:

  - You are about to drop the column `requiredlevel` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `monster_map` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "monster_map" DROP CONSTRAINT "monster_map_map_id_fkey";

-- DropForeignKey
ALTER TABLE "monster_map" DROP CONSTRAINT "monster_map_monster_id_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "requiredlevel",
ADD COLUMN     "required_level" INTEGER;

-- DropTable
DROP TABLE "experience";

-- DropTable
DROP TABLE "monster_map";

-- CreateTable
CREATE TABLE "experiences" (
    "experience_id" SERIAL NOT NULL,
    "level" INTEGER,
    "experience" INTEGER,
    "exp_type" VARCHAR,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("experience_id")
);

-- CreateTable
CREATE TABLE "monster_maps" (
    "id" SERIAL NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "map_id" VARCHAR NOT NULL,

    CONSTRAINT "monster_maps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "monster_maps" ADD CONSTRAINT "monster_maps_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("monster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_maps" ADD CONSTRAINT "monster_maps_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("map_id") ON DELETE RESTRICT ON UPDATE CASCADE;
