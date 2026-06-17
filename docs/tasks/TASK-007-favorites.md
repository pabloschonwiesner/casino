# TASK-007 — Favorites

## Goal

Allow authenticated users to favorite and unfavorite games.

## Backend

Endpoints:

- `POST /favorites/:gameId`
- `DELETE /favorites/:gameId`

Rules:

- protected with JwtAuthGuard;
- validate UUID;
- game must exist, be active, and available in user's country;
- unavailable game returns 404 `Game not found.`;
- favorite is idempotent;
- unfavorite is idempotent;
- response returns `gameId` and `isFavorite`.

## Frontend

- `favoritesApi.ts`
- `FavoriteButton.tsx`
- update `GameCard`
- update `GamesPage`

Rules:

- show favorite button only for authenticated users;
- hide favorite UI for guests;
- favorite button uses aria-label and aria-pressed;
- favorite button stops event propagation;
- invalidate `['games']` after mutation;
- no optimistic update required.

## Acceptance Criteria

- favorite/unfavorite endpoints work.
- duplicate favorites prevented.
- guest does not see favorite UI.
- authenticated user can toggle favorite.
- catalog refreshes after toggle.
- favorite UI is accessible and dark-mode compatible.

## Suggested Commit

```bash
git add .
git commit -m "feat: implement favorite games"
```
