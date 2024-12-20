// import { Hono } from 'hono';
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
// import { addMonsterMap, addMonsterMapAuto, addMap, addMapAuto } from './services'
import { MonsterIdParamsSchema, MonsterIdSchema } from '../monsters/schema';
import { MapIdSchema, MapIdParamSchema, MapsSchema, MonsterMapSchema, MonsterMapsSchema } from './schema';
import { postMonsterMapHandler, postMonsterMapsHandler, postMapHandler, postMapsHandler } from './controller';

// const app = new Hono();
export const app = new OpenAPIHono();

// app.post('/monstermaps/single/:id', async (c) => {
//     const id = c.req.param('id');
//     const paramId = MonsterIdSchema.parse(Number(id));
//     const result = await addMonsterMap(paramId);
//     return c.json(result);
// });

const postMonsterMap = createRoute({
    method: "post",
    path: "/monstermaps/single/{id}",
    request: {
        params: MonsterIdParamsSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MonsterMapsSchema,
                },
            },
            description: "Post single monster-map relation by passing Monster ID through Divine Pride API."
        },
    },
});

app.openapi(postMonsterMap, postMonsterMapHandler);
  
// app.post('/monstermaps/auto', async (c) => {
//     const result = await addMonsterMapAuto();
//     return c.json(result, 201);
// });

const postMonsterMaps = createRoute({
    method: "post",
    path: "/monstermaps/auto",
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MonsterMapsSchema
                },
            },
            description: "Post multiple monster-map relations by passing remaining Monster IDs in DB which not have relation yet through Divine Pride API."
        },
    },
});

app.openapi(postMonsterMaps, postMonsterMapsHandler);
  
// app.post('/single/:id', async (c) => {
//     const id = c.req.param('id');
//     const parseId = MapIdSchema.parse(Number(id));
//     const result = await addMap(parseId);
//     return c.json(result, 201);
// });

const postMap = createRoute({
    method: "post",
    path: "/single/{id}",
    request: {
        params: MapIdParamSchema,
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Post single map by passing Map ID through Divine Pride API."
        },
    },
});

app.openapi(postMap, postMapHandler);
  
// app.post('/auto', async (c) => {
//     const result = await addMapAuto();
//     return c.json(result, 201);
// });

const postMaps = createRoute({
    method: "post",
    path: "/auto",
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: MapsSchema,
                },
            },
            description: "Post multiple maps by passing remaining Map IDs in DB which not have relation yet through Divine Pride API."
        },
    },
});

app.openapi(postMaps, postMapsHandler);

export default app;