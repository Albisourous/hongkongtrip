# AGENTS.md

Guidance for agents working on this repo.

## What this is

Static, dependency-free trip tracker for HK · Shenzhen · Macau
(Sep 25 – Oct 3, 2026, 8 people). No build step, no frameworks.
Deployed via GitHub Pages from `main`.

## Architecture

| File | Role |
|---|---|
| `data.js` | Single source of truth — global `const TRIP`. Edit this to update people, costs, itinerary. |
| `app.js` | Renders `TRIP` into the DOM and computes splits/settlement. No data lives here. |
| `index.html` | Static shell: five empty `<section>`s (`#overview`, `#itinerary`, `#costs`, `#split`, `#settlement`), loads `data.js` then `app.js` at end of body. |
| `styles.css` | All styling. CSS variables on `:root`, dark mode via `prefers-color-scheme`. Mobile-first. |
| `tracker.md` | Original planning brief (source doc — do not edit). |

## Cost/split model (important)

- Split is **per leg**, never a flat trip total. `people[].legs` lists which
  leg ids a person attends — this drives both headcount and their share.
- A cost enters the split/settlement **only if `frontedBy` is set**:
  - `total` set → each leg attendee owes `total / headcount` to the fronter.
  - `perPerson` set → each leg attendee owes `perPerson` to the fronter.
- `frontedBy: null` → informational only (everyone pays their own).
- `null` = TBD. Render as "TBD", exclude from all math.
- Excluded from the group split by default: flights (booked individually),
  the Sep 29–30 medical block, and Sam's Tailor (all personal spend).
- Points bookings: record points used AND a cash-equivalent `total` so the
  fronter is reimbursed fairly.

## Conventions

- Vanilla HTML/CSS/JS only. No dependencies, no build, no external assets.
- `app.js` builds DOM via `createElement`/`textContent` — never `innerHTML`
  with data values.
- Money is USD, `$` + `toFixed(2)`, `.money` class, tabular numerals.
- Shared class vocabulary (styled in `styles.css`, emitted by `app.js`):
  `.table-wrap`, `.money`, `.tbd`, `.badge`, `.badge-booked`,
  `.badge-to-book`, `.total-row`, `.pos`, `.neg`, `.muted`, `.cards`,
  `.card`, `.picker`.
- Commits: small, one concern each, imperative subject lines.

## Verify

```sh
node --check data.js app.js   # syntax
python3 -m http.server 8000   # then open http://localhost:8000
```

Check: all five sections render, TBDs show for null costs, split table
sums match the cost table, settlement balances sum to ~$0.

## Outstanding TBDs (collect from trip owner)

- Shenzhen hotel choice + total (Hyatt Place Dongmen points vs Kapok Luohu cash)
- Macau hotel + total (book ASAP — Golden Week)
- SkyCity Marriott cash total
- HK1 Airbnb sleeps 7 but 8 people attend that leg — confirm rooming
- Who fronts remaining bookings
