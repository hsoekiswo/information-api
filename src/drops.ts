import { Hono } from 'hono';
import { addMonsterDrop, addMonsterDropAuto } from './services'

const app = new Hono();

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterDrop(id);
    return c.json(result, 201)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/auto', async (c) => {
  try {
    const result = await addMonsterDropAuto();
    return c.json(result, 201)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

export default app;