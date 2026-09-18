# Update brief — pending changes

> Self-contained handoff for the next work session. Read `AGENTS.md` for
> architecture and conventions; `data.js` is the single source of truth.

## Applied

- **Albin & Maas stay on the group itinerary** — same legs as KJ, no
  medical commutes. All six sleep in Guangzhou on Sep 28 (one night —
  Grand Hyatt Guangzhou booked, 2 twins ~$284) and night-train to Shenzhen
  on Sep 29. Shenzhen gets two nights at Hyatt Place Dongmen: Sep 29
  (to book, ~13,500 pts expected) + Sep 30 (booked, 13,500 pts). Sep 30
  is a full Shenzhen day — Huaqiangbei morning, Nanshan tech run
  (DJI / Talent Park / robotaxi) afternoon, COCO Park / Dongmen evening.
- **Kevin Li skips Macau** — legs now `["hk1", "gz", "sz", "hk2"]`. He
  transits back to HK on his own Oct 1 and rejoins the group for the airport
  leg (SkyCity Marriott Oct 2 → flight home Oct 3). Note: hk2 headcount is 8
  but the Marriott was booked as 2 rooms (4+3) — confirm rooming.
- **Macau hotel booked: Casa Real Hotel** — Studio 2 Twin Beds, Oct 1–2,
  $319.05 all-in on Expedia (2 rooms $216.12 + taxes $47.24 + extra
  guests $66.50 − coupon $10.81), paid under Albin →
  `costs["mo-hotel"]` total + `frontedBy`. Watch-outs: "sleeps 3"
  is 2 twins with the 3rd sharing (no rollaway), and 2 rooms cover 6 of
  the 7 `mo` attendees — may need a 3rd room.
- **HK1 Airbnb confirmed** — Airbnb `HM8YRKN5XN`, host Wing, Onward
  Building 528 Nathan Rd, Sep 25–28, $1,158.19 paid Aug 18 →
  `costs["hk1-hotel"].total`. Check-in after 2pm / out by 11am — Sep 25
  notes now mention storing bags before check-in. Sleeps 7 while 9 attend
  hk1 — rooming still open.
- **SkyCity Marriott confirmed** — Expedia itin `73521256411437`, 2 rooms
  ("Room, 2 Double Beds" each), Oct 2–3, $820.84 all-in paid Aug 13 under
  Albin → `costs["hk2-hotel"].total`. Check-in from 3pm, out 12pm.
  Reservation lists 7 adults while hk2 headcount is 8 — still need to
  confirm where the 8th person sleeps.
- **Shenzhen hotel booked: Hyatt Place Dongmen** — Albin's Hyatt account,
  confs `56229190` + `14228517` + `45139912`, 3× Specialty Twin Sep 30–Oct 1,
  13,500 pts total (4,500/room) → `costs["sz-hotel"]` with $250
  cash-equivalent (Chase pts estimate) so the split reimburses him fairly.
  At Laojie MTR exit H on the Dongmen pedestrian street; Oct 1 morning
  updated to Laojie → Shekou (~55 min, was Futian ~40). 6 beds for 6.

## Still needed from the trip owner

| Item | Where it lands in `data.js` |
|---|---|
| Shenzhen Sep 29 night — 3 more rooms at Hyatt Place Dongmen (~13,500 pts expected, on Albin's account) | `costs["sz-hotel-2"]` |
| Macau rooming — Casa Real booked ($319.05, Albin) but 2 rooms sleep 6 while 7 attend mo — confirm 7th spot or add a 3rd room | `costs["mo-hotel"].note` + `sleeps` + maybe `people` |
| SkyCity Marriott rooming — reservation lists 7 adults, 8 attend hk2 | `costs["hk2-hotel"].note` + maybe `people` |
| HK1 Airbnb rooming — sleeps 7, 9 attend | `costs["hk1-hotel"].note` + maybe `people` |
| HK2 SkyCity rooming — 8 attend, booked 4+3 | `costs["hk2-hotel"].note` |
| Who fronts remaining bookings | `frontedBy` on the above |

## Rules of engagement

- Vanilla HTML/CSS/JS, no deps, no build. `createElement`/`textContent` only.
- `null` = TBD: render "TBD", exclude from math. `frontedBy: null` = informational.
- Split is per leg by `people[].legs`; Sam's Tailor excluded.
- Small imperative commits, repo-local identity
  `Albisourous <albinshrestha01@gmail.com>`, no trailers.
- Verify: `node --check data.js js/*.js`, then `python3 -m http.server 8000`
  and check all four pages render and settlement sums to ~$0.
