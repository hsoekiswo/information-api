import { readAllItems, addItems, addItemsAuto } from "./services";
import { ItemIdSchema } from "./schema";

export async function getItemsHandler(c: any) {
    const result = await readAllItems();
    return c.json(result);
};

export async function postItemHandler(c: any) {
    const id = c.req.param('id');
    const parseId = ItemIdSchema.parse(Number(id));
    const result = await addItems(parseId);
    return c.json(result);
};

export async function postItemsHandler(c: any) {
    const result = await addItemsAuto();
    return c.json(result);
};