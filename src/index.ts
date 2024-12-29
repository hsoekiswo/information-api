import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from 'zod';
import { app as appMonster } from './monsters/routes';
import { app as appDrop } from './drops/routes';
import { app as appItem } from './items/routes';
import { app as appData } from './data/routes';
import { app as appMap } from './maps/routes';
import { app as appExperiences } from './experiences/routes';
import { app as appSummaries } from './summaries/routes';
import { handleError } from './errorHandler';
import fs from "fs";
import path from "path";

const app = new OpenAPIHono();
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Ragnarok Recommendation API",
    description: "API documentation for Ragnarok Recommendation. Ragnarok Recommendation is RESTful API platform offering structured access to Ragnarok world. Explore recommendation, items, monsters, maps in one place."
  },
  tags: [
    { name: 'Recommendations', description: 'Endpoints for user to get recommendation of item drops and leveling' },
    { name: 'Monsters', description: 'Endpoints related to monsters' },
    { name: 'Drops & Items', description: 'Endpoint related to drops chance and items' },
    { name: 'Maps', description: 'Endpoint related to maps' },
    { name: 'Other', description: 'Any other endpoints' },
  ]
})

app.onError((error, c) => {
  const { status, body } = handleError(error, c);
  return c.json(body, status);
});

const indexRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Main"],
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

async function indexRouteHandler(c: any) {
  const filePath = path.resolve(__dirname, "../public/index.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");

  return c.html(htmlContent);
}

app.openapi(indexRoute, indexRouteHandler);

app.get('/docs', swaggerUI({ url: "/doc" }));

app.route('/monsters', appMonster);
app.route('/drops', appDrop);
app.route('/items', appItem);
app.route('/data', appData);
app.route('/maps', appMap);
app.route('/experiences', appExperiences);
app.route('/summaries', appSummaries);

if (import.meta.main) {
  Bun.serve({
    fetch: app.fetch,
    port: 3001,
    idleTimeout: 60,
  })
}

export default app;
