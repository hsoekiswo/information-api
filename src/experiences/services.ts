import client, { apiKey } from '../services'

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
    try{

        const data : any = await fetchRagnarokExperience();
        const { base_normal, job_novice, job_first, job_second, job_third } = data
        const grouped = { base_normal, job_first, job_second, job_third, job_novice };
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
                const experience = [
                    level,
                    experienceRequired,
                    key
                ]
                experiences.push(experience)
            }
        }
        const colLength = 3;
        const query = `
        INSERT INTO experience (level, experience, exp_type)
        VALUES
        ${experiences.map((_, index) => `($${index * colLength + 1}, $${index * colLength + 2}, $${index * colLength + 3})`).join(', ')}
        RETURNING *;
        `
        const values = experiences.flat();
        const result = await client.query(query, values);
    
        return result.rows[0];
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}
