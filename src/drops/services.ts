import client from '../services'
import { fetchRagnarokMonsters } from '../monsters/services'
import { DropsSchema } from './schema';
import prisma from '../services';

export async function readAllDrops() {
    const result = await prisma.drops.findMany();
    return result;
}

function extractDrops(data : any) {
    const drops: any[] = [];
    const range = data.drops.length;
    for (let i = 0; i <range; i++) {
        const drop = {
            dropId: data.id,
            itemId: data.drops[i].itemId,
            chance: data.drops[i].chance/100
        }
        drops.push(drop);
    }
    DropsSchema.parse(drops);
    return drops;
}

async function insertDrops(drops : any) {
    // Preprocess to remove any duplicates
    const uniqueDrops = Array.from(
        new Map(
            drops.map((drop: any) => [
                `${drop.dropId}-${drop.itemId}-${drop.chance}`,
                drop
            ])
        ).values()
    );

    await prisma.drops.createMany({
        data: uniqueDrops.map((drop: any) => ({
            monster_id: drop.dropId,
            item_id: drop.itemId,
            chance: drop.chance,
        })),
        skipDuplicates: true,
    });

    const insertedDrops = await prisma.drops.findMany({
        where: {
            OR: uniqueDrops.map((drop: any) => ({
                monster_id: drop.dropId,
                item_id: drop.itemId,
                chance: drop.chance,
            })),
        },
    });

    return insertedDrops;
}

export async function addMonsterDrops(id : number) {
    const data: any = await fetchRagnarokMonsters(id);
    const drops = extractDrops(data);
    const result = await insertDrops(drops);
    return result;
}

export async function addMonsterDropsAuto() {
    const drops: any[] = [];
    const listId : any[] = [];
    const queryResult = await prisma.monsters.findMany({
        where: {
            drops: {
                none: {},
            },
        },
        select: {
            monster_id: true,
        },
    });
    if (queryResult[0] === undefined) {
        throw new Error(`All requested drops already written in the table`);
    }
    for (const item of queryResult) {
        listId.push(item.monster_id);
    }
    const fetchPromises = listId.map((id) => fetchRagnarokMonsters(id));
    const fetchedData = await Promise.all(fetchPromises);
    fetchedData.forEach((data : any) => {
        const extractedDrop = extractDrops(data);
        drops.push(...extractedDrop);
    })
    const result = await insertDrops(drops);
    return result;
}