import { Hono } from 'hono';
import { z } from 'zod';
import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from './services'
import { monsterIdSchema } from '../monsters/schema';

const app = new Hono();

app.get('/', async (c) => {
    try {
        const result = await readAllDrops();
        return c.json(result);
    } catch(error) {
        return c.json({ error: error.message }, 500);
    }
})

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const parseId = monsterIdSchema.parse(Number(id));
    const result = await addMonsterDrops(parseId);
    return c.json(result, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: "Validation Error",
        details: error.errors,
      }, 400)
    }
    return c.json({ error: 'Error writing data to drops table', details: error.errors }, 500);
  }
})

app.post('/auto', async (c) => {
  try {
    const result = await addMonsterDropsAuto();
    return c.json(result, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: "Validation Error",
        details: error.errors,
      }, 400)
    }
    return c.json({ error: 'Error writing data to drops table', details: error.errors }, 500);
  }
})

export default app;