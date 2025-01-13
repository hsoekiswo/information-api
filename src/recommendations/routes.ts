import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ItemIdParamsSchema } from "../items/schema";
import { LevelParamsSchema } from "../experiences/schema";
import { CharacterIdParams } from "../characters/schema";
import { getChanceItemHandler, getLevelingBaseHandler, getLevelingJobHandler } from "./controller";
import { ChanceItemSchemaArray, JobLevelParamsSchema } from "./schema";
import { MonstersSchema } from "../monsters/schema";
import { loginMiddleware } from "../auth/service";

export const app = new OpenAPIHono();

app.use('*', loginMiddleware);

const getChanceItem = createRoute({
    method: "get",
    path: "/chanceitem/{id}",
    tags: ["Recommendations"],
    request: {
        params: ItemIdParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ChanceItemSchemaArray,
                },
            },
            description: "Get items ordered with higher chance drop from monsters.",
        },
    },
});

app.openapi(getChanceItem, getChanceItemHandler);

const getLevelingBase = createRoute({
    method: "get",
    path: "/leveling/base/{id}",
    tags: ["Recommendations"],
    request: {
        params: CharacterIdParams,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MonstersSchema,
                },
            },
            description: "Get monster recommendation for leveling ordered with higher base experience."
        },
    },
});

app.openapi(getLevelingBase, getLevelingBaseHandler);

const getLevelingJob = createRoute({
    method: "get",
    path: "/leveling/job/{id}",
    tags: ["Recommendations"],
    request: {
        params: CharacterIdParams,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: MonstersSchema,
                },
            },
            description: "Get monster recommendation for leveling ordered with higher job experience."
        },
    },
});

app.openapi(getLevelingJob, getLevelingJobHandler);