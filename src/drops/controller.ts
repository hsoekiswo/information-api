import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from "./services";
import { MonsterIdSchema } from "../monsters/schema";

export async function getDropsHandler(c: any) {
    const result = await readAllDrops();
    return c.json({
        status: "success",
        message: "Successfully get all drops.",
        data: result
    }, 200);
};

export async function postDropHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await addMonsterDrops(parseId);
    return c.json({
        status: "success",
        message: `Successfully post drops with Monster ID: ${id} to database.`,
        data: result
    }, 201);
};

export async function postDropsHandler(c: any) {
    const result = await addMonsterDropsAuto();
    return c.json({
        status: "success",
        message: "Successfully post drops to all Monster IDs without existing drop relations.",
        data: result
    }, 201);
};