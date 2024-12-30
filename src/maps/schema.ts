import { z } from "zod";
import { MonsterIdSchema } from "../monsters/schema";

export const MonsterMapSchema = z.object({
    id: z.number().positive().openapi({ example: 1}),
    monsterId: MonsterIdSchema,
    mapId: z.string().min(1, "mapId must not be empty"),
})

export const MonsterMapsSchema = z.array(MonsterMapSchema);

export const MapIdSchema =  z.string().openapi({example: "prt_fild08"});

export const MapIdParamSchema = z.object({
    id: MapIdSchema
});

export const MapSchema = z.object({
    mapId: MapIdSchema,
    name: z.string().toUpperCase().openapi({ example: "prt_fild08" }),
});

export const MapsSchema = z.array(MapSchema);