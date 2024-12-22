-- CreateTable
CREATE TABLE "drops" (
    "drop_id" SERIAL NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "chance" DOUBLE PRECISION,

    CONSTRAINT "drop_pkey" PRIMARY KEY ("drop_id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "level" INTEGER,
    "experience" INTEGER,
    "exp_type" VARCHAR,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" INTEGER NOT NULL,
    "name" VARCHAR,
    "description" TEXT,
    "item_type" VARCHAR,
    "attack" INTEGER,
    "magic_attack" INTEGER,
    "defense" INTEGER,
    "weight" DOUBLE PRECISION,
    "requiredlevel" INTEGER,
    "price" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "maps" (
    "map_id" VARCHAR NOT NULL,
    "name" VARCHAR,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("map_id")
);

-- CreateTable
CREATE TABLE "monster_map" (
    "id" SERIAL NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "map_id" VARCHAR NOT NULL,

    CONSTRAINT "monster_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monsters" (
    "monster_id" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "level" INTEGER,
    "hp" INTEGER,
    "attack_min" INTEGER,
    "attack_max" INTEGER,
    "defense" INTEGER,
    "magic_defense" INTEGER,
    "base_experience" INTEGER,
    "job_experience" INTEGER,

    CONSTRAINT "monsters_pkey" PRIMARY KEY ("monster_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_drop_combination" ON "drops"("monster_id", "item_id", "chance");

-- CreateIndex
CREATE INDEX "index_item_name" ON "items"("name");

-- CreateIndex
CREATE INDEX "index_level" ON "monsters"("level");

-- AddForeignKey
ALTER TABLE "drops" ADD CONSTRAINT "drops_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("monster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drops" ADD CONSTRAINT "drops_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_map" ADD CONSTRAINT "monster_map_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("monster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_map" ADD CONSTRAINT "monster_map_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("map_id") ON DELETE RESTRICT ON UPDATE CASCADE;

