import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { loginMiddleware } from "../auth/service";
import { CharacterFormSchema, CharacterIdParams } from "./schema";
import { postCharacterHandler, getCharacterHandler, getCharactersHandler, patchCharacterHandler, deleteCharacterHandler } from "./controller";

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

const patchCharacter = createRoute({
    method: "patch",
    path: "/{id}",
    tags: ["Characters"],
    request: {
        params: CharacterIdParams,
        body: {
            content: {
                'application/x-www-form-urlencoded': {
                    schema: CharacterFormSchema,
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: CharacterFormSchema,
                },
            },
            description: "Update single character of selected ID",
        },
    },
});

app.openapi(patchCharacter, patchCharacterHandler);

const deleteCharacter = createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Characters"],
    request: {
        params: CharacterIdParams,
    },
    responses: {
        202: {
            content: {
                'application/json': {
                    schema: CharacterFormSchema
                },
            },
            description: "Delete single character of selected ID",
        },
    },
});

app.openapi(deleteCharacter, deleteCharacterHandler);