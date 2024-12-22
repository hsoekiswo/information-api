import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const uniqueDrops = [
    {
      monsterId: 1054,
      itemId: 955,
      chance: 7.5,
    },
    {
      monsterId: 1054,
      itemId: 4050,
      chance: 0.01,
    }
  ]
  const insertedDrops = await prisma.drops.findMany({
    where: {
        OR: uniqueDrops.map((drop: any) => ({
            monster_id: drop.dropId,
            item_id: drop.itemId,
            chance: drop.chance,
        })),
    },
  });
  // const insertedDrops = await prisma.drops.findMany({
  //     where: {
  //         AND: ({
  //             monster_id: 1054,
  //             item_id: 955,
  //             chance: 7.5,
  //         }),
  //     },
  // });
  console.dir(insertedDrops)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })