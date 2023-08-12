#!/bin/bash
npm rebuild argon2 --build-from-source

npx prisma generate
npx prisma migrate dev
exec "$@"