import { z } from "zod";
import { MonsterIdSchema } from "../monsters/schema";

export const MonsterMapSchema = z.object({
    monsterId: MonsterIdSchema,
    mapId: z.string().min(1, "mapId must not be empty"),
})

export const MonsterMapSchemaArray = z.array(MonsterMapSchema);

export const MapIdSchema =  z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: "The string must contain at least one alphabet and one number.",
})

export const MapSchema = z.object({
    mapId: MapIdSchema,
    name: z.string().toUpperCase(),
})