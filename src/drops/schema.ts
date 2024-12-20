import { z } from "zod";

export const DropSchema = z.object({
    dropId: z.number().positive(),
    itemId: z.number().positive(),
    chance: z.number().nonnegative(),
})

export const DropsSchema = z.array(DropSchema);