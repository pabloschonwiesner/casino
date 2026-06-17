# TASK-009 — Currency Conversion

## Goal

Convert current virtual coin balance to another currency for display only.

## Backend

Endpoints:

- `GET /currencies`
- `POST /users/me/balance/convert`

Rules:

- conversion endpoint protected;
- target currency must exist;
- unsupported currency returns 400 `Unsupported currency.`;
- 1 coin = 1 USD;
- conversion performed on backend;
- exchange rate cached for 1 hour;
- stored balance is not modified;
- decimal values returned as strings.

## Frontend

Component:

- `CurrencyConverter.tsx`

Placement:

- inside SlotMachinePage.

Behavior:

- load currencies;
- default to user's preferred currency;
- convert only when user clicks button;
- display converted balance, exchange rate, timestamp;
- show warning: display-only conversion.

## Acceptance Criteria

- currencies endpoint works.
- conversion endpoint works.
- external provider is server-side only.
- cache works.
- stored balance does not change.
- UI is accessible and dark-mode compatible.

## Suggested Commit

```bash
git add .
git commit -m "feat: add balance currency conversion"
```
