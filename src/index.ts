import { Hono } from 'hono'
import { addMonster, deleteMonsterById, getMonsterById, getMonsters, Monster, updateMonsterById, fetchFromExternalAPI, fetchFromExternalAPI2 } from './monsters'

const app = new Hono()

app.get('/', (c) => {
  return c.text("Hello this is mini Ragnarok monsters database api for learning!")
})

app.get('/monsters', async (c) => {
  const monsters = await getMonsters();
  return c.json(monsters);
})

app.get('monsters/:id', async(c) => {
  const id = c.req.param('id');
  const monster = await getMonsterById(Number(id));
  return c.json(monster);
})

app.post('/monsters', async (c) => {
  const monstersStats = await c.req.parseBody();
  const newMonster = await addMonster(monstersStats);
  return c.json(newMonster, 201);
})

app.patch('/monsters/:id', async(c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const monstersStats : Monster = {
    id: Number(id),
    ...body
  }
  
  const updatedMonster = await updateMonsterById(monstersStats);
  return c.json(updatedMonster);
})

app.delete('/monsters/:id', async(c) => {
  const id = c.req.param('id');
  const deletedMonster = await deleteMonsterById(Number(id));
  return c.text(deletedMonster);
})

app.get('/test/:id', async(c) => {
  const id = c.req.param('id');

  try {
    // Fetch from external API
    const data = await fetchFromExternalAPI(id);

    return c.json({ source: 'external', data });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
})

app.get('/test2', async(c) => {
  try {
    const data = await fetchFromExternalAPI2();

    return c.json({ data });
  } catch (error) {
    console.error('Error fetching external API:', error.message);
    return c.json({ error: error.message }, 500);
  }
})

export default app
