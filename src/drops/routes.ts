import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { getDropHandler, getAllDropsHandler } from './controller';
import { DropSchema, DropsSchema } from './schema';
import { MonsterIdParamsSchema } from "../monsters/schema";

export const app = new OpenAPIHono();

const getDrop = createRoute({
  method: "get",
  path: "/single/{id}",
  tags: ["Drops & Items"],
  request: {
    params: MonsterIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DropSchema,
        },
      },
      description: "Get drops of single Monster ID from database."
    },
  },
});

app.openapi(getDrop, getDropHandler);

const getAllDrops = createRoute({
  method: "get",
  path: "/",
  tags: ["Drops & Items"],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DropsSchema,
        },
      },
      description: "Get all drops data from database."
    },
  },
});

app.openapi(getAllDrops, getAllDropsHandler);