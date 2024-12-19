import { Hono } from 'hono';
import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from './services'
import { monsterIdSchema } from '../monsters/schema';

const app = new Hono();

app.get('/', async (c) => {
    try {
        const result = await readAllDrops();
        return c.json(result);
    } catch(error) {
        console.error('Error fetching external API or inserting data::', error.message);
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
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/auto', async (c) => {
  try {
    const result = await addMonsterDropsAuto();
    return c.json(result, 201)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

export default app;