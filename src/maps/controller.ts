import { MonsterIdSchema } from "../monsters/schema";
import { MapIdSchema } from "./schema";
import { addMonsterMap, addMonsterMapAuto, addMap, addMapAuto } from "./services";

export async function postMonsterMapHandler(c: any) {
    const id = c.req.param('id');
    const paramId = MonsterIdSchema.parse(Number(id));
    const result = await addMonsterMap(paramId);
    return c.json(result);
};

export async function postMonsterMapsHandler(c: any) {
    const result = await addMonsterMapAuto();
    return c.json(result, 201);
};

export async function postMapHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MapIdSchema.parse(id);
    const result = await addMap(parseId);
    return c.json(result, 201);
};

export async function postMapsHandler(c: any) {
    const result = await addMapAuto();
    return c.json(result, 201);
}