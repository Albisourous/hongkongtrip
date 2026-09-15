# HK · Shenzhen · Macau Group Trip 2026 — COST-SPLIT PAGE BUILD BRIEF

> Self-contained handoff. A fresh agent should be able to read ONLY this file and build a shareable web page that shows the group what everything cost and who owes what. No prior context required.

---

## 0. What to build (the ask)
Build a single shareable page (self-contained HTML is ideal, or a Google-Sheet-ready layout) for a group of 7 friends that shows:
1. The trip at a glance (dates, cities, day-by-day).
2. Every shared cost (hotels, transport, activities) with the total and the per-person share.
3. A per-person "who owes what" breakdown, split by leg so someone who skipped a leg is not charged for it.
4. Who fronted/paid each booking, so the group can settle up (Splitwise-style).
Tone/vibe: young 20s tech group, clean and design-forward, mobile-friendly, dark-mode-friendly. Photo/content angle is a plus.

Prices marked `TBD` below must be collected from the trip owner before the page is final. Known values are filled in.

---

## 1. Group
- 7 people, mid-20s. Rooming: 4 rooms (2+2+2+1) where hotels are room-based.
- Trip owner (this user) fronted several bookings; group settles after.

## 2. Trip shape
- Dates: Sep 25 – Oct 3, 2026 (8 nights). Depart Seattle Wed Sep 23; land HKG Fri Sep 25 5:05am; fly home Sat Oct 3 9:25am.
- Route: Seattle → Hong Kong → Shenzhen → Macau → Hong Kong → Seattle.
- Night split: HK 3 (Sep 25–28) / Shenzhen 3 (Sep 28–Oct 1) / Macau 1 (Oct 1–2) / HK 1 (Oct 2–3).
- Flights: Delta, booked individually per person (each paid their own), Main Basic. OUT DL2861 SEA→LAX + DL0089 LAX→HKG. RETURN DL0088 HKG→LAX + DL1714 LAX→SEA. Treat flights as NOT a shared/split cost unless the owner says otherwise.

## 3. Day-by-day
| Date | Day | Base | Plan |
|---|---|---|---|
| Sep 25 | Fri | HK (Airbnb YMT) | Land 5:05am; nap; (optional) Sam's Tailor measure; Mid-Autumn: Victoria Park lanterns + Tai Hang Fire Dragon |
| Sep 26 | Sat | HK | Dragon's Back hike + Shek O; Sham Shui Po (Apliu St, arcade, streetwear); Temple St Night Market |
| Sep 27 | Sun | HK | Kowloon Walled City exhibition + Kowloon City Thai lunch; Peak/Lugard; Sneaker St + Sino Centre; LKF night |
| Sep 28 | Mon | HK → Shenzhen | HSR West Kowloon → Futian (~14 min); check in Shenzhen; Dongmen streetwear + Huaqiangbei; nightlife |
| Sep 29 | Tue | Shenzhen | Medical Day 1 (personal): exec health checkup + cancer screen + derm + wisdom-tooth eval @ HKU-Shenzhen Hospital |
| Sep 30 | Wed | Shenzhen | Medical Day 2 (personal): LASIK/SMILE consult only @ Aier Eye Shenzhen; OCT-LOFT / Shenzhen Bay / Sea World |
| Oct 1 | Thu | SZ → Macau | Metro to Shekou Port → ferry to Macau (Outer Harbour); Senado Sq, Ruins of St Paul's, Rua da Felicidade; Cotai |
| Oct 2 | Fri | Macau → HK | Ferry to HK (TST); (optional) Sam's Tailor pickup; taxi to SkyCity Marriott (airport) |
| Oct 3 | Sat | HK → fly | Wake ~6am; HKG T1; DL0088 9:25am home |

Note: the Sep 29–30 medical block (checkup, dental, LASIK consult) is PERSONAL to the trip owner, not a group cost. Do NOT include it in the group split unless told otherwise.

## 4. Hotels (shared cost — the core of the split)
| Leg | Hotel | Dates | Nights | Rooms | Total Cost | Who fronted | Status |
|---|---|---|---|---|---|---|---|
| HK #1 | "Our Sweet & Lovely Home" 4BR Airbnb, Yau Ma Tei / Nathan Rd (airbnb.com/rooms/37172099) | Sep 25–28 | 3 | 1 unit, sleeps all 7 | $1,158 (~$165/pax) | trip owner | ✅ BOOKED |
| Shenzhen | TBD — choosing between Hyatt Place Shenzhen Dongmen (Hyatt points) OR Kapok Shenzhen Luohu (cash) | Sep 28–Oct 1 | 3 | 4 | TBD | TBD | TO BOOK |
| Macau | TBD — near Outer Harbour/Senado or Cotai (Golden Week, book ASAP) | Oct 1–2 | 1 | 4 | TBD | TBD | TO BOOK |
| HK #2 | Hong Kong SkyCity Marriott (airport, Lantau) | Oct 2–3 | 1 | 2 (4+3 guests) | TBD (cash) | trip owner | ✅ BOOKED |

