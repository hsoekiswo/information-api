import prisma from '../services';

export async function readDrop(id: any) {
    const result = await prisma.drops.findMany({
        where: {
            monster_id: id,
        },
    });
    return result;
};

export async function readAllDrops() {
    const result = await prisma.drops.findMany();
    return result;
};