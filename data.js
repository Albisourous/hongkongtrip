// Single source of truth. null = TBD. All money in USD unless noted.
const TRIP = {
  title: "HK · Guangzhou · Shenzhen · Macau — Group Trip 2026",
  dates: { depart: "Wed Sep 23 (SEA)", arrive: "Fri Sep 25, 5:05am (HKG)", home: "Sat Oct 3, 9:25am (HKG)", nights: 8 },
  route: "Seattle → Hong Kong → Guangzhou · Shenzhen → Macau → Hong Kong → Seattle",

  // legs a person attends; remove a leg id to exclude them from that leg's split
  people: [
    { id: "albin", name: "Albin", legs: ["hk1", "sz", "mo", "hk2"] }, // SZ all 3 nights, maybe GZ day trip
    { id: "kj", name: "Kevin Jacob", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "maas", name: "Maas", legs: ["hk1", "sz", "mo", "hk2"] }, // SZ all 3 nights, maybe GZ day trip
    { id: "ehsan", name: "Ehsan", legs: ["hk1", "mo", "hk2"] }, // solo in China
    { id: "scott", name: "Scott", legs: ["hk1", "mo", "hk2"] }, // same as Ehsan
    { id: "brendan", name: "Brendan", legs: ["hk1"] }, // first HK leg only
    { id: "kli", name: "Kevin Li", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "shruthik", name: "Shruthik", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
    { id: "wesley", name: "Wesley", legs: ["hk1", "gz", "sz", "mo", "hk2"] },
  ],

  legs: [
    { id: "hk1", name: "Hong Kong", dates: "Sep 25–28", nights: 3 },
    { id: "gz", name: "Guangzhou", dates: "Sep 28–30", nights: 2 },
    { id: "sz", name: "Shenzhen", dates: "Sep 28–Oct 1", nights: 3 },
    { id: "mo", name: "Macau", dates: "Oct 1–2", nights: 1 },
    { id: "hk2", name: "Hong Kong (airport)", dates: "Oct 2–3", nights: 1 },
  ],

  // Per-day plan. stay = where the group sleeps that night.
  // checklist items get a rough start time; notes = timing/booking warnings.
  days: [
    {
      date: "Sep 23", day: "Wed", base: "In transit", stay: "Overnight flight",
      morning: null, afternoon: null,
      evening: "DL2861 SEA→LAX 5:40pm → DL0089 LAX→HKG",
      notes: "Redeye over the Pacific.",
      checklist: [
        { t: "3:00pm", task: "SEA — check bags through to HKG" },
        { t: "5:40pm", task: "DL2861 SEA → LAX" },
        { t: "evening", task: "DL0089 LAX → HKG — sleep on the plane" },
      ],
    },
    {
      date: "Sep 25", day: "Fri", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei",
      morning: "Land HKG 5:05am → Bus A21 to YMT → drop bags + nap",
      afternoon: "Cha chaan teng lunch · (opt) Sam's Tailor measure · Star Ferry / TST harbourfront",
      evening: "Victoria Park lanterns 7pm → Tai Hang Fire Dragon 8:15pm",
      notes: "Mid-Autumn Festival. Buy Octopus cards at the airport.",
      checklist: [
        { t: "5:05am", task: "Land HKG · buy Octopus cards" },
        { t: "5:30am", task: "Bus A21 → Yau Ma Tei (~HK$34)" },
        { t: "7:00am", task: "Drop bags + nap at Airbnb" },
        { t: "12:30pm", task: "Cha chaan teng lunch" },
        { t: "3:00pm", task: "(opt) Sam's Tailor fitting" },
        { t: "7:00pm", task: "Victoria Park lantern carnival" },
        { t: "8:15pm", task: "Tai Hang Fire Dragon Dance" },
      ],
    },
    {
      date: "Sep 26", day: "Sat", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei",
      morning: "🥾 Dragon's Back trail run/hike → Shek O beach + village lunch",
      afternoon: "Sham Shui Po: Apliu St + Golden Computer Arcade + streetwear/coffee",
      evening: "Temple St Night Market OR rooftop bar",
      notes: "Alt AM: KLN BJJ/judo (Jordan) or Lai Chi Kok calisthenics.",
      checklist: [
        { t: "7:30am", task: "MTR → Shau Kei Wan, bus 9 to trailhead" },
        { t: "8:30am", task: "Dragon's Back → Shek O (~2.5h)" },
        { t: "12:00pm", task: "Beach + village lunch in Shek O" },
        { t: "3:00pm", task: "Sham Shui Po: Apliu St + Golden Computer Arcade" },
        { t: "7:00pm", task: "Temple St Night Market (or rooftop bar)" },
      ],
    },
    {
      date: "Sep 27", day: "Sun", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei",
      morning: "Kowloon Walled City exhibition (go early, free timed ticket) → Kowloon City Thai lunch",
      afternoon: "Peak Tram + Lugard loop · Sneaker St + Sino Centre · Mid-Levels Escalator",
      evening: "LKF night out",
      notes: "Symphony of Lights 8pm optional.",
      checklist: [
        { t: "9:00am", task: "Kowloon Walled City exhibition (timed ticket — go early)" },
        { t: "12:30pm", task: "Kowloon City Thai lunch" },
        { t: "2:30pm", task: "Peak Tram + Lugard Rd loop" },
        { t: "5:30pm", task: "Sneaker St + Sino Centre, Mong Kok" },
        { t: "8:00pm", task: "(opt) Symphony of Lights" },
        { t: "10:00pm", task: "LKF night out" },
      ],
    },
    {
      date: "Sep 28", day: "Mon", base: "HK → Guangzhou / Shenzhen", stay: "GZ hotel TBD (KJ, KLi, Shruthik, Wes) · SZ hotel TBD (Albin, Maas)",
      morning: "Check out · MTR to West Kowloon",
      afternoon: "Midday HSR West Kowloon → Guangzhou South ~1h (GZ crew) / → Futian ~14 min (SZ crew) · check in",
      evening: "GZ: Beijing Rd + Pearl River · SZ: Huaqiangbei electronics + COCO Park",
      notes: "Group splits today — Brendan heads home, Ehsan & Scott solo in China. SZ crew: fasting starts ~midnight for the Sep 29 checkup. Carry Shekou→Macau ferry ticket. HSR opens 15 days out — passport ticket.",
      checklist: [
        { t: "10:00am", task: "Check out, MTR → West Kowloon" },
        { t: "12:00pm", task: "HSR → Guangzhou South (KJ · KLi · Shruthik · Wes) / → Futian (Albin · Maas)" },
        { t: "1:30pm", task: "Check in — GZ + SZ hotels" },
        { t: "3:00pm", task: "GZ: Beijing Rd · SZ: Huaqiangbei / SEG electronics" },
        { t: "8:00pm", task: "GZ: Pearl River · SZ: COCO Park — last non-fasting night" },
      ],
    },
    {
      date: "Sep 29", day: "Tue", base: "Guangzhou / Shenzhen", stay: "GZ hotel TBD (KJ, KLi, Shruthik, Wes) · SZ hotel TBD (Albin, Maas)",
      morning: "GZ: dim sum + Shamian Island · SZ: 🩺 FASTING exec checkup + cancer screen + derm + wisdom-tooth eval @ HKU-Shenzhen (~8am)",
      afternoon: "GZ: Chen Clan Academy + Canton Tower · SZ: post-checkup lunch · wisdom-tooth extraction if flagged, else OCT-LOFT",
      evening: "GZ: Pearl River cruise / Beijing Rd · SZ: rest or COCO Park",
      notes: "Split day — GZ crew explores Guangzhou; Albin & Maas do the medical block (personal spend — not a group cost). No breakfast for SZ crew; fast from ~midnight.",
      checklist: [
        { t: "8:00am", task: "SZ: HKU-Shenzhen checkup (fasting) · GZ: dim sum breakfast" },
        { t: "10:30am", task: "GZ: Shamian Island + Chen Clan Academy" },
        { t: "12:30pm", task: "SZ: post-checkup lunch" },
        { t: "3:00pm", task: "GZ: Canton Tower · SZ: extraction if flagged, else OCT-LOFT" },
        { t: "7:30pm", task: "GZ: Pearl River cruise · SZ: rest or COCO Park" },
      ],
    },
    {
      date: "Sep 30", day: "Wed", base: "Guangzhou → Shenzhen", stay: "Shenzhen hotel (TBD), Futian",
      morning: "GZ crew: check out, HSR Guangzhou → Shenzhen (~1h) · SZ: 🩺 LASIK/SMILE consult + pre-op ONLY @ Aier Eye (no procedure)",
      afternoon: "Reunite in Shenzhen — OCT-LOFT / Shenzhen Bay boardwalk / Nantou",
      evening: "Sea World plaza (Shekou) nightlife",
      notes: "Contacts must be stopped since ~Sep 15. Book the GZ→SZ HSR with the Sep 28 tickets.",
      checklist: [
        { t: "9:00am", task: "SZ: Aier Eye consult only · GZ: check out → Guangzhou South" },
        { t: "11:00am", task: "GZ crew: HSR Guangzhou → Shenzhen (~1h)" },
        { t: "1:00pm", task: "Reunite — OCT-LOFT or Nantou old town" },
        { t: "5:00pm", task: "Shenzhen Bay boardwalk run (~10.6km flat)" },
        { t: "8:00pm", task: "Sea World plaza, Shekou" },
      ],
    },
    {
      date: "Oct 1", day: "Thu", base: "SZ → Macau", stay: "Macau Peninsula hotel (TBD)",
      morning: "Metro Futian → Shekou Port (~40 min) · ferry → Macau Outer Harbour (~60–70 min, arrive 45 min early) · 5-min taxi/shuttle to Peninsula hotel, drop bags",
      afternoon: "Historic walking tour: Senado Sq → Ruins of St Paul's → Mount Fortress → Rua da Felicidade + Macanese street food",
      evening: "Free casino shuttle from Grand Lisboa/StarWorld (or 15-min taxi) → Cotai: Venetian, Londoner, Studio City, Galaxy",
      notes: "⚠ Golden Week Day 1 — peak crowds. Carry pre-booked ferry ticket (240-hr transit requires onward ticket). Stay on the Peninsula near the historic centre for easy bag drop.",
      checklist: [
        { t: "8:00am", task: "Metro Futian → Shekou Port (~40 min)" },
        { t: "9:15am", task: "Arrive port 45 min early · ferry → Macau Outer Harbour" },
        { t: "10:45am", task: "Taxi/shuttle 5 min → Peninsula hotel, drop bags" },
        { t: "11:30am", task: "Senado Sq → Ruins of St Paul's → Mount Fortress" },
        { t: "2:00pm", task: "Rua da Felicidade + Macanese street food" },
        { t: "6:30pm", task: "Free shuttle from Grand Lisboa/StarWorld → Cotai" },
        { t: "7:30pm", task: "Cotai: Venetian · Londoner · Studio City · Galaxy" },
        { t: "late", task: "Shuttle/taxi back to Peninsula hotel" },
      ],
    },
    {
      date: "Oct 2", day: "Fri", base: "Macau → HK", stay: "SkyCity Marriott (airport)",
      morning: "Last Macau AM — Senado / Lord Stow's egg tarts",
      afternoon: "Ferry Macau → TST · (opt) Sam's Tailor pickup · taxi/AEL to SkyCity Marriott, Lantau",
      evening: "Low-key dinner near TST or SkyCity · early night",
      notes: "Book Macau→HK ferry 1–3 days ahead.",
      checklist: [
        { t: "9:00am", task: "Lord Stow's egg tarts + last Macau loop" },
        { t: "12:00pm", task: "Ferry Macau → TST (~60 min)" },
        { t: "2:00pm", task: "(opt) Sam's Tailor pickup" },
        { t: "4:00pm", task: "Taxi/AEL → SkyCity Marriott, check in" },
        { t: "8:00pm", task: "Early night — 6am wake-up" },
      ],
    },
    {
      date: "Oct 3", day: "Sat", base: "Fly home", stay: "—",
      morning: "Wake ~6am · shuttle SkyCity → HKG T1 · check in by ~7am",
      afternoon: "DL0088 HKG→LAX 9:25am",
      evening: null,
      notes: "Arrive SEA 12:27pm.",
      checklist: [
        { t: "6:00am", task: "Wake · free shuttle → HKG T1" },
        { t: "7:00am", task: "Check in / security" },
        { t: "9:25am", task: "DL0088 HKG → LAX → DL1714 → SEA" },
      ],
    },
  ],

  // Bookings, transit and activity references.
  resources: [
    { cat: "Visa/legal", detail: "240-hr transit: must be HK→mainland→Macau (different region in/out). Guangzhou + Shenzhen both count as the mainland stop. Carry onward Macau ticket.", cost: "—", url: null, linkLabel: "MTR 240-hr policy page" },
    { cat: "HSR", detail: "West Kowloon → Guangzhou South ~1h (GZ crew) · → Futian ~14 min (Albin, Maas) · plus Guangzhou → Shenzhen Sep 30. Opens 15 days out; passport ticket.", cost: "~$10–28", url: "https://www.highspeed.mtr.com.hk", linkLabel: "highspeed.mtr.com.hk" },
    { cat: "Ferry SZ→Macau", detail: "Shekou Port → Macau Taipa, ~60 min. First 08:00, last 21:00.", cost: "~$31", url: "https://www.trip.com", linkLabel: "Trip.com / Klook" },
    { cat: "Ferry Macau→HK", detail: "Macau Taipa → HK Sheung Wan, ~60 min.", cost: "~$25", url: "https://www.turbojet.com.hk", linkLabel: "turbojet.com.hk" },
    { cat: "BJJ/Judo HK", detail: "KLN BJJ (Jordan) — BJJ + judo, English.", cost: "~HK$200", url: "https://klnbjj.com", linkLabel: "klnbjj.com" },
    { cat: "BJJ Shenzhen", detail: "Wan Sheng Fight Club (Luohu).", cost: "~¥50–100", url: "https://wstkd.com", linkLabel: "wstkd.com · +86 158 8944 4114" },
    { cat: "Calisthenics HK", detail: "Lai Chi Kok Park, Victoria Park, Kowloon Park.", cost: "free", url: "https://calisthenics-parks.com", linkLabel: "calisthenics-parks.com" },
    { cat: "Calisthenics SZ", detail: "Lianhuashan / Central Park / Bijiashan · Shenzhen Bay.", cost: "free", url: "https://calisthenicslivemap.com", linkLabel: "calisthenicslivemap.com" },
    { cat: "Running HK", detail: "Bowen Rd, TST→West Kowloon promenade, Lugard loop, Dragon's Back.", cost: "free", url: "https://greatruns.com", linkLabel: "greatruns.com" },
    { cat: "Running SZ", detail: "Shenzhen Bay boardwalk (~10.6km flat), Lianhuashan hills.", cost: "free", url: "https://greatruns.com", linkLabel: "greatruns.com" },
    { cat: "Shopping gear", detail: "Citygate Outlets (Arc'teryx outlet), Sneaker St Mong Kok.", cost: "varies", url: "https://citygateoutlets.com.hk", linkLabel: "citygateoutlets.com.hk" },
    { cat: "Shopping anime", detail: "Sino Centre + In's Point + Richmond Arcade, Mong Kok.", cost: "varies", url: null, linkLabel: null },
    { cat: "Shopping SZ", detail: "Huaqiangbei/SEG electronics; Luohu tailoring (skip replicas).", cost: "varies", url: null, linkLabel: null },
    { cat: "Viewpoints", detail: "Peak/Lugard, Choi Hung, Ping An Free Sky, Ruins of St Paul's.", cost: "varies", url: null, linkLabel: null },
  ],

  flights: {
    note: "Fronted by Ehsan (Delta Main Basic) — ~$450/person placeholder, split across the group.",
    out: "DL2861 SEA→LAX + DL0089 LAX→HKG",
    back: "DL0088 HKG→LAX + DL1714 LAX→SEA",
  },

  // frontedBy set => contributes to settlement. total => split evenly among
  // leg attendees; perPerson => each attendee owes that amount to frontedBy.
  // No frontedBy => informational only (everyone pays their own).
  costs: [
    { id: "flights", leg: "hk1", cat: "Flight", label: "Round-trip flights SEA ↔ HKG (Delta)", total: null, perPerson: 450, frontedBy: "ehsan", status: "booked", note: "~$450/person placeholder — update to actual fare · everyone attends hk1 so it splits across all 9" },
    { id: "hk1-hotel", leg: "hk1", cat: "Hotel", label: "\"Our Sweet & Lovely Home\" 4BR Airbnb, Yau Ma Tei / Nathan Rd", total: 1158, perPerson: null, frontedBy: "albin", status: "booked", note: "4BR, Yau Ma Tei / Nathan Rd" },
    { id: "gz-hotel", leg: "gz", cat: "Hotel", label: "TBD — Guangzhou hotel, Sep 28–30 (2 nights)", total: null, perPerson: null, frontedBy: null, status: "to-book", note: "GZ crew only: Kevin Jacob · Kevin Li · Shruthik · Wesley" },
    { id: "sz-hotel", leg: "sz", cat: "Hotel", label: "TBD — Hyatt Place Shenzhen Dongmen (points) or Kapok Shenzhen Luohu (cash)", total: null, perPerson: null, frontedBy: null, status: "to-book", note: "4 rooms · Albin & Maas need Sep 28–Oct 1, GZ crew only Sep 30 — settle room nights/split when booking · if points, record points + cash-equivalent" },
    { id: "mo-hotel", leg: "mo", cat: "Hotel", label: "TBD — Hotel Central (San Ma Lo, closest to UNESCO), Sofitel Ponte 16 (waterfront), or Caravel (budget boutique)", total: null, perPerson: null, frontedBy: null, status: "to-book", note: "Peninsula near historic centre for morning bag drop · Golden Week — book ASAP" },
    { id: "hk2-hotel", leg: "hk2", cat: "Hotel", label: "Hong Kong SkyCity Marriott (airport)", total: null, perPerson: null, frontedBy: "albin", status: "booked", note: "2 rooms · cash price TBD" },

    { id: "a21", leg: "hk1", cat: "Transport", label: "Bus A21 · HKG → Yau Ma Tei", total: null, perPerson: 4.30, frontedBy: null, status: null, note: "~HK$34 · first bus ~05:30" },
    { id: "hsr-gz", leg: "gz", cat: "Transport", label: "HSR West Kowloon → Guangzhou South", total: null, perPerson: 27, frontedBy: null, status: null, note: "~HK$215 · ~1h · passport ticket · GZ crew (4)" },
    { id: "hsr", leg: "sz", cat: "Transport", label: "HSR West Kowloon → Futian", total: null, perPerson: 10, frontedBy: null, status: null, note: "~HK$78 · ~14 min · passport ticket · Albin & Maas" },
    { id: "hsr-gz-sz", leg: "sz", cat: "Transport", label: "HSR Guangzhou → Shenzhen", total: null, perPerson: 11, frontedBy: null, status: null, note: "~¥75 · ~1h · Sep 30 · GZ crew rejoins" },
    { id: "ferry-sz-mo", leg: "mo", cat: "Transport", label: "Metro to Shekou + ferry → Macau Outer Harbour", total: null, perPerson: 31, frontedBy: null, status: null, note: "Pre-booked ferry ticket required at border" },
    { id: "ferry-mo-hk", leg: "hk2", cat: "Transport", label: "Macau → TST ferry (Cotai Water Jet / TurboJET)", total: null, perPerson: 25, frontedBy: null, status: null, note: "Book 1–3 days ahead" },
    { id: "taxi-skycity", leg: "hk2", cat: "Transport", label: "2 taxis · TST → SkyCity Marriott", total: null, perPerson: null, frontedBy: null, status: null, note: "~HK$300/cab, split by riders · luggage" },
    { id: "shuttle-hkg", leg: "hk2", cat: "Transport", label: "SkyCity → HKG T1 shuttle", total: null, perPerson: 0, frontedBy: null, status: null, note: "Free" },
  ],

  notes: [
    "Sep 28–30 the group splits: KJ · Kevin Li · Shruthik · Wesley → Guangzhou; Albin & Maas → Shenzhen (medical, maybe GZ day trip); Ehsan & Scott solo; Brendan heads home.",
    "Flights fronted by Ehsan — ~$450/person placeholder, split across everyone; update when the real fare lands.",
    "Sep 29–30 medical block and Sam's Tailor are personal spend — excluded.",
    "Points bookings: record points used AND cash-equivalent so the fronter is reimbursed fairly.",
    "Split is per leg: each person owes (leg shared costs) / (people on that leg).",
  ],
};
