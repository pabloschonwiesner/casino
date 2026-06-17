# TASK-008 — Slot Machine

## Goal

Implement protected Slot Machine gameplay with virtual coins and persistent spin history.

## Backend

Endpoints:

- `POST /slots/spin`
- `GET /slots/history?limit=10`

Rules:

- protected with JwtAuthGuard;
- validate game and bet;
- validate game availability by country;
- insufficient balance returns 400 `Insufficient balance.`;
- update balance and insert spin history in a single transaction;
- return spin id, reels, amounts, balances, timestamp.

## Reels

```ts
const SLOT_REELS = [
  ["cherry", "lemon", "apple", "lemon", "banana", "banana", "lemon", "lemon"],
  ["lemon", "apple", "lemon", "lemon", "cherry", "apple", "banana", "lemon"],
  ["lemon", "apple", "lemon", "apple", "cherry", "lemon", "banana", "lemon"],
];
```

## Payouts

- 3 cherries: bet × 50
- 2 cherries: bet × 40
- 3 apples: bet × 20
- 2 apples: bet × 10
- 3 bananas: bet × 15
- 2 bananas: bet × 5
- 3 lemons: bet × 3

Only consecutive symbols from the left count. Wins are not cumulative. 2 lemons do not win.

## Frontend

- SlotMachinePage
- ReelDisplay
- BetSelector
- SpinButton
- SpinResult
- SpinHistoryList

Symbols display as emoji plus accessible text:

- 🍒 Cherry
- 🍋 Lemon
- 🍎 Apple
- 🍌 Banana

## Acceptance Criteria

- protected slot page works.
- game detail loads by slug.
- invalid game redirects to `/games`.
- spin endpoint works.
- payout rules are correct.
- balance updates.
- history persists.
- recent history displays.
- UI is accessible and dark-mode compatible.

## Suggested Commit

```bash
git add .
git commit -m "feat: implement slot machine gameplay"
```
