import { readAllDrops } from "./services";

export async function getDropsHandler(c: any) {
    const result = await readAllDrops();
    return c.json({
        status: "success",
        message: "Successfully get all drops.",
        data: result
    }, 200);
};