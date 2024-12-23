import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const items : any[] = [];
  const listId : any[] = [];
  const queryResult = await prisma.drops.findMany({
    distinct: ['item_id'],
    where: {
      item_id: {
        notIn: await prisma.items.findMany({
          select: { item_id: true }
        }).then(items => items.map(item => item.item_id))
      }
    },
    orderBy: {
      item_id: 'asc'
    },
    select: {
      item_id: true
    }
  });
  for (const item of queryResult) {
    listId.push(item.item_id);
    console.log(item.item_id);
  }
  // console.dir(items);
  console.log(listId);
  return queryResult;
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