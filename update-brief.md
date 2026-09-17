# Update brief — pending changes

> Self-contained handoff for the next work session. Read `AGENTS.md` for
> architecture and conventions; `data.js` is the single source of truth.

## Applied

- **Guangzhou day trip for Albin & Maas** — Sep 29 PM, *separate* from the
  GZ crew's itinerary (not Sep 30 — that would swap cities as the GZ crew
  leaves for Shenzhen). Conditional: skipped if the morning checkup flags
  a wisdom-tooth extraction (fallback: OCT-LOFT). HSR round trip ~¥150/person,
  informational only (`frontedBy: null`).
- **Kevin Li skips Macau** — legs now `["hk1", "gz", "sz"]`. He transits back
  to HK on his own Oct 1 and rejoins the group at HKG Oct 3. Off `hk2` too —
  the SkyCity Marriott was booked for 7 (4+3), which now matches exactly.

## Still needed from the trip owner

| Item | Where it lands in `data.js` |
|---|---|
| Guangzhou hotel + total (Sep 28–30, GZ crew of 4) | `costs["gz-hotel"]` |
| Shenzhen hotel choice + total — Hyatt Place Dongmen (points) vs Kapok Luohu (cash) | `costs["sz-hotel"]` — GZ crew needs only Sep 30 night; Albin & Maas all 3. If points: record points + cash-equivalent `total` |
| Macau hotel + total — **Golden Week, book ASAP** | `costs["mo-hotel"]` — shortlist: Hotel Central / Sofitel Ponte 16 / Caravel |
| SkyCity Marriott cash total | `costs["hk2-hotel"].total` |
| HK1 Airbnb rooming — sleeps 7, 9 attend | `costs["hk1-hotel"].note` + maybe `people` |
| Actual Delta fare (currently $450/person placeholder) | `costs["flights"].perPerson` |
| Who fronts remaining bookings | `frontedBy` on the above |

## Rules of engagement

- Vanilla HTML/CSS/JS, no deps, no build. `createElement`/`textContent` only.
- `null` = TBD: render "TBD", exclude from math. `frontedBy: null` = informational.
- Split is per leg by `people[].legs`; medical block + Sam's Tailor excluded.
- Small imperative commits, repo-local identity
  `Albisourous <albinshrestha01@gmail.com>`, no trailers.
- Verify: `node --check data.js js/*.js`, then `python3 -m http.server 8000`
  and check all four pages render and settlement sums to ~$0.
