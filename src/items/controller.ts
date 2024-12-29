import { ItemIdSchema } from "./schema";
import { readItem, readAllItems } from "./services";

export async function getItemHandler(c: any) {
    const id = c.req.param('id');
    const parseId = ItemIdSchema.parse(Number(id));
    const result = await readItem(parseId);
    return c.json({
        status: "success",
        message: `Successfully get item with Item ID of ${id} from the database.`,
        data: result,
    }, 200)
}

export async function getAllItemsHandlers(c: any) {
    const result = await readAllItems();
    return c.json({
        status: "success",
        message: `Successfully get all items from the database.`,
        data: result,
    }, 200);
};