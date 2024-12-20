import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from "./services";
import { MonsterIdSchema } from "../monsters/schema";

export async function getDropsHandler(c: any) {
    const result = await readAllDrops();
    return c.json(result);
};

export async function postDropHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await addMonsterDrops(parseId);
    return c.json(result, 201);
};

export async function postDropsHandler(c: any) {
    const result = await addMonsterDropsAuto();
    return c.json(result, 201);
};