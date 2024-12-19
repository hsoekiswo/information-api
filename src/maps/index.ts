import { Hono } from 'hono';
import { addMonsterMap, addMonsterMapAuto, addMap, addMapAuto } from './services'
import { monsterIdSchema } from '../monsters/schema';
import { MapIdSchema } from './schema';

const app = new Hono();

app.post('/monstersmap/single/:id', async (c) => {
    const id = c.req.param('id');
    const paramId = monsterIdSchema.parse(Number(id));
    const result = await addMonsterMap(paramId);
    return c.json(result);
});
  
app.post('/monstersmap/auto', async (c) => {
    const result = await addMonsterMapAuto();
    return c.json(result, 201);
})
  
app.post('/single/:id', async (c) => {
    const id = c.req.param('id');
    const parseId = MapIdSchema.parse(Number(id));
    const result = await addMap(parseId);
    return c.json(result, 201);
});
  
app.post('/auto', async (c) => {
    const result = await addMapAuto();
    return c.json(result, 201);
});

export default app;