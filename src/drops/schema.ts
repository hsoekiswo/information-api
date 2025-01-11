import { z } from "@hono/zod-openapi";
import { MonsterIdSchema } from "../monsters/schema";

export const DropSchema = z.object({
    monsterId: MonsterIdSchema,
    itemId: z.number().positive().openapi({example: 909}),
    chance: z.number().nonnegative().openapi({example: 70}),
})

export const DropsSchema = z.array(DropSchema);