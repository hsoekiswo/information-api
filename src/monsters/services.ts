import client, { apiKey } from '../services';

export async function fetchRagnarokMonsters(id : any) {
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

function extractMonster(data : any) {
    const monsters : any[] = [];
    const monster = [
        data.id,
        data.name,
        data.stats.level,
        data.stats.health,
        data.stats.attack.minimum,
        data.stats.attack.maximum,
        data.stats.defense,
        data.stats.magicDefense,
        data.stats.baseExperience,
        data.stats.jobExperience
    ]
    monsters.push(monster);
    return monsters;
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
        const values: any[] = monsters.flat(2);
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error while inserting monsters data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterData(id : string) {
    const data : any = await fetchRagnarokMonsters(id);
    const monsters = extractMonster(data);
    const result = insertMonsters(monsters);
    return result;
}

export async function addMonsterDataInBulk(startId : number, endId : number) {
    const monsters: any[] = [];
    try {
        const listId : any[] = [];
        for (let id = startId; id <= endId; id++) {
            listId.push(id);
        }
        const fetchPromises = listId.map((id) => fetchRagnarokMonsters(String(id)));
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((data: any) => {
            const monster = extractMonster(data);
            monsters.push(monster);
        })
        const result = await insertMonsters(monsters);
        return result;
    }
    catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}
