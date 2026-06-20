# 07 — Technical Decisions

This document records the technical decisions made for the Skivori Casino fullstack assessment.

It intentionally keeps a detailed decision log because the project follows a light SDD / AI-assisted development workflow.


---


## Decision Index

- TD-001 — Use a monorepo structure
- TD-002 — Deploy the MVP on Render
- TD-003 — Use React with Vite for the frontend
- TD-004 — Use NestJS for the backend
- TD-005 — Use PostgreSQL as the primary database
- TD-006 — Use Prisma as ORM
- TD-007 — Use TypeScript across frontend and backend
- TD-008 — Store JWT in HttpOnly cookies
- TD-009 — Authenticate the user after registration
- TD-010 — Use one shared slot engine for all games
- TD-011 — Treat selected game as visual slot context
- TD-012 — Use slug in routes and ID in persistence
- TD-013 — Use backend-owned game search
- TD-014 — Debounce frontend game search
- TD-015 — Cache public catalog responses
- TD-016 — Order authenticated catalog with favorites first
- TD-017 — Use a normalized relational schema
- TD-018 — Seed games from game-data.json
- TD-019 — Assign imported games to the Slot game type
- TD-020 — Seed initial countries and currencies
- TD-021 — Use virtual coins instead of real money
- TD-022 — Define 1 coin as 1 USD
- TD-023 — Keep currency conversion display-only
- TD-024 — Protect slot gameplay behind authentication
- TD-025 — Persist every slot spin
- TD-026 — Use decimal money values
- TD-027 — Apply endpoint-specific rate limiting
- TD-028 — Use conditional balance updates for spins
- TD-029 — Store spin balance before and after
- TD-030 — Use a paytable lookup for slot payouts
- TD-031 — Use consecutive-left matching only
- TD-032 — Do not make slot wins cumulative
- TD-033 — Use fixed allowed bet values
- TD-034 — Perform currency conversion on the backend
- TD-035 — Cache exchange rates
- TD-036 — Use route /games for the catalog
- TD-037 — Use route /slot-machine/:gameSlug for gameplay
- TD-038 — Redirect guests to login with redirectTo
- TD-039 — Validate redirectTo before navigation
- TD-040 — Use React Router for frontend routes
- TD-041 — Use TanStack Query for server state
- TD-042 — Use local UI state for search and pagination
- TD-043 — Do not sync catalog search to URL params
- TD-044 — Use shadcn-compatible Tailwind styling
- TD-045 — Use mobile-first responsive UI
- TD-046 — Use system-preference dark mode
- TD-047 — Do not add manual ThemeToggle
- TD-048 — Use Tailwind darkMode media
- TD-049 — Normalize emails
- TD-050 — Return endpoint-specific success shapes
- TD-051 — Use consistent error response semantics
- TD-052 — Use endpoint-specific success shapes
- TD-053 — Use DTO ValidationPipe
- TD-054 — Use global ValidationPipe whitelist
- TD-055 — Forbid non-whitelisted request fields
- TD-056 — Transform validated query parameters
- TD-057 — Use class-validator DTOs
- TD-058 — Use class-transformer for numeric query params
- TD-059 — Use safe user-facing error messages
- TD-060 — Do not expose password hashes
- TD-061 — Use bcryptjs for password hashing
- TD-062 — Use a starting balance constant
- TD-063 — Use country-selected registration
- TD-064 — Derive preferred currency from selected country
- TD-065 — Expose countries during authentication
- TD-066 — Delay currencies endpoint until conversion task
- TD-067 — Use HttpOnly access_token cookie name
- TD-068 — Use SameSite=Lax for auth cookie
- TD-069 — Use Secure cookies in production
- TD-070 — Use ConfigService for runtime configuration
- TD-071 — Keep JWT payload minimal
- TD-072 — Use JWT expiration of one day
- TD-073 — Use logout as idempotent cookie clear
- TD-074 — Redirect logout to games on frontend
- TD-075 — Use eight business tables
- TD-076 — Use UUIDs for primary domain entities
- TD-077 — Use natural keys for countries and currencies
- TD-078 — Use composite keys for join tables
- TD-079 — Use createdAt and updatedAt on main tables
- TD-080 — Use createdAt only on join/history tables
- TD-081 — Make spin history append-only
- TD-082 — Store slot symbols in explicit reel fields
- TD-083 — Store reel_result_key for quick inspection
- TD-084 — Use check constraints for numeric invariants
- TD-085 — Use indexes for lookup and join paths
- TD-086 — Return Decimal values as strings
- TD-087 — Use Prisma Decimal for backend money values
- TD-088 — Use DECIMAL(12,2) for balances and amounts
- TD-089 — Use DECIMAL precision for exchange rates
- TD-090 — Use nullable thumbnail_url
- TD-091 — Use nullable start_url
- TD-092 — Keep startUrl out of catalog list responses
- TD-093 — Expose startUrl only in game detail
- TD-094 — Use is_active for games
- TD-095 — Use game availability through game_countries
- TD-096 — Use user_favorite_games as many-to-many table
- TD-097 — Use spin_history for gameplay audit
- TD-098 — Use relation names aligned with Prisma
- TD-099 — Use Prisma migrations as schema source
- TD-100 — Manually edit migration SQL for CHECK constraints
- TD-101 — Use idempotent seed scripts
- TD-102 — Split seed data by domain
- TD-103 — Seed currencies before countries
- TD-104 — Seed countries before users
- TD-105 — Seed game types before games
- TD-106 — Seed game availability after games
- TD-107 — Use external_id to map JSON games
- TD-108 — Use slug as public game identifier
- TD-109 — Use title and providerName for search
- TD-110 — Use flag URL as derived frontend/API field
- TD-111 — Use GameDto as compact catalog contract
- TD-112 — Use GameDetailDto for detail contract
- TD-113 — Use PaginatedResponse for list endpoints
- TD-114 — Use page and limit pagination
- TD-115 — Use page default 1
- TD-116 — Use limit default 20
- TD-117 — Use limit max 50
- TD-118 — Return totalPages 0 when total is 0
- TD-119 — Return empty data for valid out-of-range pages
- TD-120 — Reject invalid page values
- TD-121 — Reject invalid limit values
- TD-122 — Trim q before searching
- TD-123 — Treat empty q as no search
- TD-124 — Limit q length to 100
- TD-125 — Search title and providerName only
- TD-126 — Use Prisma contains insensitive search
- TD-127 — Avoid raw SQL search construction
- TD-128 — Use guest catalog without country filtering
- TD-129 — Use authenticated catalog filtered by user country
- TD-130 — Return isFavorite false for guests
- TD-131 — Derive isFavorite for authenticated users
- TD-132 — Use title ASC ordering for guests
- TD-133 — Use favorite-first then title ASC for authenticated users
- TD-134 — Cache only guest catalog responses
- TD-135 — Do not cache authenticated catalog responses
- TD-136 — Use 60 second public catalog cache TTL
- TD-137 — Do not manually invalidate public catalog cache
- TD-138 — Do not cache game detail responses
- TD-139 — Implement correct favorite-first pagination with Prisma
- TD-140 — Implement authentication as a vertical slice
- TD-141 — Use bcryptjs
- TD-142 — Use JWT expiration of one day
- TD-143 — Use minimal JWT payload
- TD-144 — Use access_token cookie
- TD-145 — Return success response on logout
- TD-146 — Redirect logout to /games
- TD-147 — Preserve redirectTo after login
- TD-148 — Validate redirectTo before use
- TD-149 — Use AuthProvider on frontend
- TD-150 — Call GET /auth/me on app startup
- TD-151 — ProtectedRoute waits for auth loading
- TD-152 — Use redirect helper for safe auth navigation
- TD-153 — Load countries for registration
- TD-154 — Block registration if countries cannot load
- TD-155 — RegisterDto derives currency server-side
- TD-156 — Use LoginDto
- TD-157 — Return 401 for invalid login
- TD-158 — Return 409 for duplicate email
- TD-159 — Return 400 for invalid country
- TD-160 — Return 201 for register
- TD-161 — Return 200 for login
- TD-162 — Use standard HTTP status codes
- TD-163 — Use consistent AuthResponse
- TD-164 — Treat auth/me 401 as guest on frontend
- TD-165 — Make logout idempotent
- TD-166 — Use JwtAuthGuard and JWT strategy
- TD-167 — Use minimal AuthenticatedUser type
- TD-168 — Use CurrentUser decorator
- TD-169 — Protect auth/me with JwtAuthGuard
- TD-170 — Use AuthCookieService with passthrough response
- TD-171 — Use ConfigService
- TD-172 — Use SameSite Lax with production Secure cookie
- TD-173 — Centralize auth cookie constant
- TD-174 — Keep auth mapper private
- TD-175 — Use decimal helper for API strings
- TD-176 — Defer tests to TASK-012
- TD-177 — Use a basic navbar
- TD-178 — Use a shared layout
- TD-179 — Redirect root to /games
- TD-180 — Use temporary placeholders for future pages
- TD-181 — Use a temporary protected route link
- TD-182 — Expose GET /countries during auth task
- TD-183 — Cache countries on backend/frontend
- TD-184 — Defer GET /currencies
- TD-185 — Countries response includes currencyCode only
- TD-186 — Do not add balance endpoint in auth task
- TD-187 — Keep UsersService internal initially
- TD-188 — Use initial balance constant
- TD-189 — Add authenticated user to request
- TD-190 — Validate RegisterDto password
- TD-191 — Validate country code format and existence
- TD-192 — Reject lowercase countryIso2
- TD-193 — Create normalizeEmail utility
- TD-194 — Trim email frontend and normalize backend
- TD-195 — Validate frontend password with Zod
- TD-196 — Use confirmPassword only on frontend
- TD-197 — Preserve redirect intent
- TD-198 — Redirect authenticated users away from auth pages
- TD-199 — Use minimal auth UI
- TD-200 — Finalize auth state behavior
- TD-201 — Implement game catalog as vertical slice
- TD-202 — Use optional auth for catalog
- TD-203 — Create OptionalJwtAuthGuard
- TD-204 — Reuse CurrentUser for optional auth
- TD-205 — Use compact GameDto
- TD-206 — Expose startUrl only in detail
- TD-207 — Return 404 for unavailable game detail
- TD-208 — Use generic Game not found message
- TD-209 — Define catalog ordering
- TD-210 — Trim empty q
- TD-211 — Validate page
- TD-212 — Validate limit
- TD-213 — Return totalPages 0 if empty
- TD-214 — Return empty 200 for out-of-range page
- TD-215 — Create GetGamesQueryDto
- TD-216 — Limit q max length 100
- TD-217 — Use ILIKE-like Prisma behavior
- TD-218 — Use Prisma contains and no raw SQL
- TD-219 — Cache only public catalog
- TD-220 — Use local in-memory GamesService cache
- TD-221 — Use TTL-only cache expiration
- TD-222 — Do not cache detail
- TD-223 — Include auth state in games query key
- TD-224 — Use 30 second frontend staleTime
- TD-225 — Reset page on debounced search
- TD-226 — Omit empty q from frontend requests
- TD-227 — Trim debounced search value
- TD-228 — Keep previous results while fetching
- TD-229 — Use thumbnail fallback
- TD-230 — Display provider name
- TD-231 — Prepare favorite state without UI
- TD-232 — Implement favorite-first backend before UI
- TD-233 — Guest game click redirects to login
- TD-234 — Authenticated game click opens slot route
- TD-235 — Keep SlotMachinePage placeholder
- TD-236 — Implement game detail before slot uses it
- TD-237 — Validate slug
- TD-238 — Create GetGameBySlugParamsDto
- TD-239 — Use games resource files
- TD-240 — Split frontend games components
- TD-241 — Create gamesApi client
- TD-242 — Make GameGrid presentational
- TD-243 — Make GameCard clickable
- TD-244 — Make GameSearchInput presentational
- TD-245 — Create GamePagination
- TD-246 — Use fixed page size 20
- TD-247 — Show result counter
- TD-248 — Use contextual empty states
- TD-249 — Add retry error state
- TD-250 — Separate initial loading and updating states
- TD-251 — Keep previous results behavior
- TD-252 — Keep search/page state local
- TD-253 — Do not prefetch pages
- TD-254 — Add clear search action
- TD-255 — Use onClear prop
- TD-256 — Create useDebounce hook
- TD-257 — Preserve active search during pagination
- TD-258 — Show Game Type as a Simple Badge
- TD-259 — Use card click as the only GameCard action
- TD-260 — Use a button element for clickable game cards
- TD-261 — Include accessibility and dark mode support in the game catalog
- TD-262 — Use browser/system preference for dark mode
- TD-263 — Configure Tailwind dark mode with system preference
- TD-264 — Include accessibility and dark mode checks in catalog acceptance criteria
- TD-265 — Add manual accessibility validation for the game catalog
- TD-266 — Define the final acceptance state for game catalog and search
- TD-267 — Implement favorites as a dedicated vertical slice
- TD-268 — Make favorite and unfavorite actions idempotent
- TD-269 — Return 404 for games that cannot be favorited
- TD-270 — Invalidate game catalog queries after favorite changes
- TD-271 — Show favorite UI only to authenticated users
- TD-272 — Keep favorite button accessible
- TD-273 — Implement slot machine as a protected vertical slice
- TD-274 — Use a shared slot engine for all games
- TD-275 — Load selected game detail in SlotMachinePage
- TD-276 — Validate game availability before spinning
- TD-277 — Use exact allowed bet amounts
- TD-278 — Deduct bet before applying winnings
- TD-279 — Persist every spin as append-only history
- TD-280 — Use a transactional conditional balance update
- TD-281 — Use Math.random for MVP slot randomness
- TD-282 — Return updated balance from spin response
- TD-283 — Add recent spin history endpoint
- TD-284 — Update AuthProvider balance after spin
- TD-285 — Keep slot UI accessible and dark-mode compatible
- TD-286 — Display slot symbols with emoji and accessible text
- TD-287 — Keep currency conversion display-only
- TD-288 — Convert balance on the backend
- TD-289 — Add GET /currencies for supported currency selection
- TD-290 — Use one-hour server-side exchange rate cache
- TD-291 — Place currency conversion UI in SlotMachinePage
- TD-292 — Require explicit Convert button
- TD-293 — Return decimal money values as strings
- TD-294 — Consolidate security hardening in a dedicated task
- TD-295 — Use Helmet for security headers
- TD-296 — Restrict CORS by environment
- TD-297 — Use Global ValidationPipe strictly
- TD-298 — Apply endpoint-specific rate limiting
- TD-299 — Never log sensitive authentication data
- TD-300 — Keep error responses safe
- TD-301 — Document API with Swagger/OpenAPI
- TD-302 — Use cookie authentication in Swagger
- TD-303 — Add README API summary
- TD-304 — Include manual curl examples
- TD-305 — Focus tests on critical business rules
- TD-306 — Do not enforce a global coverage threshold
- TD-307 — Mock external exchange rate API in tests
- TD-308 — Keep frontend tests component-focused
- TD-309 — Treat manual accessibility validation as part of done
- TD-310 — Deploy MVP on Render
- TD-311 — Deploy frontend as static site
- TD-312 — Deploy backend as web service
- TD-313 — Use Prisma migrate deploy in production
- TD-314 — Include assessment requirement mapping in README
- TD-315 — Document known limitations honestly
- TD-316 — Use plural table names and singular code models

