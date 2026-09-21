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
  // time; must: true marks the day's time-sensitive goal, rendered red on
  // Days), sequenced to minimize backtracking between places; it follows
  // the main group itinerary — people who split off do their own thing
  // and aren't listed. notes = timing/booking warnings.
  days: [
    {
      date: "Sep 23", day: "Wed", base: "In transit", stay: "Overnight flight", legs: [],
      notes: "Redeye over the Pacific.",
      checklist: [
        { t: "3:00pm", task: "SEA — check bags through to HKG" },
        { t: "5:40pm", task: "DL2861 SEA → LAX", must: true },
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
        { t: "3:00pm", task: "(opt) Sam's Tailor fitting, TST + Chungking Mansions, Nathan Rd (Chungking Express / Fallen Angels) → Cheung Hing Kee pan-fried buns, Lock Rd (Michelin Bib — buns all meat; veg = kelp/wheat-gluten sides) → Star Ferry + harbourfront" },
        { t: "5:45pm", task: "(opt) Monster Building (Yick Cheong) photo stop — Quarry Bay, 3 stops east of CWB; the stacked-facade IG shot" },
        { t: "7:00pm", task: "Victoria Park lantern carnival, Causeway Bay" },
        { t: "8:15pm", task: "Tai Hang Fire Dragon Dance — 5-min walk from Victoria Park", must: true },
      ],
    },
    {
      date: "Sep 26", day: "Sat", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei", legs: ["hk1"],
      notes: "Hike skipped — slow morning instead. Alt AM: KLN BJJ/judo (Jordan) or Lai Chi Kok calisthenics. Neon is thinner than the '90s film era but Mong Kok still glows after dark.",
      checklist: [
        { t: "9:30am", task: "Slow morning — cha chaan teng breakfast, laundry/rest" },
        { t: "11:00am", task: "Sham Shui Po — Apliu St flea market + Golden Computer Arcade (egg tarts + pineapple buns at the bakeries)" },
        { t: "2:00pm", task: "(opt) Shek O beach afternoon — bus 9 from Shau Kei Wan (~30 min)" },
        { t: "6:30pm", task: "Mong Kok neon walk — Fallen Angels territory (Sai Yeung Choi St / Argyle)", must: true },
        { t: "7:30pm", task: "(opt) Aqua Luna red-sail junk — boards TST Pier 1, sails through the 8pm Symphony of Lights (~45 min, ~HK$300) — Temple St still on after" },
        { t: "8:00pm", task: "Temple St Night Market — back in YMT by the Airbnb (or rooftop bar)" },
        { t: "late", task: "(opt) He-mu Spa 天沐·養生 — massage + sauna, Kimberley Rd TST, til 11pm · 9542 5956" },
      ],
    },
    {
      date: "Sep 27", day: "Sun", base: "Hong Kong", stay: "Airbnb, Yau Ma Tei", legs: ["hk1"],
      notes: "All Kowloon stops before lunch are ~10 min apart. Peak saved for night — Lugard lookout is the skyline photo spot; LKF is a ~15-min walk down from the tram terminus. Peak Tram queues run ~30–45 min at dusk — buy the timed ticket ahead.",
      checklist: [
        { t: "9:00am", task: "Kowloon Walled City exhibition — free timed ticket, go early", must: true },
        { t: "10:45am", task: "Chi Lin Nunnery + Nan Lian Garden, Diamond Hill (~10 min away) — Tang-style, free" },
        { t: "11:45am", task: "(opt) Choi Hung rainbow basketball court — 1 MTR stop / ~15-min walk south of Nan Lian; the classic HK IG spot" },
        { t: "12:30pm", task: "Kowloon City Thai lunch — back by the park" },
        { t: "2:30pm", task: "Sneaker St + Sino Centre, Mong Kok" },
        { t: "5:00pm", task: "MTR → Central — Mid-Levels Escalator (Chungking Express) on the way · Peak Tram up (arrive ~5:45 for golden hour)" },
        { t: "6:15pm", task: "Lugard Rd lookout — sunset → night skyline photo (~20-min walk each way)", must: true },
        { t: "8:00pm", task: "Tram down → Central — Symphony of Lights is visible from the Peak anyway" },
        { t: "9:00pm", task: "LKF night out — walkable from the tram terminus" },
      ],
    },
    {
      date: "Sep 28", day: "Mon", base: "HK → Guangzhou", stay: "Grand Hyatt Guangzhou (Zhujiang New Town) — all 6", legs: ["gz", "sz"],
      notes: "HSR opens 15 days out — passport ticket. Carry the Shekou→Macau ferry ticket — it doubles as onward-ticket proof for the 240-hr transit. Fake-market tips (Kinbo/Zhanxi): tees ¥40–150, hoodies ¥80–300, jackets ¥150–500 — open at ~40–50% of asking and be ready to walk; they'll call you back.",
      checklist: [
        { t: "9:00am", task: "Check out · MTR → West Kowloon HSR terminus — security + border ≥45 min before departure; gates open ~15 min, close 5 min" },
        { t: "10:00am", task: "HSR West Kowloon → Guangzhou East ~1h40 (or South ~1h) — all 6", must: true },
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
      notes: "Baiyun Mountain in the morning — cableway runs ~9:00–18:00 from Yuntai Garden (south gate), Didi ~30 min each way. The 白云飞索 zipline (1,500m, ~¥150–260, 10:00–18:30, stops selling ~17:00) runs down from near the cable-car top — cable up + zipline down is the play; combo tickets exist. Liwan loop compressed to Guangxiao → Shangxiajiu → Yongqingfang → Shamian, north→south on foot; Guangxiao Temple stays a must — Chen Clan Academy and Liwan Lake become optional. Bags stay at the Grand Hyatt; Canton Tower is right by the hotel. Night HSR to Shenzhen — book it with the Sep 28 tickets.",
      checklist: [
        { t: "8:00am", task: "Dim sum — Guangzhou Restaurant or Dian Dou De" },
        { t: "9:00am", task: "Didi/taxi → Baiyun Mountain south gate, Yuntai Garden (~30 min)" },
        { t: "9:30am", task: "Baiyun Mountain: cable car up → Moxing Ridge views → 白云飞索 ZIPLINE down (~1.5km high-speed, ~¥150–260, buy at 荡胸亭 near the top; 40–90kg, ages 12–60)", must: true },
        { t: "12:30pm", task: "Taxi → Guangxiao Temple 光孝寺 — oldest temple in GZ + veg lunch nearby", must: true },
        { t: "2:00pm", task: "Shangxiajiu pedestrian street — snack stroll south through Liwan (~15-min walk from the temple)" },
        { t: "3:00pm", task: "Yongqingfang lanes + Bruce Lee ancestral home" },
        { t: "4:15pm", task: "Shamian Island — colonial streets, end of the southbound loop" },
        { t: "5:00pm", task: "(opt) Chen Clan Academy folk art · Liwan Lake Park tai chi + cards — if time allows" },
        { t: "6:30pm", task: "Canton Tower / Huacheng Sq night view — right by the Grand Hyatt · (opt) rooftop rides: Bubble Tram + Sky Drop at ~450m (~¥230+, book ahead)" },
        { t: "8:00pm", task: "Collect bags → station (East→Luohu or South→Futian) — arrive ~30–45 min early; gates open ~15 min, close 5 min" },
        { t: "9:00pm", task: "HSR Guangzhou → Shenzhen (~1h, all 6)", must: true },
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
        { t: "2:45pm", task: "(opt) Bijiashan Park hill loop → UpperHills loft mall next door — skip = straight to Nanshan" },
        { t: "3:30pm", task: "(opt) Free Sky deck — 116F Ping An IFC, Futian CBD (~¥200) · ~10 min from MOCAUP" },
        { t: "4:15pm", task: "Metro → Nanshan (~40 min)" },
        { t: "5:00pm", task: "DJI flagship @ OCT Harbour — fly drones + RoboMaster (free) · (opt) 5D cinema in the OCT/Happy Valley area", must: true },
        { t: "6:00pm", task: "Haus Nowhere — Gentle Monster flagship store + art installations · B&C bakery (Butterful & Creamorous), Shenzhen Bay MixC area" },
        { t: "6:30pm", task: "(opt) thrill swap → Alps Ice World indoor ski/snowboard @ Window of the World (~¥90–110/2h, gear incl — wkday last entry ~6:30pm) or K1 Speed e-karts @ Shekou Sea World (til ~10pm)" },
        { t: "7:00pm", task: "Talent Park — Meituan drone coffee (~¥25) + Pony.ai robotaxi (~¥10)" },
        { t: "8:00pm", task: "Shenzhen Bay boardwalk — Golden Week drone show if it's on (~10.6km flat)" },
        { t: "9:30pm", task: "COCO Park dinner, Futian — or back to Dongmen pedestrian st (veg stalls + HeyTea)" },
        { t: "late", task: "(opt) Aqila Spa — 24h, last night in Shenzhen" },
      ],
    },
    {
      date: "Oct 1", day: "Thu", base: "SZ → Macau", stay: "Casa Real Hotel, Macau Peninsula", legs: ["mo"],
      notes: "⚠ Golden Week Day 1 — peak crowds. Ferry moved to ~4:30pm — weekday Shekou→Macau sailings are sparse (~9am/11am/4:30pm), so we take the late one and keep the whole day in Shenzhen; Macau becomes evening-only (peninsula lit up at night + Cotai). A-Ma Temple cut — closes ~6pm. Carry the pre-booked ferry ticket — it's the onward-ticket proof for the 240-hr transit.",
      checklist: [
        { t: "9:00am", task: "Slow morning + checkout — bags at Hyatt Place Dongmen" },
        { t: "10:00am", task: "Flex block — Huaqiangbei round 2, Dongmen, Free Sky deck (opens ~10am), or anything missed on Sep 30" },
        { t: "12:30pm", task: "Lunch → (opt) Alps Ice World ski/snowboard @ Window of the World (opens ~12pm wkdays, ~¥90–110/2h) or K1 Speed e-karts @ Shekou Sea World — 10 min from the port" },
        { t: "3:30pm", task: "Collect bags → Shekou Port — arrive ~45 min early (~55 min metro / ~20 min from Sea World side)" },
        { t: "4:30pm", task: "Ferry Shekou → Macau Outer Harbour (~60 min)", must: true },
        { t: "5:45pm", task: "Taxi/shuttle → Casa Real, check in + drop bags" },
        { t: "6:30pm", task: "Peninsula evening loop — Ruins of St Paul's (lit up at night) → Senado Sq → Rua da Felicidade street-food dinner (ask for 斋 zhai) · (opt) Macau Tower Skywalk/bungy detour — daylight only" },
        { t: "8:45pm", task: "Free shuttle from Grand Lisboa → Cotai" },
        { t: "9:15pm", task: "Cotai strip: Venetian · Londoner · Studio City — Lord Stow's egg tarts inside the Venetian · (opt) Lisboeta ~5 min: GoAirborne skydiving + ZIPCITY 388m zipline night ride + indoor karting" },
        { t: "late", task: "Shuttle/taxi back to Casa Real" },
      ],
    },
    {
      date: "Oct 2", day: "Fri", base: "Macau → HK", stay: "SkyCity Marriott (airport)", legs: ["hk2"],
      notes: "Book Macau→HK ferry 1–3 days ahead — a morning sailing leaves room for the Big Buddha before check-in (Ngong Ping 360 runs ~10:00–18:00 weekdays; book timed tickets). Po Lin Monastery does a veg set lunch. Sam's Tailor is ~10 min from the TST terminal; last real meal is TST/Tung Chung — airport area is slim pickings.",
      checklist: [
        { t: "8:00am", task: "Margaret's Café e Nata egg tarts to-go (opens ~8:30) · checkout — or the Lord Stow's branch at the Venetian on Oct 1" },
        { t: "9:15am", task: "Early ferry Macau → TST (~60 min)", must: true },
        { t: "10:30am", task: "(opt) Sam's Tailor pickup, TST — ~10 min from the ferry terminal" },
        { t: "11:15am", task: "Taxi/AEL → SkyCity Marriott — drop bags (check-in 3pm)" },
        { t: "12:15pm", task: "Taxi/shuttle → Tung Chung · Ngong Ping 360 cable car up (~25 min) — (opt) Crystal Cabin glass-bottom gondola upgrade" },
        { t: "12:45pm", task: "Tian Tan Buddha — 268 steps + Po Lin Monastery veg lunch", must: true },
        { t: "2:15pm", task: "Short hike — Wisdom Path loop (~30–45 min) or a Lantau Trail stretch" },
        { t: "3:45pm", task: "Cable car down (last ~5:30pm) → Citygate Outlets at the terminal" },
        { t: "5:00pm", task: "Outlet lap / early dinner at Citygate → shuttle back to SkyCity" },
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
        { t: "9:25am", task: "DL0088 HKG → LAX → DL1714 → SEA", must: true },
      ],
    },
  ],

  // Bookings, transit and activity references.
  resources: [
    { cat: "Visa/legal", detail: "240-hr transit: must be HK→mainland→Macau (different region in/out). Guangzhou + Shenzhen both count as the mainland stop. Carry onward Macau ticket.", cost: "—", url: null, linkLabel: "MTR 240-hr policy page" },
    { cat: "HSR", detail: "West Kowloon → Guangzhou South ~1h (all 6) · Guangzhou → Shenzhen ~1h Sep 29 night. Opens 15 days out; passport ticket.", cost: "~$10–28", url: "https://www.highspeed.mtr.com.hk", linkLabel: "highspeed.mtr.com.hk" },
    { cat: "Ferry SZ→Macau", detail: "Shekou Port → Macau Outer Harbour, ~60 min — weekday sailings sparse (~9am/11am/4:30pm), we target ~4:30pm. Book ahead.", cost: "~$31", url: "https://www.trip.com", linkLabel: "Trip.com / Klook" },
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

  // Points of interest for the Map page. lat/lng are WGS-84 — map.js
  // converts to GCJ-02 so pins align with the Amap (mainland) tiles.
  places: [
    // Hong Kong — hk1
    { name: "Airbnb — Onward Building, 528 Nathan Rd", leg: "hk1", cat: "stay", day: "Sep 25–28", lat: 22.3119, lng: 114.1706, note: "Yau Ma Tei · home base" },
    { name: "Yau Ma Tei Wholesale Fruit Market", leg: "hk1", cat: "see", day: "Sep 25", lat: 22.3121, lng: 114.1678 },
    { name: "Chungking Mansions", leg: "hk1", cat: "see", day: "Sep 25", lat: 22.2966, lng: 114.1722, note: "Chungking Express / Fallen Angels" },
    { name: "Cheung Hing Kee pan-fried buns", leg: "hk1", cat: "eat", day: "Sep 25", lat: 22.2981, lng: 114.1737, note: "Lock Rd, TST · Michelin Bib" },
    { name: "Sam's Tailor — Burlington House", leg: "hk1", cat: "shop", day: "Sep 25 + Oct 2", lat: 22.2980, lng: 114.1721 },
    { name: "Star Ferry pier + TST harbourfront", leg: "hk1", cat: "see", day: "Sep 25/26", lat: 22.2937, lng: 114.1687, note: "Aqua Luna junk boards TST Pier 1 ~7:30pm Sep 26" },
    { name: "Victoria Park lantern carnival", leg: "hk1", cat: "see", day: "Sep 25", lat: 22.2817, lng: 114.1891, note: "Mid-Autumn Festival" },
    { name: "Tai Hang Fire Dragon Dance", leg: "hk1", cat: "see", day: "Sep 25", lat: 22.2790, lng: 114.1920 },
    { name: "Monster Building — Yick Cheong, Quarry Bay", leg: "hk1", cat: "see", day: "Sep 25 (opt)", lat: 22.2844, lng: 114.2123, note: "stacked-facade photo spot" },
    { name: "Sham Shui Po — Apliu St", leg: "hk1", cat: "shop", day: "Sep 26", lat: 22.3294, lng: 114.1620 },
    { name: "Golden Computer Arcade", leg: "hk1", cat: "shop", day: "Sep 26", lat: 22.3305, lng: 114.1616 },
    { name: "Shek O beach + village", leg: "hk1", cat: "see", day: "Sep 26 (opt)", lat: 22.2305, lng: 114.2500 },
    { name: "Mong Kok neon walk — Sai Yeung Choi St", leg: "hk1", cat: "see", day: "Sep 26", lat: 22.3169, lng: 114.1698, note: "Fallen Angels territory" },
    { name: "Temple St Night Market", leg: "hk1", cat: "see", day: "Sep 26", lat: 22.3097, lng: 114.1702 },
    { name: "He-mu Spa 天沐·養生", leg: "hk1", cat: "see", day: "Sep 26 (opt)", lat: 22.3008, lng: 114.1757, note: "massage + sauna · Kimberley Rd, TST · 12pm–11pm" },
    { name: "Kowloon Walled City Park", leg: "hk1", cat: "see", day: "Sep 27", lat: 22.3320, lng: 114.1870, note: "exhibition — timed ticket" },
    { name: "Chi Lin Nunnery + Nan Lian Garden", leg: "hk1", cat: "see", day: "Sep 27", lat: 22.3407, lng: 114.2054 },
    { name: "Choi Hung Estate — rainbow court", leg: "hk1", cat: "see", day: "Sep 27 (opt)", lat: 22.3349, lng: 114.2075, note: "the classic IG basketball court" },
    { name: "Kowloon City — Thai lunch", leg: "hk1", cat: "eat", day: "Sep 27", lat: 22.3305, lng: 114.1868 },
    { name: "Sneaker St — Fa Yuen St", leg: "hk1", cat: "shop", day: "Sep 27", lat: 22.3187, lng: 114.1703 },
    { name: "Sino Centre + In's Point", leg: "hk1", cat: "shop", day: "Sep 27", lat: 22.3170, lng: 114.1700, note: "anime/figures" },
    { name: "Mid-Levels Escalator", leg: "hk1", cat: "see", day: "Sep 27", lat: 22.2837, lng: 114.1548, note: "Chungking Express" },
    { name: "Peak Tram — Garden Rd terminus", leg: "hk1", cat: "move", day: "Sep 27", lat: 22.2778, lng: 114.1594, note: "timed ticket" },
    { name: "Lugard Rd lookout", leg: "hk1", cat: "see", day: "Sep 27", lat: 22.2783175, lng: 114.1465622, note: "sunset → night skyline" },
    { name: "Lan Kwai Fong", leg: "hk1", cat: "eat", day: "Sep 27", lat: 22.2809, lng: 114.1553, note: "night out" },
    { name: "West Kowloon HSR station", leg: "hk1", cat: "move", day: "Sep 28", lat: 22.3034, lng: 114.1650 },

    // Michelin-starred with veg options (all book-ahead)
    { name: "Yat Tung Heen 逸東軒 — Eaton HK, Jordan", leg: "hk1", cat: "eat", day: "Sep 25–28 (opt)", lat: 22.3148, lng: 114.1713, note: "1★ Cantonese — veg + vegan dim sum · ~5 min from the Airbnb" },
    { name: "Ming Court — Cordis, Mong Kok", leg: "hk1", cat: "eat", day: "Sep 27 (opt)", lat: 22.3169, lng: 114.1695, note: "Michelin-starred Cantonese — veg dishes · by Sneaker St" },
    { name: "Yè Shanghai — Marco Polo, TST", leg: "hk1", cat: "eat", day: "Sep 25/27 (opt)", lat: 22.2948, lng: 114.1680, note: "1★ Shanghainese — kaofu, veg dumplings" },
    { name: "Roganic — Lee Garden, Causeway Bay", leg: "hk1", cat: "eat", day: "Sep 25 (opt)", lat: 22.2797, lng: 114.1820, note: "1★ + Green ★ — veg tasting menu" },
    { name: "Arcane — On Lan St, Central", leg: "hk1", cat: "eat", day: "Sep 27 (opt)", lat: 22.2813, lng: 114.1566, note: "1★ modern European — dedicated vegetarian menu" },
    { name: "Feuille — Wellington St, Central", leg: "hk1", cat: "eat", day: "Sep 27 (opt)", lat: 22.2838, lng: 114.1553, note: "1★ + Green ★ — fully plant-based fine dining" },
    { name: "Amber — Landmark Mandarin Oriental", leg: "hk1", cat: "eat", day: "Sep 27 (opt)", lat: 22.2804, lng: 114.1576, note: "3★ + Green ★ — veg mirror menus (~HK$2,058+)" },
    { name: "Mora 摩 — Upper Lascar Row, Sheung Wan", leg: "hk1", cat: "eat", day: "Sep 27 (opt)", lat: 22.2854, lng: 114.1474, note: "1★ + Green ★ — tofu/soy-centric · veg menu needs 2 days notice" },

    // Guangzhou — gz
    { name: "Grand Hyatt Guangzhou", leg: "gz", cat: "stay", day: "Sep 28–29", lat: 23.1165, lng: 113.3244, note: "Zhujiang New Town" },
    { name: "Xiajiao Mei 虾饺妹 dim sum", leg: "gz", cat: "eat", day: "Sep 28", lat: 23.1145, lng: 113.2615, note: "Haizhu Plaza" },
    { name: "Beijing Rd pedestrian street", leg: "gz", cat: "see", day: "Sep 28", lat: 23.1225, lng: 113.2650, note: "ancient road under glass" },
    { name: "Kinbo + Zhanxi markets", leg: "gz", cat: "shop", day: "Sep 28", lat: 23.1487, lng: 113.2570, note: "by GZ Railway Stn · bargain hard" },
    { name: "Tianzi Pier — Pearl River cruise", leg: "gz", cat: "see", day: "Sep 28", lat: 23.1163, lng: 113.2670 },
    { name: "Baiyun Mountain — cableway + 白云飞索 zipline", leg: "gz", cat: "see", day: "Sep 29", lat: 23.1831, lng: 113.2932, note: "cable car up → Moxing Ridge → zipline down (~1.5km)" },
    { name: "Guangxiao Temple 光孝寺", leg: "gz", cat: "see", day: "Sep 29", lat: 23.1266, lng: 113.2593, note: "oldest temple in GZ · veg lunch nearby" },
    { name: "Shamian Island", leg: "gz", cat: "see", day: "Sep 29", lat: 23.1083, lng: 113.2403 },
    { name: "Shangxiajiu Pedestrian Street", leg: "gz", cat: "shop", day: "Sep 29", lat: 23.1179, lng: 113.2485, note: "snack stroll through Liwan" },
    { name: "Chen Clan Academy", leg: "gz", cat: "see", day: "Sep 29 (opt)", lat: 23.1209, lng: 113.2461 },
    { name: "Yongqingfang + Bruce Lee home", leg: "gz", cat: "see", day: "Sep 29", lat: 23.1159, lng: 113.2396 },
    { name: "Liwan Lake Park", leg: "gz", cat: "see", day: "Sep 29 (opt)", lat: 23.1248, lng: 113.2390 },
    { name: "Canton Tower + Huacheng Sq", leg: "gz", cat: "see", day: "Sep 29", lat: 23.1066, lng: 113.3246, note: "(opt) rooftop rides — Bubble Tram + Sky Drop ~450m" },
    { name: "Guangzhou East station", leg: "gz", cat: "move", day: "Sep 29", lat: 23.1497, lng: 113.3248 },
    { name: "Guangzhou South station", leg: "gz", cat: "move", day: "Sep 28", lat: 22.9870, lng: 113.2685 },

    // Shenzhen — sz
    { name: "Hyatt Place Dongmen", leg: "sz", cat: "stay", day: "Sep 29–Oct 1", lat: 22.5425, lng: 114.1180, note: "Laojie MTR exit H" },
    { name: "Dongmen pedestrian street", leg: "sz", cat: "shop", day: "Sep 29–30", lat: 22.5440, lng: 114.1185 },
    { name: "Huaqiangbei / SEG electronics", leg: "sz", cat: "shop", day: "Sep 30", lat: 22.5445, lng: 114.0855 },
    { name: "MOCAUP — art + urban planning museum", leg: "sz", cat: "see", day: "Sep 30", lat: 22.5410, lng: 114.0579 },
    { name: "Free Sky — Ping An IFC 116F", leg: "sz", cat: "see", day: "Sep 30 (opt)", lat: 22.5408, lng: 114.0506, note: "observation deck, Futian CBD (~¥200)" },
    { name: "Bijiashan Park + UpperHills", leg: "sz", cat: "see", day: "Sep 30 (opt)", lat: 22.5618, lng: 114.0780 },
    { name: "DJI flagship — OCT Harbour", leg: "sz", cat: "tech", day: "Sep 30", lat: 22.5280, lng: 113.9845, note: "drone cages + RoboMaster" },
    { name: "Haus Nowhere — Gentle Monster", leg: "sz", cat: "shop", day: "Sep 30", lat: 22.5170, lng: 113.9380 },
    { name: "Talent Park — drone coffee + robotaxi", leg: "sz", cat: "tech", day: "Sep 30", lat: 22.5097, lng: 113.9450 },
    { name: "Shenzhen Bay boardwalk", leg: "sz", cat: "see", day: "Sep 30", lat: 22.4970, lng: 113.9660, note: "Golden Week drone show" },
    { name: "Alps Ice World — Window of the World", leg: "sz", cat: "see", day: "Sep 30–Oct 1 (opt)", lat: 22.5348, lng: 113.9765, note: "indoor ski/snowboard · ~¥90–110/2h incl gear · opens ~12pm wkdays" },
    { name: "K1 Speed — Shekou Sea World", leg: "sz", cat: "see", day: "Sep 30–Oct 1 (opt)", lat: 22.4845, lng: 113.9160, note: "indoor electric karting · til ~10pm · 10 min from the port" },
    { name: "COCO Park", leg: "sz", cat: "eat", day: "Sep 30", lat: 22.5345, lng: 114.0530 },
    { name: "OCT-LOFT / Nantou (fallback)", leg: "sz", cat: "see", day: "Sep 30", lat: 22.5360, lng: 113.9880 },
    { name: "Shekou Cruise Homeport", leg: "sz", cat: "move", day: "Oct 1", lat: 22.4679, lng: 113.9048, note: "ferry → Macau" },
    { name: "Futian station", leg: "sz", cat: "move", day: "Sep 28", lat: 22.5390, lng: 114.0530 },

    // Macau — mo
    { name: "Casa Real Hotel", leg: "mo", cat: "stay", day: "Oct 1–2", lat: 22.1953, lng: 113.5530 },
    { name: "Macau Outer Harbour ferry terminal", leg: "mo", cat: "move", day: "Oct 1", lat: 22.1972, lng: 113.5590 },
    { name: "Ruins of St Paul's + Mount Fortress", leg: "mo", cat: "see", day: "Oct 1", lat: 22.1976, lng: 113.5408 },
    { name: "Senado Square", leg: "mo", cat: "see", day: "Oct 1", lat: 22.1937, lng: 113.5397 },
    { name: "Rua da Felicidade", leg: "mo", cat: "eat", day: "Oct 1", lat: 22.1940, lng: 113.5380, note: "Macanese street food" },
    { name: "Margaret's Café e Nata", leg: "mo", cat: "eat", day: "Oct 2", lat: 22.1927, lng: 113.5412, note: "egg tarts — the Peninsula classic" },
    { name: "Lord Stow's Bakery — Coloane village", leg: "mo", cat: "eat", day: "Oct 2 (opt)", lat: 22.1154, lng: 113.5514, note: "THE original Portuguese egg tart" },
    { name: "Grand Lisboa — free Cotai shuttle", leg: "mo", cat: "move", day: "Oct 1", lat: 22.1907, lng: 113.5448 },
    { name: "Macau Tower — Skywalk + bungy", leg: "mo", cat: "see", day: "Oct 1 (opt)", lat: 22.1798, lng: 113.5367, note: "world's highest bungy 233m (~MOP 3,600+) · Skywalk ~MOP 800" },
    { name: "Venetian / Londoner", leg: "mo", cat: "see", day: "Oct 1", lat: 22.1480, lng: 113.5600 },
    { name: "Studio City", leg: "mo", cat: "see", day: "Oct 1", lat: 22.1407, lng: 113.5680 },
    { name: "Galaxy Macau", leg: "mo", cat: "see", day: "Oct 1", lat: 22.1435, lng: 113.5520 },
    { name: "Lisboeta — GoAirborne + ZIPCITY + karting", leg: "mo", cat: "see", day: "Oct 1 (opt)", lat: 22.1426, lng: 113.5665, note: "indoor skydiving · 388m urban zipline (night rides) · indoor karting" },

    // Hong Kong airport — hk2
    { name: "China Ferry Terminal, TST", leg: "hk2", cat: "move", day: "Oct 2", lat: 22.2994, lng: 114.1676, note: "Macau ferry arrives here" },
    { name: "Ngong Ping 360 — Tung Chung terminal", leg: "hk2", cat: "move", day: "Oct 2", lat: 22.2894, lng: 113.9407, note: "~25-min cable car to the Buddha · (opt) Crystal Cabin glass-bottom" },
    { name: "Tian Tan Buddha + Po Lin Monastery", leg: "hk2", cat: "see", day: "Oct 2", lat: 22.2540, lng: 113.9055, note: "268 steps · veg set lunch at the monastery" },
    { name: "Wisdom Path", leg: "hk2", cat: "see", day: "Oct 2", lat: 22.2565, lng: 113.9050, note: "short hike loop from Ngong Ping" },
    { name: "Citygate Outlets", leg: "hk2", cat: "shop", day: "Oct 2", lat: 22.2897, lng: 113.9414, note: "right at the Tung Chung cable car terminal" },
    { name: "SkyCity Marriott", leg: "hk2", cat: "stay", day: "Oct 2–3", lat: 22.3124, lng: 113.9374 },
    { name: "Hong Kong Intl Airport", leg: "hk2", cat: "move", day: "Oct 3", lat: 22.3080, lng: 113.9185, note: "DL0088 9:25am" },
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
