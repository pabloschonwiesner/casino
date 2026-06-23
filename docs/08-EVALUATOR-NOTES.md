# Evaluator Notes

This document explains the main technical decisions behind the Casino MVP in a direct developer-to-developer way, with extra attention to the parts of the assessment that ask for explanation rather than just implementation.

## Why this project is shaped like an MVP

I treated the assessment as an MVP with clear boundaries instead of trying to simulate a production casino platform.

That affected several decisions:

- virtual coins instead of real money;
- one shared slot engine for all games;
- display-only currency conversion instead of a multi-currency wallet;
- no admin panel, no payment flows, no provider launch integration;
- enough security, validation, testing, and documentation to make the implementation credible and reviewable without overbuilding it.

The main goal was to keep the app complete end-to-end while making the business rules easy to inspect.

## Architecture decisions

I used a React frontend and a NestJS backend in the same repository, with PostgreSQL and Prisma on the backend.

This combination was chosen because it fits the assessment well:

- React + Vite keeps the frontend fast to build and easy to organize by feature;
- NestJS gives clear module boundaries, DTO validation, guards, and Swagger support out of the box;
- PostgreSQL fits the relational nature of users, games, favorites, countries, and spin history;
- Prisma gives typed queries, migrations, and a schema that is easy to review.

I also kept the backend as the owner of the important rules: authentication, search behavior, slot spin validation, persistence, balance updates, and currency conversion. That keeps the frontend simpler and reduces duplication of business logic.

## Authentication decision

The most important security choice was storing JWTs in an HttpOnly cookie instead of `localStorage`.

I chose that because it is closer to a safer browser-based authentication model:

- the token is not directly readable from frontend JavaScript;
- protected API requests can rely on the browser sending credentials automatically;
- the app avoids the common anti-pattern of exposing the JWT to client code.

The trade-off is more care around CORS and cookie settings, but for this kind of app that trade-off is worth it.

Related implementation areas:

- `backend/src/auth/`
- `backend/src/main.ts`
- `frontend/src/contexts/AuthContext.tsx`
- `docs/02-TECHNICAL-DESIGN.md`
- `docs/04-API-SPEC.md`

## Slot machine design decision

The assessment includes a catalog of games and also a slot machine. I intentionally separated the two concerns:

- the catalog game gives context to the session and to spin history;
- the slot logic itself is shared across all games.

That means the selected game affects the page title, provider display, and `gameId` stored in history, but it does not change reels or payout rules.

I made that choice because the assessment is really asking for a protected game flow with persistence and business rules, not for a configurable slot platform. A shared engine keeps the implementation smaller and makes the payout rules easier to audit.

### How payout is calculated

The payout calculation is intentionally explicit and small.

The service first converts the three reel symbols into a deterministic key such as `cherry_cherry_cherry` or `banana_banana_lemon`. It then uses that key to read a multiplier from a `PAYTABLE` lookup object. If a multiplier exists, the payout is `betAmount * multiplier`. If the key is not present in the paytable, the payout is `0`.

In other words, the winning rule is not inferred dynamically from partial conditions at runtime. It is mapped directly from the reel result to the business-defined payout.

This fits the assessment well because the slot rules are fixed and known in advance.

### Why a lookup object is better than conditionals here

I preferred a lookup object over a long chain of `if` or `switch` conditions for a few reasons:

- the business rules live in one place as data instead of being spread across branching logic;
- it is easier to verify that the implemented payouts match the required paytable;
- adding, removing, or changing a winning combination is a smaller and safer edit;
- tests become more straightforward because the mapping is deterministic and inspectable;
- the code is easier to scale if the number of combinations grows.
- it would be easier to modify the payout rules in the future if they were stored in a database.

If this were implemented with nested conditionals, the logic would become harder to read as soon as more combinations or exceptions were added. A paytable object keeps the decision surface flatter: generate key, look up multiplier, calculate payout.

That is not only cleaner, it is also better for maintainability. If the project later evolved into per-game paytables, the same pattern could be extended by loading different paytable objects per game rather than rewriting the payout logic itself.

I also kept the spin operation transactional. A spin validates the request, checks the game, checks balance, calculates the result, updates the user balance, inserts spin history, and returns the response as one unit of work. That matters because balance updates and history inserts should never drift apart.

Related implementation areas:

- `backend/src/slots/`
- `frontend/src/pages/SlotMachinePage.tsx`
- `docs/02-TECHNICAL-DESIGN.md`
- `docs/03-DATABASE-DESIGN.md`

## Security and middleware decisions

This is one of the areas where the assessment explicitly asks for explanation, so I focused on practical controls that materially improve the app without turning it into a security project.

### What I implemented

