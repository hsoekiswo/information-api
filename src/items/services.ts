import client, { apiKey } from '../services'

export async function fetchRagnarokItems(id : string) {
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
    const items : any [] = []
    const item = [
        data.id,
        data.name,
        data.description,
        data.unidName,
        data.attack,
        data.matk,
        data.defense,
        data.weight,
        data.requiredLevel,
        data.price
    ]
    items.push(item);
    return items;
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
        const values: any[] = items.flat(2);
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error while inserting items data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addItems(id : any) {
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
        if (queryResult.rows === null) {
            throw new Error(`All item already written in the table`);
        }
        for (const item of queryResult.rows) {
            listId.push(item.item_id);
        }
        const fetchPromises = listId.map((id) => fetchRagnarokItems(String(id)));
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((data: any) => {
            const item = extractItems(data);
            items.push(item);
        })
        const result = await insertItems(items);
        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}
