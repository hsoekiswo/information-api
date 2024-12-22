import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ItemIdParamsSchema } from "../items/schema";
import { LevelParamsSchema } from "../experiences/schema"
// import { calculateChanceItem, monsterBaseRecommendation, monsterJobRecommendation } from './services'
import { getChanceItemHandler, getLevelingBaseHandler, getLevelingJobHandler } from "./controller";
import { JobLevelParamsSchema } from "./schema";

export const app = new OpenAPIHono();

// app.get('/chanceitem/:id', async (c) => {
//     try {
//         const itemId = c.req.param('id');
//         const result = await calculateChanceItem(itemId);
//         return c.json(result);
//     } catch(error) {
//         console.error('Error fetching external API or inserting data::', error.message);
//         return c.json({ error: error.message }, 500);
//     }
// })

const getChanceItem = createRoute({
    method: "get",
    path: "/chanceitem/{id}",
    request: {
        params: ItemIdParamsSchema,
    },
    responses: {
        200: {
            description: "Get items ordered with higher chance drop from monsters.",
        },
    },
});

app.openapi(getChanceItem, getChanceItemHandler);

// app.get('/levelingmonster/base/:level', async (c) => {
//     try {
//         const level = c.req.param('level');
//         const result = await monsterBaseRecommendation(level);
//         return c.json(result);
//     } catch(error) {
//         console.error('Error fetching external API or inserting data::', error.message);
//         return c.json({ error: error.message}, 500);
//     }
// })

const getLevelingBase = createRoute({
    method: "get",
    path: "/leveling/base/{level}",
    request: {
        params: LevelParamsSchema,
    },
    responses: {
        200: {
            description: "Get monster recommendation for leveling ordered with higher base experience."
        },
    },
});

app.openapi(getLevelingBase, getLevelingBaseHandler);

// app.get('/levelingmonster/job/:type/:level', async (c) => {
//     try {
//         const type = c.req.param('type');
//         const level = c.req.param('level');
//         const result = await monsterJobRecommendation(type, level);
//         return c.json(result);
//     } catch(error) {
//         console.error('Error fetching external API or inserting data::', error.message);
//         return c.json({ error: error.message}, 500);
//     }
// });

const getLevelingJob = createRoute({
    method: "get",
    path: "/leveling/job/{type}/{level}",
    request: {
        params: JobLevelParamsSchema,
    },
    responses: {
        200: {
            description: "Get monster recommendation for leveling ordered with higher job experience."
        },
    },
});

app.openapi(getLevelingJob, getLevelingJobHandler);

export default app;