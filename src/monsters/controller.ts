import { readMonster, readAllMonsters, fetchRagnarokMonsters } from "./services";
import { MonsterIdSchema } from "./schema";

export async function getMonsterHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await readMonster(parseId);
    return c.json({
        status: "success",
        message: `Successfully get monster with ID of ${id}`,
        data: result
    }, 200);
};

export async function getAllMonstersHandler(c: any) {
    const result = await readAllMonsters();
    return c.json({
        status: "success",
        message: "Successfully get all monters.",
        data: result
    }, 200);
};

export async function fetchMonsterbyIdHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await fetchRagnarokMonsters(parseId);
    return c.json({
        status: "success",
        message: `Successfully fetch monster with ID: ${id} from Divine Pride API.`,
        data: result
    }, 200);
};