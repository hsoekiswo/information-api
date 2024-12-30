#!/bin/sh
set -e

# Run Prisma migrations
bunx prisma migrate deploy

# Run seed script only if it's the first deployment
if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding the database..."
  bun prisma/seed.ts
fi

# Start the application
exec "$@"