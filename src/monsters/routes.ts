import { Hono } from 'hono';
import { z } from "zod";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
// import { fetchRagnarokMonsters, addMonsterData, addMonsterDataInBulk } from './services'
import { MonsterIdParamsSchema, MonsterIdRangeParamsSchema, MonsterSchema, MonstersSchema } from './schema'
import { getAllMonstersHandler, fetchMonsterbyIdHandler, postMonsterHandler, postMonstersHandler } from './controller';

// const app = new Hono();
export const app = new OpenAPIHono();

// app.get('/', async (c) => {
//   const result = await readAllMonsters();
//   return c.json(result);
// });

const getMonsters = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(MonsterSchema),
        },
      },
      description: "Get all monsters data from database.",
    },
  },
});

app.openapi(getMonsters, getAllMonstersHandler);

// app.get('/fetch/:id', async (c) => {
//   const id = c.req.param('id');
//   const parseId = monsterIdSchema.parse(Number(id));
//   const result = await fetchRagnarokMonsters(parseId);
//   return c.json({ result }, 200);
// });

const fetchMonsters = createRoute({
  method: "get",
  path: "/fetch/{id}",
  request: {
    params: MonsterIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonsterSchema,
        }
      },
      description: "Fetch single monster to Divine Pride API.",
    },
  }
});

app.openapi(fetchMonsters, fetchMonsterbyIdHandler);

// app.post('/single/:id', async (c) => {
//   const id = c.req.param('id');
//   const parseId = MonsterIdSchema.parse(Number(id));
//   const result = await addMonsterData(parseId);
//   return c.json(result, 201);
// });

const postMonster = createRoute({
  method: "post",
  path: "/single/{id}",
  request: {
    params: MonsterIdParamsSchema,
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: MonsterSchema
        }
      },
      description: "Post single monster by passing Monster ID through Divine Pride API."
    },
  },
});

app.openapi(postMonster, postMonsterHandler);

// app.post('/bulk/:startId/:endId', async (c) => {
//   const startId = c.req.param('startId');
//   const endId = c.req.param('endId');
//   const parseStartId = MonsterIdSchema.parse(Number(startId));
//   const parseEndId = MonsterIdSchema.parse(Number(endId));
//   const result = await addMonsterDataInBulk(parseStartId, parseEndId);
//   return c.json(result, 201);
// });

const postMonsters = createRoute({
  method: "post",
  path: "/bulk/{startId}/{endId}",
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