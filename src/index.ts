import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from 'zod';
// import monsters from './monsters/routes';
import { app as appMonster } from './monsters/routes';
// import drops from './drops/routes';
import { app as appDrop } from './drops/routes';
// import items from './items/routes';
import { app as appItem } from './items/routes';
// import maps from './maps/routes';
import { app as appMap } from './maps/routes';
// import experiences from './experiences/routes';
import { app as appExperiences } from './experiences/routes';
// import summaries from './summaries/routes';
import { app as appSummaries } from './summaries/routes';
import { handleError } from './errorHandler';

const app = new OpenAPIHono();
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Ragnarok API",
  }
})

app.onError((error, c) => {
  const { status, body } = handleError(error, c);
  return c.json(body, status);
});

const indexRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        'text/plain': {
          schema: z.string(),
        }
      },
      description: "Say hello to the users",
    },
  },
});

app.openapi(indexRoute, (c) => {
  return c.text('Hello this is mini Ragnarok monsters database api. This API can provide items and levelling recommendation!', 200)
});

app.get('/ui', swaggerUI({ url: "/doc" }));

app.route('/monsters', appMonster);
// app.route('/monsters2', monsters);
// app.route('/drops', drops);
app.route('/drops', appDrop);
// app.route('/items', items);
app.route('/items', appItem);
// app.route('/maps', maps);
app.route('/maps', appMap);
// app.route('/experiences', experiences);
app.route('/experiences', appExperiences);
// app.route('/summaries', summaries);
app.route('/summaries', appSummaries);

export default app;
