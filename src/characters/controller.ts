import { parse } from 'querystring';
import { addCharacter, getCharacter, getAllCharacter, updateCharacter, deleteCharacter } from './service';
import { CharacterIdSchema } from './schema';

export async function postCharacterHandler(c: any) {
    const bodyText = await c.req.text();
    const character = parse(bodyText);
    const result = await addCharacter(character);
    return c.json({
        status: 'success',
        message: `Successfully write character ${character.name} into database`,
        data: result
    }, 201);
};

export async function getCharacterHandler(c: any) {
    const id = await c.req.param('id');
    const parseId = CharacterIdSchema.parse(Number(id));
    const result = await getCharacter(parseId);
    return c.json({
        status: 'success',
        message: `Successfully get character ${id} from the database`,
        data: result
    }, 200);
};

export async function getCharactersHandler(c: any) {
    const result = await getAllCharacter();
    return c.json({
        status: 'success',
        message: 'Successfully get all characters from the database',
        data: result
    }, 200);
};

export async function patchCharacterHandler(c: any) {
    const id = c.req.param('id');
    const parseId = CharacterIdSchema.parse(Number(id));

    const bodyText = await c.req.text();
    const data = parse(bodyText);

    const result = await updateCharacter(parseId, data);
    return c.json({
        status: 'success',
        message: `Successfully update character with ID: ${id} into database`,
        data: result
    }, 200)
};

export async function deleteCharacterHandler(c: any) {
    const id = c.req.param('id');
    const parseId = CharacterIdSchema.parse(Number(id));

    const result = await deleteCharacter(parseId);
    return c.json({
        status: 'success',
        message: `Successfully update character with ID: ${id} into database`,
        data: result
    }, 200)
}