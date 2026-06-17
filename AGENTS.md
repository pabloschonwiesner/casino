# AGENTS.md

## Purpose

This file gives rules for AI coding agents and development assistants working on Casino.

The project follows a light SDD workflow. Agents must read documentation before coding and must not invent contracts, schema, or product behavior.

## Required Reading Order

Before implementing a task, read:

1. `README.md`
2. `docs/01-PRD.md`
3. `docs/02-TECHNICAL-DESIGN.md`
4. `docs/03-DATABASE-DESIGN.md`
5. `docs/04-API-SPEC.md`
6. `docs/07-TECHNICAL-DECISIONS.md`
7. the specific task file in `docs/tasks/`

## General Rules

- Use TypeScript.
- Keep MVP scope.
- Follow task order.
- Do not invent new database tables without updating docs first.
- Do not invent new endpoints without updating API spec first.
- Do not store JWT in localStorage.
- Use HttpOnly cookie auth.
- Return decimal money values as strings.
- Keep UI accessible and keyboard-friendly.
- Support dark mode through system preference.
- Run relevant tests/builds before marking work complete.

## Backend Rules

- Use NestJS modules.
- Validate bodies, params, and queries with DTOs.
- Use Prisma for DB access.
- Use guards for protected endpoints.
- Use optional auth guard only for catalog endpoints.
- Do not expose stack traces or raw DB errors.
- Do not log passwords, cookies, or JWTs.

## Frontend Rules

- Use React with Vite.
- Use React Router.
- Use TanStack Query for server state.
- Use semantic HTML.
- Use real buttons for actions.
- Use accessible labels.
- Use semantic Tailwind/shadcn-compatible classes.
- Do not add a manual theme toggle.

## Slot Machine Rules

- Use fixed reels from the assessment.
- Use exact payout rules from the assessment.
- 2 lemons do not win.
- Wins are consecutive from the left only.
- Only the highest applicable payout for a single spin should be awarded
- Wins are not cumulative.
- Spin updates and history insert must be transactional.

## AI Usage Rule

AI can assist with implementation, refactoring, tests, and documentation, but the developer is responsible for final validation and submission.