---


# Foundation and architecture


## TD-001 — Use a monorepo structure

### Decision

Use a monorepo structure.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-002 — Deploy the MVP on Render

### Decision

Deploy the MVP on Render.

### Reason

Render provides a simple cloud deployment path for a technical assessment without adding infrastructure complexity.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-003 — Use React with Vite for the frontend

### Decision

Use React with Vite for the frontend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-004 — Use NestJS for the backend

### Decision

Use NestJS for the backend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-005 — Use PostgreSQL as the primary database

### Decision

Use PostgreSQL as the primary database.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-006 — Use Prisma as ORM

### Decision

Use Prisma as ORM.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-007 — Use TypeScript across frontend and backend

### Decision

Use TypeScript across frontend and backend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-008 — Store JWT in HttpOnly cookies

### Decision

Store JWT authentication tokens in an HttpOnly cookie instead of localStorage.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-009 — Authenticate the user after registration

### Decision

Authenticate the user after registration.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-010 — Use one shared slot engine for all games

### Decision

Use one shared Slot Machine engine for all catalog games during the MVP.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-011 — Treat selected game as visual slot context

### Decision

Treat selected game as visual slot context.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-012 — Use slug in routes and ID in persistence

### Decision

Use the public game slug in frontend routes and the internal game ID for database persistence.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-013 — Use backend-owned game search

