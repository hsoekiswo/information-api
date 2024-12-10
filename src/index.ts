import { Hono } from 'hono'
import { getMonsterById, getMonsters } from './monsters'

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

// app.post('monsters', (c) => {
//   const body = c.req.parseBody();
//   return c
// })

export default app
