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

### Core Functionality
- **Game Catalog** - Public game listing with search and pagination
- **Search** - Backend search by title and provider with debouncing
- **Authentication** - Secure registration and login with JWT HttpOnly cookies
- **Slot Machine** - Protected slot gameplay with virtual coin balance
- **Favorites** - Save and manage favorite games
- **Spin History** - View past spins with results and balance changes
- **Currency Conversion** - Display-only balance conversion to multiple currencies

### Slot Machine Rules
- **Fixed Reels**: `['cherry', 'lemon', 'apple', 'banana']`
- **Payout Table**:
  - 🍒🍒🍒 (cherry_cherry_cherry) = 50x bet
  - 🍒🍒🍋 (cherry_cherry_lemon) = 40x bet
  - 🍒🍒 (cherry_cherry_*) = 10x bet
  - 🍎🍎🍎 (apple_apple_apple) = 20x bet
  - 🍌🍌🍌 (banana_banana_banana) = 15x bet
  - 🍋🍋🍋 (lemon_lemon_lemon) = 3x bet
- **Win Rules**:
  - Wins are consecutive from the left only
  - Only the highest applicable payout is awarded
  - 2 lemons do NOT win (business rule)
  - Wins are NOT cumulative

### Security Features
- JWT authentication with HttpOnly cookies
- Secure cookies in production (HTTPS)
- SameSite=Lax cookie policy
- Input validation with DTOs
- Helmet security headers
- Restricted CORS (no wildcards)
- Rate limiting (global + endpoint-specific)
- Safe error responses (no stack traces)
- Request logging without sensitive data

### Technical Features
- API validation with class-validator
- Swagger/OpenAPI documentation
- System-preference dark mode
- Accessible UI components
- Responsive design
- Optimistic UI updates
- Error boundaries
- Loading states

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
DATABASE_URL=postgresql://user:password@host:5432/casino
JWT_SECRET=your-strong-random-secret-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
MASSIVE_API_BASE_URL=https://api.polygon.io
MASSIVE_API_KEY=your-polygon-api-key-here
PORT=3000
```

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret for JWT signing
- `FRONTEND_URL` - Frontend URL for CORS (no wildcards)

**Optional:**
- `MASSIVE_API_BASE_URL` - Polygon.io API base URL (defaults to https://api.polygon.io)
- `MASSIVE_API_KEY` - Polygon.io API key for real forex rates (falls back to mock rates if not set)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (defaults to 3000)

### Frontend

```env
VITE_API_URL=http://localhost:3000
```

**Required:**
- `VITE_API_URL` - Backend API base URL

## Database Migrations and Seeding

### Run Migrations

```bash
cd backend
npx prisma migrate dev
```

### Seed Database

```bash
cd backend
npm run db:seed
```

The seed script populates:
- Countries (US, CA, GB, etc.)
- Currencies (USD, EUR, GBP, etc.)
- Game types (Slots, Roulette, Blackjack, etc.)
- Sample games with providers and metadata

## Testing

### Backend Tests

```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
npm run test:watch    # Watch mode
```

**Test Coverage:**
- `SlotsService` - Payout calculations, spin validation, reel logic
- `AuthService` - Registration, login, password hashing
- `CurrenciesService` - Currency conversion, exchange rate caching
- E2E flows - Complete registration and spin flows with persistence

### Frontend Tests

```bash
cd frontend
npm run test
```

## API Documentation

Interactive Swagger/OpenAPI documentation is available at:

```text
http://localhost:3000/api/docs
```

Features:
- Cookie authentication testing
- Request/response schemas
- Try-it-out functionality
- Rate limiting information
- Error response examples

## Deployment

### Render Deployment

This project is configured for deployment on Render using the included `render.yaml` blueprint.

#### Prerequisites

1. Create a Render account
2. Fork/clone this repository
3. Obtain a Polygon.io API key (optional, for real forex rates)

#### Deploy Steps

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select this repository

2. **Configure Environment Variables**
   
   Backend service will need:
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://casino-frontend.onrender.com`)
   - `MASSIVE_API_KEY` - Your Polygon.io API key (optional)

   Frontend service will need:
   - `VITE_API_URL` - Your backend URL (e.g., `https://casino-backend.onrender.com`)

3. **Deploy**
   - Render will automatically:
     - Create PostgreSQL database
     - Deploy backend service
     - Run migrations
     - Deploy frontend static site

#### Manual Deployment Commands

**Backend:**
```bash
# Build
npm install && npx prisma generate && npm run build

# Start (with migrations)
npx prisma migrate deploy && npm run start:prod
```

**Frontend:**
```bash
# Build
npm install && npm run build

# Publish directory: dist
```

#### Post-Deployment

1. Access backend API docs at `<backend-url>/api/docs`
2. Run seed script manually if needed:
   ```bash
   npm run db:seed
   ```
3. Test registration and login flows
4. Verify CORS configuration

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

This project was developed with AI assistance following a light Spec-Driven Development (SDD) workflow.

**AI was used for:**
- Requirements analysis and clarification
- Architecture design discussions
- Technical design documentation
- Task breakdown and planning
- Code implementation assistance
- Test strategy and test writing
- Documentation generation
- Debugging and troubleshooting
- Best practices recommendations

**Developer responsibilities:**
- Final code review and validation
- Business logic verification
- Security review
- Testing execution and verification
- Deployment configuration
- Production readiness assessment

**Transparency:**
All AI usage is documented in `docs/06-AI-USAGE-DISCLOSURE.md` with details on:
- Specific AI contributions
- Human oversight and validation
- Decision-making process
- Quality assurance measures

## Assessment Requirement Mapping

