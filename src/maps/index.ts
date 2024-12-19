import { Hono } from 'hono';
import { addMonsterMap, addMonsterMapAuto, addMap, addMapAuto } from './services'
import { monsterIdSchema } from '../monsters/schema';
import { MapIdSchema } from './schema';

const app = new Hono();

app.post('/monstersmap/single/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const paramId = monsterIdSchema.parse(Number(id));
        const result = await addMonsterMap(paramId);
        return c.json(result)
    } catch (error) {
        console.error('Invalid monster ID:', error.message);
        return c.json({ error: 'Invalid monster ID', details: error.message }, 500);
    }
  })
  
app.post('/monstersmap/auto', async (c) => {
try {
    const result = await addMonsterMapAuto();
    return c.json(result, 201);
} catch (error) {
    console.error('Failed to populate the monstersmap table. Unable to automatically retrieve data from the current list of monster IDs:', error.message);
    return c.json({ error: 'Failed to populate the monstersmap table. Unable to automatically retrieve data from the current list of monster IDs', details: error.message }, 500);
}
})
  
app.post('/single/:id', async (c) => {
const id = c.req.param('id');
try {
    const parseId = MapIdSchema.parse(Number(id));
    const result = await addMap(parseId);
    return c.json(result, 201);
} catch (error) {
    console.error('Invalid map ID:', error.message);
    return c.json({ error: 'Invalid map ID', details: error.message }, 500);
}
})
  
app.post('/auto', async (c) => {
try {
    const result = await addMapAuto();
    return c.json(result, 201);
} catch (error) {
    console.error('Failed to populate the maps table. Unable to automatically retrieve data from the current list of map IDs:', error.message);
    return c.json({ error: 'Failed to populate the maps table. Unable to automatically retrieve data from the current list of map IDs', details: error.message }, 500);
}
})

export default app;