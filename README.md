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

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `styles.css` | Styling (mobile-first, dark mode via `prefers-color-scheme`) |
| `data.js` | Single source of truth for trip data |
| `app.js` | Renders tables, computes per-leg splits and settlement |
| `tracker.md` | Original planning brief |
| `AGENTS.md` | Conventions for agents working on this repo |
