
import { MonsterIdSchema } from "../monsters/schema";
import { getData, getDataAll, addData, addDataBulk } from "./services";

export async function getDataHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await getData(parseId);

    return c.json({
        status: "success",
        message: `Succesfully get monster and its component with ID: ${id} from the database.`,
        data: result,
    }, 200);
};

export async function getDataAllHandler(c: any) {
    const result = await getDataAll();

    return c.json({
        status: "success",
        message: `Succesfully get all monsters and its component from the database.`,
        data: result,
    }, 200);
}

export async function postDataHandler(c: any) {
    const id = c.req.param('id');
    const parseId = MonsterIdSchema.parse(Number(id));
    const result = await addData(parseId);

    return c.json({
        status: "success",
        message: `Successfully post monster and its components with ID: ${id} to the database.`,
        data: result
    }, 201);
}

export async function postDataBulkHandler(c: any) {
    const startId = c.req.param('startId');
    const endId = c.req.param('endId');
    const parseStartId = MonsterIdSchema.parse(Number(startId));
    const parseEndId = MonsterIdSchema.parse(Number(endId));
    const result = await addDataBulk(parseStartId, parseEndId);

    return c.json({
        status: "success",
        message: `Successfully post monsters and its components with IDs: ${startId}-${endId} to the database.`,
        data: result
    }, 201);
}