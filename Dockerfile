# Step 1: Mengambil image dari Dockerhub
FROM oven/bun:alpine

# Step 2: Setup lokasi tempat app dijalankan
WORKDIR /usr/src/app

# Step 3: Masukan package.json dulu agar rebuilding image bisa menggunakan chance (jika tidak ada perubahan pada package.json)
COPY package.json /usr/src/app

# Step 4: Menjalankan perintah yang ada pada lokasi WORKDIR
RUN bun install

# Step 5: Copy paste semua file yang ada di folder saat ini ke WORKDIR
COPY . /usr/src/app

# Step 6: Menjalankan bun prisma generate untuk menjalankan interaksi ORM dengan database
RUN bun prisma generate

# Step 7: Menjalankan migrasi di production
RUN bunx prisma migrate deploy

# Step 8: Hanya menjalankan sebuah perintah di WORKDIR ketika container dijalankan
CMD [ "bunx", "dev", "src/index.ts" ]