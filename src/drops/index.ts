import { Hono } from 'hono';
import { z } from 'zod';
import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from './services'
import { MonsterIdSchema } from '../monsters/schema';

const app = new Hono();

app.get('/', async (c) => {
    const result = await readAllDrops();
    return c.json(result);
});

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  const parseId = MonsterIdSchema.parse(Number(id));
  const result = await addMonsterDrops(parseId);
  return c.json(result, 201);
});

app.post('/auto', async (c) => {
  const result = await addMonsterDropsAuto();
  return c.json(result, 201);
});

export default app;