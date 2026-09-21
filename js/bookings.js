/* Bookings page — what still needs booking + who sleeps where, night by night.
   Consecutive days sharing a `stay` string form one hotel block; a block's
   sleepers are the people whose legs cover those nights, so anyone split
   off (Brendan, Ehsan & Scott mid-trip, Kevin Li in Macau) drops out. */
(() => {
  "use strict";

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const legDot = id => el("span", "leg-dot leg-" + id);
  const legDots = ids => {
    const s = el("span", "leg-dots");
    ids.forEach(id => s.append(el("span", "leg-dot leg-" + id)));
    return s;
  };
  const store = window.SyncStore || {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };

  const legName = id => (TRIP.legs.find(l => l.id === id) || {}).name || id;
  const legDates = id => (TRIP.legs.find(l => l.id === id) || {}).dates || "";
  const personName = id => (TRIP.people.find(p => p.id === id) || {}).name || id;
  const fmt = n => "$" + n.toFixed(2);
  const tbd = () => el("span", "tbd", "TBD");
  const td = (cls, v) => {
    const c = el("td", cls);
    if (v != null) v.nodeType ? c.append(v) : c.textContent = v;
    return c;
  };
  const mkTable = (cols, section) => {
    const wrap = el("div", "table-wrap"), t = el("table"), tb = el("tbody"),
      hr = el("tr"), thd = el("thead");
    cols.forEach(c => {
      const th = el("th");
      if (c != null && c.nodeType) th.append(c);
      else th.textContent = c;
      hr.append(th);
    });
    thd.append(hr);
    t.append(thd, tb);
    wrap.append(t);
    section.append(wrap);
    return tb;
  };
  const res = cat => TRIP.resources.find(r => r.cat === cat) || {};
  const day = date => TRIP.days.find(d => d.date === date) || {};
  // Sentence(s) of a day's notes mentioning a keyword (e.g. "ferry").
  const dayNote = (date, kw) => (day(date).notes || "")
    .split(". ").filter(s => s.toLowerCase().includes(kw)).join(" ");

  // ---- Stays: who sleeps where -------------------------------------------

  // A stay block can cover more than one leg (Sep 28–30 days carry both
  // gz and sz), so the hotel cost is matched by a leg-name keyword or by
  // shared words between the stay text and the cost label.
  const LEG_WORDS = {
    gz: ["guangzhou", "gz"], sz: ["shenzhen", "sz"], mo: ["macau"],
    hk1: ["hong kong", "hk"], hk2: ["hong kong", "hk"],
  };
  const words = s => new Set(s.toLowerCase().match(/[a-z]{3,}/g) || []);

  const hotelCosts = TRIP.costs.filter(c => c.cat === "Hotel");
  const matchCost = b => {
    const cands = hotelCosts.filter(c => b.legs.includes(c.leg));
    const sw = words(b.stay), lc = b.stay.toLowerCase();
    let best = null, bestScore = 0;
    cands.forEach(c => {
      let n = (LEG_WORDS[c.leg] || []).some(w => lc.includes(w)) ? 100 : 0;
      words(c.label).forEach(w => { if (sw.has(w)) n++; });
      if (n > bestScore) { best = c; bestScore = n; }
    });
    return best;
  };

  const blocks = [];
  TRIP.days.forEach(d => {
    const last = blocks[blocks.length - 1];
    if (last && last.stay === d.stay) last.days.push(d);
    else blocks.push({ stay: d.stay, days: [d] });
  });

  const stays = blocks
    .filter(b => b.stay && b.stay !== "—" && !/flight/i.test(b.stay))
    .map(b => {
      const legs = [...new Set(b.days.flatMap(d => d.legs || []))];
      const sleepers = TRIP.people.filter(p => p.legs.some(l => legs.includes(l)));
      return { stay: b.stay, days: b.days, legs, sleepers,
        cost: matchCost({ legs, stay: b.stay }),
        away: TRIP.people.filter(p => sleepers.indexOf(p) === -1) };
    });

  const blockLeg = b => (b.cost ? b.cost.leg : b.legs[0]);

  // "Sep 25"–"Sep 27" => "Sep 25–27"; "Sep 30"–"Oct 1" => "Sep 30–Oct 1".
  const dateRange = b => {
    const first = b.days[0].date, last = b.days[b.days.length - 1].date;
    if (first === last) return first;
    const end = first.split(" ")[0] === last.split(" ")[0]
      ? last.split(" ")[1] : last;
    return first + "–" + end;
  };

  const stayHead = b => {
    const th = el("th");
    const leg = blockLeg(b);
    if (leg) th.append(legDot(leg), " ");
    th.append(dateRange(b));
    return th;
  };

  function hotelCard(b) {
    const leg = blockLeg(b);
    const card = el("div", "hotel-card" + (leg ? " leg-" + leg : ""));

    const head = el("div", "hotel-head");
    const title = el("h3", "hotel-title");
    if (leg) title.append(legDot(leg), " ");
    title.append(b.cost ? b.cost.label.replace(/^TBD — /, "") : b.stay);
    head.append(title);
    if (b.cost) {
      const right = el("div", "hotel-right");
      right.append(b.cost.total == null
        ? el("span", "tbd", "TBD")
        : el("span", "hotel-total", fmt(b.cost.total)));
      if (b.cost.status) {
        right.append(el("span", "badge badge-" + b.cost.status,
          b.cost.status === "to-book" ? "to book" : b.cost.status));
      }
      head.append(right);
    }
    card.append(head);

    const meta = el("p", "hotel-meta");
    if (leg) meta.append(el("span", "hotel-leg leg-" + leg, legName(leg)), " · ");
    meta.append(dateRange(b) + " · " + b.days.length +
      (b.days.length === 1 ? " night" : " nights") +
      " · " + b.sleepers.length + " people");
    if (b.cost && b.cost.frontedBy) {
      const f = TRIP.people.find(p => p.id === b.cost.frontedBy);
      meta.append(" · booked by " + (f ? f.name : b.cost.frontedBy));
    }
    card.append(meta);

    const who = el("div", "block");
    who.append(el("span", "block-label", "Sleeping"));
    const names = el("span", "hotel-names");
    b.sleepers.forEach((p, i) => {
      if (i) names.append(" · ");
      names.append(p.name);
    });
    who.append(names);
    card.append(who);

    if (b.away.length) {
      const row = el("div", "block");
      row.append(el("span", "block-label", "Not here"));
      const names2 = el("span", "hotel-names muted");
      b.away.forEach((p, i) => {
        if (i) names2.append(" · ");
        names2.append(p.name);
      });
      row.append(names2);
      card.append(row);
    }

    if (b.cost && b.cost.sleeps != null) {
      const cap = el("div", "block");
      cap.append(el("span", "block-label", "Capacity"));
      const v = el("span", "hotel-names");
      v.append("sleeps " + b.cost.sleeps);
      const short = b.sleepers.length - b.cost.sleeps;
      if (short > 0) v.append(" — ", el("span", "hotel-warn", short + " short"));
      cap.append(v);
      card.append(cap);
    }

    if (b.cost && b.cost.note) card.append(el("p", "hotel-note", b.cost.note));
    if (b.cost && b.cost.url) {
      const p = el("p", "hotel-links");
      const a = el("a", null, b.cost.linkLabel || b.cost.url);
      a.href = b.cost.url;
      a.target = "_blank";
      a.rel = "noopener";
      p.append(a);
      card.append(p);
    }
    return card;
  }

  // People a hotel cost actually splits across — leg attendees minus
  // `exclude`, same rule as the Payments tab.
  const payersFor = c =>
    TRIP.people.filter(p => p.legs.includes(c.leg) &&
      (c.exclude || []).indexOf(p.id) === -1);
  const shareOf = b => {
    if (!b.cost || b.cost.total == null) return null;
    const n = payersFor(b.cost).length;
    return n ? b.cost.total / n : null;
  };

  function breakdown() {
    const s = el("section");
    s.append(el("h2", null, "Cost breakdown"));

    // Per stay: total, how many split it, each share, who fronted it.
    const tb = mkTable(["Stay", "Total", "Split among", "Each", "Fronted by"], s);
    let sum = 0;
    stays.forEach(b => {
      const c = b.cost, leg = blockLeg(b), tr = el("tr");
      const name = td(null);
      if (leg) name.append(legDot(leg), " ");
      name.append(leg ? legName(leg) : b.stay, " ",
        el("span", "muted", dateRange(b)));
      const n = c ? payersFor(c).length : 0;
      const each = shareOf(b);
      if (c && c.total != null) sum += c.total;
      tr.append(name,
        td("money", c && c.total != null ? fmt(c.total) : tbd()),
        td("money", n ? n + " pax" : "—"),
        td("money", each != null ? fmt(each) : tbd()),
        td(null, c && c.frontedBy ? personName(c.frontedBy) : "—"));
      tb.append(tr);
    });
    const fr = el("tr", "total-row"), pad = td(null, "");
    pad.colSpan = 3;
    fr.append(td(null, "All stays"), td("money", fmt(sum)), pad);
    tb.append(fr);

    // Per person: their share of each stay plus a lodging total.
    s.append(el("h3", null, "Per person"));
    const tb2 = mkTable(["Person", ...stays.map(stayHead), "Total"], s);
    TRIP.people.forEach(p => {
      const tr = el("tr");
      tr.append(td(null, p.name));
      let tot = 0;
      stays.forEach(b => {
        const c = b.cost, each = shareOf(b);
        const on = c && payersFor(c).some(q => q.id === p.id);
        if (b.sleepers.indexOf(p) === -1) tr.append(td("money", "—"));
        else if (each == null) tr.append(td("money", tbd()));
        else if (!on) tr.append(td("money muted", "own"));
        else { tot += each; tr.append(td("money", fmt(each))); }
      });
      tr.append(td("money", fmt(tot)));
      tb2.append(tr);
    });
    const gr = el("tr", "total-row");
    gr.append(td(null, "All"));
    let grand = 0;
    stays.forEach(b => {
      const c = b.cost;
      if (c && c.total != null) grand += c.total;
      gr.append(td("money", c && c.total != null ? fmt(c.total) : tbd()));
    });
    gr.append(td("money", fmt(grand)));
    tb2.append(gr);

    const pending = stays.filter(b => !b.cost || b.cost.total == null)
      .map(b => legName(blockLeg(b)));
    const note = el("p", "muted",
      "Each stay splits evenly among the people sleeping there.");
    if (pending.length) {
      note.append(" Totals exclude TBD stays: " + pending.join(", ") + ".");
    }
    s.append(note);
    return s;
  }

  function matrix() {
    const s = el("section");
    s.append(el("h2", null, "By person"));
    const wrap = el("div", "table-wrap"), t = el("table", "hotel-matrix");
    const thd = el("thead"), tb = el("tbody"), hr = el("tr");
    hr.append(el("th", null, "Person"));
    stays.forEach(b => hr.append(stayHead(b)));
    thd.append(hr);
    TRIP.people.forEach(p => {
      const tr = el("tr");
      tr.append(el("td", null, p.name));
      stays.forEach(b => {
        const cell = el("td");
        if (b.sleepers.indexOf(p) !== -1) {
          cell.append(el("span", "hotel-in" +
            (blockLeg(b) ? " leg-" + blockLeg(b) : ""), "✓"));
        } else {
          cell.append(el("span", "muted", "—"));
        }
        tr.append(cell);
      });
      tb.append(tr);
    });
    t.append(thd, tb);
    wrap.append(t);
    s.append(wrap, el("p", "muted",
      "✓ sleeps with the group; — means they aren't on that leg."));
    return s;
  }

  // ---- Action items -------------------------------------------------------

  const REQUIRED_CATS = ["Visa/legal", "HSR", "Ferry SZ→Macau", "Bus Macau→HK"];

  const hotelItem = c => ({
    id: c.id, urgent: true, legs: [c.leg],
    title: `${legName(c.leg)} hotel`,
    cost: null,
    when: legDates(c.leg),
    why: [c.label.replace(/^TBD — /, ""), c.note].filter(Boolean).join(" · "),
    url: c.url || null, linkLabel: c.linkLabel || null,
  });

  const transit = res("Visa/legal");
  const hsr = res("HSR");
  const ferryIn = res("Ferry SZ→Macau");
  const busOut = res("Bus Macau→HK");
  const walled = (day("Sep 27").checklist || []).find(i => /walled city/i.test(i.task)) || {};

  // Hotels whose bed count can't cover their leg's headcount.
  const roomingItems = TRIP.costs
    .filter(c => c.cat === "Hotel" && c.sleeps != null)
    .map(c => {
      const n = TRIP.people.filter(p => p.legs.includes(c.leg)).length;
      if (n <= c.sleeps) return null;
      return {
        id: `room-${c.id}`, urgent: true, legs: [c.leg],
        title: `Confirm rooming — ${legName(c.leg)}`,
        cost: `${c.sleeps} beds / ${n} people`,
        when: legDates(c.leg),
        why: `${c.label} — confirm where the extra ${n - c.sleeps} sleep${n - c.sleeps > 1 ? "" : "s"} (or add a room)`,
        url: c.url || null, linkLabel: c.linkLabel || null,
      };
    }).filter(Boolean);

  const REQUIRED = [
    ...TRIP.costs.filter(c => c.status === "to-book").map(hotelItem),
    ...roomingItems,
    {
      id: "room-hk2-adults", urgent: true, legs: ["hk2"],
      title: "Confirm 8th bed — SkyCity Marriott",
      cost: "7 adults booked / 8 attend",
      when: "Oct 2",
      why: "Reservation lists 7 adults but hk2 headcount is 8 — add the 8th to the booking or sort a spot",
      url: "https://www.marriott.com/en-us/hotels/hkgap-hong-kong-skycity-marriott-hotel/overview/", linkLabel: "Marriott — SkyCity",
    },
    {
      id: "prep-passports", urgent: true, legs: ["hk1"],
      title: "Passports valid 6+ months — all 9",
      cost: null,
      when: "Before Sep 25",
      why: "HK entry, the 240-hr mainland transit and Macau entry all check validity — HSR + ferry tickets also need the passport numbers",
    },
    {
      id: "prep-pay", urgent: true, legs: ["gz", "sz"],
      title: "Alipay / WeChat Pay set up + verified — mainland 6",
      cost: null,
      when: "Before Sep 28",
      why: "Cards barely work in mainland — metro, food, Didi and tickets all run on QR payments; verify the card link before you land",
    },
    {
      id: "prep-sim", urgent: true, legs: ["gz", "sz"],
      title: "eSIM/roaming with China data (+ VPN) — mainland 6",
      cost: null,
      when: "Before Sep 28",
      why: "Google/WhatsApp are blocked on the mainland — an eSIM that roams via HK or a VPN keeps them working",
    },
    {
      id: "transit-onward", urgent: true, legs: ["gz", "sz"],
      title: "Onward ticket — 240-hr transit",
      cost: transit.cost,
      when: "Show at the mainland border · Sep 28",
      why: transit.detail,
      url: transit.url, linkLabel: transit.linkLabel,
    },
    {
      id: "hsr-ticket", urgent: true, legs: ["gz", "sz"],
      title: "HSR tickets · West Kowloon → Guangzhou → Shenzhen",
      cost: hsr.cost,
      when: "Opens 15 days out (~Sep 13) · WKL→GZ Sep 28 am · GZ→SZ Sep 29 night",
      why: hsr.detail,
      url: hsr.url, linkLabel: hsr.linkLabel,
    },
    {
      id: "ferry-sz-mo", urgent: true, legs: ["mo"],
      title: "Ferry · Shekou → Macau Outer Harbour",
      cost: ferryIn.cost,
      when: "Travel Oct 1 · arrive port 45 min early",
      why: `${ferryIn.detail} Doubles as the onward-ticket proof for the 240-hr transit.`,
      url: ferryIn.url, linkLabel: ferryIn.linkLabel,
    },
    {
      id: "bus-mo-hk", urgent: true, legs: ["hk2"],
      title: "HZMB bus · Macau → HKIA",
      cost: busOut.cost,
      when: "Travel Oct 2 · no pre-booking needed (Airport Direct coach optional)",
      why: busOut.detail,
      url: busOut.url, linkLabel: busOut.linkLabel,
    },
    {
      id: "walled-city", urgent: true, legs: ["hk1"],
      title: "Kowloon Walled City exhibition — timed ticket",
      cost: "free",
      when: `Sep 27 · ${walled.t || "morning"}`,
      why: walled.task,
      url: null, linkLabel: null,
    },
  ];

  // Non-booking checks from data.js — same card/checkbox treatment,
  // badged "to check"/"done" instead of "to book"/"booked".
  const REMINDERS = (TRIP.reminders || []).map(r => ({
    id: r.id, urgent: true, check: true, legs: r.legs || [],
    title: r.title, cost: r.cost || null,
    when: r.when || null, why: r.why,
    url: r.url || null, linkLabel: r.linkLabel || null,
  }));

  // Map a resource category to a leg color, when it's place-specific.
  const CAT_LEGS = [["hong kong", "hk1"], ["hk", "hk1"], ["shenzhen", "sz"],
    ["sz", "sz"], ["macau", "mo"], ["guangzhou", "gz"], ["gz", "gz"]];
  const catLegs = cat => {
    const lc = cat.toLowerCase();
    const hit = CAT_LEGS.find(([k]) => lc.includes(k));
    return hit ? [hit[1]] : [];
  };

  // Every other resource with a booking/reference link.
  const OPTIONAL = TRIP.resources
    .filter(r => r.url && !REQUIRED_CATS.includes(r.cat))
    .map(r => ({
      id: `res-${r.cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      urgent: false, legs: catLegs(r.cat),
      title: r.cat,
      cost: r.cost,
      when: null,
      why: r.detail,
      url: r.url, linkLabel: r.linkLabel,
    }));

  // ---- Rendering ----------------------------------------------------------

  const app = document.getElementById("app");
  const head = el("header");
  head.append(
    el("h1", null, "Bookings"),
    el("p", "tagline", "What still needs locking in — red items need action before they're gone. Below: who sleeps where.")
  );
  const summary = el("p", "book-summary");
  const secToBook = el("section"), secRem = el("section"),
    secOpt = el("section"), secDone = el("section");

  const secStays = el("section");
  secStays.append(el("h2", null, "By stay"));
  const stayList = el("div", "hotel-list");
  stays.forEach(b => stayList.append(hotelCard(b)));
  secStays.append(stayList);

  const foot = el("footer");
  foot.append(
    el("p", "muted", "Booked marks sync across devices (30s refresh)."),
    el("p", "muted", "Sleeping lists come from each person's legs in data.js — update there."));
  app.append(head, summary, secToBook, secRem, secStays, breakdown(),
    matrix(), secOpt, secDone, foot);

  const isDone = it => store.get(`hkbooked:${it.id}`) === "1";

  const costNode = it => it.cost == null
    ? el("span", "tbd", "TBD")
    : el("span", "book-cost", it.cost);

  function row(it, done) {
    const li = el("li",
      "book-item" + (done ? " book-item-done" : it.urgent ? "" : " book-item-opt"));

    const lab = el("label", "book-check");
    const cb = el("input");
    cb.type = "checkbox";
    cb.checked = done;
    cb.addEventListener("change", () => {
      store.set(`hkbooked:${it.id}`, cb.checked ? "1" : null);
      render();
    });
    const title = el("span", "book-title");
    if (it.legs && it.legs.length) title.append(legDots(it.legs));
    title.append(it.title);

    const right = el("span", "book-right");
    right.append(costNode(it), el("span",
      done ? "badge badge-booked" : it.check || it.urgent ? "badge badge-to-book" : "badge",
      done ? (it.check ? "done" : "booked")
        : it.check ? "to check" : it.urgent ? "to book" : "optional"));

    lab.append(cb, title, right);
    li.append(lab);

    if (it.why) li.append(el("p", "book-why", it.why));

    const meta = el("p", "book-meta");
    if (it.when) meta.append(el("span", "book-when", it.when));
    if (it.url) {
      const a = el("a", "book-link", it.linkLabel || it.url);
      a.href = it.url;
      a.target = "_blank";
      a.rel = "noopener";
      meta.append(a);
    }
    if (meta.childNodes.length) li.append(meta);
    return li;
  }

  function render() {
    [secToBook, secRem, secOpt, secDone].forEach(s => { s.textContent = ""; });

    const reqPend = REQUIRED.filter(i => !isDone(i));
    const remPend = REMINDERS.filter(i => !isDone(i));
    const optPend = OPTIONAL.filter(i => !isDone(i));
    const done = [...REQUIRED, ...REMINDERS, ...OPTIONAL].filter(isDone);

    summary.textContent = "";
    const n = reqPend.length;
    if (n) {
      summary.append(el("strong", "book-count", String(n)),
        n === 1 ? " thing left to book" : " things left to book");
    } else {
      summary.append(el("strong", "book-count book-count-ok", "Nothing left to book"), " — all set.");
    }
    if (remPend.length) {
      summary.append(el("span", "muted",
        ` · ${remPend.length} reminder${remPend.length > 1 ? "s" : ""} to check`));
    }
    if (optPend.length) {
      summary.append(el("span", "muted",
        ` · ${optPend.length} optional link${optPend.length > 1 ? "s" : ""} below`));
    }

    secToBook.append(el("h2", null, "To book"));
    if (reqPend.length) {
      const list = el("ul", "book-list");
      reqPend.forEach(i => list.append(row(i, false)));
      secToBook.append(list);
    } else {
      secToBook.append(el("p", "muted", "Everything's booked."));
    }

    if (REMINDERS.length) {
      secRem.append(el("h2", null, "Reminders — things to check"));
      if (remPend.length) {
        const list = el("ul", "book-list");
        remPend.forEach(i => list.append(row(i, false)));
        secRem.append(list);
      } else {
        secRem.append(el("p", "muted", "All checked."));
      }
    }

    if (optPend.length) {
      secOpt.append(el("h2", null, "Optional & links"));
      const list = el("ul", "book-list");
      optPend.forEach(i => list.append(row(i, false)));
      secOpt.append(list);
    }

    if (done.length) {
      secDone.append(el("h2", null, "Done"));
      const list = el("ul", "book-list");
      done.forEach(i => list.append(row(i, true)));
      secDone.append(list);
    }
  }

  if (window.SyncStore) SyncStore.onChange(render);
  render();
})();
