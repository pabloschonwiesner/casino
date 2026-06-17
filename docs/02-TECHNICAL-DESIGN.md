#  Casino — Technical Design

## 1. Architecture Overview

 Casino is built as a monorepo with separate frontend and backend applications.

```text
/
  frontend/
  backend/
  docs/
```

The frontend is a React SPA. The backend is a NestJS REST API. PostgreSQL stores normalized application data. Prisma manages schema, migrations, and database access.

## 2. Technology Stack

### Frontend

- React
- Vite
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui-compatible styling
- React Hook Form
- Zod
- Vitest
- React Testing Library

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Passport JWT
- bcryptjs
- class-validator
- class-transformer
- Helmet
- @nestjs/throttler
- Swagger/OpenAPI
- Jest
- Supertest

### Deployment

- Render PostgreSQL
- Render Web Service for backend
- Render Static Site for frontend

## 3. Frontend Architecture

The frontend is organized by feature and reusable components.

Recommended structure:

```text
frontend/src
  api/
  components/
    balance/
    games/
    layout/
    slots/
  hooks/
  pages/
  routes/
  types/
```

Authenticated users use a persistent layout with a top navbar that shows the current user, current balance, currency conversion controls, and logout.

### Routing

Routes:

```text
/ -> redirect to /games
/games
/login
/register
/slot-machine/:gameSlug
```

Protected routes use `ProtectedRoute` and redirect unauthenticated users to login with a safe `redirectTo` parameter.

### Server State

TanStack Query is used for server state:

- games catalog;
- game detail;
- spin history;
- countries;
- currencies.

Mutations invalidate affected queries.

### Auth State

`AuthProvider` owns authenticated user state.

Startup behavior:

- call `GET /auth/me`;
- if 200, set authenticated user;
- if 401, treat as guest.

JWT is not accessible to frontend JavaScript because it is stored in an HttpOnly cookie.

Protected backend routes can rely on `req.user`; the frontend authenticated layout consumes the authenticated user returned by `/auth/me`.

## 4. Backend Architecture

Recommended module structure:

```text
backend/src
  auth/
  common/
  countries/
  currencies/
  exchange-rates/
  favorites/
  games/
  prisma/
  slots/
  users/
```

### Main Backend Responsibilities

- authentication;
- validation;
- database persistence;
- game catalog and search;
- favorites;
- slot spin transaction;
- spin history;
- balance conversion;
- security controls;
- API documentation.

## 5. Authentication Design

Authentication uses JWT stored in an HttpOnly cookie named `access_token`.

Cookie rules:

```text
HttpOnly: true
SameSite: Lax
Secure: true in production
Path: /
```

JWT payload:

```ts
{
  sub: string;
  email: string;
}
```

The JWT payload is intentionally minimal. Tenant/roles are not needed for this MVP.

## 6. API Authentication Types

### Public

No authentication required.

```text
POST /auth/register
POST /auth/login
GET /countries
GET /currencies
```

### Protected

Requires valid JWT cookie.

```text
GET /auth/me
POST /auth/logout
POST /favorites/:gameId
DELETE /favorites/:gameId
POST /slots/spin
GET /slots/history
POST /users/me/balance/convert
```

### Optional Authentication

Uses authenticated user if cookie is valid, otherwise behaves as guest.

```text
GET /games
GET /games/:slug
```

Missing, invalid, or expired JWT cookie must behave as guest access for optional-auth endpoints.

## 7. Game Catalog Design

Game data is imported from `game-data.json` into PostgreSQL during seeding.

The frontend never imports `game-data.json` directly.

`GET /games` supports:

- optional auth;
- search by title and provider;
- pagination;
- guest ordering by title;
- authenticated ordering by favorite first, then title;
- public guest cache for 60 seconds.

## 8. Slot Machine Design

All games use the same shared Slot Machine engine.

The selected game affects:

- page title;
- provider display;
- thumbnail display;
- stored `gameId` in spin history.

The selected game does not affect:

- reels;
- payout rules;
- bet values;
- balance logic.

Spin execution must be transactional:

1. validate game;
2. validate balance;
3. select random reel symbols;
4. calculate payout;
5. update user balance conditionally;
6. insert spin history;
7. return result.

## 9. Currency Conversion Design

The stored balance remains virtual coins.

For MVP:

```text
1 coin = 1 USD
```

Currency conversion is display-only and performed by the backend.

Exchange rates are cached server-side for 1 hour.

## 10. Security Design

Security controls:

- Helmet;
- restricted CORS;
- HttpOnly JWT cookie;
- global ValidationPipe;
- DTO validation;
- guards;
- optional guard;
- rate limiting;
- safe errors;
- request logging without sensitive data.

## 11. Accessibility and Dark Mode

The UI must be:

- keyboard accessible;
- screen-reader-friendly;
- visible-focus-friendly;
- readable in light and dark mode.

Dark mode uses browser/system preference.

Tailwind configuration:

```js
darkMode: "media"
```

No manual theme toggle is included in the MVP.

## 12. Error Handling

Standard error principles:

- no stack traces in API responses;
- no raw database errors;
- no auth internals;
- clear status codes;
- safe messages.

Common messages:

```text
Invalid email or password.
Game not found.
Insufficient balance.
Unsupported currency.
```

## 13. Deployment Design

Render services:

- PostgreSQL database;
- backend Web Service;
- frontend Static Site.

Production must set:

- `DATABASE_URL`;
- `JWT_SECRET`;
- `FRONTEND_URL`;
- exchange rate configuration.

Frontend uses:

- `VITE_API_BASE_URL`.
