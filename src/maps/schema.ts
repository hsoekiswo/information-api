import { z } from "zod";

export const MonsterMapSchema = z.object({
    monsterId: z.number().positive(),
    mapId: z.string().min(1, "mapId must not be empty"),
})

export const MonsterMapSchemaArray = z.array(MonsterMapSchema);

export const MapSchema = z.object({
    mapId: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "The string must contain at least one alphabet and one number.",
    }),
    name: z.string().toUpperCase(),
})