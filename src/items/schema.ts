import { z } from "zod";

export const ItemSchema = z.object({
    itemId: z.number().positive(),
    name: z.string().toUpperCase(),
    description: z.string(),
    itemType: z.string().toUpperCase(),
    attack: z.number().nonnegative(),
    magicAttack: z.number().nonnegative().nullable(),
    defense: z.number().nonnegative(),
    weight: z.number().nonnegative(),
    requiredLevel: z.number().nonnegative().max(200).nullable(),
    price: z.number().positive().nullable(),
})