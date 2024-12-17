import { Hono } from 'hono';
import { fetchRagnarokMonsters, readAllMonsters, addMonsterData, addMonsterDataInBulk } from './services'

const app = new Hono();

app.get('/read', async (c) => {
    try {
      const result = await readAllMonsters();
      return c.json(result);
    } catch (error) {
      console.error('Error writing to monsters table', error.message);
      return c.json( { error: error.message }, 500);
    }
  })

app.get('/fetch/:id', async (c) => {
  const id = c.req.param('id');
  const result = await fetchRagnarokMonsters(id);
  return c.json({ result });
})

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterData(id);
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data:', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/bulk/:startId/:endId', async (c) => {
  const startId = Number(c.req.param('startId'));
  const endId = Number(c.req.param('endId'));
  try {
    const result = await addMonsterDataInBulk(startId, endId);
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data:', error.message);
    return c.json({ error: error.message }, 500);
  }
})

export default app;