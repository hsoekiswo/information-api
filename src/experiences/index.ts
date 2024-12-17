import { Hono } from 'hono';
import { addExperienceAuto } from './services'

const app = new Hono();

app.post('/addexperience/auto', async(c) => {
    try {
        // const result = await fetchRagnarokExperience();
        const result = await addExperienceAuto();
        return c.json({ result });
    } catch (error) {
        console.error('Error fetching external API or inserting data::', error.message);
        return c.json({ error: error.message }, 500);
    }
})

export default app;
  