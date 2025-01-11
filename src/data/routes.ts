import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from '@hono/zod-openapi'
import { getDataHandler, getDataAllHandler, postDataHandler, postDataBulkHandler } from './controller'
import { MonsterIdParamsSchema, MonsterIdRangeParamsSchema } from "../monsters/schema";
import { DataSchema, DataSchemaArray } from "./schema";
import { loginMiddleware, checkAdminRole } from "../auth/service";

export const app = new OpenAPIHono();

app.use('*', loginMiddleware);

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
                    schema: DataSchema,
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
                    schema: DataSchemaArray,
                },
            },
            description: "Get all data (monster, drop, item, map) from single Monster ID.",
        },
    },
});

app.openapi(getDataAll, getDataAllHandler);

app.use('*', checkAdminRole);

const postData = createRoute({
    method: "post",
    path: "/single/{id}",
    tags: ["Main"],
    request: {
        params: MonsterIdParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: DataSchema,
                },
            },
            description: "Post single monster and its component: drops, items & maps.",
        },
        403: {
            description: 'Forbidden message',
            content: {
                'application/json': {
                    schema: z.object({}),
                    example: { message: 'Forbidden: Admins only' },
                },
            },
        },
    },
});

app.openapi(postData, postDataHandler);

const postDataBulk = createRoute({
    method: "post",
    path: "/bulk/{startId}/{endId}",
    tags: ["Main"],
    request: {
        params: MonsterIdRangeParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: DataSchemaArray,
                },
            },
            description: "Post multiple monsters and its component: drops, items & maps.",
        },
    },
});

app.openapi(postDataBulk, postDataBulkHandler);