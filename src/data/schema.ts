import { z } from '@hono/zod-openapi';
import { MonsterSchema } from '../monsters/schema';
import { DropSchema } from '../drops/schema';
import { ItemSchema } from '../items/schema';
import { MonsterMapSchema, MapSchema } from '../maps/schema';

export const DataSchema = z.object({
    monsterId: MonsterSchema.shape.monsterId,
    name: MonsterSchema.shape.name,
    level: MonsterSchema.shape.level,
    hp: MonsterSchema.shape.hp,
    attackMin: MonsterSchema.shape.attackMin,
    attackMax: MonsterSchema.shape.attackMax,
    defense: MonsterSchema.shape.defense,
    magicDefense: MonsterSchema.shape.magicDefense,
    baseExperience: MonsterSchema.shape.baseExperience,
    jobExperience: MonsterSchema.shape.jobExperience,
    drops: z.array(
        z.object({
            dropId: z.number(),
            monsterId: DropSchema.shape.monsterId,
            itemId: DropSchema.shape.itemId,
            chance: DropSchema.shape.chance,
            items: ItemSchema.openapi({ description: "List of items" }),
        }),
    ).optional().openapi({ description: "Drops and Items associated with the monster" }),
    monsterMaps: z.array(
        z.object({
            id: z.number(),
            mapId: MonsterMapSchema.shape.mapId,
            maps: MapSchema.optional().openapi({ description: "List of maps" }),
        })
    ).optional().openapi({ description: "Maps associated with the monster" }),
});

export const DataSchemaArray = z.array(DataSchema);