- Helmet for standard security headers;
- restricted CORS based on the configured frontend URL;
- DTO validation with NestJS pipes and `class-validator`;
- guards for protected endpoints;
- optional auth for catalog endpoints so guest and authenticated flows can share the same endpoints;
- rate limiting;
- safe error responses;
- request logging with sensitive-field redaction.

### Why these choices

I wanted the backend to reject bad input as early as possible and keep authentication concerns away from business logic. DTO validation and guards are a good fit for NestJS because they are explicit and easy for a reviewer to trace.

I also wanted to avoid leaking internal details. That is why API responses use safe messages instead of raw database errors or stack traces.

For logging, I kept it intentionally simple: request logs are written in JSONL format and sensitive fields like passwords, tokens, authorization headers, and cookies are redacted. I did not introduce a more complex logging stack because for this assessment the important part is observability without exposing secrets.

### Trade-offs

- Rate limiting is intentionally lightweight and suitable for MVP use, not distributed infrastructure.
- Logging is simple file-based logging rather than a centralized production logging pipeline.
- The security model is strong enough for the assessment scope, but not intended to represent a full regulated gambling platform.

Related implementation areas:

- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/src/common/middleware/request-logger.middleware.ts`
- `backend/src/auth/guards/`
- `docs/02-TECHNICAL-DESIGN.md`
- `docs/04-API-SPEC.md`

## Search optimization decisions

This is another area where the assessment asks for explanation.

I optimized search in a way that matches the size and purpose of the app rather than trying to over-engineer it.

### What I implemented

- backend-owned search via `GET /games?q=...`;
- filtering by title and provider name;
- pagination on the backend;
- 500ms debounce on the frontend;
- keeping previous results visible while fetching;
- short TTL caching for public guest catalog responses only.

### Why this design

The important decision here was to make search backend-owned instead of filtering static data in the frontend. That keeps one source of truth for:

- guest vs authenticated visibility;
- pagination;
- favorite-first ordering for authenticated users;
- country-based availability rules.

Frontend debounce reduces unnecessary requests while preserving the search-as-you-type experience required by the assessment.

I only cached guest catalog responses because authenticated catalog responses depend on user-specific data like favorites and country availability. Caching those responses more aggressively would create unnecessary consistency problems for an MVP.

### Trade-offs

- This is not full-text search and does not try to solve large-scale search problems.
- The cache is intentionally simple and short-lived.
- Search state stays local in the frontend instead of being reflected in URL params, because the assessment did not require shareable search URLs and I wanted to keep the catalog flow simpler.

Related implementation areas:

- `backend/src/games/`
- `frontend/src/hooks/useDebounce.ts`
- `frontend/src/pages/GamesPage.tsx`
- `docs/02-TECHNICAL-DESIGN.md`
- `docs/04-API-SPEC.md`
- `docs/07-TECHNICAL-DECISIONS.md`

## Database design decisions

The relational design was driven by the fact that the app has several real relationships that should stay explicit: users, games, countries, currencies, favorites, and spin history.

### Why a normalized relational schema

I used PostgreSQL with a normalized schema because the data model is relational by nature:

- users belong to a country and have a preferred currency;
- games can be available in many countries;
- users can favorite many games;
- users can have many spin history records;
- each spin belongs to both a user and a game.

A relational model makes these rules easier to express and verify than pushing everything into denormalized JSON structures.

### Key schema choices

- UUID primary keys for main domain entities;
- natural keys for currencies and countries where those identifiers already exist;
- composite keys for join tables to prevent duplicates naturally;
- `DECIMAL` storage for money-like values;
- append-only `spin_history` records;
- indexes on the expected lookup and join paths.

### Why decimal values are returned as strings

Balances, bets, payouts, and converted amounts are returned as strings in the API. I did that intentionally to avoid ambiguity around floating-point handling between backend and frontend. It is a small contract choice, but it keeps money-like values safer and more explicit.

### Why spin history stores before/after balances

That was included so each spin can be understood as a complete record, not just an isolated reel result. It makes the audit trail clearer and makes debugging balance issues much easier.

Related implementation areas:

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`
- `backend/prisma/seed.ts`
- `docs/03-DATABASE-DESIGN.md`

## API design decisions

The API is intentionally straightforward REST.

I preferred a small number of explicit endpoints with clear contracts instead of a generic abstraction layer. That makes the app easier to inspect during evaluation.

A few concrete decisions mattered here:

- optional auth on catalog endpoints so guests and authenticated users can use the same routes;
- protected endpoints for favorites, spins, history, and balance conversion;
- endpoint-specific DTOs for request validation;
- standard HTTP status codes with safe error messages;
- Swagger/OpenAPI to make the contract easy to test manually.

This approach works well for an assessment because the reviewer can verify functionality from both the code and the Swagger UI without guessing hidden behavior.

