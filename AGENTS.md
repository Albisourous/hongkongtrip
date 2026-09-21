# AGENTS.md

Guidance for agents working on this repo.

## What this is

Static, dependency-free trip tracker for HK · Guangzhou · Shenzhen ·
Macau (Sep 25 – Oct 3, 2026, 9 people). No build step, no frameworks.
Deployed via GitHub Pages from `main`.

## Architecture

Multi-page static site — one HTML shell per page, one JS + one CSS each.
Every page loads `data.js` + `styles.css`, renders into `<main id="app">`,
and shares the fixed bottom tab nav (`.tabs`).

| Page | Shell | JS | Page CSS | Owns |
|---|---|---|---|---|
| Home | `index.html` | `js/home.js` | `css/home.css` | What/where/when, leg cards, roster |
| Days | `days.html` | `js/days.js` | `css/days.css` | Day-by-day plan, swipe, checklists, per-day mini map |
| Map | `map.html` | `js/map.js` | `css/map.css` | Interactive POI map (Leaflet + Amap tiles) |
| Bookings | `bookings.html` | `js/bookings.js` | `css/bookings.css` | What still needs booking + checkable reminders (red), who sleeps where, per-stay cost split |
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
- `exclude: [ids]` on a cost → those people paid their own and are left
  out of that cost's split (e.g. Kevin Li booked his own flight).
- `settled: [ids]` on a cost → those people already paid the fronter —
  still shown in splits (with a ✓ in the ledger) but netted out of the
  settlement table (e.g. Albin + Scott paid Ehsan for flights).
- `null` = TBD. Render as "TBD", exclude from all math.
- `sleeps` on a hotel cost = bed capacity; the Bookings tab compares it
  to the leg's headcount and flags shortfalls.
- Excluded from the group split: Sam's Tailor (personal spend). Flights
  are fronted by Ehsan and sit on `hk1` so they split across 7 — Kevin
  Li + Brendan paid their own ($456/person confirmed). `cat: "Flight"` and
  `cat: "Hotel"` costs render as their own `FLT`/`HTL` columns in the
  split table instead of inside the leg column.
- Sep 28 all six mainland travelers take the `gz` leg in Guangzhou (one
  night at the Grand Hyatt), then night-train to Shenzhen on Sep 29 —
  everyone on `sz` needs the Sep 29 + Sep 30 hotel nights. Brendan
  attends `hk1` only; Ehsan & Scott skip mainland (solo); Kevin Li skips
  `mo` and `hk2` — own way back to HK after Shenzhen.
- Settlement shows fronted/owes/net per person plus a "who to pay" line
  per fronter (flights → Ehsan, hotels → Albin) — no payment suggestions
  or netting. Who has paid is tracked via `settled: [ids]` in data.js.
- Points bookings: record points used AND a cash-equivalent `total` so the
  fronter is reimbursed fairly.

## Conventions

- Vanilla HTML/CSS/JS only. No dependencies, no build, no external assets —
  the one exception is `vendor/leaflet/` (Leaflet 1.9.4 vendored for the Map
  page so nothing loads from a CDN).
- Pages build DOM via `createElement`/`textContent` — never `innerHTML`
  with data values.
- The Map page uses Amap raster tiles (`webrd0{1-4}.is.autonavi.com`,
  `lang=zh_en` bilingual) — the only mainstream basemap reachable on
  mainland networks without an API key. `TRIP.places` coords are WGS-84;
  `js/geo.js` (`window.GeoKit`) converts them to GCJ-02 ("Mars
  coordinates") and holds the shared tile URL, pin icon and popup
  builders — used by both the Map page and the per-day mini maps on
  Days. `places[].day` strings ("Sep 25", "Sep 25/27", "Sep 25–28")
  decide which day a pin shows on.
- Money is USD, `$` + `toFixed(2)`, `.money` class, tabular numerals.
- `TRIP.days` holds per-day plans: `stay`, `notes` (timing/booking
  warnings), and `checklist` — the full time-ordered itinerary as `{t,
  task, must?}` items (t is a rough start time; `must: true` marks the
  day's time-sensitive goal, rendered red via `.day-must`), sequenced to minimize
  backtracking between places. The checklist follows the main group
  itinerary; people who split off do their own thing and aren't listed.
  Checklist state persists in localStorage (`hkcheck:{date}:{index}`).
  Booking marks use `hkbooked:{costId}` — `TRIP.reminders` ids share this
  keyspace (non-booking checks on the Bookings page, badged "to check").
  Paid-up splits are tracked via
  `settled: [ids]` on the cost in data.js, not page marks.
- `js/sync.js` (`window.SyncStore`, loaded on Days/Bookings/Payments)
  syncs those marks across devices via a free JSON bin
  (extendsclass json-storage — no auth, anyone with the URL can write).
  Keys merge last-write-wins by timestamp; localStorage mirrors state so
  pages work offline. Pages call `SyncStore.onChange(rerender)`; if the
  script is unreachable they fall back to a localStorage-only shim.
- Leg colors: each leg id has a color (`--hk1`, `--gz`, `--sz`, `--mo`,
  `--hk2` in `styles.css`). Put `leg-{id}` on an element to set `--leg`;
  `.leg-dot` renders the dot, `.leg-dots` groups several. Used in roster
  badges, leg-card top strips, day chips/headings (`days[].legs`),
  payment rows/headers, and booking titles.
- Shared class vocabulary (styled in `styles.css`): `.table-wrap`,
  `.money`, `.tbd`, `.badge`, `.badge-booked`, `.badge-to-book` (red),
  `.total-row`, `.pos`, `.neg`, `.muted`, `.cards`, `.card`, `.picker`,
  `.day-chips`, `.day-chip`, `.day-detail`, `.block`, `.block-label`,
  `.checklist`, `.time`, `.tabs`. Page-specific classes go in
  `css/<page>.css`, prefixed `.home-`, `.day-`, `.hotel-`, `.book-`, `.pay-`.
- Commits: small, one concern each, imperative subject lines. Author as
  the repo-local identity (`Albisourous <albinshrestha01@gmail.com>`) —
  GitHub attributes by email. Do NOT add `Co-Authored-By` or
  `Generated with` trailers; they make the bot show up as a contributor.

## Verify

```sh
node --check data.js js/*.js  # syntax
python3 -m http.server 8000   # then open http://localhost:8000
```

Check: all five pages render, TBDs show for null costs, split table
sums match the cost table, settlement balances sum to ~$0.

## Outstanding TBDs (collect from trip owner)

- Macau rooming — Casa Real booked ($319.05, fronted by Albin), 2 rooms sleep 6 but 7 attend mo — confirm 7th spot or 3rd room
- HK1 Airbnb sleeps 7 but 9 people attend that leg — confirm rooming
- HSR + ferry tickets still to buy — Sep 28 WK→GZ + Sep 29 GZ→SZ (on sale 15 days out), Shekou→Macau ferry (required at border). Macau→HK is now the HZMB Gold Bus + B4 to HKIA — walk-up, nothing to book (Airport Direct coach is an airside option needing an eligible onward flight)