### Decision

Use backend-owned game search.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-014 — Debounce frontend game search

### Decision

Debounce frontend game search.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-015 — Cache public catalog responses

### Decision

Cache only public guest catalog responses for a short time-to-live.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-016 — Order authenticated catalog with favorites first

### Decision

Order authenticated catalog with favorites first.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Product, gameplay, and cross-cutting rules


## TD-017 — Use a normalized relational schema

### Decision

Use a normalized relational schema.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-018 — Seed games from game-data.json

### Decision

Seed games from game-data.json.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-019 — Assign imported games to the Slot game type

### Decision

Assign imported games to the Slot game type.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-020 — Seed initial countries and currencies

### Decision

Seed initial countries and currencies.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-021 — Use virtual coins instead of real money

### Decision

Use virtual coins instead of real money.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-022 — Define 1 coin as 1 USD

### Decision

Define 1 coin as 1 USD.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-023 — Keep currency conversion display-only

### Decision

Keep currency conversion display-only.

### Reason

Currency conversion is required as display-only functionality, and backend ownership protects provider details and consistency.

### Trade-offs

The trade-off is no multi-currency wallet support, but the feature matches the assessment requirement without financial complexity.


## TD-024 — Protect slot gameplay behind authentication

### Decision

Protect slot gameplay behind authentication.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-025 — Persist every slot spin

