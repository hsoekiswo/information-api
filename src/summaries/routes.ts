import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ItemIdParamsSchema } from "../items/schema";
import { LevelParamsSchema } from "../experiences/schema"
import { getChanceItemHandler, getLevelingBaseHandler, getLevelingJobHandler } from "./controller";
import { JobLevelParamsSchema } from "./schema";

export const app = new OpenAPIHono();

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