import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ItemIdParamsSchema, ItemSchema, ItemsSchema } from './schema';
import { getItemHandler, getAllItemsHandler, fetchItemHandler } from './controller';

export const app = new OpenAPIHono();

const getItem = createRoute({
    method: "get",
    path: "/single/{id}",
    tags: ["Drops & Items"],
    request: {
        params: ItemIdParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ItemSchema,
                },
            },
            description: "Get single item data from database by Item ID.",
        },
    },
});

app.openapi(getItem, getItemHandler);

const getAllItems = createRoute({
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

app.openapi(getAllItems, getAllItemsHandler);

const fetchItem = createRoute({
    method: "get",
    path: "/fetch/{id}",
    tags: ["Drops & Items"],
    request: {
        params: ItemIdParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ItemSchema,
                },
            },
            description: "Get single item data from database by Item ID.",
        },
    },
});

app.openapi(fetchItem, fetchItemHandler);