### Decision

Persist every slot spin.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-026 — Use decimal money values

### Decision

Use decimal money values.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-027 — Apply endpoint-specific rate limiting

### Decision

Apply different rate limits to general, authentication, and spin endpoints.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-028 — Use conditional balance updates for spins

### Decision

Update user balance with a conditional database operation during spins.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-029 — Store spin balance before and after

### Decision

Store spin balance before and after.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-030 — Use a paytable lookup for slot payouts

### Decision

Represent slot payouts as an explicit paytable lookup rather than scattered conditional logic.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-031 — Use consecutive-left matching only

### Decision

Only consecutive symbols from the left side of the reel result count as winning combinations.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-032 — Do not make slot wins cumulative

### Decision

Apply only the highest applicable payout. Wins are not cumulative.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-033 — Use fixed allowed bet values

### Decision

Use fixed allowed bet values.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-034 — Perform currency conversion on the backend

### Decision

Perform currency conversion in the backend instead of the frontend.

### Reason

Currency conversion is required as display-only functionality, and backend ownership protects provider details and consistency.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-035 — Cache exchange rates

### Decision

Cache exchange rates server-side for one hour.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


# Frontend/backend conventions and authentication foundations


## TD-036 — Use route /games for the catalog

### Decision

Use route /games for the catalog.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-037 — Use route /slot-machine/:gameSlug for gameplay

### Decision

Use route /slot-machine/:gameSlug for gameplay.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-038 — Redirect guests to login with redirectTo

### Decision

Redirect guests to login with redirectTo.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-039 — Validate redirectTo before navigation

### Decision

Validate redirectTo before navigation.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-040 — Use React Router for frontend routes

### Decision

Use React Router for frontend routes.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-041 — Use TanStack Query for server state

### Decision

Use TanStack Query for server state.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-042 — Use local UI state for search and pagination

### Decision

Use local UI state for search and pagination.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-043 — Do not sync catalog search to URL params

### Decision

Do not sync catalog search to URL params.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-044 — Use shadcn-compatible Tailwind styling

### Decision

Use shadcn-compatible Tailwind styling.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-045 — Use mobile-first responsive UI

### Decision

Use mobile-first responsive UI.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-046 — Use system-preference dark mode

### Decision

Support dark mode through the user’s browser or operating system preference.

### Reason

The main UI should be usable, readable, and presentable from the MVP, including keyboard and system dark mode support.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-047 — Do not add manual ThemeToggle

### Decision

Do not add a manual theme toggle during the MVP.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-048 — Use Tailwind darkMode media

### Decision

Configure Tailwind with media-based dark mode.

### Reason

The main UI should be usable, readable, and presentable from the MVP, including keyboard and system dark mode support.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-049 — Normalize emails

### Decision

Normalize emails.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-050 — Return endpoint-specific success shapes

### Decision

Return endpoint-specific success shapes.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-051 — Use consistent error response semantics

### Decision

Use consistent error response semantics.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-052 — Use endpoint-specific success shapes

### Decision

Use endpoint-specific success shapes.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-053 — Use DTO ValidationPipe

### Decision

Use DTO ValidationPipe.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-054 — Use global ValidationPipe whitelist

### Decision

Use global ValidationPipe whitelist.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-055 — Forbid non-whitelisted request fields

### Decision

Forbid non-whitelisted request fields.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-056 — Transform validated query parameters

### Decision

Transform validated query parameters.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-057 — Use class-validator DTOs

### Decision

Use class-validator DTOs.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-058 — Use class-transformer for numeric query params

### Decision

Use class-transformer for numeric query params.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-059 — Use safe user-facing error messages

### Decision

Use safe user-facing error messages.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-060 — Do not expose password hashes

### Decision

Do not expose password hashes.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-061 — Use bcryptjs for password hashing

### Decision

Use bcryptjs for password hashing.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-062 — Use a starting balance constant

### Decision

Use a starting balance constant.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-063 — Use country-selected registration

### Decision

Use country-selected registration.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-064 — Derive preferred currency from selected country

### Decision

Derive preferred currency from selected country.

### Reason

Currency conversion is required as display-only functionality, and backend ownership protects provider details and consistency.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-065 — Expose countries during authentication

### Decision

Expose countries during authentication.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-066 — Delay currencies endpoint until conversion task

### Decision

Delay currencies endpoint until conversion task.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-067 — Use HttpOnly access_token cookie name

### Decision

Use HttpOnly access_token cookie name.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-068 — Use SameSite=Lax for auth cookie

### Decision

Use SameSite=Lax for auth cookie.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-069 — Use Secure cookies in production

### Decision

Use Secure cookies in production.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-070 — Use ConfigService for runtime configuration

### Decision

Use ConfigService for runtime configuration.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-071 — Keep JWT payload minimal

### Decision

Keep JWT payload minimal.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-072 — Use JWT expiration of one day

### Decision

Use JWT expiration of one day.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-073 — Use logout as idempotent cookie clear

### Decision

Use logout as idempotent cookie clear.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-074 — Redirect logout to games on frontend

### Decision

Redirect logout to games on frontend.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Database, seed, catalog contracts, and data access


## TD-075 — Use eight business tables

### Decision

Use eight main business tables: currencies, countries, users, game_types, games, game_countries, user_favorite_games, and spin_history.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-076 — Use UUIDs for primary domain entities

### Decision

Use UUIDs for primary domain entities.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-077 — Use natural keys for countries and currencies

### Decision

Use natural keys for countries and currencies.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-078 — Use composite keys for join tables

### Decision

Use composite keys for join tables.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-079 — Use createdAt and updatedAt on main tables

### Decision

Use createdAt and updatedAt on main tables.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-080 — Use createdAt only on join/history tables

### Decision

Use createdAt only on join/history tables.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-081 — Make spin history append-only

### Decision

Make spin history append-only.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-082 — Store slot symbols in explicit reel fields

### Decision

Store slot symbols in explicit reel fields.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-083 — Store reel_result_key for quick inspection

### Decision

Store reel_result_key for quick inspection.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-084 — Use check constraints for numeric invariants

### Decision

