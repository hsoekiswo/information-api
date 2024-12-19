import { Hono } from 'hono';
import { z } from 'zod';
import { addItems, addItemsAuto, readAllItems } from './services'
import { itemIdSchema } from './schema';

const app = new Hono();

app.get('/', async (c) => {
    const result = await readAllItems();
    return c.json(result);
});

app.post('/single/:id', async (c) => {
    const id = c.req.param('id');
    const parseId = itemIdSchema.parse(Number(id));
    const result = await addItems(parseId);
    return c.json(result);
});

app.post('/auto', async (c) => {
    const result = await addItemsAuto();
    return c.json(result);
});

export default app;