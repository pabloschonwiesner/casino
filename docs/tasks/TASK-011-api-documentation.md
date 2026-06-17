# TASK-011 — API Documentation

## Goal

Document backend API using Swagger/OpenAPI and README examples.

## Scope

- install Swagger;
- expose `/api/docs`;
- add cookie auth scheme;
- document controllers and DTOs;
- add README API table;
- add curl examples.

## Required Sections

- Auth
- Countries
- Currencies
- Games
- Favorites
- Slots
- Balance conversion
- Errors
- Rate limiting

## Acceptance Criteria

- Swagger loads at `/api/docs`.
- cookie auth documented.
- key endpoints documented.
- README has API summary.
- README has cookie-auth curl examples.

## Suggested Commit

```bash
git add .
git commit -m "docs: add API documentation"
```
