# AGENTS.md

Guidance for agents working on this repo.

## What this is

Static, dependency-free trip tracker for HK · Shenzhen · Macau
(Sep 25 – Oct 3, 2026, 9 people). No build step, no frameworks.
Deployed via GitHub Pages from `main`.

## Architecture

Multi-page static site — one HTML shell per page, one JS + one CSS each.
Every page loads `data.js` + `styles.css`, renders into `<main id="app">`,
and shares the fixed bottom tab nav (`.tabs`).

| Page | Shell | JS | Page CSS | Owns |
|---|---|---|---|---|
| Home | `index.html` | `js/home.js` | `css/home.css` | What/where/when, leg cards, roster |
| Days | `days.html` | `js/days.js` | `css/days.css` | Day-by-day plan, swipe, checklists |
| Bookings | `bookings.html` | `js/bookings.js` | `css/bookings.css` | What still needs booking (red) |
| Payments | `payments.html` | `js/payments.js` | `css/payments.css` | Splits, settlement, paid ledger |

Shared files (coordinate before editing): `data.js`, `styles.css`,
`tracker.md` (source brief — do not edit), this file.

The previous single-page `app.js` was removed; its split/settlement and
checklist logic can be recovered with `git show aec6870:app.js`.

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
- `TRIP.days` holds per-day plans: `morning`/`afternoon`/`evening` blocks
  (null = nothing planned), `stay`, `notes`, and `checklist` items
  (`{t, task}` — t is a rough start time). Checklist state persists in
  localStorage (`hkcheck:{date}:{index}`). Payment marks use
  `hkpaid:{from}>{to}`; booking marks use `hkbooked:{costId}`.
- `js/sync.js` (`window.SyncStore`, loaded on Days/Bookings/Payments)
  syncs those marks across devices via a free JSON bin
  (extendsclass json-storage — no auth, anyone with the URL can write).
  Keys merge last-write-wins by timestamp; localStorage mirrors state so
  pages work offline. Pages call `SyncStore.onChange(rerender)`; if the
  script is unreachable they fall back to a localStorage-only shim.
- Shared class vocabulary (styled in `styles.css`): `.table-wrap`,
  `.money`, `.tbd`, `.badge`, `.badge-booked`, `.badge-to-book` (red),
  `.total-row`, `.pos`, `.neg`, `.muted`, `.cards`, `.card`, `.picker`,
  `.day-chips`, `.day-chip`, `.day-detail`, `.block`, `.block-label`,
  `.checklist`, `.time`, `.tabs`. Page-specific classes go in
  `css/<page>.css`, prefixed `.home-`, `.day-`, `.book-`, `.pay-`.
- Commits: small, one concern each, imperative subject lines. Author as
  the repo-local identity (`Albisourous <albinshrestha01@gmail.com>`) —
  GitHub attributes by email. Do NOT add `Co-Authored-By` or
  `Generated with` trailers; they make the bot show up as a contributor.

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
- HK1 Airbnb sleeps 7 but 9 people attend that leg — confirm rooming
- Who fronts remaining bookings
