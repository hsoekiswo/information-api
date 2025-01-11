import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { LoginSchema } from "./schema";
import { loginHandler } from "./controller";

export const app = new OpenAPIHono();

const login = createRoute({
    method: "post",
    path: "login",
    tags: ["Main"],
    requestBody: {
        content: {
            'application/json': {
                schema: LoginSchema,
            },
        },
    },
    responses: {
        201: {
            description: "Authentication using credentials."
        },
    },
});

app.openapi(login, loginHandler);