import { Hono } from 'hono';
import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from './services'
import { monsterIdSchema } from '../monsters/schema';

const app = new Hono();

app.get('/', async (c) => {
    try {
        const result = await readAllDrops();
        return c.json(result);
    } catch(error) {
        console.error('Error accessing drops table:', error.message);
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
    console.error('Invalid monster ID:', error.message);
    return c.json({ error: 'Invalid monster ID', details: error.message }, 500);
  }
})

app.post('/auto', async (c) => {
  try {
    const result = await addMonsterDropsAuto();
    return c.json(result, 201)
  } catch (error) {
    console.error('Failed to populate the drops table. Unable to automatically retrieve data from the current list of monster IDs:', error.message);
    return c.json({ error: 'Failed to populate the drops table. Unable to automatically retrieve data from the current list of monster IDs', details: error.message }, 500);
  }
})

export default app;