Use check constraints for numeric invariants.

### Reason

The main UI should be usable, readable, and presentable from the MVP, including keyboard and system dark mode support.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-085 — Use indexes for lookup and join paths

### Decision

Use indexes for lookup and join paths.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-086 — Return Decimal values as strings

### Decision

Return decimal money values as strings in API responses.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-087 — Use Prisma Decimal for backend money values

### Decision

Use Prisma Decimal for backend money values.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-088 — Use DECIMAL(12,2) for balances and amounts

### Decision

Use DECIMAL(12,2) for balances and amounts.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-089 — Use DECIMAL precision for exchange rates

### Decision

Use DECIMAL precision for exchange rates.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-090 — Use nullable thumbnail_url

### Decision

Use nullable thumbnail_url.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-091 — Use nullable start_url

### Decision

Use nullable start_url.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-092 — Keep startUrl out of catalog list responses

### Decision

Keep startUrl out of catalog list responses.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-093 — Expose startUrl only in game detail

### Decision

Expose startUrl only in game detail.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-094 — Use is_active for games

### Decision

Use is_active for games.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-095 — Use game availability through game_countries

### Decision

Use game availability through game_countries.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-096 — Use user_favorite_games as many-to-many table

### Decision

Use user_favorite_games as many-to-many table.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-097 — Use spin_history for gameplay audit

### Decision

Use spin_history for gameplay audit.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-098 — Use relation names aligned with Prisma

### Decision

Use relation names aligned with Prisma.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-099 — Use Prisma migrations as schema source

### Decision

Treat Prisma migrations as the executable source of database evolution.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-100 — Manually edit migration SQL for CHECK constraints

### Decision

Manually edit generated migration SQL when PostgreSQL CHECK constraints are required.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-101 — Use idempotent seed scripts

### Decision

Use idempotent seed scripts.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-102 — Split seed data by domain

### Decision

Split seed data by domain.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-103 — Seed currencies before countries

### Decision

Seed currencies before countries.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-104 — Seed countries before users

### Decision

Seed countries before users.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-105 — Seed game types before games

### Decision

Seed game types before games.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-106 — Seed game availability after games

### Decision

Seed game availability after games.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-107 — Use external_id to map JSON games

### Decision

Use external_id to map JSON games.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-108 — Use slug as public game identifier

### Decision

Use slug as public game identifier.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-109 — Use title and providerName for search

### Decision

Use title and providerName for search.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-110 — Use flag URL as derived frontend/API field

### Decision

Use flag URL as derived frontend/API field.

### Reason

Clear documentation makes the project easier to evaluate, run, and defend in a technical review.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-111 — Use GameDto as compact catalog contract

### Decision

Use GameDto as compact catalog contract.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-112 — Use GameDetailDto for detail contract

### Decision

Use GameDetailDto for detail contract.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-113 — Use PaginatedResponse for list endpoints

### Decision

Use PaginatedResponse for list endpoints.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-114 — Use page and limit pagination

### Decision

Use page and limit pagination.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-115 — Use page default 1

### Decision

Use page default 1.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-116 — Use limit default 20

### Decision

Use limit default 20.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-117 — Use limit max 50

### Decision

Use limit max 50.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-118 — Return totalPages 0 when total is 0

### Decision

Return totalPages 0 when total is 0.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-119 — Return empty data for valid out-of-range pages

### Decision

Return empty data for valid out-of-range pages.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-120 — Reject invalid page values

### Decision

Reject invalid page values.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-121 — Reject invalid limit values

### Decision

Reject invalid limit values.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-122 — Trim q before searching

### Decision

Trim q before searching.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-123 — Treat empty q as no search

### Decision

Treat empty q as no search.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-124 — Limit q length to 100

### Decision

Limit q length to 100.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-125 — Search title and providerName only

### Decision

Search title and providerName only.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-126 — Use Prisma contains insensitive search

### Decision

Use Prisma contains insensitive search.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-127 — Avoid raw SQL search construction

### Decision

Avoid raw SQL search construction.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-128 — Use guest catalog without country filtering

### Decision

Use guest catalog without country filtering.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-129 — Use authenticated catalog filtered by user country

### Decision

Use authenticated catalog filtered by user country.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-130 — Return isFavorite false for guests

### Decision

Return isFavorite false for guests.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-131 — Derive isFavorite for authenticated users

### Decision

Derive isFavorite for authenticated users.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-132 — Use title ASC ordering for guests

### Decision

Use title ASC ordering for guests.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-133 — Use favorite-first then title ASC for authenticated users

### Decision

Use favorite-first then title ASC for authenticated users.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-134 — Cache only guest catalog responses

### Decision

Cache only guest catalog responses.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-135 — Do not cache authenticated catalog responses

### Decision

Do not cache authenticated catalog responses.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-136 — Use 60 second public catalog cache TTL

### Decision

Use 60 second public catalog cache TTL.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-137 — Do not manually invalidate public catalog cache

### Decision

Do not manually invalidate public catalog cache.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-138 — Do not cache game detail responses

### Decision

Do not cache game detail responses.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-139 — Implement correct favorite-first pagination with Prisma

### Decision

Use a Prisma-based two-bucket approach for correct favorite-first pagination when needed.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


# Authentication vertical slice


## TD-140 — Implement authentication as a vertical slice

### Decision

Implement authentication as a dedicated vertical slice before catalog and gameplay features.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-141 — Use bcryptjs

### Decision

Use bcryptjs.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-142 — Use JWT expiration of one day

### Decision

Use JWT expiration of one day.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-143 — Use minimal JWT payload

### Decision

Use minimal JWT payload.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-144 — Use access_token cookie

### Decision

Use access_token cookie.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-145 — Return success response on logout

### Decision

Return success response on logout.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-146 — Redirect logout to /games

### Decision

Redirect logout to /games.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-147 — Preserve redirectTo after login

### Decision

Preserve redirectTo after login.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-148 — Validate redirectTo before use

### Decision

Validate redirectTo before use.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-149 — Use AuthProvider on frontend

### Decision

Use AuthProvider on frontend.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-150 — Call GET /auth/me on app startup

