import { readAllMonsters, fetchRagnarokMonsters, addMonsterData, addMonsterDataInBulk } from "./services";
import { MonsterIdSchema } from "./schema";

export async function getAllMonstersHandler(c: any) {
    const result = await readAllMonsters();
    return c.json({
        status: "success",
        message: "Successfully get all monters.",
        data: result
    }, 200);
}

export async function fetchMonsterbyIdHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await fetchRagnarokMonsters(parseId);
    return c.json({
        status: "success",
        message: `Successfully fetch monster with ID: ${id} from Divine Pride API.`,
        data: result
    }, 200);
}

export async function postMonsterHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await addMonsterData(parseId);
    return c.json({
        status: "success",
        message: `Successfully post monster with ID: ${id} to the database.`,
        data: result
    }, 201);
}

export async function postMonstersHandler(c: any) {
    const startId = c.req.param('startId');
    const endId = c.req.param('endId');
    const parseStartId = MonsterIdSchema.parse(Number(startId));
    const parseEndId = MonsterIdSchema.parse(Number(endId));
    const result = await addMonsterDataInBulk(parseStartId, parseEndId);
    return c.json({
        status: "success",
        message: `Successfully post monsters with IDs: ${startId}-${endId} to the database.`,
        data: result
    }, 201);
}