// Payments page — shared costs, per-leg split, settlement ledger.
(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const fmt = n => {
    const r = Math.round(n * 100) / 100;
    return (r < 0 ? "-$" : "$") + Math.abs(r).toFixed(2);
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const tbd = () => el("span", "tbd", "TBD");
  const td = (cls, v) => {
    const c = el("td", cls);
    if (v != null) v.nodeType ? c.append(v) : c.textContent = v;
    return c;
  };
  const mkTable = (cols, section) => {
    const wrap = el("div", "table-wrap"), t = el("table"), tb = el("tbody"), hr = el("tr"), thd = el("thead");
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
  const legTag = (id, label) => {
    const s = el("span", "pay-legtag leg-" + id);
    s.append(el("span", "leg-dot"), document.createTextNode(label));
    return s;
  };
  const legDot = id => el("span", "leg-dot leg-" + id);
  const store = window.SyncStore || {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };

  const legName = id => (TRIP.legs.find(l => l.id === id) || {}).name || id;
  const legShort = id => ({ flight: "FLT", hotel: "HTL", hk1: "HK", gz: "GZ", sz: "SZ", mo: "MO", hk2: "HKG" }[id] || legName(id));
  const personName = id => (TRIP.people.find(p => p.id === id) || {}).name || id;
  const attendees = leg => TRIP.people.filter(p => p.legs.includes(leg));
  // Leg attendees who owe for a cost — exclude lists people who paid their own.
  const payers = c => {
    const at = attendees(c.leg);
    return c.exclude ? at.filter(p => !c.exclude.includes(p.id)) : at;
  };
  // Payers minus people who already settled with the fronter — settlement
  // uses this so paid-up shares drop out of what everyone still owes.
  const activePayers = c =>
    c.settled ? payers(c).filter(p => !c.settled.includes(p.id)) : payers(c);

  // Per-attendee share of a cost, or null when it doesn't count toward splits.
  const share = c => {
    if (!c.frontedBy) return null;
    const n = payers(c).length;
    if (!n) return null;
    return c.total != null ? c.total / n : c.perPerson;
  };
  const isFlight = c => c.cat === "Flight";
  const isHotel = c => c.cat === "Hotel";
  const legTotal = leg => TRIP.costs.reduce((s, c) => {
    const sh = c.leg === leg && !isFlight(c) && !isHotel(c) ? share(c) : null;
    return sh == null ? s : s + sh * payers(c).length;
  }, 0);
  const personLegShare = (p, leg) => TRIP.costs.reduce((s, c) => {
    const sh = c.leg === leg && !isFlight(c) && !isHotel(c) ? share(c) : null;
    return sh == null || !payers(c).some(q => q.id === p) ? s : s + sh;
  }, 0);
  const personHotelShare = p => TRIP.costs.reduce((s, c) => {
    const sh = isHotel(c) ? share(c) : null;
    return sh == null || !payers(c).some(q => q.id === p) ? s : s + sh;
  }, 0);
  const onHotel = p => TRIP.costs.some(c => isHotel(c) && payers(c).some(q => q.id === p));
  const hotelTotal = () => TRIP.costs.reduce((s, c) => {
    const sh = isHotel(c) ? share(c) : null;
    return sh == null ? s : s + sh * payers(c).length;
  }, 0);
  const personFlightShare = p => TRIP.costs.reduce((s, c) => {
    const sh = isFlight(c) ? share(c) : null;
    return sh == null || !payers(c).some(q => q.id === p) ? s : s + sh;
  }, 0);
  const onFlight = p => TRIP.costs.some(c => isFlight(c) && payers(c).some(q => q.id === p));
  const flightTotal = () => TRIP.costs.reduce((s, c) => {
    const sh = isFlight(c) ? share(c) : null;
    return sh == null ? s : s + sh * payers(c).length;
  }, 0);

  // A person's share of costs matching pred counts as paid when they're
  // in c.settled, or their person>fronter payment is checked off.
  const paidIn = (p, pred) => TRIP.costs.reduce((s, c) => {
    const sh = pred(c) ? share(c) : null;
    if (sh == null || !payers(c).some(q => q.id === p)) return s;
    const paid = (c.settled && c.settled.includes(p.id)) ||
      store.get(`hkpaid:${p.id}>${c.frontedBy}`) === "1";
    return paid ? s + sh : s;
  }, 0);

  // Rows needing action sort first: to-book, booked, then informational.
  const STATUS_ORDER = { "to-book": 0, booked: 1 };
  const statusRank = c => c.status in STATUS_ORDER ? STATUS_ORDER[c.status] : 2;

  const app = $("#app");

  function header() {
    const h = el("header");
    h.append(el("h1", null, "Payments"),
      el("p", "tagline", "Shared costs, per-leg splits, and who owes whom. All USD."));
    app.append(h);
  }

  function costs() {
    const s = el("section");
    s.append(el("h2", null, "Shared costs"));

    const todo = TRIP.costs.filter(c => c.status === "to-book");
    if (todo.length) {
      const alert = el("p", "pay-alert");
      alert.append(el("strong", null, `To book (${todo.length}): `));
      todo.forEach((c, i) => {
        if (i) alert.append(" · ");
        alert.append(legDot(c.leg), `${c.cat} — ${legName(c.leg)}`);
      });
      alert.append(" ");
      const link = el("a", null, "Open Bookings →");
      link.href = "bookings.html";
      alert.append(link);
      s.append(alert);
    }

    const tb = mkTable(["Item", "Total", "Per person", "Status"], s);
    let sum = 0;
    [...TRIP.costs].sort((a, b) => statusRank(a) - statusRank(b)).forEach(c => {
      const n = payers(c).length;
      const pp = c.perPerson != null ? c.perPerson : (c.total != null && n ? c.total / n : null);
      const sh = share(c);
      if (sh != null) sum += sh * n;
      const tr = el("tr", c.status === "to-book" ? "pay-need" : null);
      const item = td(null);
      const sub = el("div", "pay-sub leg-" + c.leg);
      sub.append(el("span", "leg-dot"),
        `${legName(c.leg)} · ${c.frontedBy ? "fronted by " + personName(c.frontedBy) : "pay your own"}` +
        (c.exclude ? ` · ${c.exclude.map(personName).join(", ")} paid own` : "") +
        (c.settled ? ` · ${c.settled.map(personName).join(", ")} settled` : ""));
      item.append(el("div", "pay-item", c.label), sub);
      tr.append(item,
        td("money", c.total == null ? tbd() : fmt(c.total)),
        td("money", pp == null ? tbd() : `~$${pp.toFixed(2)}/pax`),
        td(null, c.status == null ? "—" : el("span", `badge badge-${c.status}`, c.status)));
      tb.append(tr);
    });
    const fr = el("tr", "total-row"), a = td(null, "Shared total (fronted only)"), z = td(null, "");
    z.colSpan = 2;
    fr.append(a, td("money", fmt(sum)), z);
    tb.append(fr);
    s.append(el("p", "muted", "Red rows still need booking. “Pay your own” rows are informational — excluded from the split."));
    app.append(s);
  }

  // One row per fronted cost: who paid it and who owes a share back.
  function ledger() {
    const s = el("section");
    s.append(el("h2", null, "Who paid for what"));
    const fronted = TRIP.costs.filter(c => c.frontedBy);
    if (!fronted.length) {
      s.append(el("p", "muted", "Nothing fronted yet."));
      app.append(s);
      return;
    }
    const tb = mkTable(["Item", "Paid by", "Split among", "Each"], s);
    fronted.forEach(c => {
      const at = payers(c), sh = share(c);
      const tr = el("tr");
      const item = td(null);
      const sub = el("div", "pay-sub leg-" + (isFlight(c) ? "flight" : c.leg));
      sub.append(el("span", "leg-dot"),
        `${isFlight(c) ? "Flights" : legName(c.leg)} · ${at.length} pax`);
      item.append(el("div", "pay-item", c.label), sub);
      const who = td("pay-who");
      at.forEach((p, i) => {
        if (i) who.append(" · ");
        who.append(p.name + (c.settled && c.settled.includes(p.id) ? " ✓" : ""));
      });
      tr.append(item, td(null, personName(c.frontedBy)), who,
        td("money", sh == null ? tbd() : fmt(sh)));
      tb.append(tr);
    });
    s.append(el("p", "muted",
      "Each person's share of what someone else fronted — the fronter's own share is included in the split. ✓ = already paid the fronter."));
    app.append(s);
  }

  function split() {
    const s = el("section");
    s.append(el("h2", null, "Per-person split"));
    // Green when the person's share in that bucket is fully paid/settled.
    const shareCell = (owed, paid, show) => {
      const c = td("money", show ? fmt(owed) : "—");
      if (show && owed > 0.004 && paid >= owed - 0.005) c.classList.add("pos");
      return c;
    };
    const tb = mkTable(["Person", legTag("flight", "FLT"), legTag("hotel", "HTL"), ...TRIP.legs.map(l => legTag(l.id, legShort(l.id))), "Total"], s);
    TRIP.people.forEach(p => {
      const tr = el("tr");
      tr.append(td(null, p.name));
      let tot = 0;
      const flt = personFlightShare(p.id), htl = personHotelShare(p.id);
      tr.append(shareCell(flt, paidIn(p.id, isFlight), onFlight(p.id)));
      tr.append(shareCell(htl, paidIn(p.id, isHotel), onHotel(p.id)));
      tot += flt + htl;
      TRIP.legs.forEach(l => {
        if (!p.legs.includes(l.id)) { tr.append(td("money", "—")); return; }
        const v = personLegShare(p.id, l.id);
        tot += v;
        tr.append(shareCell(v,
          paidIn(p.id, c => c.leg === l.id && !isFlight(c) && !isHotel(c)), true));
      });
      tr.append(td("money", fmt(tot)));
      tb.append(tr);
    });
    const fr = el("tr", "total-row");
    fr.append(td(null, "All"));
    let grand = flightTotal();
    fr.append(td("money", fmt(grand)));
    grand += hotelTotal();
    fr.append(td("money", fmt(hotelTotal())));
    TRIP.legs.forEach(l => {
      const v = legTotal(l.id);
      grand += v;
      fr.append(td("money", fmt(v)));
    });
    fr.append(td("money", fmt(grand)));
    tb.append(fr);
    const legend = el("p", "muted", "Each leg splits only among the people on it. ");
    const LEGEND = { flight: "round-trip airfare", hotel: "all hotel nights", hk1: "Sep 25–28", gz: "Guangzhou", sz: "Shenzhen", mo: "Macau", hk2: "airport night" };
    ["flight", "hotel", ...TRIP.legs.map(l => l.id)].forEach((id, i) => {
      if (i) legend.append(" · ");
      legend.append(el("span", "pay-abbr leg-" + id, legShort(id)),
        " = " + (LEGEND[id] || legName(id)));
    });
    legend.append(" · green = already paid/settled.");
    s.append(legend);
    app.append(s);
  }

  function settlement() {
    const s = el("section"), fronted = {}, owes = {};
    s.append(el("h2", null, "Settlement"));
    TRIP.people.forEach(p => { fronted[p.id] = 0; owes[p.id] = 0; });
    TRIP.costs.forEach(c => {
      const sh = share(c);
      if (sh == null) return;
      const at = activePayers(c);
      fronted[c.frontedBy] += sh * at.length;
      at.forEach(p => { owes[p.id] += sh; });
    });
    if (!TRIP.costs.some(c => share(c) != null)) {
      s.append(el("p", "muted", "No shared totals yet — the ledger fills in once TBDs land."));
      app.append(s);
      return;
    }

    const net = p => fronted[p.id] - owes[p.id];

    // Creditors first so it's clear who's waiting on money.
    const tb = mkTable(["Person", "Fronted", "Owes", "Net"], s);
    [...TRIP.people].sort((a, b) => net(b) - net(a)).forEach(p => {
      const n = net(p);
      const tr = el("tr");
      tr.append(td(null, p.name), td("money", fmt(fronted[p.id])), td("money", fmt(owes[p.id])),
        td("money" + (n > 0.004 ? " pos" : n < -0.004 ? " neg" : ""), fmt(n)));
      tb.append(tr);
    });
    s.append(el("p", "muted", "Net = fronted − owes; already-settled shares are netted out."));

    // Who collects what — one line per fronter, no payment optimization.
    const byFronter = {};
    TRIP.costs.forEach(c => {
      if (share(c) == null) return;
      (byFronter[c.frontedBy] = byFronter[c.frontedBy] || []).push(c);
    });
    s.append(el("h3", null, "Who to pay"));
    const ul = el("ul", "pay-pays");
    Object.keys(byFronter).forEach(f => {
      const cats = [...new Set(byFronter[f].map(c => c.cat.toLowerCase() + "s"))].join(" + ");
      const li = el("li");
      li.append(el("span", null, `${cats} → ${personName(f)}`));
      ul.append(li);
    });
    s.append(ul);
    app.append(s);
  }

  const run = () => {
    app.textContent = "";
    header(); costs(); ledger(); split(); settlement();
    const foot = el("footer");
    foot.append(el("p", "muted", "Paid-up people are marked via `settled` in data.js."));
    app.append(foot);
  };
  if (window.SyncStore) SyncStore.onChange(run);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
