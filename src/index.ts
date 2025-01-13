import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { app as appAuth } from './auth/routes';
import { app as appCharacter } from './characters/routes';
import { app as appMonster } from './monsters/routes';
import { app as appDrop } from './drops/routes';
import { app as appItem } from './items/routes';
import { app as appData } from './data/routes';
import { app as appMap } from './maps/routes';
import { app as appExperiences } from './experiences/routes';
import { app as appSummaries } from './recommendations/routes';
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
    { name: 'Main', description: 'Main endpoint' },
    { name: 'Data', description: 'Endpoints for complete info of monsters'},
    { name: 'Characters', description: 'Endpoints for character to create, read, update and delete ragnarok character' },
    { name: 'Recommendations', description: 'Endpoints for user to get recommendation of item drops and leveling' },
    { name: 'Monsters', description: 'Endpoints related to monsters' },
    { name: 'Drops & Items', description: 'Endpoint related to drops chance and items' },
    { name: 'Maps', description: 'Endpoint related to maps' },
    { name: 'Other', description: 'Any other endpoints' },
  ]
})
app.get('/docs', swaggerUI({ url: "/doc" }));

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
      content: {},
      description: "Provide welcome page to the users",
    },
  },
});

async function indexRouteHandler(c: any) {
  const filePath = path.resolve(__dirname, "../public/index.html");
  const htmlContent = await fs.promises.readFile(filePath, "utf-8");
  
  return c.html(htmlContent);
}

app.openapi(indexRoute, indexRouteHandler);

app.route('/', appAuth);
app.route('/characters', appCharacter);
app.route('/data', appData);
app.route('/monsters', appMonster);
app.route('/drops', appDrop);
app.route('/items', appItem);
app.route('/maps', appMap);
app.route('/experiences', appExperiences);
app.route('/recommendations', appSummaries);

// Set up using Bun Serve
const hostname = "0.0.0.0"
const port = process.env.APP_PORT || 4000;

if (import.meta.main) {
  Bun.serve({
    fetch: app.fetch,
    hostname: hostname,
    port: port,
    idleTimeout: 60,
  });

  console.log(`Server is listening on ${hostname}:${port}`);
}