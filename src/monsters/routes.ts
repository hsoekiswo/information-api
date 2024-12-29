import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema, MonsterSchema, MonstersSchema } from './schema'
import { getMonsterHandler, getAllMonstersHandler, fetchMonsterbyIdHandler } from './controller';

export const app = new OpenAPIHono();

const getMonster = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Monsters"],
  request: {
    params: MonsterIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonstersSchema,
        },
      },
      description: `Get monster with specific ID from database.`,
    },
  },
});

app.openapi(getMonster, getMonsterHandler);

const getAllMonsters = createRoute({
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

app.openapi(getAllMonsters, getAllMonstersHandler);

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