import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { loginMiddleware } from "../auth/service";
import { CharacterFormSchema, CharacterIdParams } from "./schema";
import { postCharacterHandler, getCharacterHandler, getCharactersHandler } from "./controller";
import { object } from "zod";

export const app = new OpenAPIHono();

app.use('*', loginMiddleware);

const postCharacter = createRoute({
    method: "post",
    path: "/",
    tags: ["Characters"],
    request: {
        body: {
            content: {
                'application/x-www-form-urlencoded': {
                    schema: CharacterFormSchema,
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: CharacterFormSchema,
                },
            },
            description: "Post single character to the database"
        },
    },
});

app.openapi(postCharacter, postCharacterHandler);

const getCharacter = createRoute({
    method: "get",
    path: "/single/{id}",
    tags: ["Characters"],
    request: {
        params: CharacterIdParams,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: CharacterFormSchema,
                },
            },
            description: "Get a single character from database"
        },
    },
});

app.openapi(getCharacter, getCharacterHandler);

const getCharacters = createRoute({
    method: "get",
    path: "/",
    tags: ["Characters"],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: CharacterFormSchema,
                },
            },
            description: "Get a single character from database"
        },
    },
});

app.openapi(getCharacters, getCharactersHandler);