import { MonsterIdSchema } from "../monsters/schema";
import { MapIdSchema } from "./schema";
import { readMonsterMap, readAllMonsterMaps, readMap, readAllMaps, fetchRagnarokMaps } from "./services";


export async function getMonsterMapHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await readMonsterMap(parseId);
    return c.json({
        status: "success",
        message: `Successfully read monster maps with Monster ID of ${id} from the database.`,
        data: result,
    }, 200)
};

export async function getAllMonsterMapsHandler(c: any) {
    const result = await readAllMonsterMaps();
    return c.json({
        status: "success",
        message: "Successfully read all monster maps from the database.",
        data: result,
    }, 200)
};

export async function getMapHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MapIdSchema.parse(id);
    const result = await readMap(parseId);
    return c.json({
        status: "success",
        message: `Successfully read maps with Map ID of ${id} from the database.`,
        data: result,
    }, 200)
};

export async function getAllMapsHandler(c: any) {
    const result = await readAllMaps();
    return c.json({
        status: "success",
        message: "Successfully read all maps from the database.",
        data: result,
    }, 200)
};

export async function fetchMapHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MapIdSchema.parse(id);
    const result = await fetchRagnarokMaps(parseId);
    return c.json({
        status: "success",
        message: `Successfully fetch map with ID: ${id} from Divine Pride API.`,
        data: result,
    }, 200);
}