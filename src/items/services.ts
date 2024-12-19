import client, { apiKey } from '../services'
import { ItemSchema } from './schema';

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
    try {
        const result = await client.query('SELECT * FROM items;');
        return result.rows
    }
    catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
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
    try {
        ItemSchema.parse(item);
        items.push(item);
        return items;
    } catch(error) {
        console.error("Invalid item data type:", error.errors);
    }
}

async function insertItems(items : any) {
    try {
        const colLength = 10;
        const query = `
        INSERT INTO items
        VALUES
        ${items.map((_ : any, index : any) => `($${index * colLength + 1}, $${index * colLength + 2}, $${index * colLength + 3}, $${index * colLength + 4}, $${index * colLength + 5}, $${index * colLength + 6}, $${index * colLength + 7}, $${index * colLength + 8}, $${index * colLength + 9}, $${index * colLength + 10})`).join(', ')}
        RETURNING *;
        `
        const values: any[] = items.flatMap(item => [
            item.itemId,
            item.name,
            item.description,
            item.itemType,
            item.attack,
            item.magicAttack,
            item.defense,
            item.weight,
            item.requiredLevel,
            item.price
        ]);
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error while inserting items data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addItems(id : number) {
    try {
        const data : any = await fetchRagnarokItems(id);
        const items = extractItems(data);
        const result = await insertItems(items);
        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addItemsAuto() {
    const items : any[] = [];
    try {
        const listId : any[] = [];
        const queryResult = await client.query(`
        SELECT
            DISTINCT drops.item_id
        FROM
            drops
        LEFT JOIN
            items
        ON drops.item_id = items.item_id
        WHERE
            items.item_id is null
        ORDER BY 1
        `);
        if (queryResult.rows[0] === undefined) {
            throw new Error(`All requested items already written in the table`);
        }
        for (const item of queryResult.rows) {
            listId.push(item.item_id);
        }
        const fetchPromises = listId.map((id) => fetchRagnarokItems(String(id)));
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((data: any) => {
            const extractedItem = extractItems(data);
            items.push(...extractedItem);
        })
        const result = await insertItems(items);
        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}
