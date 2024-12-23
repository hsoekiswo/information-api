import client, { apiKey } from '../services';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const data : any = await fetchRagnarokExperience();
    const { base_normal, job_novice, job_first, job_second, job_third } = data
    const grouped: any = { base_normal, job_first, job_second, job_third, job_novice };
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
            const experience = {
                level: level,
                experienceRequired: experienceRequired,
                expType: key
            }
            experiences.push(experience)
        }
    }
    
    await prisma.experiences.createMany({
        data: experiences.map((experience: any) => ({
            level: experience.level,
            experience: experience.experienceRequired,
            exp_type: experience.expType,
        })),
    });

    const insertedExperiences = await prisma.experiences.findMany();

    return insertedExperiences;
}
