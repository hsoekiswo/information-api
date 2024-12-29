import { MonsterIdSchema } from "../monsters/schema";
import { readMonsterMap, readAllMonsterMaps } from "./services";


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
}