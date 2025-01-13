import { parse } from 'querystring';
import { addCharacter } from './service';

export async function postCharacterHandler(c: any) {
    const bodyText = await c.req.text();
    const character = parse(bodyText);
    const result = await addCharacter(character);
    return c.json({
        status: 'success',
        message: `Successfully write character ${character.name} into database`,
        data: result
    }, 201);
}