import { Hono } from 'hono';
import { addItems, addItemsAuto, readAllItems } from './services'
import { itemIdSchema } from './schema';

const app = new Hono();

app.get('/', async (c) => {
    try {
        const result = await readAllItems();
        return c.json(result);
    } catch (error) {
        console.error('Error fetching external API or inserting data::', error.message);
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
      console.error('Error fetching external API or inserting data::', error.message);
      return c.json({ error: error.message }, 500);
    }
})

app.post('/auto', async (c) => {
    try {
        const result = await addItemsAuto();
        return c.json(result)
    } catch(error) {
        console.error('Error fetching external API or inserting data::', error.message);
        return c.json({ error: error.message }, 500);
    }
})

export default app;