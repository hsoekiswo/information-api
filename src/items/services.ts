import client, { apiKey } from '../services'
import prisma from '../services';

export async function fetchRagnarokItems(id : number) {
    const response = await fetch(`https://www.divine-pride.net/api/database/Item/${id}?apiKey=${apiKey}`, {
        method: 'GET',
        headers: {
            'Accept-Language': 'en_US'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data for item`);
    }
    return await response.json();
};

export async function readItem(id: any) {
    const result = await prisma.items.findUnique({
        where: {
            item_id: id,
        },
    });
    return result;
};

export async function readAllItems() {
    const result = await prisma.items.findMany();
    return result;
};