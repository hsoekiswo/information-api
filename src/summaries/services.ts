import client from '../services'

export async function calculateChanceItem(itemId : any) {
    try {
        if (isNaN(Number(itemId))) {
            throw new Error('Invalid itemId provided, itemId accept only number format');
        }
        const query = `
            SELECT
                items.item_id,
                items.name AS item_name,
                items.item_type,
                monsters.name AS monster_name,
                drops.chance AS chance_percent
            FROM
                items
            LEFT JOIN
                drops ON items.item_id = drops.item_id
            LEFT JOIN
                monsters ON drops.monster_id = monsters.monster_id
            WHERE
                items.item_id = $1
            ORDER BY
                chance DESC;
        `
        const values = [itemId];
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}

export async function monsterBaseRecommendation(level : any) {
    try {
        if (isNaN(Number(level))) {
            throw new Error('Invalid level provided, level accept only number format');
        } else if (level < 1 || level > 99) {
            throw new Error('Invalid level provided, level must between 1-99');
        }
        const query = `
        SELECT
            *,
            (SELECT experience FROM experience WHERE level = $1 AND exp_type = 'base_normal')/base_experience AS required_number
        FROM
            monsters
        WHERE
            level BETWEEN $1-5 AND $1+5
        ORDER BY required_number ASC;
        `
        const values = [level];
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}

export async function monsterJobRecommendation(type : any, level : any) {
    try {
        if (isNaN(Number(level))) {
            throw new Error('Invalid level provided, level accept only number format');
        } else if (level < 1 || level > 99) {
            throw new Error('Invalid level provided, level must between 1-99');
        }
        const query = `
        SELECT
            *,
            (SELECT experience FROM experience WHERE level = $1 AND exp_type = $2)/job_experience AS required_number
        FROM
            monsters
        WHERE
            level BETWEEN $1-5 AND $1+5
        ORDER BY required_number ASC;
        `
        const values = [level, type];
        const result = await client.query(query, values);
        return result.rows;
    } catch(error) {
        console.error('Error fetching external API or inserting data:', error.message);
        return { error: error.message, status: 500};
    }
}