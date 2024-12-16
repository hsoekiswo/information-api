import { Hono } from 'hono';
import { addMonster, deleteMonsterById, getMonsterById, getMonsters, Monster, fetchRagnarokMonsters, readAllMonsters, addMonsterData, addMonsterDataInBulk, updateMonsterById } from './services'

const app = new Hono();

// app.get('/', async (c) => {
//   const monsters = await getMonsters();
//   return c.json(monsters);
// })

// app.get('/:id', async(c) => {
//   const id = c.req.param('id');
//   const monster = await getMonsterById(Number(id));
//   return c.json(monster);
// })

// app.post('/', async (c) => {
//   const monstersStats = await c.req.parseBody();
//   const newMonster = await addMonster(monstersStats);
//   return c.json(newMonster, 201);
// });

// app.patch('/:id', async(c) => {
//   const id = c.req.param('id');
//   const body = await c.req.parseBody();
//   const monstersStats : Monster = {
//     id: Number(id),
//     ...body
//   }
  
//   const updatedMonster = await updateMonsterById(monstersStats);
//   return c.json(updatedMonster);
// })

// app.delete('/:id', async(c) => {
//   const id = c.req.param('id');
//   const deletedMonster = await deleteMonsterById(Number(id));
//   return c.text(deletedMonster);
// })

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

app.post('/add/single/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const result = await addMonsterData(id);
    return c.json(result, 201);
  } catch (error) {
    console.error('Error fetching external API or inserting data:', error.message);
    return c.json({ error: error.message }, 500);
  }
})

app.post('/add/bulk/:startId/:endId', async (c) => {
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