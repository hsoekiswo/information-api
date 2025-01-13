# Ragnarok Monsters

## Goals
This information API is a database to help Ragnarok player find monsters for leveling or get items. Main feature of this API is the recommendations for items drop and leveling monster guide. The database is fetched from divine-pride.net API.

## Concept
This API is able to retrieve ragnarok online monsters data provided by divine-pride.net.<br>
One thing to notes that this API have role based access to use its path.<br>
Authentication and authorization process is supported by JWT.<br>
Writing monsters data only can be accessed through admin.<br>
User can create character and get monster recommendation.<br>
This table summarize the detail of user access:<br>

| Endpoint Category | GET    | POST  | PATCH | DELETE |
|-------------------|--------|-------|-------|--------|
| recommendations   | user   | -     | -     | -      |
| characters        | user   | user  |user   | user   |
| data              | user   | admin | -     | -      |
| monsters          | user   | -     | -     | -      |
| drops             | user   | -     | -     | -      |
| items             | user   | -     | -     | -      |
| maps              | user   | -     | -     | -      |
| experiences       | -      | admin | -     | -      |

Usage flow for user: login -> create character -> get recommendations.<br>
Usage flow for admin (to add monster data)*: login as admin -> post monster data.<br>
<br>

*There are just 10 default monster data.

## API Endpoint
Here is the summary of API documentation. Although you can visit https://ragnarok-recommendation.onrender.com/docs
### Recommendations
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/recommendations/chanceitem/:id    | Get list recommendation of monsters ordered by higher chances item drops |
| GET              | api/recommendations/leveling/base/:id | Get list recommendation of monsters ordered by higher base experience    |
| GET              | api/recommendations/leveling/job/:id  | Get list recommendation of monsters ordered by higher job experience     |

### Characters
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| POST             | api/characters                        | Post single user and put incremental ID                                  |
| GET              | api/characters                        | Get all characters info                                                  |
| GET              | api/characters/single/:id             | Get single character info by ID                                          |
| PATCH            | api/characters/:id                    | Update single character info by ID                                       |
| DELETE           | api/characters/:id                    | Delete single character by ID                                            |

### Data
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/data/single/:id                   | Get single data consisted monsters, drops, items, maps by monster ID     |
| POST             | api/data/single/:id                   | Post single data consisted monsters, drops, items, maps by monster ID    |
| GET              | api/data                              | Get all data of monster info                                             |
| POST             | api/bulk/:startId/:endId              | Post multiple data consisted monsters, drops, items, maps by monster ID  |

### Monsters
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/monsters/:id                      | Get single monster info by ID                                            |
| GET              | api/monsters                          | Get list of all monsters                                                 |
| GET              | api/monsters/fetch/:id                | Get single monster data structure on divine-pride API                    |

### Drops & Items
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/drops/single/:id                  | Get single relation of monster and its chance of dropped item by ID      |
| GET              | api/drops                             | Get list of all relation of monster and its chance of dropped item       |
| GET              | api/items/single/:id                  | Get single item by item ID                                               |
| GET              | api/items                             | Get list of all items on database                                        |
| GET              | api/itemsfetch/:id                    | Get single item data structure on divine-pride API                       |

### Maps
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| GET              | api/maps/monstermaps/single/:id       | Get single relation of monster and its map by ID                         |
| GET              | api/maps/monstermaps                  | Get all relation of monster and its map by ID                            |
| GET              | api/maps/single/:id                   | Get single map info by map ID                                            |
| GET              | api/maps                              | Get all maps on the database                                             |
| GET              | api/fetch/maps                        | Get single map data structure on divine-pride API                        |

### Experiences
| HTTP Method      | Endpoint                              | Description                                                              |
|------------------|---------------------------------------|--------------------------------------------------------------------------|
| POST             | api/experiences/auto                  | Insert experiences needed for base and job level to database by using fetch experience from divine-pride API. Limited up to level third class |

## Tech Stack
Typescript, Hono, PostgresSQL, Docker

## Libraries
Prisma ORM, Zod, Open API, Swagger UI, JWT

## Setup
To install dependencies:
```
bash
docker compose --build
```

## Running the project
To run the development server:
```
bash
docker compose up
```
Inside Dockerfile it will run:
```
bun prisma migrate deploy && bun run src/index.ts
```
This will start the server at http://0.0.0.0:3000