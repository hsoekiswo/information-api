import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MonsterIdParamsSchema } from '../monsters/schema';
import { DropsSchema } from './schema';
import { getDropsHandler, postDropHandler, postDropsHandler } from './controller';

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

app.openapi(getDrops, getDropsHandler);

const postDrop = createRoute({
  method: "post",
  path: "/single/{id}",
  tags: ["Drops & Items"],
  request: {
    params: MonsterIdParamsSchema,
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: DropsSchema,
        },
      },
      description: "Post single monster-drop relation by passing Monster ID through Divine Pride API.",
    },
  },
});

app.openapi(postDrop, postDropHandler);

const postDrops = createRoute({
  method: "post",
  path: "/auto",
  tags: ["Drops & Items"],
  responses: {
    201: {
      content: {
        'application/json': {
          schema: DropsSchema,
        },
      },
      description: "Post multiple monster-drop relations by passing remaining Monster IDs in DB which not have relation yet through Divine Pride API."
    },
  },
});

app.openapi(postDrops, postDropsHandler);