# Ragnarok Monsters

## Goals
This information API is a database to help Ragnarok player find monsters for leveling or get items. The database is fetched from divine-pride.net API.

## API Endpoint
### Summaries
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/summaries/chanceitem/:id          | Get list recommendation of monsters ordered by higher chances item drops |
| GET              | api/levelingmonster/base/:level       | Get list recommendation of monsters ordered by higher base experience    |
| GET              | api/levelingmonster/job/:type/:level  | Get list recommendation of monsters ordered by higher job experience     |

### Monsters
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/monsters/read                     | Get list of all monsters                                                 |
| POST             | api/monsters/single/:id               | Insert monster to database by using fetch monsters from divine-pride API. Insert monster ID to params |
| POST             | api/monsters/bulk/:startId/:endId     | Insert several monsters by its ID to database by using fetch monsters from divine-pride API |

### Drops
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/drops/read                        | Get list of all relation of monster and its chance of dropped item       |
| POST             | api/drops/single/:id                  | Insert monster and drops chance to database by using fetch monsters from divine-pride API. Insert monster ID to params |
| POST             | api/drops/auto                        | Insert several monster drops by its ID to database by using fetch monsters from divine-pride API |

### Items
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/items/read                        | Get list of all relation of monster and its chance of dropped item       |
| POST             | api/items/single/:id                  | Insert items to database by using fetch monsters from divine-pride API. Insert item ID to params |
| POST             | api/items/auto                        | Insert several items by its ID to database by using fetch items from divine-pride API |

### Maps
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| POST             | api/monstermap/single/:id             | Insert monster and maps relation to database by using fetch monsters from divine-pride API. Insert monster ID to params |
| POST             | api/monstermap/auto                   | Insert monster and maps by its ID to database by using fetch monsters from divine-pride API |
| POST             | api/maps/single/:id                   | Insert map information to database by using fetch map from divine-pride API. Insert map ID to params |
| POST             | api/maps/auto                         | Insertmaps by its ID to database by using fetch map from divine-pride API |

### Experiences
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| POST             | api/experiences/auto                  | Insert experiences needed for base and job level to database by using fetch experience from divine-pride API. Limited up to level third class |

## Tech Stack
Typescript, Hono, PostgresSQL, Docker

## Setup
To install dependencies:
'''
bun install
'''

## Running the project
To run the development server:
'''
bun run dev
'''
This will start the server at http://localhost:3000