### Decision

Call GET /auth/me on app startup.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-151 — ProtectedRoute waits for auth loading

### Decision

ProtectedRoute waits for auth loading.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-152 — Use redirect helper for safe auth navigation

### Decision

Use redirect helper for safe auth navigation.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-153 — Load countries for registration

### Decision

Load countries for registration.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-154 — Block registration if countries cannot load

### Decision

Block registration if countries cannot load.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-155 — RegisterDto derives currency server-side

### Decision

RegisterDto derives currency server-side.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-156 — Use LoginDto

### Decision

Use LoginDto.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-157 — Return 401 for invalid login

### Decision

Return 401 for invalid login.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-158 — Return 409 for duplicate email

### Decision

Return 409 for duplicate email.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-159 — Return 400 for invalid country

### Decision

Return 400 for invalid country.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-160 — Return 201 for register

### Decision

Return 201 for register.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-161 — Return 200 for login

### Decision

Return 200 for login.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-162 — Use standard HTTP status codes

### Decision

Use standard HTTP status codes.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-163 — Use consistent AuthResponse

### Decision

Use consistent AuthResponse.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-164 — Treat auth/me 401 as guest on frontend

### Decision

Treat auth/me 401 as guest on frontend.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-165 — Make logout idempotent

### Decision

Make logout idempotent.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-166 — Use JwtAuthGuard and JWT strategy

### Decision

Use JwtAuthGuard and JWT strategy.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-167 — Use minimal AuthenticatedUser type

### Decision

Use minimal AuthenticatedUser type.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-168 — Use CurrentUser decorator

### Decision

Use CurrentUser decorator.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-169 — Protect auth/me with JwtAuthGuard

### Decision

Protect auth/me with JwtAuthGuard.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-170 — Use AuthCookieService with passthrough response

### Decision

Use AuthCookieService with passthrough response.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-171 — Use ConfigService

### Decision

Use ConfigService.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-172 — Use SameSite Lax with production Secure cookie

### Decision

Use SameSite Lax with production Secure cookie.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-173 — Centralize auth cookie constant

### Decision

Centralize auth cookie constant.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-174 — Keep auth mapper private

### Decision

Keep auth mapper private.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-175 — Use decimal helper for API strings

### Decision

Use decimal helper for API strings.

### Reason

Clear documentation makes the project easier to evaluate, run, and defend in a technical review.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-176 — Defer tests to TASK-012

### Decision

Defer tests to TASK-012.

### Reason

Focused tests demonstrate quality on the riskiest logic while keeping the assessment scope achievable.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-177 — Use a basic navbar

### Decision

Use a basic navbar.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-178 — Use a shared layout

### Decision

Use a shared layout.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-179 — Redirect root to /games

### Decision

Redirect root to /games.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-180 — Use temporary placeholders for future pages

### Decision

Use temporary placeholders for future pages.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-181 — Use a temporary protected route link

### Decision

Use a temporary protected route link.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-182 — Expose GET /countries during auth task

### Decision

Expose GET /countries during auth task.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-183 — Cache countries on backend/frontend

### Decision

Cache countries on backend/frontend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-184 — Defer GET /currencies

### Decision

Defer GET /currencies.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-185 — Countries response includes currencyCode only

### Decision

Countries response includes currencyCode only.

### Reason

Currency conversion is required as display-only functionality, and backend ownership protects provider details and consistency.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-186 — Do not add balance endpoint in auth task

### Decision

Do not add balance endpoint in auth task.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-187 — Keep UsersService internal initially

### Decision

Keep UsersService internal initially.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-188 — Use initial balance constant

### Decision

Use initial balance constant.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-189 — Add authenticated user to request

### Decision

Add authenticated user to request.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-190 — Validate RegisterDto password

### Decision

Validate RegisterDto password.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-191 — Validate country code format and existence

### Decision

Validate country code format and existence.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-192 — Reject lowercase countryIso2

### Decision

Reject lowercase countryIso2.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-193 — Create normalizeEmail utility

### Decision

Create normalizeEmail utility.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-194 — Trim email frontend and normalize backend

### Decision

Trim email frontend and normalize backend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-195 — Validate frontend password with Zod

### Decision

Validate frontend password with Zod.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-196 — Use confirmPassword only on frontend

### Decision

Use confirmPassword only on frontend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-197 — Preserve redirect intent

### Decision

Preserve redirect intent.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-198 — Redirect authenticated users away from auth pages

### Decision

Redirect authenticated users away from auth pages.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-199 — Use minimal auth UI

### Decision

Use minimal auth UI.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-200 — Finalize auth state behavior

### Decision

Finalize auth state behavior.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Game catalog and search vertical slice


## TD-201 — Implement game catalog as vertical slice

### Decision

Implement game catalog as vertical slice.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-202 — Use optional auth for catalog

### Decision

Use optional authentication for game catalog endpoints so guests and authenticated users share the same routes.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-203 — Create OptionalJwtAuthGuard

### Decision

Create an OptionalJwtAuthGuard for catalog endpoints.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-204 — Reuse CurrentUser for optional auth

### Decision

Reuse CurrentUser for optional auth.

### Reason

Authentication must be secure, predictable, and simple enough to support protected gameplay and user-specific data.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-205 — Use compact GameDto

### Decision

Use compact GameDto.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-206 — Expose startUrl only in detail

### Decision

Expose startUrl only in detail.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-207 — Return 404 for unavailable game detail

### Decision

Return 404 for unavailable game detail.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-208 — Use generic Game not found message

### Decision

Use generic Game not found message.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-209 — Define catalog ordering

### Decision

Define catalog ordering.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-210 — Trim empty q

### Decision

Trim empty q.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-211 — Validate page

### Decision

Validate page.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-212 — Validate limit

### Decision

Validate limit.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-213 — Return totalPages 0 if empty

### Decision

Return totalPages 0 if empty.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-214 — Return empty 200 for out-of-range page

### Decision

Return empty 200 for out-of-range page.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-215 — Create GetGamesQueryDto

### Decision

Create GetGamesQueryDto.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-216 — Limit q max length 100

### Decision

