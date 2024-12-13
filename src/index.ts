import { Client } from 'pg';
import dotenv from 'dotenv'
import { Hono } from 'hono'
import { addMonster, deleteMonsterById, getMonsterById, getMonsters, Monster, updateMonsterById, fetchFromExternalAPI, fetchFromExternalAPI2 } from './monsters'

const app = new Hono();

dotenv.config({ path: '../.env' });

console.log('DB Config:', {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
});

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});
await client.connect();

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

app.get('/readmonsters', async (c) => {
  const result = await client.query('SELECT * FROM monsters');
  return c.json(result.rows);
})

export default app
