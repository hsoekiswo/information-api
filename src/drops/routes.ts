import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { DropsSchema } from './schema';

export const app = new OpenAPIHono();

const getDrops = createRoute({
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