import client, { apiKey } from '../services'

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

export async function addItems(id : any) {
    try {
        const data : any = await fetchRagnarokItems(id);
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
        ];

        const query = 'INSERT INTO items VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        const values = item;
        const result = await client.query(query, values);

        return result.rows[0];
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addItemsAuto() {
    const items : any[] = [];
    try {
        const result = client.query(`
        SELECT
            DISTINCT drops.item_id
        FROM
            drops
        LEFT JOIN
            items
        ON drops.item_id = items.item_id
        WHERE
            items.item_id is null
        ORDER BY 1;
        `);
        const listId = (await result).rows
        if (listId === null) {
            throw new Error(`All item already written in the table`);
        }
        for (const item_ of listId) {
            const item = await addItems(item_.item_id);
            items.push(item);
        }
        return items;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}
