#  Casino — Product Requirements Document

## 1. Product Overview

 Casino is a fullstack casino-style web application where users can browse a catalog of games, search games by title or provider, register/login, mark games as favorites, and play a virtual-coin Slot Machine.

The product is designed as a technical MVP that demonstrates a complete fullstack flow using React, NestJS, PostgreSQL, Prisma, authentication, validation, security hardening, persistent gameplay history, API documentation, deployment, and a light AI-assisted SDD workflow.

## 2. Product Purpose

The purpose of  Casino is to provide a simple but complete casino-style experience:

- public users can browse and search games;
- registered users can access protected gameplay;
- authenticated users see a persistent top navbar with their user info, current balance, and logout;
- authenticated users can favorite games;
- the Slot Machine uses virtual coins, fixed reels, payout rules, and persistent spin history;
- users can view their current virtual balance converted into another currency for display only.

## 3. Target Users

Primary users:

- guests browsing the casino catalog;
- registered users playing with virtual coins;
- reviewers evaluating the technical implementation.

## 4. Product Goals

- Provide a mobile-first game catalog.
- Serve game data from the backend, not directly from static frontend files.
- Support backend-powered search while typing.
- Implement secure authentication with JWT and HttpOnly cookies.
- Protect Slot Machine gameplay behind authentication.
- Persist every spin with user, game, reels, bet, payout, balances, and timestamp.
- Demonstrate normalized database design.
- Include security, validation, rate limiting, and error handling.
- Include API documentation and focused tests.
- Clearly disclose AI-assisted development.

## 5. In Scope

- React frontend.
- NestJS backend.
- PostgreSQL database.
- Prisma ORM.
- Game catalog imported from `game-data.json`.
- Backend REST API for games.
- Backend search endpoint.
- Register, login, logout, and current user.
- JWT authentication stored in HttpOnly cookie.
- Favorite games.
- Protected Slot Machine page.
- Virtual coin balance starting at 20.00 coins.
- Bet amounts from 0.50 to 5.00.
- Fixed Slot Machine reels and payout rules.
- Persistent spin history.
- Currency conversion display-only feature.
- Security hardening.
- Swagger/OpenAPI documentation.
- Focused testing strategy.
- Cloud deployment.

## 6. Out of Scope

- Real-money gambling.
- Deposits or withdrawals.
- Payment processing.
- Admin panel.
- OAuth login.
- Email verification.
- Refresh-token rotation.
- Manual dark mode toggle.
- Configurable slot engines per game.
- Real external game launch integration.
- Full browser E2E automation.
- CI/CD pipeline.

## 7. Assumptions

- The application uses virtual coins only.
- 1 coin equals 1 USD for conversion purposes.
- Currency conversion is display-only and never modifies stored balance.
- A new user starts with 20.00 coins.
- All games from `game-data.json` are imported into the database.
- Imported games are assigned the `slot` game type during the MVP.
- Imported games are available in all seeded countries during the MVP.
- Missing thumbnails are allowed and handled with a UI fallback.
- `startUrl` may be stored but is not launched during the MVP.
- The Slot Machine engine is shared by all catalog games.
- The selected catalog game provides visual context and `gameId` for spin history.
- Country is selected during registration.
- Email verification is out of scope.

## 8. Functional Requirements

### 8.1 Game Catalog

Users can browse all active games.

Guests see:

- all active games;
- no favorite controls;
- `isFavorite: false` in API responses.

Authenticated users see:

- active games available in their registered country;
- favorite state per game;
- favorite games first.

Each game card shows:

- thumbnail or `No image` fallback;
- title;
- provider name;
- game type badge.

### 8.2 Search

Users can search games by title or provider.

Search is performed by the backend through `GET /games?q=...`.

Frontend behavior:

- search while typing;
- 500ms debounce;
- reset to page 1 when search changes;
- keep previous results visible while fetching;
- clear search button.

### 8.3 Authentication

Users can register and login.

Registration requires:

- email;
- password;
- country.

Login requires:

- email;
- password.

Authentication behavior:

- JWT stored in HttpOnly cookie;
- no JWT stored in localStorage;
- protected routes redirect to login;
- login/register preserve safe `redirectTo` behavior.

### 8.4 Favorites

Authenticated users can favorite and unfavorite games.

Guest users do not see favorite UI.

Favorite behavior:

- `POST /favorites/:gameId` marks a game as favorite;
- `DELETE /favorites/:gameId` removes favorite;
- both actions are idempotent;
- catalog refreshes after mutation.

### 8.5 Slot Machine

Authenticated users can open `/slot-machine/:gameSlug`.

The page loads selected game detail and renders a shared Slot Machine engine.

Users can:

- select a bet amount;
- spin reels;
- see reel result;
- see win/loss result;
- see updated balance;
- see recent spin history.

Every spin must be persisted.

### 8.6 Currency Conversion

Authenticated users can convert their current virtual coin balance to another currency for display only.

The conversion UI is available from the authenticated top navbar during the whole session.

Rules:

- stored balance remains unchanged;
- conversion is performed by backend;
- exchange rates are cached server-side;
- UI clearly shows display-only warning.

## 9. Non-Functional Requirements

- Mobile-first responsive layout.
- Accessible keyboard navigation.
- System-preference dark mode using `prefers-color-scheme`.
- Clear loading, error, and empty states.
- Backend request validation.
- Security headers.
- Rate limiting.
- Safe error responses.
- Structured, maintainable folders.
- Comprehensive README.

## 10. Success Criteria

The MVP is successful when a reviewer can:

- open the deployed frontend;
- browse backend-powered game data;
- search games;
- register and login;
- favorite a game;
- open a protected Slot Machine page;
- spin, update balance, and persist history;
- convert balance for display;
- inspect Swagger documentation;
- run local setup from README;
- understand AI usage and technical decisions.
