import { Hono } from 'hono';
import { fetchRagnarokMonsters, readAllMonsters, addMonsterData, addMonsterDataInBulk } from './services'
import { monsterIdSchema } from './schema'

const app = new Hono();

app.get('/', async (c) => {
  try {
    const result = await readAllMonsters();
    return c.json(result);
  } catch (error) {
    console.error('Error accessing monsters table', error.errors);
    return c.json( { error: error.errors }, 500);
  }
})

app.get('/fetch/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const parseId = monsterIdSchema.parse(Number(id));
    const result = await fetchRagnarokMonsters(parseId);
    return c.json({ result });
  } catch(error) {
    console.error('Invalid monster ID:', error.errors);
    return c.json({ error: 'Invalid monster ID', details: error.errors }, 400);
  }
})

app.post('/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const parseId = monsterIdSchema.parse(Number(id));
    const result = await addMonsterData(parseId);
    return c.json(result, 201);
  } catch (error) {
    console.error('Invalid monster ID:', error.errors);
    return c.json({ error: 'Invalid monster ID', details: error.errors }, 400);
  }
})

app.post('/bulk/:startId/:endId', async (c) => {
  const startId = c.req.param('startId');
  const endId = c.req.param('endId');
  try {
    const parseStartId = monsterIdSchema.parse(Number(startId));
    const parseEndId = monsterIdSchema.parse(Number(endId));
    const result = await addMonsterDataInBulk(parseStartId, parseEndId);
    return c.json(result, 201);
  } catch (error) {
    console.error('Invalid Monster ID:', error.errors);
    return c.json({ error: 'Invalid Monster ID', details: error.errors }, 400);
  }
})

export default app;