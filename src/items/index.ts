import { Hono } from 'hono';
import { z } from 'zod';
import { addItems, addItemsAuto, readAllItems } from './services'
import { itemIdSchema } from './schema';

const app = new Hono();

app.get('/', async (c) => {
    try {
        const result = await readAllItems();
        return c.json(result);
    } catch (error) {
        return c.json({ error: error.message }, 500);
    }
})

app.post('/single/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const parseId = itemIdSchema.parse(Number(id));
        const result = await addItems(parseId);
      return c.json(result)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({
              error: "Validation Error",
              details: error.errors,
            }, 400)
          }
        return c.json({ error: 'Error writing data to items table', details: error.message }, 500);
    }
})

app.post('/auto', async (c) => {
    try {
        const result = await addItemsAuto();
        return c.json(result)
    } catch(error) {
        console.error('Failed to populate the items table. Unable to automatically retrieve data from the current list of item IDs:', error.message);
        return c.json({ error: 'Failed to populate the items table. Unable to automatically retrieve data from the current list of item IDs', details: error.message }, 500);
    }
})

export default app;