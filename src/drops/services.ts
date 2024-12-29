import prisma from '../services';

export async function readAllDrops() {
    const result = await prisma.drops.findMany();
    return result;
}