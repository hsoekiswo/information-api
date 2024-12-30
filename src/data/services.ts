import prisma from '../services';
import { fetchRagnarokMonsters } from '../monsters/services';
import { fetchRagnarokItems } from '../items/services';
import { fetchRagnarokMaps } from '../maps/services';
import { DropsSchema } from '../drops/schema';
import { ItemSchema } from '../items/schema';
import { MonsterMapsSchema } from '../maps/schema';
import { MonsterSchema } from '../monsters/schema';
import { MapSchema } from '../maps/schema';

export async function getData(id: any) {
    const result = await prisma.monsters.findUnique({
        where: {
            monster_id: id,
        },
        include: {
            drops: {
                include: {
                    items: true,
                }
            },
            monster_maps: {
                include: {
                    maps: true,
                }
            },
        },
    });

    return result;
}

export async function getDataAll() {
    const result = await prisma.monsters.findMany({
        include: {
            drops: {
                include: {
                    items: true,
                }
            },
            monster_maps: {
                include: {
                    maps: true,
                }
            },
        },
    });

    return result;
}

async function extractMonstersDropsMaps(monsterId: any) {
    const data: any = await fetchRagnarokMonsters(monsterId);

    // Declare empty array for storing data
    const monsters: any[] = [];
    const drops: any[] = [];
    const monsterMaps: any[] = [];

    // Extract data from raw data provided by the Divine Pride
    // Monsters
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

    // Drops
    const rangeDrops = data.drops.length;
    for (let i = 0; i <rangeDrops; i++) {
        const drop = {
            dropId: data.id,
            itemId: data.drops[i].itemId,
            chance: data.drops[i].chance/100
        }
        drops.push(drop);
    }
    DropsSchema.parse(drops);

    // Monster Map
    const rangeMonsterMaps = data.spawn.length;
    for (let i = 0; i <rangeMonsterMaps; i++) {
        const monsterMap = {
            monsterId: data.id,
            mapId: data.spawn[i].mapname
        }
        monsterMaps.push(monsterMap);
    }
    MonsterMapsSchema.parse(monsterMaps);

    const result = {
        monsters,
        drops,
        monsterMaps,
    }
    return result;
}

async function extractItems(drops: any) {
    const listId: any[] = [];
    drops.forEach((drop: any) => {
        listId.push(drop.itemId)
    });
    const fetchPromises = listId.map((id) => fetchRagnarokItems(id));
    const fetchedData: any = await Promise.all(fetchPromises);

    const items: any[] = [];
    fetchedData.map((data: any) => {
        const item = {
            itemId: data.id,
            name: data.name,
            description: data.description,
            itemType: data.unidName,
            attack: data.attack,
            magicAttack: data.matk,
            defense: data.defense,
            weight: data.weight,
            requiredLevel: data.requiredLevel,
            price: data.price
        }
        ItemSchema.parse(item);
        items.push(item);
    })
    
    return items;
}

async function extractMaps(monsterMaps : any) {
    const listId: any[] = [];
    monsterMaps.forEach((monsterMap: any) => {
        listId.push(monsterMap.mapId)
    });

    const fetchPromises = listId.map((id) => fetchRagnarokMaps(id));
    const fetchedData: any = await Promise.all(fetchPromises);

    const maps : any[] = []
    fetchedData.map((data: any) => {
        const map = {
            mapId: data.mapname,
            name: data.name
        }
        MapSchema.parse(map);
        maps.push(map);
    });

    return maps;
}

export async function insertData(data : any) {
    const { monsters, drops, items, monsterMaps, maps } = data;

    // Preprocess to remove any duplicates
    const uniqueDrops = Array.from(
        new Map(
            drops.map((drop: any) => [
                `${drop.dropId}-${drop.itemId}-${drop.chance}`,
                drop
            ])
        ).values()
    );

    await prisma.$transaction(async (tx) => {
        await Promise.all(
            monsters.map((monster: any) =>
                tx.monsters.upsert({
                    where: { monster_id: monster.monsterId },
                    create: {
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
                    },
                    update: {},
                })
            )
        );
        
        await Promise.all(
            items.map((item: any) =>
                tx.items.upsert({
                    where: { item_id: item.itemId },
                    create: {
                        item_id: item.itemId,
                        name: item.name,
                        description: item.description,
                        item_type: item.itemType,
                        attack: item.attack,
                        magic_attack: item.magicAttack,
                        defense: item.defense,
                        weight: item.weight,
                        price: item.price,
                        required_level: item.requiredLevel,
                    },
                    update: {},
                })
            )
        );

        await Promise.all(
            maps.map((map: any) =>
                tx.maps.upsert({
                    where: { map_id: map.mapId },
                    create: {
                        map_id: map.mapId,
                        name: map.name,
                    },
                    update: {},
                })
            )
        );

        await Promise.all(
            uniqueDrops.map((drop: any) =>
                tx.drops.upsert({
                    where: {
                        monster_id_item_id: {
                            monster_id: drop.monsterId,
                            item_id: drop.itemId,
                        },
                    },
                    create: {
                        monster_id: drop.monsterId,
                        item_id: drop.itemId,
                        chance: drop.chance,
                    },
                    update: {},
                })
            )
        );

        await Promise.all(
            monsterMaps.map((monsterMap: any) =>
                tx.monster_maps.upsert({
                    where: {
                        monster_id_map_id: {
                            monster_id: monsterMap.monsterId,
                            map_id: monsterMap.mapId,
                        },
                    },
                    create: {
                        monster_id: monsterMap.monsterId,
                        map_id: monsterMap.mapId,
                    },
                    update: {}, // No update needed
                })
            )
        );
    })

    const insertedMonsters = await prisma.monsters.findMany({
        where: {
            monster_id:{
                in: monsters.map((monster: any) => monster.monsterId),
            }
        },
        include: {
            drops: {
                include: {
                    items: true,
                }
            },
            monster_maps: {
                include: {
                    maps: true,
                }
            }
        }
    });

    return insertedMonsters;
}

export async function addData(monsterId : number) {
    const { monsters, drops, monsterMaps } = await extractMonstersDropsMaps(monsterId);
    const items = await extractItems(drops);
    const maps = await extractMaps(monsterMaps);
    const data = {
        monsters,
        drops,
        items,
        monsterMaps,
        maps,
    }
    const result = await insertData(data);
    return result;
    // return data;
}

export async function addDataBulk(startId : number, endId : number) {
    const allMonsters: any[] = [];
    const allDrops: any[] = [];
    const allItems: any[] = [];
    const allMonsterMaps: any[] = [];
    const allMaps: any[] = [];

    // Loop through the range of monster IDs
    for (let monsterId = startId; monsterId <= endId; monsterId++) {
        const { monsters, drops, monsterMaps } = await extractMonstersDropsMaps(monsterId);
        const items = await extractItems(drops);
        const maps = await extractMaps(monsterMaps);

        // Accumulate all data
        allMonsters.push(...monsters);
        allDrops.push(...drops);
        allItems.push(...items);
        allMonsterMaps.push(...monsterMaps);
        allMaps.push(...maps);
    }

    const data = {
        monsters: allMonsters,
        drops: allDrops,
        items: allItems,
        monsterMaps: allMonsterMaps,
        maps: allMaps,
    };

    // Insert all data using the existing insertData function
    const result = await insertData(data);

    return result;
}