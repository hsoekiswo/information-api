import { Hono } from 'hono';
import { addMonster, deleteMonsterById, getMonsterById, getMonsters, Monster, fetchRagnarokMonsters, readAllMonsters, addMonsterData, addMonsterDataInBulk, addMonsterDrop, addMonsterDropAuto, addItem, addMonsterMap, addMonsterMapAuto, addMap, addMapAuto } from './monsters'

const app = new Hono();

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

app.get('/fetchmonster/:id', async (c) => {
  const id = c.req.param('id');
  const result = await fetchRagnarokMonsters(id);
  return c.json({ result });
})

app.get('/readmonsters', async (c) => {
  try {
    const result = await readAllMonsters();
    return c.json(result.rows);
  } catch (error) {
    console.error('Error writing to monsters table', error.message);
    return c.json( { error: error.message }, 500);
  }
})

app.post('/addmonsters/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterData(id);
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data:', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/addmonsters/bulk/:startId/:endId', async (c) => {
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

app.post('/adddrops/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterDrop(id);
    return c.json(result, 201)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/adddrops/auto', async (c) => {
  try {
    const result = await addMonsterDropAuto();
    return c.json(result, 201)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/additems/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addItem(id);
    return c.json(result)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/addmonstermap/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterMap(id);
    return c.json(result)
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/addmonstermap/auto', async (c) => {
  try {
    const result = await addMonsterMapAuto();
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/addmap/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMap(id);
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/addmap/auto', async (c) => {
  try {
    const result = await addMapAuto();
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
  }
})

export default app
