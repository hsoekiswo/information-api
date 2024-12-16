import { Client } from 'pg';
import dotenv, { config }  from 'dotenv';

config();
const apiKey = process.env.API_KEY;

dotenv.config({ path: '../.env' });
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

try {
    await client.connect();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }

export type Monster = {
    'id': number;
    'name': string;
    'level': number;
    'hp': number;
    'attack': string;
    'defense': number;
    'magicDef': number;
}

// Database Dummy
export let initialMonsters: Monster[] = [
    {
        'id': 1,
        'name': 'Poring',
        'level': 1,
        'hp': 50,
        'attack': '7-10',
        'defense': 0,
        'magicDef': 5
    },
    {
        'id': 2,
        'name': 'Lunatic',
        'level': 3,
        'hp': 60,
        'attack': '9-12',
        'defense': 0,
        'magicDef': 20
    },
    {
        'id': 3,
        'name': 'Rocker',
        'level': 9,
        'hp': 198,
        'attack': '24-29',
        'defense': 5,
        'magicDef': 10
    },
    {
        'id': 4,
        'name': 'Spore',
        'level': 16,
        'hp': 510,
        'attack': '24-48',
        'defense': 0,
        'magicDef': 5

    },
    {
        'id': 5,
        'name': 'Peco Peco',
        'level': 19,
        'hp': 531,
        'attack': '50-64',
        'defense': 0,
        'magicDef': 0
    }
]

export async function getMonsters() {
    return initialMonsters;
}

export async function getMonsterById(id: number) {
    const selectedMonster = initialMonsters.find(
        (monster) => monster.id === id
    );
    
    return selectedMonster;
}

export async function addMonster(monsterStats : Omit<Monster, 'id'>) {
    let newId;
    if (initialMonsters.length === 0) {
        newId = 1;
    } else {
        newId = initialMonsters.at(-1)!.id + 1;
    }

    const newMonster = {
        id: newId,
        name: monsterStats.name,
        level: Number(monsterStats.level),
        hp: Number(monsterStats.hp),
        attack: monsterStats.attack,
        defense: Number(monsterStats.defense),
        magicDef: Number(monsterStats.magicDef),
    }
    initialMonsters.push(newMonster);

    return { ...newMonster };
}

export async function updateMonsterById({ id, ...monsterStats } : Monster) {
    const index = initialMonsters.findIndex(monster => monster.id === id);
    if (index === -1) {
        throw new Error(`Monster with id ${id} not found`);
    }
    initialMonsters[index] = { ...initialMonsters[index], ...monsterStats }

    return initialMonsters[index];
}

export async function deleteMonsterById(id : number) {
    const index = initialMonsters.findIndex(monster => monster.id === id);
    if (index === -1) {
        throw new Error(`Monster with id ${id} not found`);
    }
    const newMonsters = initialMonsters.filter(
        (monster) => monster.id !== id
    )
    console.log(index);
    console.log(newMonsters);
    initialMonsters = newMonsters;

    return `Monster with id: ${id} has been deleted.`
}

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

export async function addMonsterData(id : string) {
    const data : any = await fetchRagnarokMonsters(id);
    const monster = {
        'monsterId': data.id,
        'name': data.name,
        'level': data.stats.level,
        'hp': data.stats.health,
        'attack_min': data.stats.attack.minimum,
        'attack_max': data.stats.attack.maximum,
        'defense': data.stats.defense,
        'magicDefense': data.stats.magicDefense,
        'baseExperience': data.stats.baseExperience,
        'jobExperience': data.stats.jobExperience
    };
  
    const query = 'INSERT INTO monsters VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
    const values = [
        monster.monsterId,
        monster.name,
        monster.level,
        monster.hp,
        monster.attack_min,
        monster.attack_max,
        monster.defense,
        monster.magicDefense,
        monster.baseExperience,
        monster.jobExperience
    ]
    const result = await client.query(query, values);

    return result.rows[0];
}

export async function addMonsterDataInBulk(startId : number, endId : number) {
    const monsters: any[] = [];

    try {
        for (let id = startId; id <= endId; id++) {
            console.log(`Trying to write data for ID: ${id}`);
            const stringId = String(id);
            const data: any = await fetchRagnarokMonsters(stringId);
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
            ];
            monsters.push(monster);
        }

        const colLength = 10;
        const query = `
        INSERT INTO monsters
        VALUES
        ${monsters.map((_, index) => `($${index * colLength + 2}, $${index * colLength + 3}, $${index * colLength + 4}, $${index * colLength + 4}, $${index * colLength + 5}, $${index * colLength + 6}, $${index * colLength + 7}, $${index * colLength + 8}, $${index * colLength + 9}, $${index * colLength + 10})`).join(', ')}
        RETURNING *;
        `;
        const values: any[] = monsters.flat();
        const result = await client.query(query, values);

        return result;
    }
    catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

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

