import { z } from "@hono/zod-openapi";
import { ItemSchema } from "../items/schema";
import { DropSchema } from "../drops/schema";
import { MonsterSchema } from "../monsters/schema";

export const JobLevelParamsSchema = z.object({
    type: z.enum(["job_first", "job_second", "job_third"]).openapi({example: "job_first"}),
    level: z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "30"}),
});

export const ChanceItemSchema = z.object({
    name: ItemSchema.shape.name,
    itemId: ItemSchema.shape.itemId,
    itemType: ItemSchema.shape.itemType,
    drops: z.array(
        z.object({
            chance: DropSchema.shape.chance,
            monsters: z.object({
                name: MonsterSchema.shape.name,
                level: MonsterSchema.shape.level,
                hp: MonsterSchema.shape.hp,
            }),
        }),
    ),
});

export const ChanceItemSchemaArray = z.array(ChanceItemSchema);