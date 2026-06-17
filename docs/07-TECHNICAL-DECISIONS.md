# Skivori Casino — Technical Decisions

This document records the main technical decisions made for the Skivori Casino MVP.

The goal is not to document every small implementation detail, but to make the architecture, trade-offs, and assessment-driven choices explicit and reviewable.

---

## TD-001 — Use a Monorepo

### Decision

Use a monorepo with separate `frontend` and `backend` directories.

### Reason

The assessment is easier to review when frontend, backend, docs, and task files live in one repository.

### Trade-offs

A monorepo is slightly larger than separate repositories, but it improves discoverability for a technical assessment.

---

## TD-002 — Use React + Vite for the Frontend

### Decision

Use React with Vite and TypeScript.

### Reason

The assessment allows React or Next.js. React + Vite keeps the frontend simple as a SPA and avoids unnecessary server-side rendering complexity.

### Trade-offs

Next.js would provide more built-in routing and deployment conventions, but Vite is lighter for this MVP.

---

## TD-003 — Use NestJS for the Backend

### Decision

Use NestJS with TypeScript for the backend.

### Reason

NestJS provides a clean modular architecture, controllers, services, guards, DTO validation, dependency injection, and Swagger support.

### Trade-offs

NestJS adds structure and boilerplate, but that structure is useful for a fullstack assessment.

---

## TD-004 — Use PostgreSQL as the Primary Database

### Decision

Use PostgreSQL as the primary database.

### Reason

The assessment requires PostgreSQL and the product needs relational modeling for users, games, countries, favorites, and spin history.

---

## TD-005 — Use Prisma as ORM and Migration Tool

### Decision

Use Prisma for schema modeling, migrations, and typed database access.

### Reason

Prisma provides good TypeScript integration and clear migration workflows.

### Trade-offs

Some database constraints may need manual migration SQL, but Prisma remains a good fit for the MVP.

---

## TD-006 — Seed `game-data.json` into PostgreSQL

### Decision

Import the provided `game-data.json` into the database during seeding.

### Reason

The assessment requires the game list to be served by the backend REST API, not loaded directly by the frontend.

---

## TD-007 — Assign Imported Games to a Slot Game Type

### Decision

All imported games are assigned to the `slot` game type in the MVP.

### Reason

The assessment provides game catalog data but only requires implementation of one Slot Machine game mechanic.

### Trade-offs

This is a simplification. Future versions could support multiple game engines and game types.

---

## TD-008 — Use Normalized Database Entities

### Decision

Use normalized tables for users, games, game types, countries, currencies, game availability, favorites, and spin history.

### Reason

The assessment asks for normalized database design with primary keys, foreign keys, indexes, and constraints.

---

## TD-009 — Store Money Values as Decimal Values and Return Strings in the API

### Decision

Store balances and amounts using decimal database fields and return money values as strings in API responses.

### Reason

This avoids floating-point ambiguity between backend and frontend.

---

## TD-010 — Use JWT Stored in an HttpOnly Cookie

### Decision

Store the JWT in an HttpOnly cookie named `access_token`.

### Reason

This avoids storing tokens in localStorage and improves security.

### Trade-offs

Cookie authentication requires CORS credentials configuration and careful production cookie settings.

---

## TD-011 — Auto-Login After Registration

### Decision

After successful registration, set the auth cookie and return the authenticated user.

### Reason

This reduces friction and keeps the MVP user flow simple.

---

## TD-012 — Use Minimal JWT Payload

### Decision

JWT payload contains minimal user data such as `sub` and `email`.

### Reason

The MVP does not require roles, permissions, or tenant data.

---

## TD-013 — Use `SameSite=Lax` for the Auth Cookie

### Decision

Use `SameSite=Lax` for the JWT cookie.

### Reason

This provides a reasonable default for the MVP while supporting normal navigation flows.

---

## TD-014 — Use Secure Cookies in Production

### Decision

Set cookie `Secure: true` in production and `Secure: false` in local development.

### Reason

Production deployments use HTTPS, while local development usually runs on HTTP.

---

## TD-015 — Use Optional Authentication for Catalog Endpoints

### Decision

