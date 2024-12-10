import { Hono } from 'hono'
import { addMonster, getMonsterById, getMonsters, Monster } from './monsters'

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
  const monstersStats : Omit<Monster, 'id'> = await c.req.parseBody();
  const newMonster = await addMonster(monstersStats);
  return c.json(newMonster, 201);
})

export default app
