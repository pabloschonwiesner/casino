# TASK-010 — Security Hardening

## Goal

Make security measures explicit and reviewable.

## Scope

- Helmet.
- restricted CORS.
- ValidationPipe.
- DTO validation review.
- guards review.
- rate limiting.
- request logging.
- safe error responses.
- cookie security review.
- README security notes.

## Requirements

- JWT cookie HttpOnly.
- Secure cookie in production.
- SameSite=Lax.
- no JWT localStorage.
- CORS restricted by FRONTEND_URL.
- no wildcard CORS with credentials.
- no sensitive logging.
- auth/register/spin rate limits.

## Acceptance Criteria

- Helmet enabled.
- CORS configured.
- global validation enabled.
- protected endpoints guarded.
- optional endpoints use optional guard.
- rate limiting configured.
- safe errors returned.
- security documented.

## Suggested Commit

```bash
git add .
git commit -m "chore: harden application security"
```
