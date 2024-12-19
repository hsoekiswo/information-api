import { Hono } from 'hono';
import { addExperienceAuto } from './services'

const app = new Hono();

app.post('/auto', async(c) => {
    try {
        const result = await addExperienceAuto();
        return c.json({ result });
    } catch (error) {
        console.error('Failed to populate the experiences table:', error.message);
        return c.json({ error: 'Failed to populate the experiences table', details: error.message }, 500);
    }
})

export default app;
  