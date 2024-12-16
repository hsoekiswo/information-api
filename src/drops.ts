import { Hono } from 'hono';
import { addMonsterDrops, addMonsterDropsAuto } from './services'

const app = new Hono();

app.get('/all', async(c) => {

})

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterDrops(id);
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