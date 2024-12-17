import { Hono } from 'hono';
import { addMonsterMap, addMonsterMapAuto, addMap, addMapAuto } from './services'

const app = new Hono();

app.post('/monstersmap/single/:id', async (c) => {
    const id = c.req.param('id');
    try {
      const result = await addMonsterMap(id);
      return c.json(result)
    } catch (error) {
      console.error('Error fetching external API or inserting data::', error.message);
      return c.json({ error: error.message }, 500);
    }
  })
  
app.post('/monstersmap/auto', async (c) => {
try {
    const result = await addMonsterMapAuto();
    return c.json(result, 201);
} catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
}
})
  
app.post('/single/:id', async (c) => {
const id = c.req.param('id');
try {
    const result = await addMap(id);
    return c.json(result, 201);
} catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
}
})
  
app.post('/auto', async (c) => {
try {
    const result = await addMapAuto();
    return c.json(result, 201);
} catch (error) {
    console.error('Error fetching external API or inserting data::', error.message);
    return c.json({ error: error.message }, 500);
}
})

export default app;