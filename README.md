# hongkongtrip

Group trip tracker — Hong Kong · Shenzhen · Macau, Sep 25 – Oct 3, 2026.

A dependency-free static site that shows the itinerary, shared costs,
per-person splits by leg, and who owes whom.

## View it

Open `index.html` in a browser, or serve locally:

```sh
python3 -m http.server 8000
```

To publish, enable GitHub Pages (Settings → Pages → deploy from `main`).

## Update trip data

All content lives in `data.js` — people, hotels, transport, itinerary,
and who fronted each booking. Edit values there; `app.js` recomputes the
splits and settlement automatically. `null` means TBD.

## Layout

Four pages, each a shell + its own JS/CSS, sharing `data.js` and
`styles.css`:

| Page | What it shows |
|---|---|
| `index.html` | Home — what the trip is, legs, who's on which leg |
| `days.html` | Day-by-day plans with swipe + checklists |
| `bookings.html` | What still needs booking (red = to book) |
| `payments.html` | Per-leg splits, settlement, paid ledger |

`data.js` is the single source of truth — edit values there; `null` = TBD.
`tracker.md` is the original brief, `AGENTS.md` the contributor contract.
