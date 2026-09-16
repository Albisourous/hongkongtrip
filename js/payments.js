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
    cols.forEach(c => hr.append(el("th", null, c)));
    thd.append(hr);
    t.append(thd, tb);
    wrap.append(t);
    section.append(wrap);
    return tb;
  };
  const store = window.SyncStore || {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };

  const legName = id => (TRIP.legs.find(l => l.id === id) || {}).name || id;
  const legShort = id => ({ hk1: "HK", gz: "GZ", sz: "SZ", mo: "MO", hk2: "HKG" }[id] || legName(id));
  const personName = id => (TRIP.people.find(p => p.id === id) || {}).name || id;
  const attendees = leg => TRIP.people.filter(p => p.legs.includes(leg));

  // Per-attendee share of a cost, or null when it doesn't count toward splits.
  const share = c => {
    if (!c.frontedBy) return null;
    const n = attendees(c.leg).length;
    if (!n) return null;
    return c.total != null ? c.total / n : c.perPerson;
  };
  const legTotal = leg => TRIP.costs.reduce((s, c) => {
    const sh = c.leg === leg ? share(c) : null;
    return sh == null ? s : s + sh * attendees(leg).length;
  }, 0);
  const personLegShare = (p, leg) => TRIP.costs.reduce((s, c) => {
    const sh = c.leg === leg ? share(c) : null;
    return sh == null ? s : s + sh;
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
        alert.append(`${c.cat} — ${legName(c.leg)}`);
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
      const n = attendees(c.leg).length;
      const pp = c.perPerson != null ? c.perPerson : (c.total != null && n ? c.total / n : null);
      const sh = share(c);
      if (sh != null) sum += sh * n;
      const tr = el("tr", c.status === "to-book" ? "pay-need" : null);
      const item = td(null);
      item.append(el("div", "pay-item", c.label),
        el("div", "pay-sub", `${legName(c.leg)} · ${c.frontedBy ? "fronted by " + personName(c.frontedBy) : "pay your own"}`));
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

  function split() {
    const s = el("section");
    s.append(el("h2", null, "Per-person split"));
    const tb = mkTable(["Person", ...TRIP.legs.map(l => legShort(l.id)), "Total"], s);
    TRIP.people.forEach(p => {
      const tr = el("tr");
      tr.append(td(null, p.name));
      let tot = 0;
      TRIP.legs.forEach(l => {
        if (!p.legs.includes(l.id)) { tr.append(td("money", "—")); return; }
        const v = personLegShare(p.id, l.id);
        tot += v;
        tr.append(td("money", fmt(v)));
      });
      tr.append(td("money", fmt(tot)));
      tb.append(tr);
    });
    const fr = el("tr", "total-row");
    fr.append(td(null, "All"));
    let grand = 0;
    TRIP.legs.forEach(l => {
      const v = legTotal(l.id);
      grand += v;
      fr.append(td("money", fmt(v)));
    });
    fr.append(td("money", fmt(grand)));
    tb.append(fr);
    s.append(el("p", "muted", "Each leg splits only among the people on it. HK = Sep 25–28 · GZ = Guangzhou · SZ = Shenzhen · MO = Macau · HKG = airport night."));
    app.append(s);
  }

  function settlement() {
    const s = el("section"), fronted = {}, owes = {};
    s.append(el("h2", null, "Settlement"));
    TRIP.people.forEach(p => { fronted[p.id] = 0; owes[p.id] = 0; });
    TRIP.costs.forEach(c => {
      const sh = share(c);
      if (sh == null) return;
      const at = attendees(c.leg);
      fronted[c.frontedBy] += sh * at.length;
      at.forEach(p => { owes[p.id] += sh; });
    });
    if (!TRIP.costs.some(c => share(c) != null)) {
      s.append(el("p", "muted", "No shared totals yet — the ledger fills in once TBDs land."));
      app.append(s);
      return;
    }

    // Suggested payments via greedy netting on current balances.
    const net = p => fronted[p.id] - owes[p.id];
    const nets = TRIP.people.map(p => ({ id: p.id, net: net(p) }));
    const debt = nets.filter(x => x.net < -0.01).map(x => ({ id: x.id, amt: -x.net })).sort((a, b) => b.amt - a.amt);
    const cred = nets.filter(x => x.net > 0.01).map(x => ({ id: x.id, amt: x.net })).sort((a, b) => b.amt - a.amt);
    const pays = [];
    let i = 0, j = 0;
    while (i < debt.length && j < cred.length) {
      const pay = Math.min(debt[i].amt, cred[j].amt);
      pays.push({ from: debt[i].id, to: cred[j].id, amt: pay });
      debt[i].amt -= pay;
      cred[j].amt -= pay;
      if (debt[i].amt < 0.01) i++;
      if (cred[j].amt < 0.01) j++;
    }

    // Remaining = net adjusted by payments already marked paid.
    const remaining = {}, remCells = {};
    TRIP.people.forEach(p => { remaining[p.id] = net(p); });
    const updateRemaining = () => TRIP.people.forEach(p => {
      const v = remaining[p.id], cell = remCells[p.id];
      cell.className = "money" + (v > 0.004 ? " pos" : v < -0.004 ? " neg" : "");
      cell.textContent = fmt(v);
    });

    // Creditors first so it's clear who's waiting on money.
    const tb = mkTable(["Person", "Fronted", "Owes", "Net", "Remaining"], s);
    [...TRIP.people].sort((a, b) => net(b) - net(a)).forEach(p => {
      const n = net(p);
      const tr = el("tr"), rem = td("money", fmt(n));
      remCells[p.id] = rem;
      tr.append(td(null, p.name), td("money", fmt(fronted[p.id])), td("money", fmt(owes[p.id])),
        td("money" + (n > 0.004 ? " pos" : n < -0.004 ? " neg" : ""), fmt(n)), rem);
      tb.append(tr);
    });
    s.append(el("p", "muted", "Net = fronted − owes. Remaining updates as payments are checked off."));

    if (!pays.length) {
      s.append(el("p", "muted", "Everyone is even — no payments needed."));
      app.append(s);
      return;
    }

    const progress = el("span", "pay-progress");
    const h3 = el("h3", null, "Suggested payments ");
    h3.append(progress);
    s.append(h3, el("p", "muted", "Check off payments as they're sent."));

    const ul = el("ul", "pay-pays");
    let settled = 0;
    const updateProgress = () => {
      progress.textContent = `${settled} of ${pays.length} payments settled`;
      progress.classList.toggle("done", settled === pays.length);
    };
    pays.forEach(p => {
      const key = `hkpaid:${p.from}>${p.to}`;
      const li = el("li"), lab = el("label"), cb = el("input");
      cb.type = "checkbox";
      const done = store.get(key) === "1";
      cb.checked = done;
      li.classList.toggle("pay-paid", done);
      if (done) {
        settled++;
        remaining[p.from] += p.amt;
        remaining[p.to] -= p.amt;
      }
      cb.addEventListener("change", () => {
        store.set(key, cb.checked ? "1" : null);
        li.classList.toggle("pay-paid", cb.checked);
        settled += cb.checked ? 1 : -1;
        remaining[p.from] += cb.checked ? p.amt : -p.amt;
        remaining[p.to] -= cb.checked ? p.amt : -p.amt;
        updateRemaining();
        updateProgress();
      });
      lab.append(cb, el("span", null, `${personName(p.from)} → ${personName(p.to)}`),
        el("span", "money", fmt(p.amt)));
      li.append(lab);
      ul.append(li);
    });
    s.append(ul);
    updateRemaining();
    updateProgress();
    app.append(s);
  }

  const run = () => {
    app.textContent = "";
    header(); costs(); split(); settlement();
    const foot = el("footer");
    foot.append(el("p", "muted", "Paid marks sync across devices (30s refresh)."));
    app.append(foot);
  };
  if (window.SyncStore) SyncStore.onChange(run);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
