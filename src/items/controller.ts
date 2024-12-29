import { readAllItems } from "./services";

export async function getItemsHandler(c: any) {
    const result = await readAllItems();
    return c.json(result);
};