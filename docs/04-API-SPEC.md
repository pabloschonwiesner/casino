#  Casino — API Specification

## 1. Base URL

Local backend:

```text
http://localhost:3000
```

Production backend:

```text
<backend-live-url>
```

## 2. Authentication

Authentication uses a JWT stored in an HttpOnly cookie named `access_token`.

Frontend requests must include credentials.

## 3. Response Conventions

Decimal money values are returned as strings.

Paginated responses use:

```ts
type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
```

## 4. Auth Endpoints

### POST /auth/register

Auth: Public

Request:

```json
{
  "email": "demo@example.com",
  "password": "Password123!",
  "countryIso2": "MT"
}
```

Response: `201 Created`

```json
{
  "user": {
    "id": "user-id",
    "email": "demo@example.com",
    "balance": "20.00",
    "countryIso2": "MT",
    "preferredCurrencyCode": "EUR"
  }
}
```

Sets `access_token` cookie.

Errors:

- `400 Bad Request` validation error;
- `409 Conflict` duplicate email.

### POST /auth/login

Auth: Public

Request:

```json
{
  "email": "demo@example.com",
  "password": "Password123!"
}
```

Response: `200 OK`

Sets `access_token` cookie.

Errors:

- `401 Unauthorized` with `Invalid email or password.`

### GET /auth/me

Auth: Required

Response: `200 OK`

Returns authenticated user.

Errors:

- `401 Unauthorized`

### POST /auth/logout

Auth: Required

Response: `200 OK`

Clears `access_token` cookie.

## 5. Countries

### GET /countries

Auth: Public

Response:

```json
{
  "data": [
    {
      "iso2": "MT",
      "iso3": "MLT",
      "name": "Malta",
      "flagUrl": "https://flagcdn.com/mt.svg",
      "currencyCode": "EUR"
    }
  ]
}
```

## 6. Currencies

### GET /currencies

Auth: Public

Response:

```json
{
  "data": [
    {
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "decimalPlaces": 2,
      "flagUrl": "https://flagcdn.com/mt.svg"
    }
  ]
}
```

## 7. Games

### GET /games

Auth: Optional

Query:

```text
q?: string
page?: number default 1
limit?: number default 20 max 50
```

Response:

```json
{
  "data": [
    {
      "id": "game-id",
      "slug": "legacy-of-dead",
      "title": "Legacy of Dead",
      "providerName": "Play'n GO",
      "thumbnailUrl": "https://...",
      "gameType": {
        "code": "slot",
        "name": "Slot"
      },
      "isFavorite": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

Guest behavior:

- all active games;
- `isFavorite: false`;
- ordered by title ASC;
- public cache 60 seconds.

Authenticated behavior:

- games available in user's country;
- real favorite state;
- favorites first, then title ASC.

### GET /games/:slug

Auth: Optional

Response includes `startUrl`:

```json
{
  "id": "game-id",
  "slug": "legacy-of-dead",
  "title": "Legacy of Dead",
  "providerName": "Play'n GO",
  "thumbnailUrl": "https://...",
  "startUrl": "https://...",
  "gameType": {
    "code": "slot",
    "name": "Slot"
  },
  "isFavorite": false
}
```

Errors:

- `404 Not Found` with `Game not found.`

## 8. Favorites

### POST /favorites/:gameId

Auth: Required

Response:

```json
{
  "gameId": "game-id",
  "isFavorite": true
}
```

Idempotent.

### DELETE /favorites/:gameId

Auth: Required

Response:

```json
{
  "gameId": "game-id",
  "isFavorite": false
}
```

Idempotent.

Errors:

- `400 Bad Request` invalid UUID;
- `401 Unauthorized`;
- `404 Not Found` with `Game not found.`

## 9. Slots

### POST /slots/spin

Auth: Required

Request:

```json
{
  "gameId": "game-id",
  "betAmount": "1.00"
}
```

Response:

```json
{
  "spinId": "spin-id",
  "gameId": "game-id",
  "reels": ["cherry", "cherry", "lemon"],
  "betAmount": "1.00",
  "payoutAmount": "40.00",
  "netAmount": "39.00",
  "balanceBefore": "20.00",
  "balanceAfter": "59.00",
  "createdAt": "2026-06-16T00:00:00.000Z"
}
```

Errors:

- `400 Bad Request` invalid bet or insufficient balance;
- `401 Unauthorized`;
- `404 Not Found` game not found.

### GET /slots/history

Auth: Required

Query:

```text
limit?: number default 10 max 50
```

Response:

```json
{
  "data": [
    {
      "spinId": "spin-id",
      "gameId": "game-id",
      "gameTitle": "Legacy of Dead",
      "reels": ["cherry", "cherry", "lemon"],
      "betAmount": "1.00",
      "payoutAmount": "40.00",
      "netAmount": "39.00",
      "balanceBefore": "20.00",
      "balanceAfter": "59.00",
      "createdAt": "2026-06-16T00:00:00.000Z"
    }
  ]
}
```

## 10. Balance Conversion

### POST /users/me/balance/convert

Auth: Required

Request:

```json
{
  "targetCurrencyCode": "EUR"
}
```

Response:

```json
{
  "balance": "20.00",
  "baseCurrencyCode": "USD",
  "targetCurrencyCode": "EUR",
  "exchangeRate": "0.920000",
  "convertedBalance": "18.40",
  "asOf": "2026-06-16T00:00:00.000Z"
}
```

Rules:

- display-only;
- stored balance is not modified;
- 1 coin = 1 USD;
- exchange rates are cached server-side.

## 11. Standard Error Statuses

```text
400 Bad Request - validation error or invalid operation
401 Unauthorized - protected endpoint without valid auth
404 Not Found - unavailable game/resource
409 Conflict - duplicate email
429 Too Many Requests - rate limit
500 Internal Server Error - unexpected error
```
