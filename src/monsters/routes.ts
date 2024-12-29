import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema, MonsterIdRangeParamsSchema, MonsterSchema, MonstersSchema } from './schema'
import { getAllMonstersHandler, fetchMonsterbyIdHandler } from './controller';

export const app = new OpenAPIHono();

const getMonsters = createRoute({
  method: "get",
  path: "/",
  tags: ["Monsters"],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonstersSchema,
        },
      },
      description: "Get all monsters data from database.",
    },
  },
});

app.openapi(getMonsters, getAllMonstersHandler);

const fetchMonsters = createRoute({
  method: "get",
  path: "/fetch/{id}",
  tags: ["Monsters"],
  request: {
    params: MonsterIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonsterSchema,
        },
      },
      description: "Fetch single monster to Divine Pride API.",
    },
  }
});

app.openapi(fetchMonsters, fetchMonsterbyIdHandler);