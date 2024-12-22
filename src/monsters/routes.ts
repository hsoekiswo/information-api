import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema, MonsterIdRangeParamsSchema, MonsterSchema, MonstersSchema } from './schema'
import { getAllMonstersHandler, fetchMonsterbyIdHandler, postMonsterHandler, postMonstersHandler } from './controller';

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

const postMonster = createRoute({
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
          schema: MonsterSchema,
        },
      },
      description: "Post single monster by passing Monster ID through Divine Pride API."
    },
  },
});

app.openapi(postMonster, postMonsterHandler);

const postMonsters = createRoute({
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
          schema: MonstersSchema
        }
      },
      description: "Post multiple monsters by passing start Monster ID and the end Monster ID through Divine Pride API."
    },
  },
});

app.openapi(postMonsters, postMonstersHandler);

export default app;