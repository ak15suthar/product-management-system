# Product Management System - Backend

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)

## Database Setup on Another PC

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/).

### 2. Create the Database

```bash
# macOS / Linux (Homebrew) — default user is your system username
psql -d postgres -c "CREATE DATABASE product_management;"

# Linux (apt) — default user is 'postgres'
sudo -u postgres psql -c "CREATE DATABASE product_management;"
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to match your PostgreSQL credentials:

```bash
# macOS (Homebrew) — no password, uses system user
DATABASE_URL="postgresql://your_username@localhost:5432/product_management?schema=public"

# Linux / Docker with password
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/product_management?schema=public"
```

### 4. Install Dependencies and Migrate

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the Server

```bash
npm run dev    # development (auto-reload)
npm run build && npm start    # production
```

## Default Seed Data

After seeding, the following data is available:

| Email | Password | Role |
|---|---|---|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |

**Categories:** Electronics, Clothing, Books, Home & Garden, Sports, Toys, Automotive, Health & Beauty

**Products:** 10 sample products across categories

## Database Schema

```
users        — id, uuid, email, password, name, role, timestamps
categories   — id, uuid, name, timestamps
products     — id, uuid, name, image, price, categoryId (FK), timestamps
```

## Useful Commands

```bash
npx prisma studio          # Open Prisma Studio (visual DB browser)
npx prisma migrate diff    # Compare schema with database
npx prisma db pull         # Introspect existing DB into schema
```

## Sharing Database Data Between PCs

### Option A: SQL Dump (recommended)

**Export from PC 1:**
```bash
pg_dump -U your_username -d product_management > product_management.sql
```

**Import on PC 2:**
```bash
psql -U your_username -d postgres -c "CREATE DATABASE product_management;"
psql -U your_username -d product_management < product_management.sql
```

### Option B: Re-seed

If you only need the seed data (no custom data), just run:
```bash
npx prisma migrate dev
npx prisma db seed
```

### Option C: Docker (same config everywhere)

```bash
docker run --name pg-pms -e POSTGRES_DB=product_management -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

Then use: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_management?schema=public"`
