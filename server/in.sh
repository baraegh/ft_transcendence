#!/bin/bash
# npm install --force #
npm rebuild argon2 --build-from-source

npx prisma generate
npx prisma migrate dev
npm run build
exec "$@"