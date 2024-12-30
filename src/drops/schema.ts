import { z } from "@hono/zod-openapi";

export const DropSchema = z.object({
    dropId: z.number().positive().openapi({example: 129}),
    itemId: z.number().positive().openapi({example: 909}),
    chance: z.number().nonnegative().openapi({example: 70}),
})

export const DropsSchema = z.array(DropSchema);