/*
  Warnings:

  - A unique constraint covering the columns `[monster_id,item_id]` on the table `drops` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[monster_id,map_id]` on the table `monster_maps` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "unique_drop_combination";

-- AlterTable
ALTER TABLE "drops" RENAME CONSTRAINT "drop_pkey" TO "drops_pkey";

-- CreateTable
CREATE TABLE "characters" (
    "character_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "baseLevel" INTEGER NOT NULL,
    "jobLevel" INTEGER NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("character_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_name_key" ON "characters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_drop_combination" ON "drops"("monster_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "monster_maps_monster_id_map_id_key" ON "monster_maps"("monster_id", "map_id");
