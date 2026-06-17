# TASK-005 — Authentication

## Goal

Implement registration, login, logout, current user, and protected frontend routing.

## Backend Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /countries`

## Rules

- JWT stored in HttpOnly cookie.
- New user starts with 20.00 coins.
- Email is normalized lowercase.
- Password is hashed with bcryptjs.
- Country is selected at registration.
- Preferred currency is derived from selected country.

## Frontend

- AuthProvider.
- Login page.
- Register page.
- ProtectedRoute.
- redirectTo support.

## Acceptance Criteria

- users can register.
- users can login.
- users can logout.
- `/auth/me` works with cookie.
- protected route redirects guests.
- JWT is not stored in localStorage.

## Suggested Commit

```bash
git add .
git commit -m "feat: implement authentication"
```
