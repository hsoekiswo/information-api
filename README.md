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
| POST             | api/monsters/single/:id               | Insert monster to database by using fetch monsters from divine-pride API |
| POST             | api/monsters/bulk/:startId/:endId     | Insert several monsters by its ID to database by using fetch monsters from divine-pride API     |

## REST API Specification
- Production: 
- Local: http://localhost:3000