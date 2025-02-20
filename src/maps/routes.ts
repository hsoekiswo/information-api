import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema } from "../monsters/schema";
import { getMonsterMapHandler, getAllMonsterMapsHandler, getMapHandler, getAllMapsHandler, fetchMapHandler } from "./controller";
import { MonsterMapsSchema, MapsSchema, MapIdParamSchema } from "./schema";
import { loginMiddleware } from "../auth/service";

export const app = new OpenAPIHono();

app.use('*', loginMiddleware);

const getMonsterMap = createRoute({
    method: "get",
    path: "/monstermaps/single/{id}",
    tags: ["Maps"],
    request: {
        params: MonsterIdParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MonsterMapsSchema,
                },
            },
            description: "Get monster map (monster to map relation) of single Monster ID from the database.",
        },
    },
});

app.openapi(getMonsterMap, getMonsterMapHandler);

const getAllMonsterMaps = createRoute({
    method: "get",
    path: "/monstermaps",
    tags: ["Maps"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MonsterMapsSchema,
                },
            },
            description: "Get all monster maps (monster to map relation) from the database.",
        },
    },
});

app.openapi(getAllMonsterMaps, getAllMonsterMapsHandler);

const getMap = createRoute({
    method: "get",
    path: "/single/{id}",
    tags: ["Maps"],
    request: {
        params: MapIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Get maps of single Map ID from the database."
        },
    },
});

app.openapi(getMap, getMapHandler);

const getAllMaps = createRoute({
    method: "get",
    path: "/",
    tags: ["Maps"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Get all maps from the database."
        },
    },
});

app.openapi(getAllMaps, getAllMapsHandler);

const fetchMap = createRoute({
    method: "get",
    path: "/fetch/{id}",
    tags: ["Maps"],
    request: {
        params: MapIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Fetch single map from Divine Pride API."
        },
    },
});

app.openapi(fetchMap, fetchMapHandler);