# Step 1: Use the Bun alpine image
FROM oven/bun:alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app/

# Step 3: Copy package.json and lock file
COPY package.json bun.lockb /usr/src/app/

# Step 4: Install dependencies
RUN bun install

# Step 5: Copy all files into the working directory
COPY . /usr/src/app/

# Step 6: Generate Prisma client
RUN bun prisma generate

# Step 7: Ensure the entrypoint script is executable
RUN chmod +x docker-entrypoint.sh

# Step 8: Set the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]

EXPOSE 3000

# Step 9: Default command to start the app
CMD [ "bun", "start" ]