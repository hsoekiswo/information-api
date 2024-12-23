import client, { apiKey } from '../services';
import { MonsterSchema } from './schema';
import prisma from '../services';

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
    const result = await prisma.monsters.findMany();
    return result
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

    MonsterSchema.parse(monster);
    monsters.push(monster);
    return monsters;
}

async function insertMonsters(monsters : any) {
    await prisma.monsters.createMany({
        data: monsters.map((monster: any) => ({
            monster_id: monster.monsterId,
            name: monster.name,
            level: monster.level,
            hp: monster.hp,
            attack_min: monster.attackMin,
            attack_max: monster.attackMax,
            defense: monster.defense,
            magic_defense: monster.magicDefense,
            base_experience: monster.baseExperience,
            job_experience: monster.jobExperience,
        })),
    });

    const insertedMonsters = await prisma.monsters.findMany({
    where: {
        monster_id: {
        in: monsters.map((monster: any) => monster.monsterId),
        },
    },
    });

    return insertedMonsters;
}

export async function addMonsterData(id : number) {
    const data: any = await fetchRagnarokMonsters(id);
    const monsters = extractMonsters(data);
    const result = insertMonsters(monsters);
    return result;
}

export async function addMonsterDataInBulk(startId : number, endId : number) {
    const monsters: any[] = [];
    const listId: any[] = [];
    for (let id = startId; id <= endId; id++) {
        listId.push(id);
    }

    const fetchPromises = listId.map((id) => fetchRagnarokMonsters(id));
    const fetchedData = await Promise.all(fetchPromises);

    fetchedData.forEach((data: any) => {
        const extractedMonster = extractMonsters(data);
        monsters.push(...extractedMonster);
    });

    if(monsters.length === 0) {
        throw new Error("No valid monsters to insert.");
    }

    const result = await insertMonsters(monsters);
    return result;
}
