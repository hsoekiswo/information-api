import { apiKey } from '../services';
import prisma from '../services';

export async function fetchRagnarokMaps(id: string) {
    const response = await fetch(`https://www.divine-pride.net/api/database/Map/${id}?apiKey=${apiKey}`, {
        method: 'GET',
        headers: {
            'Accept-Language': 'en_US'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data for map`);
    }
    return await response.json();
};

export async function readMonsterMap(id: any) {
    const result = await prisma.monster_maps.findMany({
        where: {
            monster_id: id,
        },
    });
    return result;
};

export async function readAllMonsterMaps() {
    const result = await prisma.monster_maps.findMany();
    return result;
}