| Requirement | Implementation | Location |
| --- | --- | --- |
| **Backend API** | NestJS REST API with TypeScript | `backend/src/` |
| **Frontend** | React + Vite + TypeScript | `frontend/src/` |
| **Database** | PostgreSQL + Prisma ORM | `backend/prisma/` |
| **Game Listing** | `GET /games` with pagination | `backend/src/games/` |
| **Search** | Backend search by title/provider | `backend/src/games/games.service.ts` |
| **Authentication** | JWT with HttpOnly cookies | `backend/src/auth/` |
| **Registration** | `POST /auth/register` | `backend/src/auth/auth.controller.ts` |
| **Login** | `POST /auth/login` | `backend/src/auth/auth.controller.ts` |
| **Slot Machine** | Protected slot gameplay | `frontend/src/pages/SlotMachine.tsx` |
| **Spin Logic** | Backend payout calculation | `backend/src/slots/slots.service.ts` |
| **Spin Persistence** | `spin_history` table | `backend/prisma/schema.prisma` |
| **Balance Updates** | Transactional updates | `backend/src/slots/slots.service.ts` |
| **Favorites** | User favorite games | `backend/src/favorites/` |
| **Security** | Guards, validation, rate limiting, Helmet | `backend/src/` |
| **Input Validation** | DTOs with class-validator | `backend/src/**/dto/` |
| **Rate Limiting** | Global + endpoint-specific | `backend/src/app.module.ts` |
| **CORS** | Restricted to frontend URL | `backend/src/main.ts` |
| **Search Optimization** | Debounce, pagination | `frontend/src/hooks/useDebounce.ts` |
| **Currency Conversion** | Display-only with caching | `backend/src/currencies/` |
| **Forex Integration** | Adapter pattern with Polygon.io | `backend/src/currencies/adapters/` |
| **DB Design** | Normalized schema with relations | `backend/prisma/schema.prisma` |
| **Migrations** | Prisma migrations | `backend/prisma/migrations/` |
| **Seeding** | Sample data script | `backend/prisma/seed.ts` |
| **API Documentation** | Swagger/OpenAPI | `backend/src/main.ts` + controllers |
| **Testing** | Unit + E2E tests | `backend/src/**/*.spec.ts`, `backend/test/` |
| **AI Disclosure** | Full documentation | `docs/06-AI-USAGE-DISCLOSURE.md` |
| **Deployment** | Render blueprint | `render.yaml` |

## Known Limitations

### MVP Scope
- **Shared Slot Engine** - All slot games use the same reel configuration and paytable
- **Provider Integration** - Game provider `startUrl` is stored but not launched (would require iframe integration)
- **Display-Only Conversion** - Currency conversion is for display purposes only; actual balance remains in USD
- **Virtual Currency** - No real-money gambling; all transactions use virtual coins
- **Manual Testing** - No full browser E2E test suite (Playwright/Cypress)

### Features Not Included
- **Admin Panel** - No admin interface for game/user management
- **Manual Theme Toggle** - Dark mode follows system preference only
- **Social Features** - No chat, leaderboards, or multiplayer
- **Payment Integration** - No deposit/withdrawal functionality
- **Advanced Analytics** - Basic logging only, no comprehensive analytics dashboard
- **Email Notifications** - No email verification or notifications
- **Password Reset** - No password recovery flow
- **Profile Management** - Limited user profile customization

### Technical Limitations
- **Forex API** - Falls back to mock rates if Polygon.io API key not configured
- **Rate Limiting** - Simple in-memory rate limiting (not distributed)
- **Session Management** - No session revocation or device management
- **File Uploads** - No avatar or document upload functionality

## Future Improvements

### High Priority
- **Admin Dashboard** - Game management, user management, analytics
- **Configurable Slots** - Per-game paytables and reel configurations
- **Email System** - Verification, notifications, password reset
- **Enhanced Testing** - Full E2E browser test suite with Playwright
- **CI/CD Pipeline** - Automated testing and deployment

### Medium Priority
- **Social Features** - Leaderboards, achievements, user profiles
- **Advanced Analytics** - Player behavior tracking, game performance metrics
- **Multi-language Support** - i18n for international users
- **Mobile App** - React Native mobile application
- **Game Variety** - Additional game types (Roulette, Blackjack, Poker)

### Low Priority
- **Real-time Features** - WebSocket support for live updates
- **Tournament System** - Scheduled slot tournaments
- **Loyalty Program** - Points, rewards, VIP tiers
- **Advanced Security** - 2FA, device fingerprinting, fraud detection
- **Performance Optimization** - CDN, caching strategies, database optimization

## Project Structure

```text
casino/
├── backend/                 # NestJS backend
│   ├── prisma/             # Database schema and migrations
│   │   ├── migrations/     # Prisma migrations
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed script
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── common/         # Shared utilities and middleware
│   │   ├── countries/      # Countries module
│   │   ├── currencies/     # Currency conversion module
│   │   ├── favorites/      # Favorites module
│   │   ├── games/          # Games catalog module
│   │   ├── prisma/         # Prisma service
│   │   └── slots/          # Slot machine module
│   └── test/               # E2E tests
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── api/            # API client functions
│       ├── components/     # React components
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       └── types/          # TypeScript types
├── docs/                   # Project documentation
│   ├── tasks/              # Task breakdown
│   ├── 01-PRD.md          # Product requirements
│   ├── 02-TECHNICAL-DESIGN.md
│   ├── 03-DATABASE-DESIGN.md
│   ├── 04-API-SPEC.md
│   └── 06-AI-USAGE-DISCLOSURE.md
└── render.yaml            # Render deployment blueprint

```

## Contributing

This is an assessment project and is not open for contributions.

## License

This project is for assessment purposes only.
