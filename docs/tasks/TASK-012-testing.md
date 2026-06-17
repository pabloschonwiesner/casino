# TASK-012 — Testing Strategy

## Goal

Add focused tests for critical business logic and UI behavior.

## Backend Tests

- SlotPayoutService.
- SlotRandomService.
- AuthService.
- GamesService.
- FavoritesService.
- ExchangeRatesService.
- API smoke tests with Supertest.

## E2E Tests

- user registration flow;
- complete spin flow and spin persistence, regardless of win or loss.

## Frontend Tests

- GameCard.
- GameSearchInput.
- GamePagination.
- FavoriteButton.
- Slot components.
- CurrencyConverter.

## Rules

- mock external exchange API;
- no strict global coverage threshold;
- test critical business rules;
- manual accessibility validation remains required.

## Acceptance Criteria

- important backend tests exist.
- important frontend tests exist.
- external API is mocked.
- test commands documented.
- tests pass.

## Suggested Commit

```bash
git add .
git commit -m "test: add critical backend and frontend tests"
```
