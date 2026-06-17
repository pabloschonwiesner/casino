#  Casino — Technical Decisions

## TD-001 — Use a Monorepo

### Decision

Use a monorepo with separate `frontend` and `backend` directories.

### Reason

The assessment is easier to review when frontend, backend, docs, and tasks live in one repository.

---

## TD-002 — Use Render for Deployment

### Decision

Deploy PostgreSQL, backend, and frontend on Render.

### Reason

Render is simple and suitable for a technical assessment.

---

## TD-003 — Use React + Vite

### Decision

Use React with Vite instead of Next.js.

### Reason

The assessment allows React or Next.js. Vite keeps the frontend simple as a SPA.

---

## TD-004 — Use NestJS

### Decision

Use NestJS for the backend.

### Reason

NestJS provides structure, validation, guards, modules, and Swagger support.

---

## TD-005 — Use PostgreSQL + Prisma

### Decision

Use PostgreSQL as the primary database and Prisma as ORM.

### Reason

The assessment requires PostgreSQL and Prisma provides safe migrations and typed database access.

---

## TD-006 — Seed Game Data into the Database

### Decision

Import `game-data.json` into PostgreSQL during seeding.

### Reason

Game listing must be served by backend REST API, not frontend static data.

---

## TD-007 — Use JWT in HttpOnly Cookie

### Decision

Store JWT in an HttpOnly cookie named `access_token`.

### Reason

This avoids storing JWT in localStorage and improves security.

---

## TD-008 — Auto-Login After Registration

### Decision

After successful registration, set the auth cookie and return the authenticated user.

### Reason

This reduces friction for the MVP.

---

## TD-009 — Use Minimal JWT Payload

### Decision

JWT payload contains only `sub` and `email`.

### Reason

The MVP does not need roles or tenant data.

---

## TD-010 — Use Optional Authentication for Catalog

### Decision

`GET /games` and `GET /games/:slug` support optional authentication.

### Reason

Guests can browse games while authenticated users get country filtering and favorite state.

---

## TD-011 — Use Backend-Owned Search

### Decision

Search is performed by the backend via `GET /games?q=...`.

### Reason

The assessment requires backend filtering through a dedicated REST endpoint.

---

## TD-012 — Use 500ms Frontend Debounce

### Decision

Debounce catalog search by 500ms.

### Reason

This improves UX and reduces unnecessary API calls.

---

## TD-013 — Cache Public Game Catalog Responses

### Decision

Cache guest catalog responses for 60 seconds.

### Reason

Public catalog results are safe to cache and demonstrate search optimization.

---

## TD-014 — Show Favorites First for Authenticated Users

### Decision

Authenticated catalog results are ordered by favorite state first, then title.

### Reason

This makes favorites immediately useful without requiring a separate page.

---

## TD-015 — Use Card Button for GameCard

### Decision

`GameCard` uses `<button type="button">`.

### Reason

The card is an interactive action and should be keyboard accessible.

---

## TD-016 — Use System-Preference Dark Mode

### Decision

Use Tailwind `darkMode: "media"`.

### Reason

The app respects browser/OS preference without adding a manual theme toggle.

---

## TD-017 — Implement Favorites as a Separate Vertical Slice

### Decision

Implement favorite/unfavorite after catalog.

### Reason

Favorites depend on auth and catalog response state.

---

## TD-018 — Make Favorite Actions Idempotent

### Decision

`POST /favorites/:gameId` and `DELETE /favorites/:gameId` are idempotent.

### Reason

Idempotency simplifies frontend retries and repeated clicks.

---

## TD-019 — Use Shared Slot Engine

### Decision

All games use the same Slot Machine engine in the MVP.

### Reason

The assessment requires one slot implementation, not unique gameplay per game.

---

## TD-020 — Store Selected Game ID in Spin History

### Decision

Spin history stores the selected `gameId`.

### Reason

This links gameplay to the selected catalog game while using a shared engine.

---

## TD-021 — Deduct Bet Before Winnings

### Decision

Calculate `netAmount = payoutAmount - betAmount`.

### Reason

The assessment requires deducting the bet before applying winnings.

---

## TD-022 — Use Transactional Conditional Balance Update

### Decision

Spin execution uses a Prisma transaction and conditional update.

### Reason

This prevents race conditions and protects balance correctness.

---

## TD-023 — Persist Spin History as Append-Only

### Decision

Every spin creates a permanent `spin_history` record.

### Reason

The assessment requires every spin to be persisted.

---

## TD-024 — Use Math.random for MVP

### Decision

Use `Math.random()` for reel symbol selection.

### Reason

This is a virtual-coin technical assessment, not regulated real-money gambling.

---

## TD-025 — Show Slot Symbols with Emoji and Text

### Decision

Display symbols as emoji plus accessible text.

### Reason

Emoji improves game feel; text preserves accessibility.

---

## TD-026 — Keep Currency Conversion Display-Only

### Decision

Currency conversion does not change stored balance.

### Reason

The assessment asks for display conversion, not a multi-currency wallet.

---

## TD-027 — Perform Currency Conversion on Backend

### Decision

The backend calls the exchange rate provider.

### Reason

API keys and caching should not live in the frontend.

---

## TD-028 — Cache Exchange Rates for One Hour

### Decision

Cache USD-to-target exchange rates for 3600 seconds.

### Reason

This reduces external API calls and improves performance.

---

## TD-029 — Use Helmet and Strict Validation

### Decision

Enable Helmet and global ValidationPipe with whitelist and forbidNonWhitelisted.

### Reason

Security and validation are explicit assessment requirements.

---

## TD-030 — Apply Endpoint-Specific Rate Limiting

### Decision

Use stricter limits for login, register, and spin.

### Reason

These endpoints are more sensitive than public reads.

---

## TD-031 — Document API with Swagger

### Decision

Expose Swagger at `/api/docs`.

### Reason

Interactive API documentation improves reviewability.

---

## TD-032 — Focus Tests on Critical Business Rules

### Decision

Prioritize slot payout, auth, catalog, favorites, conversion, and key UI tests.

### Reason

Meaningful tests are better than artificial coverage targets.

---

## TD-033 — No Strict Global Coverage Threshold

### Decision

Do not enforce a global coverage percentage.

### Reason

The MVP should focus on important tests, not arbitrary metrics.

---

## TD-034 — Include AI Usage Disclosure

### Decision

Document how AI was used.

### Reason

The assessment allows AI usage and asks for transparent disclosure.

---

## TD-035 — Document Known Limitations

### Decision

README must include known limitations.

### Reason

Clear boundaries make the MVP look intentional and professional.
