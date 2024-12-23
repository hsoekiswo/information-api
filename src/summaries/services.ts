import { PrismaClient } from '@prisma/client';
import prisma from '../services';

export async function calculateChanceItem(itemId : any) {
    const itemIdNumber = Number(itemId);
    if (isNaN(itemIdNumber)) {
        throw new Error('Invalid itemId provided, itemId accept only number format');
    }
    const result = await prisma.items.findMany({
        select: {
            name: true,
            item_id: true,
            item_type: true,
            drops: {
                select: {
                    chance: true,
                    monsters: {
                        select: {
                            name: true,
                            level: true,
                            hp: true
                        }
                    },
                },
                orderBy: {
                    chance: 'desc'
                }
            }
        },
        where: {
            item_id: itemIdNumber
        }
    });
    return result;
}

export async function monsterBaseRecommendation(level : any) {
    const levelNumber = Number(level);
    if (isNaN(levelNumber)) {
        throw new Error('Invalid level provided, level accept only number format');
    } else if (level < 1 || level > 99) {
        throw new Error('Invalid level provided, level must between 1-99');
    }

    const result = await prisma.$queryRawUnsafe(`
        SELECT
            *,
            (SELECT experience FROM experiences WHERE level = ${levelNumber} AND exp_type = 'base_normal')/base_experience AS required_number
        FROM
            monsters
        WHERE
            level > (${levelNumber} - 5)
            AND level < (${levelNumber} + 5)
        ORDER BY required_number ASC;
    `);
    
    return result;
}

export async function monsterJobRecommendation(type : any, level : any) {
    const levelNumber = Number(level);
    if (isNaN(levelNumber)) {
        throw new Error('Invalid level provided, level accept only number format');
    } else if (level < 1 || level > 99) {
        throw new Error('Invalid level provided, level must between 1-99');
    }

    const result = await prisma.$queryRawUnsafe(`
        SELECT
            *,
            (SELECT experience FROM experiences WHERE level = ${levelNumber} AND exp_type = '${type}')/job_experience AS required_number
        FROM
            monsters
        WHERE
            level > (${levelNumber} - 5)
            AND level < (${levelNumber} + 5)
        ORDER BY required_number ASC;
    `);

    return result;
}