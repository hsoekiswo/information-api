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