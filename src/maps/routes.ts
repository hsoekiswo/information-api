import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema } from '../monsters/schema';
import { MapIdParamSchema, MapsSchema, MonsterMapsSchema } from './schema';
import { postMonsterMapHandler, postMonsterMapsHandler, postMapHandler, postMapsHandler } from './controller';

export const app = new OpenAPIHono();

const postMonsterMap = createRoute({
    method: "post",
    path: "/monstermaps/single/{id}",
    tags: ['Maps'],
    request: {
        params: MonsterIdParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MonsterMapsSchema,
                },
            },
            description: "Post single monster-map relation by passing Monster ID through Divine Pride API."
        },
    },
});

app.openapi(postMonsterMap, postMonsterMapHandler);

const postMonsterMaps = createRoute({
    method: "post",
    path: "/monstermaps/auto",
    tags: ['Maps'],
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MonsterMapsSchema
                },
            },
            description: "Post multiple monster-map relations by passing remaining Monster IDs in DB which not have relation yet through Divine Pride API."
        },
    },
});

app.openapi(postMonsterMaps, postMonsterMapsHandler);

const postMap = createRoute({
    method: "post",
    path: "/single/{id}",
    tags: ['Maps'],
    request: {
        params: MapIdParamSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Post single map by passing Map ID through Divine Pride API."
        },
    },
});

app.openapi(postMap, postMapHandler);

const postMaps = createRoute({
    method: "post",
    path: "/auto",
    tags: ['Maps'],
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Post multiple maps by passing remaining Map IDs in DB which not have relation yet through Divine Pride API."
        },
    },
});

app.openapi(postMaps, postMapsHandler);

export default app;