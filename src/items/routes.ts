import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ItemIdParamsSchema, ItemSchema, ItemsSchema } from './schema';
import { getItemsHandler, postItemHandler, postItemsHandler } from './controller';

export const app = new OpenAPIHono();

const getItems = createRoute({
    method: "get",
    path: "/",
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

const postItem = createRoute({
    method: "post",
    path: "/single/{id}",
    request: {
        params: ItemIdParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: ItemSchema,
                },
            },
            description: "Post single item by passing Item ID through Divine Pride API."
        },
    },
});

app.openapi(postItem, postItemHandler);

const postItems = createRoute({
    method: "post",
    path: "/auto",
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: ItemsSchema,
                },
            },
            description: "Post multiple items by passing remaining Item IDs in DB which not have relation yet through Divine Pride API."
        },
    },
});

app.openapi(postItems, postItemsHandler);

export default app;