## Frontend decisions

On the frontend, I tried to keep the architecture boring in a good way.

### Main choices

- React Router for page-level routing;
- TanStack Query for server state and mutation invalidation;
- local component state for short-lived UI state like search text, pagination, and selected bet amount;
- accessible semantic controls;
- system-preference dark mode instead of a manual toggle.

### Why this split matters

TanStack Query is useful for data that comes from the server and needs caching or invalidation. Local state is better for temporary UI interactions that do not need to become global application state.

That boundary kept the frontend easier to reason about and avoided introducing unnecessary complexity like a separate global state store.

## Testing decisions

The testing strategy focuses on the risky parts of the app instead of chasing raw coverage numbers.

That means prioritizing:

- slot payout rules;
- balance update behavior;
- authentication flows;
- currency conversion logic;
- critical API flows;
- focused frontend component behavior.

I did not optimize the project around an arbitrary coverage threshold because that can produce a lot of low-value tests in a time-boxed assessment. I preferred a smaller set of tests around business rules and failure paths that are actually likely to break.

Related implementation areas:

- `docs/05-TESTING-STRATEGY.md`
- `backend/src/**/*.spec.ts`
- `backend/test/`
- `frontend/src/**/*.test.tsx`

## Scalability and deployment decisions

For deployment, I chose Render because it is a good fit for an assessment submission: it keeps infrastructure understandable, supports the full stack needed by the app, and is fast to explain to a reviewer.

The deployment shape is intentionally simple:

- PostgreSQL as a managed Render database;
- NestJS backend as a Render web service;
- React frontend as a Render static site.

### Why Render was a good choice here

I wanted a deployment model that was easy to reproduce and easy to review. Render provides a clean path for that without introducing unrelated platform complexity.

It also matches the app architecture naturally:

- the backend is a conventional stateless HTTP service;
- the frontend builds to static assets;
- the database is relational and managed separately.

### Scalability perspective

I would not describe the current deployment as built for massive scale, but it is shaped in a way that scales reasonably for the MVP and leaves a clean path for growth.

The helpful choices are:

- frontend and backend are already separated, so they can scale independently;
- the backend is stateless apart from the database, which makes horizontal scaling easier in principle;
- PostgreSQL is the source of truth for persistence and transactional business logic;
- search, authentication, and slot logic stay backend-owned, so behavior remains consistent as clients grow.

The main current limits are also explicit:

- in-memory rate limiting is simple and not distributed;
- guest catalog caching is intentionally lightweight;
- there is no queueing, background processing, or centralized observability stack.

For this assessment, I think that is the right trade-off. The solution is deployable, understandable, and structurally scalable without pretending to solve production-scale problems that the assessment did not ask for.

Related implementation areas:

- `render.yaml`
- `docs/tasks/TASK-013-deployment-and-readme.md`
- `docs/02-TECHNICAL-DESIGN.md`

## AI usage decision

This is the last major explanation area in the assessment.

AI was used as an assistant, not as an authority. In practice that meant using it to help with:

- clarifying requirements;
- documenting architecture and decisions;
- breaking work into tasks;
- drafting implementation approaches;
- supporting debugging and documentation updates.

What remained developer-owned was the important part:

- deciding scope;
- validating the implementation against the assessment;
- reviewing code and docs;
- checking security-sensitive behavior;
- running tests and manual verification;
- deciding what to keep, change, or reject.

I documented AI usage explicitly because hiding it would be less honest and less useful to the evaluator. The goal was transparency plus accountability.

Related implementation areas:

- `docs/06-AI-USAGE-DISCLOSURE.md`
- `docs/07-TECHNICAL-DECISIONS.md`

## Known limitations that were intentional

A few limitations are not missing work by accident. They were deliberate scope choices.

- All games share one slot engine.
- Currency conversion is display-only.
- There is no payment system or real-money flow.
- There is no admin panel.
- Rate limiting and logging are MVP-grade, not distributed production infrastructure.
- There is no full browser E2E suite.

I think these are acceptable trade-offs for the assessment because they preserve the core fullstack flows while keeping the solution understandable and reviewable.

## Final note to the evaluator

If I had to summarize the project in one line, it would be: a deliberately scoped fullstack MVP where the important technical decisions were made to keep the business rules explicit, the security posture reasonable, and the code easy to inspect.

For the detailed source-of-truth documents, the best references are:

- `docs/02-TECHNICAL-DESIGN.md`
- `docs/03-DATABASE-DESIGN.md`
- `docs/04-API-SPEC.md`
- `docs/05-TESTING-STRATEGY.md`
- `docs/06-AI-USAGE-DISCLOSURE.md`
- `docs/07-TECHNICAL-DECISIONS.md`