`GET /games` and `GET /games/:slug` use optional authentication.

### Reason

Guests can browse the catalog, while authenticated users get country-filtered availability and favorite state.

---

## TD-016 — Treat Invalid Optional Auth as Guest Access

### Decision

For optional-auth catalog endpoints, missing, invalid, or expired cookies behave as guest access.

### Reason

The catalog should remain public and resilient even when auth state is unavailable.

---

## TD-017 — Use Backend-Owned Search

### Decision

Game search is performed by the backend through `GET /games?q=...`.

### Reason

The assessment explicitly asks for filtering through a dedicated backend REST endpoint.

---

## TD-018 — Search by Game Title and Provider Name

### Decision

Catalog search matches both game title and provider name.

### Reason

This makes search more useful while staying simple.

---

## TD-019 — Use 500ms Frontend Debounce for Search

### Decision

Debounce catalog search input by 500ms.

### Reason

This reduces unnecessary API calls while preserving responsive UX.

---

## TD-020 — Use Pagination for the Catalog

### Decision

`GET /games` supports `page` and `limit`.

### Reason

Pagination demonstrates search optimization and prevents large responses.

---

## TD-021 — Cache Public Catalog Responses for 60 Seconds

### Decision

Cache guest catalog responses for 60 seconds on the backend.

### Reason

Public catalog data is safe to cache and demonstrates backend optimization.

### Trade-offs

Authenticated catalog responses are not cached because they depend on user country and favorite state.

---

## TD-022 — Order Authenticated Catalog Results with Favorites First

### Decision

Authenticated catalog results are ordered by favorite state first, then by title.

### Reason

This makes favorites immediately useful without requiring a separate favorites page.

---

## TD-023 — Use a Two-Bucket Prisma Strategy for Favorite-First Pagination

### Decision

For authenticated catalog pagination, use Prisma queries to handle favorites and non-favorites as separate buckets when needed.

### Reason

This avoids unsafe raw SQL while preserving correct favorite-first pagination.

### Trade-offs

The service logic is slightly more complex, but the query behavior remains explicit and type-safe.

---

## TD-024 — Hide `startUrl` from Catalog List Responses

### Decision

`startUrl` is returned only by `GET /games/:slug`, not by `GET /games`.

### Reason

The list endpoint should return compact card data. Detail data is available only when needed.

---

## TD-025 — Use Slug for Frontend Game Routes and ID for Persistence

### Decision

Frontend routes use game `slug`, while database writes store internal `gameId`.

### Reason

Slugs create readable URLs, while IDs provide stable database relationships.

---

## TD-026 — Use Full Card Click for Game Selection

### Decision

The full game card is clickable. Do not add a separate Play button during the catalog task.

### Reason

The card has one primary action, so a separate button would duplicate behavior.

---

## TD-027 — Implement `GameCard` as a Button

### Decision

Use `<button type="button">` for clickable game cards.

### Reason

The card is an interactive action and should be keyboard accessible by default.

---

## TD-028 — Add Accessible Labels and Focus States to Game Cards

### Decision

Game cards include `aria-label`, visible focus states, image alt text, and readable fallback content.

### Reason

The catalog is the main product screen and must be usable with keyboard and assistive technology.

---

## TD-029 — Show Game Type as a Simple Badge

### Decision

Display `gameType.name` as a small badge on each game card.

### Reason

The badge makes the game type clear and demonstrates that the frontend uses normalized backend data.

---

## TD-030 — Use System-Preference Dark Mode

### Decision

Use Tailwind `darkMode: "media"`.

### Reason

The app respects the user's browser or operating system preference without adding a manual theme toggle.

### Trade-offs

Users cannot manually override the theme inside the app, but the MVP remains simpler.

---

## TD-031 — Do Not Add a Theme Toggle in the MVP

### Decision

Do not add a manual light/dark theme toggle.

### Reason

The user preference should come from the browser or OS, avoiding extra UI state and localStorage logic.

---

## TD-032 — Include Accessibility Checks in Catalog Acceptance Criteria

### Decision

Catalog acceptance criteria include keyboard accessibility, labels, focus states, readable states, and dark mode readability.

### Reason

Accessibility should be part of done, not optional polish.