export async function addMonsterMap(id: any) {
    const monstersMap : any[] = [];
    try {
        const stringId = String(id)
        const data : any = await fetchRagnarokMonsters(stringId);
        const range = data.spawn.length;
        for (let i = 0; i <range; i++) {
            const monsterMap = [
                data.id,
                data.spawn[i].mapname
            ]
            monstersMap.push(monsterMap);
        }

        const colLength = 2;
        if (monstersMap.length === 0) {
            throw new Error(`Cannot insert monster map with monster ID ${id}: No data to insert`);
        }
        const query = `
        INSERT INTO monster_map (monster_id, map_id)
        VALUES
        ${monstersMap.map((_, index) => `($${index * colLength + 1}, $${index * colLength + 2})`).join(', ')}
        RETURNING *;
        `;
        const values: any[] = monstersMap.flat();
        const result = await client.query(query, values);

        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMonsterMapAuto() {
    const monsterMaps: any[] = [];
    try {
        const result = await client.query('SELECT DISTINCT monsters.monster_id as monster_id FROM monsters LEFT JOIN monster_map ON monsters.monster_id = monster_map.monster_id WHERE monster_map.monster_id is null');
        const listId = result.rows
        if (listId === null) {
            throw new Error(`All monster map already written in the table`);
        }
        console.log(listId);
        for (const item of listId) {
            const monsterMap = await addMonsterMap(item.monster_id);
            monsterMaps.push(monsterMap);
        }
        return monsterMaps;
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

export async function addMap(id : any) {
    try {
        const data : any = await fetchRagnarokMaps(id);
        const map = [
            data.mapname,
            data.name
        ]

        const query = 'INSERT INTO maps VALUES ($1, $2) RETURNING *'
        const values = map;
        const result = await client.query(query, values);

        return result.rows[0];
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}

export async function addMapAuto() {
    const maps : any[] = [];
    try {
        const result = await client.query('SELECT DISTINCT monster_map.map_id FROM monster_map LEFT JOIN maps ON monster_map.map_id = maps.map_id WHERE maps.map_id IS null;');
        const listId = result.rows
        if (listId === null) {
            throw new Error(`All map already written in the table`);
        }
        for (const item of listId) {
            const map = await addMap(item.map_id);
            maps.push(map);
        }
        return maps;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}

export async function fetchRagnarokExperience() {
    const response = await fetch(`https://www.divine-pride.net/api/database/Experience/?apiKey=${apiKey}`, {
        method: 'GET',
        headers: {
            'Accept-Language': 'en_US'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data for experience`);
    }
    return await response.json();
}

export async function addExperienceAuto() {
    try{

        const data : any = await fetchRagnarokExperience();
        const { base_normal, job_novice, job_first, job_second, job_third } = data
        const grouped = { base_normal, job_first, job_second, job_third, job_novice };
        const experiences : any[] = [];
        // insert logic for checking type of experience, if any can't insert new
        for (const key in grouped) {
            const item = grouped[key];
            const levels = Object.keys(item);
            const exp_required = Object.values(item);
            const range = levels.length;
            for (let i=0; i<range; i++) {
                const level = Number(levels[i]);
                const experienceRequired = exp_required[i];
                const experience = [
                    level,
                    experienceRequired,
                    key
                ]
                experiences.push(experience)
            }
        }
        const colLength = 3;
        const query = `
        INSERT INTO experience (level, experience, exp_type)
        VALUES
        ${experiences.map((_, index) => `($${index * colLength + 1}, $${index * colLength + 2}, $${index * colLength + 3})`).join(', ')}
        RETURNING *;
        `
        const values = experiences.flat();
        const result = await client.query(query, values);
    
        return result.rows[0];
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}

export async function calculateChanceItem(itemId : any) {
    try {
        if (isNaN(Number(itemId))) {
            throw new Error('Invalid itemId provided, itemId accept only number format');
        }
        const query = `
            SELECT
                items.item_id,
                items.name AS item_name,
                items.item_type,
                monsters.name AS monster_name,
                drops.chance AS chance_percent
            FROM
                items
            LEFT JOIN
                drops ON items.item_id = drops.item_id
            LEFT JOIN
                monsters ON drops.monster_id = monsters.monster_id
            WHERE
                items.item_id = $1
            ORDER BY
                chance DESC;
        `
        const values = [itemId];
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}

export async function monsterBaseRecommendation(level : any) {
    try {
        if (isNaN(Number(level))) {
            throw new Error('Invalid level provided, level accept only number format');
        } else if (level < 1 || level > 99) {
            throw new Error('Invalid level provided, level must between 1-99');
        }
        const query = `
        SELECT
            *,
            (SELECT experience FROM experience WHERE level = $1 AND exp_type = 'base_normal')/base_experience AS required_number
        FROM
            monsters
        WHERE
            level BETWEEN $1-5 AND $1+5
        ORDER BY required_number ASC;
        `
        const values = [level];
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}

export async function monsterJobRecommendation(type : any, level : any) {
    try {
        if (isNaN(Number(level))) {
            throw new Error('Invalid level provided, level accept only number format');
        } else if (level < 1 || level > 99) {
            throw new Error('Invalid level provided, level must between 1-99');
        }
        const query = `
        SELECT
            *,
            (SELECT experience FROM experience WHERE level = $1 AND exp_type = $2)/job_experience AS required_number
        FROM
            monsters
        WHERE
            level BETWEEN $1-5 AND $1+5
        ORDER BY required_number ASC;
        `
        const values = [level, type];
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}