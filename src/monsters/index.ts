import { Hono } from 'hono';
import { z } from "zod";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { fetchRagnarokMonsters, readAllMonsters, addMonsterData, addMonsterDataInBulk } from './services'
import { monsterIdSchema, MonsterSchema } from './schema'

const app = new Hono();
export const monster = new OpenAPIHono();

app.get('/', async (c) => {
  const result = await readAllMonsters();
  return c.json(result);
});

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
      description: "Get all monsters data from database",
    },
  },
});

monster.openapi(getMonsters, async (c) => {
  return c.json(await readAllMonsters());
})

app.get('/fetch/:id', async (c) => {
  const id = c.req.param('id');
  const parseId = monsterIdSchema.parse(Number(id));
  const result = await fetchRagnarokMonsters(parseId);
  return c.json({ result });
});

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  const parseId = monsterIdSchema.parse(Number(id));
  const result = await addMonsterData(parseId);
  return c.json(result, 201);
});

app.post('/bulk/:startId/:endId', async (c) => {
  const startId = c.req.param('startId');
  const endId = c.req.param('endId');
  const parseStartId = monsterIdSchema.parse(Number(startId));
  const parseEndId = monsterIdSchema.parse(Number(endId));
  const result = await addMonsterDataInBulk(parseStartId, parseEndId);
  return c.json(result, 201);
});

export default app;