---

## TD-033 — Add Manual Accessibility Validation

### Decision

Add a manual accessibility checklist to relevant task files.

### Reason

Some accessibility and dark mode checks are easier to validate manually in the MVP.

---

## TD-034 — Implement Favorites as a Dedicated Vertical Slice

### Decision

Implement favorites after the catalog as `TASK-007-favorites`.

### Reason

Favorites depend on authentication and catalog response state.

---

## TD-035 — Use Protected Favorite Endpoints

### Decision

Favorite and unfavorite endpoints require authentication.

### Reason

Favorites belong to a user account and cannot be managed by guests.

---

## TD-036 — Make Favorite and Unfavorite Actions Idempotent

### Decision

`POST /favorites/:gameId` returns `isFavorite: true` even if the favorite already exists. `DELETE /favorites/:gameId` returns `isFavorite: false` even if the favorite does not exist.

### Reason

Idempotent favorite actions simplify frontend retries and repeated clicks.

---

## TD-037 — Validate Game Availability Before Favoriting

### Decision

A user can favorite only games that exist, are active, and are available in the user's country.

### Reason

Favorite behavior should match catalog availability rules.

---

## TD-038 — Hide Favorite UI for Guests

### Decision

Favorite buttons are shown only to authenticated users.

### Reason

Guests cannot favorite games, so showing unavailable controls would be confusing.

---

## TD-039 — Invalidate Catalog Queries After Favorite Changes

### Decision

After favorite or unfavorite succeeds, invalidate `['games']` queries.

### Reason

The catalog response contains `isFavorite` and favorite-first ordering, so it should be refreshed after a mutation.

---

## TD-040 — Keep Favorite Button Accessible

### Decision

Favorite buttons use real buttons, `aria-label`, `aria-pressed`, visible focus states, and stop event propagation.

### Reason

Favorite controls are interactive elements and must not trigger the game card click accidentally.

---

## TD-041 — Implement Slot Machine as a Protected Vertical Slice

### Decision

Implement Slot Machine gameplay after catalog and favorites.

### Reason

Slot gameplay depends on authentication, selected game context, balance updates, and persistence.

---

## TD-042 — Use a Shared Slot Engine for All Games

### Decision

All catalog games use the same Slot Machine engine in the MVP.

### Reason

The assessment asks for a slot implementation, not separate gameplay per catalog game.

---

## TD-043 — Load Selected Game Detail in SlotMachinePage

### Decision

`SlotMachinePage` loads selected game context using `GET /games/:slug`.

### Reason

The route uses slug, while spin persistence requires the internal `gameId`.

---

## TD-044 — Validate Game Availability Before Spinning

### Decision

Before spinning, verify the selected game exists, is active, and is available in the user's country.

### Reason

Spin behavior should respect catalog availability rules.

---

## TD-045 — Use Exact Allowed Bet Amounts

### Decision

Accept only predefined bet amounts from `0.50` to `5.00` in `0.50` increments.

### Reason

This matches the assessment and reduces decimal edge cases.

---

## TD-046 — Deduct Bet Before Applying Winnings

### Decision

Calculate `netAmount = payoutAmount - betAmount`.

### Reason

The assessment explicitly requires deducting the bet before applying winnings.

---

## TD-047 — Use Consecutive-From-Left Payout Logic

### Decision

Only consecutive matching symbols from reel 1 count for payouts.

### Reason

This matches the assessment examples and prevents accidental cumulative wins.

---

## TD-048 — Treat Two Lemons as No Win

### Decision

Only three lemons win; two lemons do not win.

### Reason

The assessment payout table only defines a payout for three lemons.

---

## TD-049 — Persist Every Spin as Append-Only History

### Decision

Every spin creates a permanent `spin_history` record.

### Reason

The assessment requires every spin to be persisted with user, game, reels, amounts, balances, and timestamp.

---

## TD-050 — Use Transactional Conditional Balance Update

### Decision

Use a Prisma transaction and conditional balance update for spin execution.

### Reason

This prevents balance race conditions when multiple spin requests happen close together.

---

## TD-051 — Use `Math.random()` for MVP Reel Selection

### Decision

