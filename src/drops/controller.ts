import { MonsterIdSchema } from "../monsters/schema";
import { readDrop, readAllDrops } from "./services";

export async function getDropHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await readDrop(parseId);
    return c.json({
        status: "success",
        message: `Successfully get single drop data for Monster ID of ${id}.`,
        data: result
    }, 200);
}

export async function getAllDropsHandler(c: any) {
    const result = await readAllDrops();
    return c.json({
        status: "success",
        message: "Successfully get all drops.",
        data: result
    }, 200);
};