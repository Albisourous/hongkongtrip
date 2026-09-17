# Update brief — pending changes

> Self-contained handoff for the next work session. Read `AGENTS.md` for
> architecture and conventions; `data.js` is the single source of truth.

## Applied

- **Guangzhou day trip for Albin & Maas** — Sep 29 PM, *separate* from the
  GZ crew's itinerary (not Sep 30 — that would swap cities as the GZ crew
  leaves for Shenzhen). Conditional: skipped if the morning checkup flags
  a wisdom-tooth extraction (fallback: OCT-LOFT). HSR round trip ~¥150/person,
  informational only (`frontedBy: null`).
- **Kevin Li skips Macau** — legs now `["hk1", "gz", "sz", "hk2"]`. He
  transits back to HK on his own Oct 1 and rejoins the group for the airport
  leg (SkyCity Marriott Oct 2 → flight home Oct 3). Note: hk2 headcount is 8
  but the Marriott was booked as 2 rooms (4+3) — confirm rooming.
- **SkyCity Marriott confirmed** — Expedia itin `73521256411437`, 2 rooms
  ("Room, 2 Double Beds" each), Oct 2–3, $820.84 all-in paid Aug 13 under
  Albin → `costs["hk2-hotel"].total`. Check-in from 3pm, out 12pm.
  Reservation lists 7 adults while hk2 headcount is 8 — still need to
  confirm where the 8th person sleeps.

## Still needed from the trip owner

| Item | Where it lands in `data.js` |
|---|---|
| Guangzhou hotel + total (Sep 28–30, GZ crew of 4) | `costs["gz-hotel"]` |
| Shenzhen hotel choice + total — Hyatt Place Dongmen (points) vs Kapok Luohu (cash) | `costs["sz-hotel"]` — GZ crew needs only Sep 30 night; Albin & Maas all 3. If points: record points + cash-equivalent `total` |
| Macau hotel + total — **Golden Week, book ASAP** | `costs["mo-hotel"]` — shortlist: Hotel Central / Sofitel Ponte 16 / Caravel |
| SkyCity Marriott rooming — reservation lists 7 adults, 8 attend hk2 | `costs["hk2-hotel"].note` + maybe `people` |
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
