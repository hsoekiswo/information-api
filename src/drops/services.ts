import client from '../services'
import { fetchRagnarokMonsters } from '../monsters/services'

export async function readAllDrops() {
    try {
        const result = await client.query('SELECT * FROM drops;');
        return result.rows
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterDrops(id : any) {
    const drops: any[] = [];
    try {
        const stringId = String(id)
        const data : any = await fetchRagnarokMonsters(stringId);
        const range = data.drops.length;
        for (let i = 0; i <range; i++) {
            const drop = [
                data.id,
                data.drops[i].itemId,
                data.drops[i].chance/100
            ]
            drops.push(drop);
        }

        const colLength = 3;
        const query = `
        INSERT INTO drops (monster_id, item_id, chance)
        VALUES
        ${drops.map((_, index) => `($${index * colLength + 1}, $${index * colLength + 2}, $${index * colLength + 3})`).join(', ')}
        RETURNING *;
        `;
        const values: any[] = drops.flat();
        const result = await client.query(query, values);

        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterDropsAuto() {
    const drops: any[] = [];
    try {
        const result = await client.query('SELECT DISTINCT monsters.monster_id as monster_id FROM monsters LEFT JOIN drops ON monsters.monster_id = drops.monster_id WHERE drops.monster_id is null'); 
        const listId = result.rows
        if (listId === null) {
            throw new Error(`All monster map already written in the table`);
        }
        for (const item of listId) {
            const drop = await addMonsterDrops(item.monster_id);
            drops.push(drop);
        }
        return drops;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}