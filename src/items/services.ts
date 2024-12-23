import client, { apiKey } from '../services'
import { ItemSchema } from './schema';
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
}

export async function readAllItems() {
    const result = await prisma.items.findMany();
    return result;
}

function extractItems(data : any) {
    const items : any[] = []
    const item = {
        itemId: data.id,
        name: data.name,
        description: data.description,
        itemType: data.unidName,
        attack: data.attack,
        magicAttack: data.matk,
        defense: data.defense,
        weight: data.weight,
        requiredLevel: data.requiredLevel,
        price: data.price
    }
    ItemSchema.parse(item);
    items.push(item);
    return items;
}

async function insertItems(items : any) {
    await prisma.items.createMany({
        data: items.map((item: any) => ({
            item_id: item.itemId,
            name: item.name,
            description: item.description,
            item_type: item.itemType,
            attack: item.attack,
            magic_attack: item.magicAttack,
            defense: item.defense,
            weight: item.weight,
            required_level: item.requiredLevel,
            price: item.price
        })),
    });

    const insertedItems = await prisma.items.findMany({
        where: {
            item_id: {
                in: items.map((item: any) => item.itemId),
            },
        },
    });

    return insertedItems;
}

export async function addItems(id : number) {
    const data : any = await fetchRagnarokItems(id);
    const items = extractItems(data);
    const result = await insertItems(items);
    return result;
}

export async function addItemsAuto() {
    const items: any[] = [];
    const listId: any[] = [];
    const queryResult = await prisma.drops.findMany({
        distinct: ['item_id'],
        where: {
          item_id: {
            notIn: await prisma.items.findMany({
              select: { item_id: true }
            }).then(items => items.map(item => item.item_id))
          }
        },
        orderBy: {
          item_id: 'asc'
        },
        select: {
          item_id: true
        }
    });
    if (queryResult[0] === undefined) {
        throw new Error(`All requested items already written in the table`);
    }
    for (const item of queryResult) {
        listId.push(item.item_id);
    }
    const fetchPromises = listId.map((id) => fetchRagnarokItems(id));
    const fetchedData = await Promise.all(fetchPromises);
    fetchedData.forEach((data: any) => {
        const extractedItem = extractItems(data);
        items.push(...extractedItem);
    })
    const result = await insertItems(items);
    return result;
}