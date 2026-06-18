# Database Setup Guide

## Prerequisites

- PostgreSQL 14 or higher installed and running
- Node.js and npm installed

## Setup Steps

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE casino_db;

# Exit psql
\q
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/casino_db
```

### 3. Run Migrations

Apply the database schema:

```bash
npx prisma migrate deploy
```

Or for development (creates migration if needed):

```bash
npx prisma migrate dev
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Seed the Database

Populate the database with initial data:

```bash
npm run db:seed
```

This will seed:
- 10 currencies (USD, EUR, GBP, ARS, BRL, CAD, JPY, AUD, CHF, MXN)
- 10 countries (MT, GB, US, AR, BR, CA, JP, AU, CH, MX)
- 1 game type (slot)
- 12 games from `game-data.json`
- Game availability for all games in all countries

## Verify Setup

Check that tables were created:

```bash
npx prisma studio
```

Or connect with psql:

```bash
psql -U postgres -d casino_db

# List tables
\dt

# Check seeded data
SELECT COUNT(*) FROM currencies;
SELECT COUNT(*) FROM countries;
SELECT COUNT(*) FROM games;
SELECT COUNT(*) FROM game_countries;
```

## Troubleshooting

### Connection Issues

If you get connection errors:
- Verify PostgreSQL is running
- Check your DATABASE_URL credentials
- Ensure the database exists

### Migration Errors

If migrations fail:
- Check PostgreSQL version (14+ required)
- Verify database permissions
- Review migration logs

### Seed Errors

If seeding fails:
- Ensure migrations ran successfully
- Check that `game-data.json` exists in `prisma/` directory
- Verify all foreign key relationships

## Reset Database

To reset the database (WARNING: deletes all data):

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Run all migrations
4. Run the seed script
