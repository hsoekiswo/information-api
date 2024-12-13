import { config } from 'dotenv';

config();
const apiKey = process.env.API_KEY;

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

export async function fetchFromExternalAPI(id: string) {
    const response = await fetch(`https://ragnapi.com/api/v1/old-times/monsters/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for monster ID: ${id}`);
    }
    return await response.json();
}

export async function fetchRagnarokMonsters(id : string) {
    const response = await fetch(`https://www.divine-pride.net/api/database/Monster/${id}?apiKey=${apiKey}`, {
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