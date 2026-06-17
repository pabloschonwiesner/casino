#  Casino — Testing Strategy

## 1. Goal

The testing strategy focuses on critical business rules and main user interactions without overbuilding the assessment project.

The goal is not 100% coverage. The goal is meaningful coverage over high-risk areas.

## 2. Testing Philosophy

Use a practical test pyramid:

- more unit tests for business rules;
- some API smoke tests for critical flows;
- some frontend component tests for user interactions;
- manual validation for accessibility, dark mode, and deployment.

## 3. Backend Tests

Backend uses:

- Jest;
- Nest TestingModule;
- Supertest;
- mocked external services where needed.

### Critical Backend Unit Tests

#### SlotPayoutService

Must test:

- 3 cherries pays bet × 50;
- 2 cherries pays bet × 40;
- 3 apples pays bet × 20;
- 2 apples pays bet × 10;
- 3 bananas pays bet × 15;
- 2 bananas pays bet × 5;
- 3 lemons pays bet × 3;
- 2 lemons do not win;
- Apple Cherry Apple does not win;
- Apple Apple Cherry wins 2 apples;
- Cherry Cherry Lemon wins 2 cherries;
- Banana Banana Banana wins 3 bananas;
- Lemon Lemon Apple does not win;
- wins are based on consecutive symbols from the left;
- wins are not cumulative;
- netAmount = payoutAmount - betAmount.

#### SlotRandomService

Must test:

- returns exactly 3 symbols;
- symbol 1 belongs to reel 1;
- symbol 2 belongs to reel 2;
- symbol 3 belongs to reel 3;
- symbols are valid.

Do not test statistical randomness.

#### AuthService

Must test:

- register normalizes email;
- duplicate email is rejected;
- password is hashed;
- user starts with 20.00 balance;
- preferred currency is derived from country;
- invalid login is rejected;
- passwordHash is never returned.

#### GamesService

Must test:

- guest catalog returns active games;
- guest catalog returns `isFavorite: false`;
- guest catalog orders by title ASC;
- authenticated catalog filters by country;
- authenticated catalog derives favorite state;
- authenticated catalog orders favorites first;
- search trims q;
- empty q does not filter;
- search matches title and provider;
- pagination meta is correct;
- public cache is used for guest catalog;
- auth catalog is not cached.

#### FavoritesService

Must test:

- favorite creates favorite;
- favorite is idempotent;
- unavailable game returns not found;
- unfavorite removes favorite;
- unfavorite is idempotent;
- user cannot favorite game unavailable in their country.

#### ExchangeRatesService and Balance Conversion

Must test:

- exchange rates are cached;
- unsupported currency is rejected;
- conversion uses 1 coin = 1 USD;
- conversion does not update stored balance;
- convertedBalance rounds correctly;
- decimal values return as strings.

External exchange provider must be mocked.

## 4. Backend API Smoke Tests

Use Supertest.

Minimum smoke tests:

- `POST /auth/register` returns 201 and sets cookie;
- `POST /auth/login` returns 200 and sets cookie;
- `GET /auth/me` without cookie returns 401;
- `GET /games` works as guest;
- `GET /games?q=legacy` works as guest;
- `POST /favorites/:gameId` without cookie returns 401;
- `POST /slots/spin` without cookie returns 401;
- `POST /users/me/balance/convert` without cookie returns 401.

Optional full smoke flow:

```text
register -> get games -> favorite game -> spin -> get history -> convert balance
```

## 5. Frontend Tests

Frontend uses:

- Vitest;
- React Testing Library;
- @testing-library/user-event;
- jsdom.

### Component Tests

#### GameCard

Must test:

- renders title;
- renders provider;
- renders game type badge;
- renders thumbnail;
- renders fallback when thumbnail is null;
- calls onClick;
- uses button semantics;
- has accessible name.

#### GameSearchInput

Must test:

- accessible label;
- typing calls onChange;
- clear button appears when value exists;
- clear button calls onClear;
- background fetching text appears.

#### GamePagination

Must test:

- Page X of Y;
- No pages state;
- Previous disabled on first page;
- Next disabled on last page;
- nav has accessible label.

#### FavoriteButton

Must test:

- add favorite state;
- remove favorite state;
- aria-pressed;
- accessible label;
- pending disabled state.

#### Slot Components

Must test:

- ReelDisplay placeholders;
- ReelDisplay emoji + text;
- BetSelector allowed values;
- SpinButton pending state;
- SpinResult win/loss/break-even text.

#### CurrencyConverter

Must test:

- selector loads;
- Convert button exists;
- display-only warning appears;
- conversion runs only on button click;
- converted result appears;
- error message appears.

#### Authenticated Navbar

Must test:

- shows user identity;
- shows balance;
- opens currency converter popover/dropdown;
- shows logout action in the same dropdown;
- keeps controls accessible by keyboard.

### E2E Tests

Must test:

- user registration flow;
- complete spin flow and spin persistence, regardless of win or loss.

## 6. Accessibility Testing

Automated checks focus on roles and labels with React Testing Library.

Manual validation remains required for:

- keyboard tab flow;
- visible focus;
- screen-reader-readable text;
- dark mode readability.

Optional package if time allows:

```bash
npm install -D jest-axe
```

## 7. Coverage Policy

No strict global coverage threshold is required.

Reason:

- this is an MVP assessment;
- meaningful tests are better than artificial coverage;
- focus should be on business-critical behavior.

## 8. Commands

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

## 9. Manual Validation

Manual validation must include:

- catalog search;
- pagination;
- auth flow;
- favorite toggle;
- slot spin;
- balance update;
- spin history;
- currency conversion;
- dark mode;
- keyboard navigation;
- authenticated navbar;
- deployed URLs.
