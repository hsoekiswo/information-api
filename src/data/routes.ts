import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from '@hono/zod-openapi'
import { getDataHandler, getDataAllHandler, postDataHandler, postDataBulkHandler } from './controller'
import { MonsterIdParamsSchema, MonsterIdRangeParamsSchema } from "../monsters/schema";

export const app = new OpenAPIHono();

const getData = createRoute({
    method: "get",
    path: "/single/{id}",
    tags: ["Main"],
    request: {
        params: MonsterIdParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({}),
                },
            },
            description: "Get all data (monster, drop, item, map) from single Monster ID.",
        },
    },
});

app.openapi(getData, getDataHandler);

const getDataAll = createRoute({
    method: "get",
    path: "/",
    tags: ["Main"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({}),
                },
            },
            description: "Get all data (monster, drop, item, map) from single Monster ID.",
        },
    },
});

app.openapi(getDataAll, getDataAllHandler);

const postData = createRoute({
    method: "post",
    path: "/single/{id}",
    tags: ["Monsters"],
    request: {
        params: MonsterIdParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({}),
                },
            },
            description: "Post single monster and its component: drops, items & maps.",
        },
    },
});

app.openapi(postData, postDataHandler);

const postDataBulk = createRoute({
    method: "post",
    path: "/bulk/{startId}/{endId}",
    tags: ["Monsters"],
    request: {
        params: MonsterIdRangeParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({}),
                },
            },
            description: "Post multiple monsters and its component: drops, items & maps.",
        },
    },
});

app.openapi(postDataBulk, postDataBulkHandler);