Limit q max length 100.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-217 — Use ILIKE-like Prisma behavior

### Decision

Use ILIKE-like Prisma behavior.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-218 — Use Prisma contains and no raw SQL

### Decision

Use Prisma contains and no raw SQL.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-219 — Cache only public catalog

### Decision

Cache only public catalog.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-220 — Use local in-memory GamesService cache

### Decision

Use local in-memory GamesService cache.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-221 — Use TTL-only cache expiration

### Decision

Use TTL-only cache expiration.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-222 — Do not cache detail

### Decision

Do not cache detail.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-223 — Include auth state in games query key

### Decision

Include auth state in games query key.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-224 — Use 30 second frontend staleTime

### Decision

Use 30 second frontend staleTime.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-225 — Reset page on debounced search

### Decision

Reset page on debounced search.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-226 — Omit empty q from frontend requests

### Decision

Omit empty q from frontend requests.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-227 — Trim debounced search value

### Decision

Trim debounced search value.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-228 — Keep previous results while fetching

### Decision

Keep previous results while fetching.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-229 — Use thumbnail fallback

### Decision

Use thumbnail fallback.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-230 — Display provider name

### Decision

Display provider name.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-231 — Prepare favorite state without UI

### Decision

Prepare favorite state without UI.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-232 — Implement favorite-first backend before UI

### Decision

Implement favorite-first backend before UI.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-233 — Guest game click redirects to login

### Decision

Guest game click redirects to login.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-234 — Authenticated game click opens slot route

### Decision

Authenticated game click opens slot route.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-235 — Keep SlotMachinePage placeholder

### Decision

Keep SlotMachinePage placeholder.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-236 — Implement game detail before slot uses it

### Decision

Implement game detail before slot uses it.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-237 — Validate slug

### Decision

Validate slug.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-238 — Create GetGameBySlugParamsDto

### Decision

Create GetGameBySlugParamsDto.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-239 — Use games resource files

### Decision

Use games resource files.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-240 — Split frontend games components

### Decision

Split frontend games components.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-241 — Create gamesApi client

### Decision

Create gamesApi client.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-242 — Make GameGrid presentational

### Decision

Make GameGrid presentational.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-243 — Make GameCard clickable

### Decision

Make GameCard clickable.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-244 — Make GameSearchInput presentational

### Decision

Make GameSearchInput presentational.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-245 — Create GamePagination

### Decision

Create GamePagination.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-246 — Use fixed page size 20

### Decision

Use fixed page size 20.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-247 — Show result counter

### Decision

Show result counter.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-248 — Use contextual empty states

### Decision

Use contextual empty states.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-249 — Add retry error state

### Decision

Add retry error state.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-250 — Separate initial loading and updating states

### Decision

Separate initial loading and updating states.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-251 — Keep previous results behavior

### Decision

Keep previous results behavior.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-252 — Keep search/page state local

### Decision

Keep search/page state local.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-253 — Do not prefetch pages

### Decision

Do not prefetch pages.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-254 — Add clear search action

### Decision

Add clear search action.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-255 — Use onClear prop

### Decision

Use onClear prop.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-256 — Create useDebounce hook

### Decision

Create useDebounce hook.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-257 — Preserve active search during pagination

### Decision

Preserve active search during pagination.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-258 — Show Game Type as a Simple Badge

### Decision

Display gameType.name as a simple visual badge on each game card.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-259 — Use card click as the only GameCard action

### Decision

Make the full GameCard clickable and do not add a separate Play button in TASK-006.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-260 — Use a button element for clickable game cards

### Decision

Render GameCard as a semantic button element.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-261 — Include accessibility and dark mode support in the game catalog

### Decision

Include accessibility and dark mode support as part of the game catalog MVP.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-262 — Use browser/system preference for dark mode

### Decision

Use the browser/system preference for dark mode and avoid custom theme state.

### Reason

The main UI should be usable, readable, and presentable from the MVP, including keyboard and system dark mode support.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-263 — Configure Tailwind dark mode with system preference

### Decision

Configure Tailwind dark mode with darkMode: 'media'.

### Reason

The main UI should be usable, readable, and presentable from the MVP, including keyboard and system dark mode support.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-264 — Include accessibility and dark mode checks in catalog acceptance criteria

### Decision

Include accessibility and dark mode checks in catalog acceptance criteria.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-265 — Add manual accessibility validation for the game catalog

### Decision

Add manual accessibility validation for the game catalog.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-266 — Define the final acceptance state for game catalog and search

### Decision

Define the final acceptance state for game catalog and search.

### Reason

The catalog is the main entry point, and backend-owned filtering, pagination, and clear contracts make it reliable and reviewable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Favorites vertical slice


## TD-267 — Implement favorites as a dedicated vertical slice

### Decision

Implement favorites as a dedicated vertical slice after catalog.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-268 — Make favorite and unfavorite actions idempotent

### Decision

Make both favorite and unfavorite actions idempotent.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-269 — Return 404 for games that cannot be favorited

### Decision

Return 404 for games that cannot be favorited.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-270 — Invalidate game catalog queries after favorite changes

### Decision

Invalidate game catalog queries after favorite changes.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-271 — Show favorite UI only to authenticated users

### Decision

Show favorite UI only to authenticated users.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-272 — Keep favorite button accessible

### Decision

Keep favorite button accessible.

### Reason

Favorites depend on authenticated users and game catalog state, so the behavior is kept explicit and easy to refresh from backend source of truth.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Slot machine vertical slice


## TD-273 — Implement slot machine as a protected vertical slice

### Decision

Implement the Slot Machine as a protected gameplay vertical slice.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-274 — Use a shared slot engine for all games

### Decision

Use a shared slot engine for all games.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-275 — Load selected game detail in SlotMachinePage

### Decision

Load selected game detail in SlotMachinePage.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-276 — Validate game availability before spinning

### Decision

Validate game availability before spinning.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-277 — Use exact allowed bet amounts

### Decision

Use exact allowed bet amounts.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-278 — Deduct bet before applying winnings

### Decision

Deduct the bet first and then apply winnings through netAmount = payoutAmount - betAmount.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-279 — Persist every spin as append-only history

