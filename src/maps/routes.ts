import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema } from "../monsters/schema";
import { getMonsterMapHandler, getAllMonsterMapsHandler } from "./controller";
import { MonsterMapsSchema } from "./schema";

export const app = new OpenAPIHono();

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
    path: "/monstermaps/",
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