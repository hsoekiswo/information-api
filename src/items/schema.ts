import { z } from "zod";

export const ItemIdSchema = z.number().positive().openapi({example: 909});

const ItemIdParams = z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "909"});

export const ItemIdParamsSchema = z.object({
    id: ItemIdParams
});

export const ItemSchema = z.object({
    itemId: ItemIdSchema,
    name: z.string().toUpperCase(),
    description: z.string(),
    itemType: z.string().toUpperCase(),
    attack: z.number().nonnegative(),
    magicAttack: z.number().nonnegative().nullable(),
    defense: z.number().nonnegative(),
    weight: z.number().nonnegative(),
    requiredLevel: z.number().nonnegative().max(200).nullable(),
    price: z.number().nonnegative().nullable(),
});

export const ItemsSchema = z.array(ItemSchema);