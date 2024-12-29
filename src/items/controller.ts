import { ItemIdSchema } from "./schema";
import { readItem, readAllItems, fetchRagnarokItems } from "./services";

export async function getItemHandler(c: any) {
    const id = c.req.param('id');
    const parseId = ItemIdSchema.parse(Number(id));
    const result = await readItem(parseId);
    return c.json({
        status: "success",
        message: `Successfully get item with Item ID of ${id} from the database.`,
        data: result,
    }, 200);
};

export async function getAllItemsHandler(c: any) {
    const result = await readAllItems();
    return c.json({
        status: "success",
        message: `Successfully get all items from the database.`,
        data: result,
    }, 200);
};

export async function fetchItemHandler(c: any) {
    const id = c.req.param('id');
    const parseId = ItemIdSchema.parse(Number(id));
    const result = await fetchRagnarokItems(parseId);
    return c.json({
        status: "success",
        message: `Successfully fetch item with ID: ${id} from Divine Pride API.`,
        data: result,
    }, 200)
}