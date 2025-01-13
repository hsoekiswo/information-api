import prisma from '../services';

export async function addCharacter(data: any) {
    await prisma.characters.create({
        data: {
            name: data.name,
            baseLevel: Number(data.baseLevel),
            jobLevel: Number(data.jobLevel),
        },
    });

    const fetchedCharacter = prisma.characters.findUnique({
        where: {
            name: data.name,
        },
    });

    return fetchedCharacter;
};

export async function getCharacter(id: any) {
    const result = prisma.characters.findUnique({
        where: {
            character_id: id,
        },
    });

    return result;
};

export async function getAllCharacter() {
    const result = prisma.characters.findMany();

    return result;
};

export async function updateCharacter(id: any, data: any) {
    await prisma.characters.update({
        where: {
            character_id: id,
        },
        data: {
            name: data.name,
            baseLevel: Number(data.baseLevel),
            jobLevel: Number(data.jobLevel),
        },
    });

    const result = await prisma.characters.findUnique({
        where: {
            character_id: id,
        },
    });

    return result;
};

export async function deleteCharacter(id: any) {
    await prisma.characters.delete({
        where: {
            character_id: id,
        },
    });

    const result = await prisma.characters.findUnique({
        where: {
            character_id: id,
        },
    });

    return result;
}