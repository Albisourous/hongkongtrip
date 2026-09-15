// Single source of truth. null = TBD. All money in USD unless noted.
const TRIP = {
  title: "HK · Shenzhen · Macau — Group Trip 2026",
  dates: { depart: "Wed Sep 23 (SEA)", arrive: "Fri Sep 25, 5:05am (HKG)", home: "Sat Oct 3, 9:25am (HKG)", nights: 8 },
  route: "Seattle → Hong Kong → Shenzhen → Macau → Hong Kong → Seattle",

  // legs a person attends; remove a leg id to exclude them from that leg's split
  people: [
    { id: "p1", name: "You", legs: ["hk1", "sz", "mo", "hk2"] },
    { id: "p2", name: "Friend 2", legs: ["hk1", "sz", "mo", "hk2"] },
    { id: "p3", name: "Friend 3", legs: ["hk1", "sz", "mo", "hk2"] },
    { id: "p4", name: "Friend 4", legs: ["hk1", "sz", "mo", "hk2"] },
    { id: "p5", name: "Friend 5", legs: ["hk1", "sz", "mo", "hk2"] },
    { id: "p6", name: "Friend 6", legs: ["hk1", "sz", "mo", "hk2"] },
    { id: "p7", name: "Friend 7", legs: ["hk1", "sz", "mo", "hk2"] },
  ],

  legs: [
    { id: "hk1", name: "Hong Kong", dates: "Sep 25–28", nights: 3 },
    { id: "sz", name: "Shenzhen", dates: "Sep 28–Oct 1", nights: 3 },
    { id: "mo", name: "Macau", dates: "Oct 1–2", nights: 1 },
    { id: "hk2", name: "Hong Kong (airport)", dates: "Oct 2–3", nights: 1 },
  ],

  itinerary: [
    { date: "Sep 25", day: "Fri", base: "Hong Kong", plan: "Land 5:05am · nap · (opt) Sam's Tailor measure · Mid-Autumn: Victoria Park lanterns + Tai Hang Fire Dragon" },
    { date: "Sep 26", day: "Sat", base: "Hong Kong", plan: "Dragon's Back hike + Shek O · Sham Shui Po (Apliu St, arcade, streetwear) · Temple St Night Market" },
    { date: "Sep 27", day: "Sun", base: "Hong Kong", plan: "Kowloon Walled City exhibition + Kowloon City Thai lunch · Peak/Lugard · Sneaker St + Sino Centre · LKF night" },
    { date: "Sep 28", day: "Mon", base: "HK → Shenzhen", plan: "HSR West Kowloon → Futian (~14 min) · check in · Dongmen streetwear + Huaqiangbei · nightlife" },
    { date: "Sep 29", day: "Tue", base: "Shenzhen", plan: "Medical Day 1 (personal): exec health checkup + cancer screen + derm + wisdom-tooth eval @ HKU-Shenzhen Hospital" },
    { date: "Sep 30", day: "Wed", base: "Shenzhen", plan: "Medical Day 2 (personal): LASIK/SMILE consult @ Aier Eye · OCT-LOFT / Shenzhen Bay / Sea World" },
    { date: "Oct 1", day: "Thu", base: "SZ → Macau", plan: "Metro to Shekou Port → ferry to Outer Harbour · Senado Sq, Ruins of St Paul's, Rua da Felicidade · Cotai" },
    { date: "Oct 2", day: "Fri", base: "Macau → HK", plan: "Ferry to TST · (opt) Sam's Tailor pickup · taxi to SkyCity Marriott (airport)" },
    { date: "Oct 3", day: "Sat", base: "Fly home", plan: "Wake ~6am · HKG T1 · DL0088 9:25am" },
  ],

  flights: {
    note: "Booked individually (Delta Main Basic) — not a shared cost.",
    out: "DL2861 SEA→LAX + DL0089 LAX→HKG",
    back: "DL0088 HKG→LAX + DL1714 LAX→SEA",
  },

  // frontedBy set => contributes to settlement. total => split evenly among
  // leg attendees; perPerson => each attendee owes that amount to frontedBy.
  // No frontedBy => informational only (everyone pays their own).
  costs: [
    { id: "hk1-hotel", leg: "hk1", cat: "Hotel", label: "\"Our Sweet & Lovely Home\" 4BR Airbnb, Yau Ma Tei / Nathan Rd", total: 1158, perPerson: null, frontedBy: "p1", status: "booked", note: "Sleeps all 7 · ~$165/pax" },
    { id: "sz-hotel", leg: "sz", cat: "Hotel", label: "TBD — Hyatt Place Shenzhen Dongmen (points) or Kapok Shenzhen Luohu (cash)", total: null, perPerson: null, frontedBy: null, status: "to-book", note: "4 rooms · if points, record points + cash-equivalent" },
    { id: "mo-hotel", leg: "mo", cat: "Hotel", label: "TBD — near Outer Harbour/Senado or Cotai", total: null, perPerson: null, frontedBy: null, status: "to-book", note: "4 rooms · Golden Week — book ASAP" },
    { id: "hk2-hotel", leg: "hk2", cat: "Hotel", label: "Hong Kong SkyCity Marriott (airport)", total: null, perPerson: null, frontedBy: "p1", status: "booked", note: "2 rooms (4+3 guests) · cash price TBD" },

    { id: "a21", leg: "hk1", cat: "Transport", label: "Bus A21 · HKG → Yau Ma Tei", total: null, perPerson: 4.30, frontedBy: null, status: null, note: "~HK$34 · first bus ~05:30" },
    { id: "hsr", leg: "sz", cat: "Transport", label: "HSR West Kowloon → Futian", total: null, perPerson: 10, frontedBy: null, status: null, note: "~HK$78 · ~14 min · passport ticket" },
    { id: "ferry-sz-mo", leg: "mo", cat: "Transport", label: "Metro to Shekou + ferry → Macau Outer Harbour", total: null, perPerson: 31, frontedBy: null, status: null, note: "Pre-booked ferry ticket required at border" },
    { id: "ferry-mo-hk", leg: "hk2", cat: "Transport", label: "Macau → TST ferry (Cotai Water Jet / TurboJET)", total: null, perPerson: 25, frontedBy: null, status: null, note: "Book 1–3 days ahead" },
    { id: "taxi-skycity", leg: "hk2", cat: "Transport", label: "2 taxis · TST → SkyCity Marriott", total: null, perPerson: null, frontedBy: null, status: null, note: "~HK$300/cab, split by riders · luggage" },
    { id: "shuttle-hkg", leg: "hk2", cat: "Transport", label: "SkyCity → HKG T1 shuttle", total: null, perPerson: 0, frontedBy: null, status: null, note: "Free" },
  ],

  notes: [
    "Flights booked individually — excluded from the split.",
    "Sep 29–30 medical block and Sam's Tailor are personal spend — excluded.",
    "Points bookings: record points used AND cash-equivalent so the fronter is reimbursed fairly.",
    "Split is per leg: each person owes (leg shared costs) / (people on that leg).",
  ],
};
