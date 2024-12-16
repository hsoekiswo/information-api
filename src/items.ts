import { Hono } from 'hono';
import { addItem } from './services'

const app = new Hono();

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addItem(id);
    return c.json(result)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

export default app;