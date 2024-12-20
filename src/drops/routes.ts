import { Hono } from 'hono';
import { z } from 'zod';
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { readAllDrops, addMonsterDrops, addMonsterDropsAuto } from './services'
import { MonsterIdParamsSchema, MonsterIdSchema } from '../monsters/schema';
import { DropsSchema } from './schema';
import { getDropsHandler, postDropHandler, postDropsHandler } from './controller';

// const app = new Hono();
export const app = new OpenAPIHono();

// app.get('/', async (c) => {
//     const result = await readAllDrops();
//     return c.json(result);
// });

const getDrops = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DropsSchema,
        },
      },
      description: "Get all drops data from database"
    },
  },
});

app.openapi(getDrops, getDropsHandler);

// app.post('/single/:id', async (c) => {
//   const id = c.req.param('id');
//   const parseId = MonsterIdSchema.parse(Number(id));
//   const result = await addMonsterDrops(parseId);
//   return c.json(result, 201);
// });

const postDrop = createRoute({
  method: "post",
  path: "/single/{id}",
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

// app.post('/auto', async (c) => {
//   const result = await addMonsterDropsAuto();
//   return c.json(result, 201);
// });

const postDrops = createRoute({
  method: "post",
  path: "/auto",
  responses: {
    201: {
      content: {
        'application/json': {
          schema: DropsSchema,
        },
      },
      description: "Post multiple monster-drop relations by passing remaining Monster IDs in DB which not have relation yet."
    },
  },
});

app.openapi(postDrops, postDropsHandler);

export default app;