### Decision

Persist every spin as append-only history.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-280 — Use a transactional conditional balance update

### Decision

Use a database transaction and conditional balance update for each spin.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-281 — Use Math.random for MVP slot randomness

### Decision

Use Math.random for MVP slot randomness.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-282 — Return updated balance from spin response

### Decision

Return updated balance from spin response.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-283 — Add recent spin history endpoint

### Decision

Add recent spin history endpoint.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-284 — Update AuthProvider balance after spin

### Decision

Update AuthProvider balance after spin.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-285 — Keep slot UI accessible and dark-mode compatible

### Decision

Keep slot UI accessible and dark-mode compatible.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-286 — Display slot symbols with emoji and accessible text

### Decision

Display slot symbols using emoji plus readable text labels.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Currency conversion vertical slice


## TD-287 — Keep currency conversion display-only

### Decision

Keep currency conversion display-only and never modify stored balance.

### Reason

Currency conversion is required as display-only functionality, and backend ownership protects provider details and consistency.

### Trade-offs

The trade-off is no multi-currency wallet support, but the feature matches the assessment requirement without financial complexity.


## TD-288 — Convert balance on the backend

### Decision

Convert balance on the backend.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-289 — Add GET /currencies for supported currency selection

### Decision

Add GET /currencies for supported currency selection.

### Reason

Currency conversion is required as display-only functionality, and backend ownership protects provider details and consistency.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-290 — Use one-hour server-side exchange rate cache

### Decision

Use one-hour server-side exchange rate cache.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is potential short-lived staleness in exchange for simpler performance improvement.


## TD-291 — Place currency conversion UI in SlotMachinePage

### Decision

Place currency conversion UI in SlotMachinePage.

### Reason

Slot gameplay is the core protected business flow, so the decision keeps the implementation deterministic, auditable, and aligned with the assessment rules.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-292 — Require explicit Convert button

### Decision

Require explicit Convert button.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-293 — Return decimal money values as strings

### Decision

Return decimal money values as strings.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Security hardening


## TD-294 — Consolidate security hardening in a dedicated task

### Decision

Create a dedicated security-hardening task to make security controls explicit.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-295 — Use Helmet for security headers

### Decision

Use Helmet for security headers.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-296 — Restrict CORS by environment

### Decision

Restrict CORS by environment.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-297 — Use Global ValidationPipe strictly

### Decision

Use Global ValidationPipe strictly.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-298 — Apply endpoint-specific rate limiting

### Decision

Apply endpoint-specific rate limiting.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-299 — Never log sensitive authentication data

### Decision

Never log sensitive authentication data.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-300 — Keep error responses safe

### Decision

Keep error responses safe.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# API documentation


## TD-301 — Document API with Swagger/OpenAPI

### Decision

Expose Swagger/OpenAPI documentation at /api/docs.

### Reason

Clear documentation makes the project easier to evaluate, run, and defend in a technical review.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-302 — Use cookie authentication in Swagger

### Decision

Use cookie authentication in Swagger.

### Reason

Cookie-based authentication reduces exposure of JWTs to client-side JavaScript and keeps the authentication flow close to production practices.

### Trade-offs

The trade-off is slightly more CORS/cookie configuration compared with bearer tokens, but stronger browser-side security.


## TD-303 — Add README API summary

### Decision

Add README API summary.

### Reason

Clear documentation makes the project easier to evaluate, run, and defend in a technical review.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-304 — Include manual curl examples

### Decision

Include manual curl examples.

### Reason

Clear documentation makes the project easier to evaluate, run, and defend in a technical review.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Testing strategy


## TD-305 — Focus tests on critical business rules

### Decision

Focus automated tests on critical business rules and user interactions.

### Reason

Focused tests demonstrate quality on the riskiest logic while keeping the assessment scope achievable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-306 — Do not enforce a global coverage threshold

### Decision

Do not enforce a global coverage threshold.

### Reason

Focused tests demonstrate quality on the riskiest logic while keeping the assessment scope achievable.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-307 — Mock external exchange rate API in tests

### Decision

Mock external exchange rate API in tests.

### Reason

Security controls are required by the assessment and make the application safer without overbuilding the MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-308 — Keep frontend tests component-focused

### Decision

Keep frontend tests component-focused.

### Reason

Focused tests demonstrate quality on the riskiest logic while keeping the assessment scope achievable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-309 — Treat manual accessibility validation as part of done

### Decision

Treat manual accessibility validation as part of done.

### Reason

Explicit DTO validation protects the API boundary and makes request behavior predictable.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


# Deployment, README, and final conventions


## TD-310 — Deploy MVP on Render

### Decision

Deploy the MVP using Render services.

### Reason

Render provides a simple cloud deployment path for a technical assessment without adding infrastructure complexity.

### Trade-offs

The trade-off is reduced feature breadth in exchange for a clearer and more reliable MVP.


## TD-311 — Deploy frontend as static site

### Decision

Deploy frontend as static site.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-312 — Deploy backend as web service

### Decision

Deploy backend as web service.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-313 — Use Prisma migrate deploy in production

### Decision

Use Prisma migrate deploy in production.

### Reason

Prisma gives typed database access, migration management, and a clear schema source for PostgreSQL.

### Trade-offs

The trade-off is less low-level query control, but the code remains safer and easier to maintain.


## TD-314 — Include assessment requirement mapping in README

### Decision

Include assessment requirement mapping in README.

### Reason

Clear documentation makes the project easier to evaluate, run, and defend in a technical review.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-315 — Document known limitations honestly

### Decision

Document known limitations honestly.

### Reason

This decision keeps the MVP consistent with the previously defined architecture, reduces ambiguity, and supports a controlled AI-assisted implementation workflow.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.


## TD-316 — Use plural table names and singular code models

### Decision

Use plural snake_case SQL table names and singular PascalCase Prisma/code models.

### Reason

A relational model fits the normalized data requirements, relationships, constraints, and audit history of the casino MVP.

### Trade-offs

The trade-off is accepted because the decision improves clarity, maintainability, or assessment alignment without adding unnecessary complexity.

