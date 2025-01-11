import { z } from "@hono/zod-openapi";

export const ItemIdSchema = z.number().positive().openapi({example: 909});

const ItemIdParams = z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "909"});

export const ItemIdParamsSchema = z.object({
    id: ItemIdParams
});

export const ItemSchema = z.object({
    itemId: ItemIdSchema,
    name: z.string().toUpperCase().openapi({ example: 'Jellopy' }),
    description: z.string().openapi({ example: 'A small crystallization created by some monsters.\nWeight: ^8080801^000000' }),
    itemType: z.string().toUpperCase().openapi({ example: 'Jellopy' }),
    attack: z.number().nonnegative().openapi({ example: 0 }),
    magicAttack: z.number().nonnegative().nullable().openapi({ example: null }),
    defense: z.number().nonnegative().openapi({ example: 0 }),
    weight: z.number().nonnegative().openapi({ example: 1 }),
    requiredLevel: z.number().nonnegative().max(200).nullable().openapi({ example: null }),
    price: z.number().nonnegative().nullable().openapi({ example: 4 }),
});

export const ItemsSchema = z.array(ItemSchema);