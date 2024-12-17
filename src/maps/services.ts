import client, { apiKey } from '../services'
import { fetchRagnarokMonsters  } from '../monsters/services';

function extractMonstersMap(data : any) {
    const monstersMap : any[] = [];
    const range = data.spawn.length;
        for (let i = 0; i <range; i++) {
            const monsterMap = [
                data.id,
                data.spawn[i].mapname
            ]
            monstersMap.push(monsterMap);
        }
    return monstersMap;
}

async function insertMonstersMap(id : any, monstersMap : any) {
    const colLength = 2;
        if (monstersMap.length === 0) {
            throw new Error(`Cannot insert monster map with monster ID ${id}: No data to insert`);
        }
    const query = `
    INSERT INTO monster_map (monster_id, map_id)
    VALUES
    ${monstersMap.map((_ : any, index : any) => `($${index * colLength + 1}, $${index * colLength + 2})`).join(', ')}
    RETURNING *;
    `;
    const values: any[] = monstersMap.flat();
    const result = await client.query(query, values);

    return result.rows;
}

export async function addMonsterMap(id: any) {
    try {
        const stringId = String(id)
        const data : any = await fetchRagnarokMonsters(stringId);
        const monstersMap = extractMonstersMap(data);
        const result = await insertMonstersMap(stringId, monstersMap)

        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterMapAuto() {
    const monstersMaps: any[] = [];
    try {
        const listId: any[] = [];
        const queryResult = await client.query('SELECT DISTINCT monsters.monster_id as monster_id FROM monsters LEFT JOIN monster_map ON monsters.monster_id = monster_map.monster_id WHERE monster_map.monster_id is null');
        if (queryResult.rows === null) {
            throw new Error(`All monster map already written in the table`);
        }
        for (const item of queryResult.rows) {
            listId.push(item.monster_id);
        }
        const fetchPromises = listId.map((id) => fetchRagnarokMonsters(String(id)));
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((data: any) => {
            const monsterMap = extractMonstersMap(data);
            monstersMaps.push(monsterMap);
        })
        return monstersMaps;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function fetchRagnarokMaps(id: string) {
    const response = await fetch(`https://www.divine-pride.net/api/database/Map/${id}?apiKey=${apiKey}`, {
        method: 'GET',
        headers: {
            'Accept-Language': 'en_US'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data for map`);
    }
    return await response.json();
}

function extractMaps(data : any) {
    const maps : any[] = []
    const map = [
        data.mapname,
        data.name
    ]
    maps.push(map);
    return maps;
}

async function insertMaps(maps : any) {
    try {
        const colLength = 2;
        const query = `
        INSERT INTO maps
        VALUES
        ${maps.map((_ : any, index : any) => `($${index * colLength + 1}, $${index * colLength + 2})`).join(', ')}
        RETURNING *;
        `
        const values: any[] = maps.flat(2);
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error while inserting maps data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMap(id : any) {
    try {
        const data : any = await fetchRagnarokMaps(id);
        const maps = extractMaps(data);
        const result = insertMaps(maps);
        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMapAuto() {
    const maps : any[] = [];
    try {
        const listId : any[] = [];
        const queryResult = await client.query('SELECT DISTINCT monster_map.map_id FROM monster_map LEFT JOIN maps ON monster_map.map_id = maps.map_id WHERE maps.map_id IS null;');
        if (queryResult.rows === null) {
            throw new Error(`All map already written in the table`);
        }
        for (const map of queryResult.rows) {
            listId.push(map.map_id);
        }
        const fetchPromises = listId.map((id) => fetchRagnarokMaps(String(id)));
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((data: any) => {
            const map = extractMaps(data);
            maps.push(map);
        })
        const result = await insertMaps(maps);
        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}