Use `Math.random()` for reel symbol selection.

### Reason

This is a virtual coin technical assessment, not regulated real-money gambling.

### Future Improvement

Use cryptographically secure randomness if real-money or regulated gameplay is introduced.

---

## TD-052 — Return Updated Balance from Spin Response

### Decision

`POST /slots/spin` returns `balanceBefore` and `balanceAfter`.

### Reason

The frontend can update the visible balance immediately without an extra balance request.

---

## TD-053 — Add Recent Spin History Endpoint

### Decision

Add `GET /slots/history?limit=10`.

### Reason

The user should see recent gameplay activity, and this demonstrates persisted spin history.

---

## TD-054 — Display Slot Symbols with Emoji and Accessible Text

### Decision

Display symbols as emoji plus text labels.

### Mapping

```text
cherry -> 🍒 Cherry
lemon -> 🍋 Lemon
apple -> 🍎 Apple
banana -> 🍌 Banana
```

### Reason

Emoji improves the game-like visual experience, while text labels preserve accessibility.

---

## TD-055 — Keep Currency Conversion Display-Only

### Decision

Currency conversion does not modify the stored user balance.

### Rule

For the MVP, `1 coin = 1 USD`.

### Reason

The assessment asks for display conversion, not multi-currency wallet behavior.

---

## TD-056 — Perform Currency Conversion on the Backend

### Decision

The backend calls the exchange rate provider and performs conversion.

### Reason

API keys, provider details, validation, and caching should stay on the backend.

---

## TD-057 — Add `GET /currencies`

### Decision

Add a public endpoint returning supported currencies.

### Reason

The frontend needs a reliable source for the conversion selector.

---

## TD-058 — Cache Exchange Rates for One Hour

### Decision

Cache USD-to-target exchange rates for 3600 seconds.

### Reason

Exchange rates do not need to be fetched on every conversion click.

---

## TD-059 — Convert Only When the User Clicks the Button

### Decision

The frontend does not auto-convert on every currency change. It converts only when the user clicks `Convert balance`.

### Reason

The assessment asks for a button and this avoids unnecessary API calls.

---

## TD-060 — Place Currency Conversion UI in SlotMachinePage

### Decision

Place the currency conversion UI inside the Slot Machine page.

### Reason

The balance is most relevant during gameplay.

---

## TD-061 — Enable Helmet Globally

### Decision

Enable Helmet in the NestJS backend.

### Reason

Helmet adds common HTTP security headers with minimal implementation cost.

---

## TD-062 — Restrict CORS by Environment

### Decision

Configure CORS using `FRONTEND_URL` and credentials.

### Reason

The frontend uses cookie authentication, so CORS must allow credentials only from the configured frontend origin.

---

## TD-063 — Use Strict Global ValidationPipe

### Decision

