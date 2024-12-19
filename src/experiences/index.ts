import { Hono } from 'hono';
import { addExperienceAuto } from './services'

const app = new Hono();

app.post('/auto', async(c) => {
    const result = await addExperienceAuto();
    return c.json({ result });
})

export default app;
  