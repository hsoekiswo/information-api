import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from '@hono/zod-openapi'
import { postDataHandler, postDataBulkHandler } from './controller'
import { MonsterIdParamsSchema, MonsterIdRangeParamsSchema } from "../monsters/schema";

export const app = new OpenAPIHono();

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