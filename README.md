# Casino

Casino is a fullstack casino-style MVP built with React, NestJS, PostgreSQL, Prisma, TypeScript, and a light AI-assisted SDD workflow.

It includes a backend-powered game catalog, search, authentication, favorite games, a virtual-coin Slot Machine, spin history, display-only currency conversion, security hardening, API documentation, testing strategy, and deployment planning.

## Live Demo

Replace these after deployment:

- Frontend: `<frontend-url>`
- Backend: `<backend-url>`
- API Docs: `<backend-url>/api/docs`

## Tech Stack

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
- JWT authentication
- HttpOnly cookies
- class-validator
- Helmet
- @nestjs/throttler
- Swagger/OpenAPI
- Jest
- Supertest

## Features

- Public game catalog loaded from backend.
- Backend search by title and provider.
- Pagination.
- Registration and login.
- JWT stored in HttpOnly cookie.
- Protected Slot Machine page.
- Virtual coin balance.
- Favorite games.
- Spin history.
- Display-only currency conversion.
- API validation.
- Rate limiting.
- Security headers.
- API documentation.
- System-preference dark mode.
- Accessibility-focused UI components.

## Architecture

```text
/
  frontend/
  backend/
  docs/
```

The frontend communicates with the backend through REST APIs. The backend owns authentication, validation, game data, balance updates, spin persistence, favorites, and currency conversion.

## Database

The database is PostgreSQL and is managed with Prisma migrations.

Main entities:

- users
- games
- game_types
- countries
- currencies
- game_countries
- user_favorite_games
- spin_history

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EXCHANGE_RATE_API_URL=
EXCHANGE_RATE_API_KEY=
EXCHANGE_RATE_CACHE_TTL_SECONDS=3600
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Testing

Backend:

```bash
cd backend
npm run test
npm run test:e2e
```

Frontend:

```bash
cd frontend
npm run test
```

## API Documentation

Swagger documentation is available at:

```text
/api/docs
```

## Security

The application includes:

- JWT authentication;
- HttpOnly cookies;
- Secure cookies in production;
- SameSite=Lax cookie policy;
- DTO validation;
- Helmet security headers;
- restricted CORS;
- rate limiting;
- safe error responses;
- request logging without sensitive data.

## AI Usage

AI was used as a development assistant for requirements analysis, architecture discussion, task breakdown, documentation, and test planning.

The developer remains responsible for final implementation, validation, testing, and deployment.

See:

```text
docs/06-AI-USAGE-DISCLOSURE.md
```

## Assessment Requirement Mapping

| Requirement | Implementation |
| --- | --- |
| Backend API | NestJS REST API |
| Frontend | React + Vite |
| Database | PostgreSQL + Prisma |
| Game listing | `GET /games` |
| Search | Backend `q` search |
| Authentication | Register/login/JWT cookie |
| Slot Machine | Protected `/slot-machine/:gameSlug` |
| Spin persistence | `spin_history` table |
| Security | Guards, validation, rate limiting, Helmet |
| Search optimization | Debounce, cache, pagination |
| Currency conversion | Display-only backend conversion |
| DB design | Normalized PostgreSQL schema |
| AI disclosure | `docs/06-AI-USAGE-DISCLOSURE.md` |
| Deployment | Render frontend/backend/PostgreSQL |

## Known Limitations

- Slot Machine uses a shared engine for all games.
- Game provider `startUrl` is stored but not launched in the MVP.
- Currency conversion is display-only.
- No real-money gambling is supported.
- No admin panel is included.
- No manual theme toggle is included; dark mode follows system preference.
- No full browser E2E suite in the MVP.

## Future Improvements

- Admin game management.
- Configurable slot paytables.
- Configurable slot reels.
- Real E2E browser tests.
- CI/CD pipeline.
- More advanced monitoring.
