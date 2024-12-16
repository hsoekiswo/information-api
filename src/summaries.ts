import { Hono } from 'hono';
import { calculateChanceItem } from './services'

const app = new Hono();

app.get('/chanceitem/:id', async (c) => {
    try {
        const itemId = c.req.param('id');
        const result = await calculateChanceItem(itemId);
        return c.json(result);
    } catch(error) {
        console.error('Error fetching external API or inserting data::', error.message);
        return c.json({ error: error.message }, 500);
    }
})

export default app;