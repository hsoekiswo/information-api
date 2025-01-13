import { calculateChanceItem, getBaseLevel, getJobLevel, monsterBaseRecommendation, monsterJobRecommendation } from "./services";
import { CharacterIdSchema } from "../characters/schema";
import { parse } from "path";

export async function getChanceItemHandler(c: any) {
    const itemId = c.req.param('id');
    const result = await calculateChanceItem(itemId);
    return c.json({
        status: "success",
        message: "Successfully get chance item recommendation.",
        data: result
    }, 200);
};

export async function getLevelingBaseHandler(c: any) {
    const characterId = c.req.param('id');
    const parseId = CharacterIdSchema.parse(Number(characterId));
    const baseLevel = await getBaseLevel(parseId);
    const result = await monsterBaseRecommendation(baseLevel);
    return c.json({
        status: "success",
        message: "Successfully get monster recommendation for base leveling.",
        data: result
    }, 201);
};

export async function getLevelingJobHandler(c: any) {
    const characterId = c.req.param('id');
    const parseId = CharacterIdSchema.parse(Number(characterId));
    const { expType, jobLevel } = await getJobLevel(parseId);
    const result = await monsterJobRecommendation(expType, jobLevel);
    return c.json({
        status: "success",
    message: "Successfully get monster recommendation for job leveling.",
    data: result
    }, 201);
};