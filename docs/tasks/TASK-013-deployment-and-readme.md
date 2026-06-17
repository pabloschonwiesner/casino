# TASK-013 — Deployment and README

## Goal

Prepare project for final submission with deployment and comprehensive README.

## Deployment

Use Render:

- PostgreSQL database;
- backend Web Service;
- frontend Static Site.

## Backend

Build:

```bash
npm install && npx prisma generate && npm run build
```

Start:

```bash
npx prisma migrate deploy && npm run start:prod
```

## Frontend

Build:

```bash
npm install && npm run build
```

Publish directory:

```text
dist
```

## README Must Include

- live demo links;
- overview;
- tech stack;
- features;
- setup;
- env vars;
- migrations/seed;
- testing;
- API docs;
- security;
- AI usage;
- requirement mapping;
- known limitations;
- future improvements.

## Acceptance Criteria

- frontend deployed.
- backend deployed.
- PostgreSQL deployed.
- migrations run.
- seed run.
- API docs available.
- README complete.
- final project ready to submit.

## Suggested Commit

```bash
git add .
git commit -m "docs: finalize deployment and README"
```
