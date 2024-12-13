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
await client.connect();

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

export async function fetchRagnarokMonsters(id : string) {
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
    const result = await client.query('SELECT * FROM monsters');
    return result
}

export async function addMonsterData(id : any) {
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

    return result;
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

export async function addMonsterDrop(id : any) {
    const drops: any[] = [];
    try {
        const stringId = String(id)
        const data : any = await fetchRagnarokMonsters(stringId);
        const range = data.drops.length;
        for (let i = 0; i <range; i++) {
            const drop = [
                data.id,
                data.drops[i].itemId,
                data.drops[i].chance
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
        console.log('values');
        console.log(values);
        const result = await client.query(query, values);

        return result;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500 };
    }
}