If any hotel is paid with Hyatt/Chase points, record BOTH the points used and a cash-equivalent value so the group can reimburse the fronter fairly (points strategy: burn points in Shenzhen + Macau, pay cash in HK).

## 5. Transport (shared cost, per person unless noted)
| Leg | Date | Mode | Approx cost/pax | Notes |
|---|---|---|---|---|
| HKG airport → YMT | Fri Sep 25 | Bus A21 | ~HK$34 (~$4.30) | first bus ~05:30 |
| West Kowloon → Futian (Shenzhen) | Mon Sep 28 | HSR | ~HK$78 (~$10) | ~14 min, passport ticket |
| Shenzhen → Macau | Thu Oct 1 | Metro to Shekou + ferry to Outer Harbour | ~$31 ferry | pre-booked ferry ticket required at border |
| Macau → HK (TST) | Fri Oct 2 | Cotai Water Jet / TurboJET ferry | ~$25 | book 1–3 days ahead |
| TST → SkyCity Marriott | Fri Oct 2 | 2 taxis | ~HK$300/cab split | luggage |
| SkyCity → HKG T1 | Sat Oct 3 | free shuttle | $0 | |

## 6. Activities (optional shared costs — collect actuals)
- Disneyland: DROPPED (not doing).
- Sam's Tailor (bespoke clothing): personal per-person spend, not a group split. Measure Sep 25, pickup Oct 2.
- Other paid entries (Peak Tram, exhibitions, BJJ drop-ins, etc.): mostly individual; include only if the group shared them. Collect actuals.

## 7. Cost-split model
Split PER LEG, not one flat trip total. For each shared cost:
`per_person_for_leg = leg_total_cost / (number of people on that leg)`
Each person owes the sum of their legs. This correctly handles anyone who skips a leg.

Existing tracker file with live Google Sheets formulas: `/local/home/albinshr/.meshclaw/workspace/hk-trip-2026-cost-split.tsv`
Layout: rows = guests; columns = legs; mark 1 where a person stays; sheet auto-computes headcount, per-person, each person's total owed, and grand total. Use this as the data model for the page.

Settlement: also track who FRONTED each booking so the page can show net balances (owed to / owed by each person), Splitwise-style.

## 8. Data still needed (agent should request from trip owner before finalizing)
- The 7 real names.
- Shenzhen hotel choice + total cost.
- Macau hotel choice + total cost.
- SkyCity Marriott total cost.
- Who fronted each booking (payer).
- Points-vs-cash: for any points booking, the cash-equivalent to reimburse.
- Whether to include flights and/or activities in the split (default: exclude flights, exclude personal medical + Sam's Tailor).

## 9. Page requirements (spec)
- Single shareable artifact (self-contained HTML preferred; or a Google Sheet).
- Sections: trip overview + day-by-day; hotel cost table; transport cost table; per-person split table; net settlement (who pays whom).
- Interactive-friendly: let a viewer see their own total.
- Mobile-first, clean, dark-mode-friendly, minimal.
- Currency: show USD, note HKD/MOP/CNY where relevant.
- Do NOT include the trip owner's personal medical costs in the group split.

## 10. Source files (in /local/home/albinshr/.meshclaw/workspace/)
- `hk-trip-2026-cost-split.tsv` — the live cost-split tracker (formulas).
- `hk-trip-2026-daily-itinerary.tsv` — full day-by-day.
- `hk-trip-2026-tracker-sheets.tsv` — multi-tab tracker (flights, transit, itinerary, bookings, budget, packing).
- `hk-trip-2026-CONTEXT-HANDOFF.md` — general trip context.


echo "# hongkongtrip" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Albisourous/hongkongtrip.git
git push -u origin main

Create a website for https://github.com/Albisourous/hongkongtrip to track all of our travel plans and expenses etc then make commits small spun up agents make minimal code with just want we need simple and clean use best practice create a tracker document Agents.md read me etc 

Make multiple sub agents to track this 
