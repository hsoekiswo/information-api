import { Hono } from 'hono';
import { calculateChanceItem, monsterBaseRecommendation, monsterJobRecommendation } from './services'

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

app.get('/levelingmonster/base/:level', async (c) => {
    try {
        const level = c.req.param('level');
        const result = await monsterBaseRecommendation(level);
        return c.json(result);
    } catch(error) {
        console.error('Error fetching external API or inserting data::', error.message);
        return c.json({ error: error.message}, 500);
    }
})

app.get('/levelingmonster/job/:type/:level', async (c) => {
    try {
        const type = c.req.param('type');
        const level = c.req.param('level');
        const result = await monsterJobRecommendation(type, level);
        return c.json(result);
    } catch(error) {
        console.error('Error fetching external API or inserting data::', error.message);
        return c.json({ error: error.message}, 500);
    }
})

export default app;