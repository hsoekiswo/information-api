import client from '../services'
import { fetchRagnarokMonsters } from '../monsters/services'
import { DropSchemaArray } from './schema';

export async function readAllDrops() {
    try {
        const result = await client.query('SELECT * FROM drops;');
        return result.rows
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

function extractDrops(data : any) {
    const drops: any[] = [];
    const range = data.drops.length;
    for (let i = 0; i <range; i++) {
        const drop = {
            dropId: data.id,
            itemId: data.drops[i].itemId,
            chance: data.drops[i].chance/100
        }
        drops.push(drop);
    }
    try {
        DropSchemaArray.parse(drops);
        return drops;
    } catch(error) {
        console.error("Invalid drop data type:", error.errors);
    }
}

async function insertDrops(drops : any) {
    try {    
        const colLength = 3;
        const query = `
        INSERT INTO drops (monster_id, item_id, chance)
        VALUES
        ${drops.map((_ : any, index : any) => `($${index * colLength + 1}, $${index * colLength + 2}, $${index * colLength + 3})`).join(', ')}
        RETURNING *;
        `;
        const values: any[] = drops.flatMap(drop => [
            drop.dropId,
            drop.itemId,
            drop.chance
        ]);
        const result = await client.query(query, values);
        return result.rows
    } catch(error) {
        console.error('Error while inserting drops data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterDrops(id : any) {
    try {
        const stringId = String(id)
        const data: any = await fetchRagnarokMonsters(stringId);
        const drops = extractDrops(data);
        const result = await insertDrops(drops);
        return result;
    } catch(error) {
        console.error('Error fetching external API', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterDropsAuto() {
    const drops: any[] = [];
    try {
        const listId : any[] = [];
        const queryResult = await client.query('SELECT DISTINCT monsters.monster_id as monster_id FROM monsters LEFT JOIN drops ON monsters.monster_id = drops.monster_id WHERE drops.monster_id is null'); 
        if (queryResult.rows[0] === undefined) {
            throw new Error(`All monster map already written in the table`);
        }
        for (const item of queryResult.rows) {
            listId.push(item.monster_id);
        }
        const fetchPromises = listId.map((id) => fetchRagnarokMonsters(String(id)));
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((data : any) => {
            const extractedDrop = extractDrops(data);
            drops.push(...extractedDrop);
        })
        const result = await insertDrops(drops);
        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}