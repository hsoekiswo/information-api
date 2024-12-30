import fs from 'fs';
import path from 'path';
import { insertData } from '../src/data/services';
import prisma from '../src/services';

async function main() {
    try {
        const filePath = path.join(__dirname, 'samples.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const rawSamples = JSON.parse(rawData);

        const snakeToCamel = (str: string) => {
            return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        };
        
        const convertSnakeToCamel: any = (data: any) => {
            // If the data is an array, recursively convert each item
            if (Array.isArray(data)) {
              return data.map(item => convertSnakeToCamel(item));
            }
          
            // If the data is an object, convert each key and value
            if (typeof data === 'object' && data !== null) {
              return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                  snakeToCamel(key), // Convert the key to camelCase
                  value && typeof value === 'object' ? convertSnakeToCamel(value) : value, // Recursively convert the value if it's an object or array
                ])
              );
            }
          
            // If the data is neither an object nor an array, return it as is
            return data;
          };

        const samples = convertSnakeToCamel(rawSamples);

        const monsters: any[] = [];
        const drops: any[] = [];
        const items: any[] = [];
        const monsterMaps: any[] = [];
        const maps: any[] = [];

        samples.forEach((sample: any) => {
            const { drops: rawDrop, monsterMaps: rawMonsterMap, ...restMonster } = sample;
            monsters.push(restMonster);
            rawDrop.forEach((sample: any) => {
                const { items: item, ...restDrop } = sample;
                drops.push(restDrop);
                items.push(item);
            });
            rawMonsterMap.forEach((sample: any) => {
                const { maps: map, ...restMonsterMap } = sample;
                monsterMaps.push(restMonsterMap);
                maps.push(map);
            })
        });
        
        const data = {
            monsters: monsters,
            drops: drops,
            items: items,
            monsterMaps: monsterMaps,
            maps: maps,
        };

        // Insert all data using the existing insertData function
        await insertData(data);
        
        console.log('Seeding completed successfully.');
    } catch(error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
};

main();