#!/bin/bash
set -e

echo "=== Building Backend ==="
cd backend
npm install
npx prisma generate
npm run build
cd ..

echo "=== Building Frontend ==="
cd frontend
npm install
npx ng build --configuration production
cd ..

echo "=== Build Complete ==="
