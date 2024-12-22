import { calculateChanceItem, monsterBaseRecommendation, monsterJobRecommendation } from "./services";

export async function getChanceItemHandler(c: any) {
    const itemId = c.req.param('id');
    const result = await calculateChanceItem(itemId);
    return c.json(result);
};

export async function getLevelingBaseHandler(c: any) {
    const level = c.req.param('level');
    const result = await monsterBaseRecommendation(level);
    return c.json(result);
};

export async function getLevelingJobHandler(c: any) {
    const type = c.req.param('type');
        const level = c.req.param('level');
        const result = await monsterJobRecommendation(type, level);
        return c.json(result);
};