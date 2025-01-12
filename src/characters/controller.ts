import { parse } from 'querystring';

export async function postCharacterHandler(c: any) {
    const bodyText = await c.req.text();
    const character = parse(bodyText);
    return c.json(character, 201);
}