import client, { apiKey } from '../services'
import { fetchRagnarokMonsters  } from '../monsters/services';
import { MapSchema, MonsterMapsSchema } from './schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


function extractMonsterMaps(data : any) {
    const monsterMaps : any[] = [];
    const range = data.spawn.length;
    for (let i = 0; i <range; i++) {
        const monsterMap = {
            monsterId: data.id,
            mapId: data.spawn[i].mapname
        }
        monsterMaps.push(monsterMap);
    }
    MonsterMapsSchema.parse(monsterMaps);
    return monsterMaps;
}

async function insertMonsterMaps(monsterMaps: any) {
    if (monsterMaps.length === 0) {
        throw new Error('Cannot insert monster map: No data to insert');
    }
    await prisma.monster_maps.createMany({
        data: monsterMaps.map((monsterMap: any) => ({
            monster_id: monsterMap.monsterId,
            map_id: monsterMap.mapId,
        })),
    });

    const insertedMonsterMaps = await prisma.monster_maps.findMany({
        where: {
            monster_id: {
                in: monsterMaps.map((monsterMap: any) => monsterMap.monsterId)
            }
        },
    });

    return insertedMonsterMaps;
}

export async function addMonsterMap(id: number) {
    const data: any = await fetchRagnarokMonsters(id);
    const monsterMaps = extractMonsterMaps(data);
    const result = await insertMonsterMaps(monsterMaps);
    return result;
}

export async function addMonsterMapAuto() {
    const monsterMaps: any[] = [];
    const listId: any[] = [];
    const queryResult = await prisma.monster_maps.findMany({
        distinct: ['monster_id'],
        where: {
            monster_id: {
                notIn: await prisma.monsters.findMany({
                    select: { monster_id: true }
                }).then(monsterMaps => monsterMaps.map(monsterMap => monsterMap.monster_id))
            }
        },
    });
    
    if (queryResult[0] === undefined) {
        throw new Error(`All requested monsters map already written in the table`);
    }
    for (const item of queryResult) {
        listId.push(item.monster_id);
    }
    const fetchPromises = listId.map((id) => fetchRagnarokMonsters(id));
    const fetchedData = await Promise.all(fetchPromises);
    fetchedData.forEach((data: any) => {
        const extractedMonsterMap = extractMonsterMaps(data);
        monsterMaps.push(...extractedMonsterMap);
    });
    const result = await insertMonsterMaps(monsterMaps)
    return result;
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
    const map = {
        mapId: data.mapname,
        name: data.name
    }
    MapSchema.parse(map);
    maps.push(map);
    return maps;
}

async function insertMaps(maps : any) {
    // const colLength = 2;
    await prisma.maps.createMany({
        data: maps.map((map: any) => ({
            map_id: map.mapId,
            name: map.name,
        })),
    });

    const insertedMaps = await prisma.maps.findMany({
        where: {
            map_id: {
                in: maps.map((map: any) => map.mapId),
            },
        },
    });

    return insertedMaps;
}

export async function addMap(id: string) {
    const data: any = await fetchRagnarokMaps(id);
    const maps = extractMaps(data);
    const result = insertMaps(maps);
    return result;
}

export async function addMapAuto() {
    const maps : any[] = [];
    const listId : any[] = [];
    const queryResult = await prisma.monster_maps.findMany({
        distinct: ['map_id'],
        where: {
            map_id: {
                notIn: await prisma.maps.findMany({
                    select: { map_id: true }
                }).then(maps => maps.map(map => map.map_id))
            }
        },
        orderBy: {
            map_id: 'asc'
        },
        select: {
            map_id: true
        }
    })
    if (queryResult[0] === undefined) {
        throw new Error(`All requested maps already written in the table`);
    }
    for (const map of queryResult) {
        listId.push(map.map_id);
    }
    const fetchPromises = listId.map((id) => fetchRagnarokMaps(id));
    const fetchedData = await Promise.all(fetchPromises);
    fetchedData.forEach((data: any) => {
        const extractedMap = extractMaps(data);
        maps.push(...extractedMap);
    });
    const result = await insertMaps(maps);
    return result;
}