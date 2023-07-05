#!/bin/sh

npx prisma migrate deploy
npm run start:dev
npm rebuild argon2 --build-from-source
exec "$@"