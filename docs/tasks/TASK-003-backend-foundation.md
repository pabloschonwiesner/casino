# TASK-003 — Backend Foundation

## Goal

Prepare NestJS backend foundation.

## Scope

- ConfigModule.
- PrismaModule.
- Global ValidationPipe.
- Helmet.
- CORS.
- basic request logging foundation.
- basic root/health endpoint.

## Required Backend Features

```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
app.use(helmet());
app.enableCors({ origin: FRONTEND_URL, credentials: true });
```

## Acceptance Criteria

- backend starts.
- config loads from env.
- validation pipe enabled.
- Helmet enabled.
- CORS configured with frontend URL.
- Prisma module available.

## Suggested Commit

```bash
git add .
git commit -m "chore: add backend foundation"
```