Use `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.

### Reason

This rejects unexpected fields, validates incoming data, and transforms query params into DTO types.

---

## TD-064 — Apply Endpoint-Specific Rate Limiting

### Decision

Use stricter limits for login, register, and slot spin endpoints.

### Reason

Auth and spin endpoints are more sensitive than public read endpoints.

---

## TD-065 — Never Log Sensitive Authentication Data

### Decision

Request logging must not include passwords, JWT tokens, cookies, or sensitive request bodies.

### Reason

Logs are useful for debugging but must not become a security risk.

---

## TD-066 — Keep Error Responses Safe

### Decision

Do not expose stack traces, raw database errors, or authentication internals in API responses.

### Reason

Safe error responses improve security while still giving users actionable feedback.

---

## TD-067 — Document API with Swagger/OpenAPI

### Decision

Expose Swagger documentation at `/api/docs`.

### Reason

Swagger gives reviewers an interactive way to inspect and test the backend API.

---

## TD-068 — Use Cookie Authentication in Swagger

### Decision

Configure Swagger with cookie auth for `access_token`.

### Reason

The backend uses JWT in HttpOnly cookies, not bearer tokens stored in localStorage.

---

## TD-069 — Add README API Summary and Curl Examples

### Decision

Add an API summary table and curl examples using a cookie jar.

### Reason

The README should be useful even without opening Swagger, and cookie-based testing needs clear examples.

---

## TD-070 — Focus Tests on Critical Business Rules

### Decision

Prioritize tests for slot payout rules, balance behavior, authentication, catalog behavior, favorites, and currency conversion.

### Reason

These areas carry the highest risk and best demonstrate engineering quality.

---

## TD-071 — Use a Persistent Authenticated Navbar

### Decision

Authenticated users see a persistent top navbar with current user, current balance, currency conversion controls, and logout.

### Reason

This keeps account actions and balance conversion available on every authenticated page instead of hiding them inside a single screen.

---

## TD-072 — Keep Request Logging Per Request and Non-Sensitive

### Decision

Log every backend request with non-sensitive metadata such as method, path, status code, duration, and userId when available.

### Reason

This gives useful observability without exposing passwords, cookies, JWTs, or raw request bodies.

---

## TD-071 — Do Not Enforce a Global Coverage Threshold

### Decision

Do not require a strict global coverage percentage for the MVP.

### Reason

Meaningful tests are more valuable than artificial coverage numbers in a technical assessment.

---

## TD-072 — Mock the External Exchange Rate API in Tests

### Decision

Tests must not call the real exchange rate provider.

### Reason

Tests should be deterministic, fast, and independent from external services.

---

## TD-073 — Keep Frontend Tests Component-Focused

### Decision

Use React Testing Library for component and light page interaction tests.

### Reason

The MVP does not need full browser E2E automation, but key UI behaviors should still be verified.

---

## TD-074 — Treat Manual Accessibility Validation as Part of Done

### Decision

Manual accessibility validation remains part of the completion checklist.

### Reason

Not every accessibility requirement needs automated testing in the MVP, but it should still be validated.

---

## TD-075 — Deploy the MVP on Render

### Decision

Use Render for frontend, backend, and PostgreSQL deployment.

### Reason

Render supports the required cloud deployment with low infrastructure complexity.

---

## TD-076 — Deploy Frontend as a Static Site

### Decision

Deploy the React/Vite frontend as a Render Static Site.

### Reason

The frontend is a static SPA and does not require a Node server in production.

---

## TD-077 — Deploy Backend as a Web Service

### Decision

Deploy the NestJS backend as a Render Web Service.

### Reason

The backend must expose REST APIs, handle authentication cookies, access PostgreSQL, and integrate with the exchange rate provider.

---

## TD-078 — Use Prisma Migrate Deploy in Production

### Decision

Run production migrations with `npx prisma migrate deploy`.

### Reason

Production should apply committed migrations, not generate new migrations.

---

## TD-079 — Include Assessment Requirement Mapping in README

### Decision

The README must include a table mapping assessment requirements to implementation.

### Reason

This makes the project easier to review and shows that each requested item was addressed.

---

## TD-080 — Document Known Limitations Honestly

### Decision

The README must include known limitations.

### Reason

Clear boundaries make the MVP look intentional and professional.

---

## TD-081 — Use AI-Assisted Light SDD Workflow

### Decision

Use a lightweight SDD-style documentation and task breakdown process with AI assistance.

### Reason

This demonstrates intentional planning and controlled AI usage without overbuilding documentation.

---

## TD-082 — Include AI Usage Disclosure

### Decision

Include `docs/06-AI-USAGE-DISCLOSURE.md`.

### Reason

The assessment allows AI usage and asks for transparent disclosure.

---

## TD-083 — Use Task Files as Implementation Contracts

### Decision

Each task file defines scope, out-of-scope items, API behavior, frontend behavior, validation, accessibility, acceptance criteria, and suggested commit.

### Reason

Task files make the AI-assisted development process repeatable and controlled.

---

## TD-084 — Keep the MVP Free of Real-Money Gambling Features

### Decision

Do not include deposits, withdrawals, payments, or real-money gambling mechanics.

### Reason

The assessment is about a technical fullstack implementation using virtual coins.

---

## TD-085 — Keep MVP Boundaries Explicit

### Decision

Document intentionally excluded features such as admin panel, OAuth, refresh token rotation, custom slot engines, CI/CD, and full E2E browser automation.

### Reason

Explicit scope boundaries make the project easier to review and defend.
