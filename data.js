// Single source of truth. null = TBD. All money in USD unless noted.
const TRIP = {
  title: "HK · Guangzhou · Shenzhen · Macau — Group Trip 2026",
  dates: { depart: "Wed Sep 23 (SEA)", arrive: "Fri Sep 25, 5:05am (HKG)", home: "Sat Oct 3, 9:25am (HKG)", nights: 8 },
  route: "Seattle → Hong Kong → Guangzhou · Shenzhen → Macau → Hong Kong → Seattle",

  // legs a person attends; remove a leg id to exclude them from that leg's split
  people: [
    { id: "albin", name: "Albin", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "kj", name: "Kevin Jacob", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "maas", name: "Maas", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "ehsan", name: "Ehsan", legs: ["hk1", "mo", "hk2"] }, // solo in China
    { id: "scott", name: "Scott", legs: ["hk1", "mo", "hk2"] }, // same as Ehsan
    { id: "brendan", name: "Brendan", legs: ["hk1"] }, // first HK leg only
    { id: "kli", name: "Kevin Li", legs: ["hk1", "gz", "sz", "hk2"] }, // skips Macau — own transit back to HK Oct 1, rejoins for the airport leg
    { id: "shruthik", name: "Shruthik", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "wesley", name: "Wesley", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
  ],

  legs: [
    { id: "hk1", name: "Hong Kong", dates: "Sep 25–28", nights: 3 },
    { id: "gz", name: "Guangzhou", dates: "Sep 28–29", nights: 1 },
    { id: "sz", name: "Shenzhen", dates: "Sep 29–Oct 1", nights: 2 },
    { id: "mo", name: "Macau", dates: "Oct 1–2", nights: 1 },
    { id: "hk2", name: "Hong Kong (airport)", dates: "Oct 2–3", nights: 1 },
  ],

  // Per-day plan. stay = where the group sleeps that night.
  // checklist = the full time-ordered plan ({t, task} — t is a rough start
  // time), sequenced to minimize backtracking between places; it follows
  // the main group itinerary — people who split off do their own thing
  // and aren't listed. notes = timing/booking warnings.
  days: [
    {
      date: "Sep 23", day: "Wed", base: "In transit", stay: "Overnight flight", legs: [],
      notes: "Redeye over the Pacific.",
      checklist: [
        { t: "3:00pm", task: "SEA — check bags through to HKG" },
        { t: "5:40pm", task: "DL2861 SEA → LAX" },
        { t: "evening", task: "DL0089 LAX → HKG — sleep on the plane" },
      ],
    },
    {
      date: "Sep 25", day: "Fri", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei", legs: ["hk1"],
      notes: "Mid-Autumn Festival. Buy Octopus cards at the airport. Airbnb check-in after 2pm — store bags first (host offers luggage storage).",
      checklist: [
        { t: "5:05am", task: "Land HKG · buy Octopus cards" },
        { t: "5:30am", task: "Bus A21 → Yau Ma Tei (~HK$34)" },
        { t: "7:00am", task: "Drop bags at Airbnb + nap (check-in 2pm)" },
        { t: "10:30am", task: "Yau Ma Tei Wholesale Fruit Market — next to the Airbnb" },
        { t: "12:30pm", task: "Cha chaan teng lunch — ask for 斋菜 (zhai) veg dishes" },
        { t: "3:00pm", task: "(opt) Sam's Tailor fitting, TST → Star Ferry + harbourfront" },
        { t: "7:00pm", task: "Victoria Park lantern carnival, Causeway Bay" },
        { t: "8:15pm", task: "Tai Hang Fire Dragon Dance — 5-min walk from Victoria Park" },
      ],
    },
    {
      date: "Sep 26", day: "Sat", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei", legs: ["hk1"],
      notes: "Alt AM: KLN BJJ/judo (Jordan) or Lai Chi Kok calisthenics.",
      checklist: [
        { t: "7:30am", task: "MTR → Shau Kei Wan, bus 9 to the trailhead" },
        { t: "8:30am", task: "Dragon's Back hike → Shek O (~2.5h)" },
        { t: "12:00pm", task: "Shek O beach + village lunch — veg plates at the cafés" },
        { t: "3:00pm", task: "Sham Shui Po — Apliu St flea market + Golden Computer Arcade (egg tarts + pineapple buns at the bakeries)" },
        { t: "7:00pm", task: "Temple St Night Market — back in YMT by the Airbnb (or rooftop bar)" },
      ],
    },
    {
      date: "Sep 27", day: "Sun", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei", legs: ["hk1"],
      notes: "All Kowloon stops before lunch are ~10 min apart. Peak saved for night — Lugard lookout is the skyline photo spot; LKF is a ~15-min walk down from the tram terminus. Peak Tram queues run ~30–45 min at dusk — buy the timed ticket ahead.",
      checklist: [
        { t: "9:00am", task: "Kowloon Walled City exhibition — free timed ticket, go early" },
        { t: "10:45am", task: "Chi Lin Nunnery + Nan Lian Garden, Diamond Hill (~10 min away) — Tang-style, free" },
        { t: "12:30pm", task: "Kowloon City Thai lunch — back by the park" },
        { t: "2:30pm", task: "Sneaker St + Sino Centre, Mong Kok" },
        { t: "5:00pm", task: "MTR → Central · Peak Tram up (arrive ~5:45 for golden hour)" },
        { t: "6:15pm", task: "Lugard Rd lookout — sunset → night skyline photo (~20-min walk each way)" },
        { t: "8:00pm", task: "Tram down → Central — Symphony of Lights is visible from the Peak anyway" },
        { t: "9:00pm", task: "LKF night out — walkable from the tram terminus" },
      ],
    },
    {
      date: "Sep 28", day: "Mon", base: "HK → Guangzhou", stay: "Grand Hyatt Guangzhou (Zhujiang New Town) — all 6", legs: ["gz", "sz"],
      notes: "HSR opens 15 days out — passport ticket. Carry the Shekou→Macau ferry ticket — it doubles as onward-ticket proof for the 240-hr transit. Fake-market tips (Kinbo/Zhanxi): tees ¥40–150, hoodies ¥80–300, jackets ¥150–500 — open at ~40–50% of asking and be ready to walk; they'll call you back.",
      checklist: [
        { t: "9:00am", task: "Check out · MTR → West Kowloon HSR terminus (arrive ~45–60 min early — border checks inside)" },
        { t: "10:00am", task: "HSR West Kowloon → Guangzhou East ~1h40 (or South ~1h) — all 6" },
        { t: "11:45am", task: "Metro/taxi → Grand Hyatt, drop bags (check-in 3pm)" },
        { t: "12:45pm", task: "Xiajiao Mei 虾饺妹 dim sum — Haizhu Plaza branch, the smiley-face one" },
        { t: "2:00pm", task: "Beijing Rd pedestrian st — ancient road under glass floor" },
        { t: "3:30pm", task: "Kinbo Fashion Market + Zhanxi Clothing Markets, by GZ Railway Stn (metro L2/L5; close ~6–7pm)" },
        { t: "6:30pm", task: "Dinner back at Beijing Rd / Haizhu Sq" },
        { t: "8:00pm", task: "Pearl River night cruise from Tianzi Pier — by Haizhu Sq, ~10-min walk" },
      ],
    },
    {
      date: "Sep 29", day: "Tue", base: "Guangzhou → Shenzhen", stay: "Hyatt Place Shenzhen Dongmen (Laojie MTR) — all 6", legs: ["gz", "sz"],
      notes: "Liwan walking day — everything through Liwan Lake sits within ~2 km. Bags stay at the Grand Hyatt; Canton Tower/Huacheng Sq is right by the hotel. Night HSR to Shenzhen — book it with the Sep 28 tickets.",
      checklist: [
        { t: "8:30am", task: "Dim sum — Guangzhou Restaurant or Dian Dou De" },
        { t: "10:00am", task: "Shamian Island — colonial streets" },
        { t: "12:00pm", task: "Guangxiao Temple veg lunch — Guangzhou's oldest temple, near Chen Clan" },
        { t: "1:30pm", task: "Chen Clan Academy — folk art" },
        { t: "3:00pm", task: "Yongqingfang lanes + Bruce Lee ancestral home (~15-min walk)" },
        { t: "4:30pm", task: "Liwan Lake Park — locals' tai chi + cards" },
        { t: "6:30pm", task: "Canton Tower / Huacheng Sq night view — right by the Grand Hyatt" },
        { t: "8:00pm", task: "Collect bags → Guangzhou South" },
        { t: "9:00pm", task: "HSR Guangzhou → Shenzhen (~1h, all 6)" },
        { t: "10:30pm", task: "Check in — Hyatt Place Dongmen" },
      ],
    },
    {
      date: "Sep 30", day: "Wed", base: "Shenzhen", stay: "Hyatt Place Shenzhen Dongmen (Laojie MTR) — all 6", legs: ["sz"],
      notes: "Full Shenzhen day — Futian cluster midday, Nanshan tech run late afternoon, SZ Bay at night. Robotaxi needs a CN number or WeChat mini-program — fallback is a normal Didi. Golden Week drone/robot light shows run over Shenzhen Bay this week. Fallbacks if packed: OCT-LOFT or Nantou Old Town.",
      checklist: [
        { t: "9:30am", task: "Huaqiangbei electronics markets — SEG + the component stalls" },
        { t: "11:30am", task: "(opt) Cycling/ski gear — YKYW + Uke are Shenzhen brands; ski shops cluster near the indoor-ski venues" },
        { t: "12:30pm", task: "Lunch — Dongmen food stalls by the hotel (veg options) or a mall food court" },
        { t: "1:30pm", task: "MOCAUP, Futian CBD — contemporary art + urban planning museum, free, closes ~6pm" },
        { t: "2:45pm", task: "Bijiashan Park hill loop → UpperHills loft mall next door" },
        { t: "4:15pm", task: "Metro → Nanshan (~40 min)" },
        { t: "5:00pm", task: "DJI flagship @ OCT Harbour — fly drones + RoboMaster (free) · (opt) 5D cinema in the OCT/Happy Valley area" },
        { t: "6:00pm", task: "Haus Nowhere — Gentle Monster art space, Shenzhen Bay MixC" },
        { t: "7:00pm", task: "Talent Park — Meituan drone coffee (~¥25) + Pony.ai robotaxi (~¥10)" },
        { t: "8:00pm", task: "Shenzhen Bay boardwalk — Golden Week drone show if it's on (~10.6km flat)" },
        { t: "9:30pm", task: "COCO Park dinner, Futian — or back to Dongmen pedestrian st (veg stalls + HeyTea)" },
        { t: "late", task: "(opt) Aqila Spa — 24h, last night before the early ferry" },
      ],
    },
    {
      date: "Oct 1", day: "Thu", base: "SZ → Macau", stay: "Casa Real Hotel, Macau Peninsula", legs: ["mo"],
      notes: "⚠ Golden Week Day 1 — peak crowds. Carry the pre-booked ferry ticket — it's the onward-ticket proof for the 240-hr transit. The peninsula walk runs north→south and ends at Grand Lisboa for the Cotai shuttle.",
      checklist: [
        { t: "7:45am", task: "Metro Laojie → Shekou Port (~55 min) — or 2 Didis ~¥90/cab" },
        { t: "9:15am", task: "Arrive port 45 min early · ferry → Macau Outer Harbour (~60–70 min)" },
        { t: "10:45am", task: "5-min taxi/shuttle → Casa Real, drop bags" },
        { t: "11:15am", task: "(opt) Red Market wet market — ~15 min NW of the hotel" },
        { t: "12:00pm", task: "Ruins of St Paul's + Mount Fortress" },
        { t: "1:30pm", task: "Senado Sq → Rua da Felicidade — Macanese street-food lunch (ask for 斋 zhai)" },
        { t: "4:00pm", task: "A-Ma Temple + Barra waterfront — ~20-min walk south" },
        { t: "6:30pm", task: "Free shuttle from Grand Lisboa/StarWorld → Cotai" },
        { t: "7:30pm", task: "Cotai strip: Venetian · Londoner · Studio City · Galaxy" },
        { t: "late", task: "Shuttle/taxi back to Casa Real" },
      ],
    },
    {
      date: "Oct 2", day: "Fri", base: "Macau → HK", stay: "SkyCity Marriott (airport)", legs: ["hk2"],
      notes: "Book Macau→HK ferry 1–3 days ahead. Sam's Tailor is ~10 min from the TST ferry terminal; last real meal is TST — airport area is slim pickings.",
      checklist: [
        { t: "9:00am", task: "Margaret's Café e Nata egg tarts + last Senado loop (Lord Stow's is a Coloane detour)" },
        { t: "12:00pm", task: "Ferry Macau → TST (~60 min)" },
        { t: "2:00pm", task: "(opt) Sam's Tailor pickup, TST" },
        { t: "4:00pm", task: "Taxi/AEL → SkyCity Marriott, Lantau — check in" },
        { t: "8:00pm", task: "Early night — 6am wake-up" },
      ],
    },
    {
      date: "Oct 3", day: "Sat", base: "Fly home", stay: "—", legs: ["hk2"],
      notes: "Arrive SEA 12:27pm.",
      checklist: [
        { t: "6:00am", task: "Wake · free shuttle → HKG T1" },
        { t: "7:00am", task: "Check in / security" },
        { t: "7:45am", task: "(opt) Free mahjong-tile souvenir — HKG giveaway counter in departures, while it lasts" },
        { t: "9:25am", task: "DL0088 HKG → LAX → DL1714 → SEA" },
      ],
    },
  ],

  // Bookings, transit and activity references.
  resources: [
    { cat: "Visa/legal", detail: "240-hr transit: must be HK→mainland→Macau (different region in/out). Guangzhou + Shenzhen both count as the mainland stop. Carry onward Macau ticket.", cost: "—", url: null, linkLabel: "MTR 240-hr policy page" },
    { cat: "HSR", detail: "West Kowloon → Guangzhou South ~1h (all 6) · Guangzhou → Shenzhen ~1h Sep 29 night. Opens 15 days out; passport ticket.", cost: "~$10–28", url: "https://www.highspeed.mtr.com.hk", linkLabel: "highspeed.mtr.com.hk" },
    { cat: "Ferry SZ→Macau", detail: "Shekou Port → Macau Outer Harbour, ~60 min. First 08:00, last 21:00.", cost: "~$31", url: "https://www.trip.com", linkLabel: "Trip.com / Klook" },
    { cat: "Ferry Macau→HK", detail: "Taipa → TST (Cotai Water Jet) or Outer Harbour → Sheung Wan (TurboJET), ~60 min.", cost: "~$25", url: "https://www.turbojet.com.hk", linkLabel: "turbojet.com.hk" },
    { cat: "BJJ/Judo HK", detail: "KLN BJJ (Jordan) — BJJ + judo, English.", cost: "~HK$200", url: "https://klnbjj.com", linkLabel: "klnbjj.com" },
    { cat: "BJJ Shenzhen", detail: "Wan Sheng Fight Club (Luohu).", cost: "~¥50–100", url: "https://wstkd.com", linkLabel: "wstkd.com · +86 158 8944 4114" },
    { cat: "Calisthenics HK", detail: "Lai Chi Kok Park, Victoria Park, Kowloon Park.", cost: "free", url: "https://calisthenics-parks.com", linkLabel: "calisthenics-parks.com" },
    { cat: "Calisthenics SZ", detail: "Lianhuashan / Central Park / Bijiashan · Shenzhen Bay.", cost: "free", url: "https://calisthenicslivemap.com", linkLabel: "calisthenicslivemap.com" },
    { cat: "Running HK", detail: "Bowen Rd, TST→West Kowloon promenade, Lugard loop, Dragon's Back.", cost: "free", url: "https://greatruns.com", linkLabel: "greatruns.com" },
    { cat: "Running SZ", detail: "Shenzhen Bay boardwalk (~10.6km flat), Lianhuashan hills.", cost: "free", url: "https://greatruns.com", linkLabel: "greatruns.com" },
    { cat: "Shopping gear", detail: "Citygate Outlets (Arc'teryx outlet), Sneaker St Mong Kok.", cost: "varies", url: "https://citygateoutlets.com.hk", linkLabel: "citygateoutlets.com.hk" },
    { cat: "Shopping anime", detail: "Sino Centre + In's Point + Richmond Arcade, Mong Kok.", cost: "varies", url: null, linkLabel: null },
    { cat: "Shopping SZ", detail: "Huaqiangbei/SEG electronics · COCO Park mall + bar street (Futian, Shopping Park metro) · Luohu tailoring (skip replicas).", cost: "varies", url: null, linkLabel: null },
    { cat: "AI/tech SZ", detail: "DJI flagship OCT Harbour (free — indoor drone cages, RoboMaster; L9 Shenzhen Bay Park exit E) · Meituan drone delivery @ Talent Park (~¥25/order, works w/ foreign Alipay/WeChat) · Pony.ai driverless taxi, Nanshan/Qianhai geofence (~¥8–15, needs CN number or WeChat mini-program) · driverless metro lines 12/14 — ride the front car", cost: "free–¥30", url: "https://www.dji.com/where-to-buy/flagship/cn-sz", linkLabel: "DJI flagship store" },
    { cat: "Local life", detail: "Morning tai chi + dancing aunties in any park · wet-market breakfast (baozi, congee, jianbing) · herbal tea shops 凉茶 · foot massage 足浴 after walking days · KTV · mahjong parlors · milk tea — HeyTea is from this region · shared bikes on Shenzhen Bay", cost: "free–cheap", url: null, linkLabel: null },
    { cat: "Veg eats", detail: "HK: Chi Lin Nunnery veg restaurant (Nan Lian Garden, Diamond Hill) + LockCha tea house (HK Park) · GZ: Guangxiao Temple veg restaurant · SZ: Dongmen/COCO Park food courts · Macau: egg tarts + ask for 斋 (zhai, Buddhist veg) — every city: temple veg buffets are the reliable bet", cost: "cheap", url: null, linkLabel: null },
    { cat: "Viewpoints", detail: "Peak/Lugard, Choi Hung, Ping An Free Sky, Ruins of St Paul's.", cost: "varies", url: null, linkLabel: null },
  ],

  // Non-booking checks to verify — rendered on Bookings as a Reminders
  // section (checkable, synced like booked marks via hkbooked:{id}).
  reminders: [
    { id: "china-batteries", legs: ["gz", "sz"], title: "China power-bank / battery rules",
      when: "Before Sep 28",
      why: "Mainland airports + rail require a CCC (3C) mark on power banks and confiscate unmarked or recalled ones (≤100Wh typical, ≤160Wh with approval). Check every bank + spare batteries before packing — on the Delta flights they're carry-on only anyway." },
    { id: "border-items", legs: [], title: "Restricted items at the borders",
      when: "Before packing",
      why: "Vapes/e-cigarettes are banned into HK + Macau, drones need registration on the mainland, and some meds are restricted — check anything unusual before crossing." },
    { id: "vpn", legs: ["gz", "sz"], title: "VPN installed + tested",
      when: "Before Sep 28 — hard to download once inside",
      why: "Google/WhatsApp/Instagram are blocked on the mainland. Install a China-working VPN (e.g. Astrill, LetsVPN) on every phone + laptop and test it before crossing — app stores and VPN sites are blocked there too." },
    { id: "apps", legs: ["gz", "sz"], title: "Mainland app stack installed",
      when: "Before Sep 28",
      why: "WeChat (verify the account early — new foreign accounts can need an existing user to vouch; Meituan drone delivery + Pony.ai robotaxi run as mini-programs inside it) · Alipay (payments + Didi mini-program) · Trip.com/12306 (HSR tickets) · Amap or Apple Maps (Google Maps is unreliable there) · translator with offline pack." },
    { id: "mainland-entry", legs: ["gz"], title: "Mainland entry card + hotel registration",
      when: "Sep 28 at West Kowloon",
      why: "Fill the arrival card at the border; hotels auto-register foreigners with police within 24h (an Airbnb wouldn't — one reason it's all hotels in mainland)." },
    { id: "insurance", legs: [], title: "Travel insurance",
      when: "Before Sep 23",
      why: "Medical + delay cover spanning HK, mainland and Macau — buy before departure and confirm mainland China is covered." },
    { id: "typhoon", legs: ["mo", "hk2"], title: "Typhoon-season check",
      when: "Week of Sep 21 + before ferries",
      why: "Late Sep is still typhoon season — check HKO/CMA warnings; flights and the Shekou/Macau ferries can be delayed or cancelled." },
  ],

  flights: {
    note: "Fronted by Ehsan (Delta Main Basic) — $456/person confirmed; Kevin Li paid his own, so it splits across the other 8.",
    out: "DL2861 SEA→LAX + DL0089 LAX→HKG",
    back: "DL0088 HKG→LAX + DL1714 LAX→SEA",
  },

  // frontedBy set => contributes to settlement. total => split evenly among
  // leg attendees; perPerson => each attendee owes that amount to frontedBy.
  // exclude: [ids] => those people paid their own — left out of the split.
  // settled: [ids] => already paid the fronter — netted out of settlement.
  // sleeps: bed capacity on a hotel — the Hotels tab flags shortfalls.
  // No frontedBy => informational only (everyone pays their own).
  costs: [
    { id: "flights", leg: "hk1", cat: "Flight", label: "Round-trip flights SEA ↔ HKG (Delta)", total: null, perPerson: 456, frontedBy: "ehsan", exclude: ["kli"], settled: ["albin", "scott", "kj"], status: "booked", note: "$456/person confirmed by Ehsan · Kevin Li paid his own — splits across the other 8 · Albin, Scott + KJ already paid Ehsan" },
    { id: "hk1-hotel", leg: "hk1", cat: "Hotel", label: "\"Our Sweet & Lovely Home\" 4BR Airbnb, Yau Ma Tei / Nathan Rd", total: 1158.19, perPerson: null, frontedBy: "albin", status: "booked", sleeps: 7, note: "Airbnb HM8YRKN5XN · host Wing · Onward Building, 528 Nathan Rd · in after 2pm / out by 11am · A21 → Man Ming Lane stop or Yau Ma Tei MTR exit D · paid Aug 18 · sleeps 7 but 9 attend — confirm rooming", url: "https://www.airbnb.com/rooms/37172099", linkLabel: "Airbnb — listing" },
    { id: "gz-hotel", leg: "gz", cat: "Hotel", label: "Grand Hyatt Guangzhou — 2× Twin (Zhujiang New Town)", total: 357, perPerson: null, frontedBy: "albin", status: "booked", sleeps: 6, note: "Hyatt confs 40023B27689039 + 40023B27689093 · 15,000 pts total (7,500/room — $357 @2.38cpp) · 45sqm twin, 2 singles, 3 adults/room → 6 beds for all 6 · Sep 28–29, in 3pm / out 12pm · 12 Zhujiang West Rd, by Canton Tower / Huacheng Sq · on Albin's Hyatt account", url: "https://www.hyatt.com/grand-hyatt/en-US/guagh-grand-hyatt-guangzhou", linkLabel: "Hyatt — Grand Hyatt Guangzhou" },
    { id: "sz-hotel", leg: "sz", cat: "Hotel", label: "Hyatt Place Shenzhen Dongmen — Sep 30 night, 3× Specialty Twin (Laojie MTR, Luohu)", total: 321.30, perPerson: null, frontedBy: "albin", status: "booked", sleeps: 6, note: "Hyatt confs 56229190 + 14228517 + 45139912 · 13,500 pts (4,500/room — $321.30 @2.38cpp) · Sep 30–Oct 1, in 3pm / out 12pm · Laojie MTR exit H, turn left · breakfast incl up to 2/room · Sep 29 night = separate booking (sz-hotel-2)", url: "https://www.hyatt.com/hyatt-place/en-US/szxzs-hyatt-place-shenzhen-dongmen", linkLabel: "Hyatt — Hyatt Place Dongmen" },
    { id: "sz-hotel-2", leg: "sz", cat: "Hotel", label: "Hyatt Place Shenzhen Dongmen — Sep 29 night, 3× Specialty Twin (Laojie MTR, Luohu)", total: 321.30, perPerson: null, frontedBy: "albin", status: "booked", sleeps: 6, note: "Hyatt confs 37134482 + 29032314 + 31333538 · 13,500 pts (4,500/room — $321.30 @2.38cpp) · Sep 29–30, in 3pm / out 12pm · Laojie MTR exit H, turn left · breakfast incl up to 2/room", url: "https://www.hyatt.com/hyatt-place/en-US/szxzs-hyatt-place-shenzhen-dongmen", linkLabel: "Hyatt — Hyatt Place Dongmen" },
    { id: "mo-hotel", leg: "mo", cat: "Hotel", label: "Casa Real Hotel — Studio, 2 Twin Beds (Macau Peninsula)", total: 319.05, perPerson: null, frontedBy: "albin", status: "booked", sleeps: 6, note: "Expedia · 2 rooms $216.12 ($108.06/room) + taxes $47.24 + extra guests $66.50 − coupon $10.81 · non-refundable · 'sleeps 3' = 2 twins, 3rd shares (no rollaway) — 2 rooms sleep 6 but 7 attend, confirm 7th spot · Oct 1–2", url: "https://www.expedia.com/Macau-Hotels-Casa-Real-Hotel.h2219745.Hotel-Information?chkin=2026-10-01&chkout=2026-10-02", linkLabel: "Expedia — Casa Real Hotel" },
    { id: "hk2-hotel", leg: "hk2", cat: "Hotel", label: "Hong Kong SkyCity Marriott (airport)", total: 820.84, perPerson: null, frontedBy: "albin", status: "booked", sleeps: 8, note: "Expedia itin 73521256411437 · 2 rooms, 2 double beds each · paid Aug 13 · in 3pm / out 12pm · 7 adults booked but 8 attend — confirm 8th bed", url: "https://www.marriott.com/en-us/hotels/hkgap-hong-kong-skycity-marriott-hotel/overview/", linkLabel: "Marriott — SkyCity" },

    { id: "a21", leg: "hk1", cat: "Transport", label: "Bus A21 · HKG → Yau Ma Tei", total: null, perPerson: 4.30, frontedBy: null, status: null, note: "~HK$34 · first bus ~05:30" },
    { id: "hsr-gz", leg: "gz", cat: "Transport", label: "HSR West Kowloon → Guangzhou South", total: null, perPerson: 27, frontedBy: null, status: null, note: "~HK$215 · ~1h · passport ticket · all 6" },
    { id: "hsr-gz-sz", leg: "sz", cat: "Transport", label: "HSR Guangzhou → Shenzhen", total: null, perPerson: 11, frontedBy: null, status: null, note: "~¥75 · ~1h · Sep 29 evening — all 6 on the ~9pm train" },
    { id: "ferry-sz-mo", leg: "mo", cat: "Transport", label: "Metro to Shekou + ferry → Macau Outer Harbour", total: null, perPerson: 31, frontedBy: null, status: null, note: "Pre-booked ferry ticket required at border" },
    { id: "ferry-mo-hk", leg: "hk2", cat: "Transport", label: "Macau → TST ferry (Cotai Water Jet / TurboJET)", total: null, perPerson: 25, frontedBy: null, status: null, note: "Book 1–3 days ahead" },
    { id: "taxi-skycity", leg: "hk2", cat: "Transport", label: "2 taxis · TST → SkyCity Marriott", total: null, perPerson: null, frontedBy: null, status: null, note: "~HK$300/cab, split by riders · luggage" },
    { id: "shuttle-hkg", leg: "hk2", cat: "Transport", label: "SkyCity → HKG T1 shuttle", total: null, perPerson: 0, frontedBy: null, status: null, note: "Free" },
  ],

  notes: [
    "All six enter Guangzhou Sep 28 for one night, then night-train to Shenzhen Sep 29 for two nights. Ehsan & Scott solo; Brendan heads home.",
    "Kevin Li skips Macau — own transit back to HK Oct 1, rejoins the group for the airport leg (SkyCity Marriott + flight home).",
    "Flights fronted by Ehsan — $456/person, split across everyone except Kevin Li (paid his own); Albin, Scott + KJ already settled.",
    "Sam's Tailor is personal spend — excluded.",
    "Points bookings: record points used AND cash-equivalent so the fronter is reimbursed fairly.",
    "Split is per leg: each person owes (leg shared costs) / (people on that leg).",
  ],
};
