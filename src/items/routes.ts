import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ItemIdParamsSchema, ItemSchema, ItemsSchema } from './schema';
import { getItemsHandler, postItemHandler, postItemsHandler } from './controller';

export const app = new OpenAPIHono();

const getItems = createRoute({
    method: "get",
    path: "/",
    tags: ["Drops & Items"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ItemsSchema,
                },
            },
            description: "Get all items data from database."
        },
    },
});

app.openapi(getItems, getItemsHandler);