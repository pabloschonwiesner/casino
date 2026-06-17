# TASK-001 — Scaffold Frontend and Backend

## Goal

Create the initial monorepo structure with separate frontend and backend applications.

## Scope

- Create `frontend/` using React + Vite + TypeScript.
- Create `backend/` using NestJS + TypeScript.
- Add root documentation folder.
- Add initial scripts and environment examples.

## Commands

```bash
npm create vite@latest frontend -- --template react-ts
nest new backend
mkdir -p docs/tasks
```

## Acceptance Criteria

- `frontend` app starts locally.
- `backend` app starts locally.
- root repo structure is clear.
- `.env.example` files exist.
- initial README exists.

## Suggested Commit

```bash
git add .
git commit -m "chore: scaffold frontend and backend"
```
