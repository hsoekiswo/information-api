import client, { apiKey } from '../services';
import { MonsterSchema } from './schema';

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
    const result = await client.query('SELECT * FROM monsters;');
    return result.rows
}

function extractMonsters(data : any) {
    const monsters : any[] = [];
    const monster = {
        monsterId: data.id,
        name: data.name,
        level: data.stats.level,
        hp: data.stats.health,
        attackMin: data.stats.attack.minimum,
        attackMax: data.stats.attack.maximum,
        defense: data.stats.defense,
        magicDefense: data.stats.magicDefense,
        baseExperience: data.stats.baseExperience,
        jobExperience: data.stats.jobExperience
    }
    try {
        MonsterSchema.parse(monster);
        monsters.push(monster);
        return monsters;
    } catch(error) {
        console.error("Invalid monster data type:", error.errors);
        return [];
    }
}

async function insertMonsters(monsters : any) {
    try {
        const colLength = 10;
        const query = `
        INSERT INTO monsters
        VALUES
        ${monsters.map((_ : any, index : any) => `($${index * colLength + 1}, $${index * colLength + 2}, $${index * colLength + 3}, $${index * colLength + 4}, $${index * colLength + 5}, $${index * colLength + 6}, $${index * colLength + 7}, $${index * colLength + 8}, $${index * colLength + 9}, $${index * colLength + 10})`).join(', ')}
        RETURNING *;
        `;
        const values: any[] = monsters.flatMap(monster => [
            monster.monsterId,
            monster.name,
            monster.level,
            monster.hp,
            monster.attackMin,
            monster.attackMax,
            monster.defense,
            monster.magicDefense,
            monster.baseExperience,
            monster.jobExperience
        ]);
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error while inserting monsters data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterData(id : number) {
    const data: any = await fetchRagnarokMonsters(id);
    const monsters = extractMonsters(data);
    const result = insertMonsters(monsters);
    return result;
}

export async function addMonsterDataInBulk(startId : number, endId : number) {
    const monsters: any[] = [];
    try {
        const listId: any[] = [];
        for (let id = startId; id <= endId; id++) {
            listId.push(id);
        }

        const fetchPromises = listId.map((id) => fetchRagnarokMonsters(id));
        const fetchedData = await Promise.all(fetchPromises);

        fetchedData.forEach((data: any) => {
            const extractedMonster = extractMonsters(data);
            if (monsters.length > 0) {
                monsters.push(...extractedMonster);
            }
        });

        if(monsters.length === 0) {
            throw new Error("No valid monsters to insert.");
        }

        const result = await insertMonsters(monsters);
        return result;
    }
    catch(error) {
        console.error('Error fetching or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}
