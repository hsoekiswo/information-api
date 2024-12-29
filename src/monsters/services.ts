import client, { apiKey } from '../services';
import { MonsterSchema } from './schema';
import prisma from '../services';

export async function fetchRagnarokMonsters(id: number) {
    const response = await fetch(`https://www.divine-pride.net/api/database/Monster/${id}?apiKey=${apiKey}`, {
        method: 'GET',
        headers: {
            'Accept-Language': 'en_US'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data for monster`);
    }
    return await response.json();
}

export async function readAllMonsters() {
    const result = await prisma.monsters.findMany();
    return result
}
