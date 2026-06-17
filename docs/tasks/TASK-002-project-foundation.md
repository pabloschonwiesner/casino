# TASK-002 — Project Foundation

## Goal

Add base project conventions and frontend/backend foundations.

## Scope

- Configure frontend routing.
- Add base layout.
- Add HTTP client with credentials support.
- Add TanStack Query.
- Add Tailwind CSS and shadcn-compatible styling.
- Add base backend config conventions.
- Add shared constants where needed.

## Frontend Requirements

- React Router configured.
- Routes for `/games`, `/login`, `/register`, `/slot-machine/:gameSlug`.
- Root redirects to `/games`.
- HTTP client uses `credentials: include` or `withCredentials`.
- Tailwind uses `darkMode: "media"`.

## Acceptance Criteria

- frontend foundation compiles.
- backend foundation compiles.
- routing skeleton exists.
- placeholder pages exist.
- project conventions are documented.

## Suggested Commit

```bash
git add .
git commit -m "chore: add project foundation"
```
