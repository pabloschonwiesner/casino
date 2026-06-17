# TASK-004 — Database Model, Schema, and Seed

## Goal

Implement the PostgreSQL schema with Prisma and seed initial catalog data.

## Scope

- Define Prisma models.
- Create migrations.
- Add constraints and indexes.
- Seed currencies.
- Seed countries.
- Seed game types.
- Import games from `game-data.json`.
- Seed game availability.

## Required Tables

- currencies
- countries
- game_types
- games
- game_countries
- users
- user_favorite_games
- spin_history

## Seed Rules

- Seeds are idempotent.
- All imported games use game type `slot`.
- All imported games are available in all seeded countries.
- Missing thumbnails are allowed.
- countries include hardcoded `flagUrl` values in seed data.
- user balance is initialized in application code during registration.

## Acceptance Criteria

- Prisma schema exists.
- Migration exists.
- Seed script exists.
- Game data is imported.
- DB constraints and indexes are included.
- Backend can query seeded games.

## Suggested Commit

```bash
git add .
git commit -m "feat: add database schema and seed data"
```
