import { Hono } from 'hono';
import { handleError } from '../errorHandler';
import { fetchRagnarokMonsters, readAllMonsters, addMonsterData, addMonsterDataInBulk } from './services'
import { monsterIdSchema } from './schema'

const app = new Hono();

app.onError((error, c) => {
  const { status, body } = handleError(error, c);
  return c.json(body, status);
});

app.get('/', async (c) => {
  const result = await readAllMonsters();
  return c.json(result);
});

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