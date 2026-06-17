# TASK-006 — Game Catalog and Search

## Goal

Implement backend-powered game catalog and search.

## Backend

Endpoints:

- `GET /games?q=&page=&limit=`
- `GET /games/:slug`

Behavior:

- optional authentication;
- guests see active games;
- auth users see games available in their country;
- auth users see favorite state;
- auth users get favorites first;
- search title and provider;
- pagination default page 1, limit 20, max 50;
- public guest cache 60 seconds.

## Frontend

Components:

- GamesPage
- GameGrid
- GameCard
- GameSearchInput
- GamePagination
- useDebounce

Rules:

- 500ms debounce.
- local search/page state.
- no URL query sync.
- fixed limit 20.
- card is `<button type="button">`.
- card has aria-label.
- no Play button.
- no favorite star yet.
- game type as badge.
- thumbnail fallback says `No image`.
- guest click navigates to `/login?redirectTo=/slot-machine/:gameSlug`.
- auth click navigates to `/slot-machine/:gameSlug`.

## Accessibility and Dark Mode

- keyboard focusable cards;
- visible focus;
- labeled search input;
- pagination nav with aria-label;
- readable loading/error/empty states;
- Tailwind `darkMode: "media"`;
- system preference dark mode;
- no theme toggle.

## Acceptance Criteria

- catalog loads real backend data.
- backend search works.
- pagination works.
- optional auth works.
- cache works for guest catalog.
- game detail works.
- frontend search debounce works.
- cards navigate correctly.
- UI is accessible.
- UI works in light/dark mode.

## Suggested Commit

```bash
git add .
git commit -m "feat: implement game catalog and search"
```
