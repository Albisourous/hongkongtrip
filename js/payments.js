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
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };

  const legName = id => (TRIP.legs.find(l => l.id === id) || {}).name || id;
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
    const tb = mkTable(["Item", "Leg", "Total", "Per person", "Fronted by", "Status"], s);
    let sum = 0;
    TRIP.costs.forEach(c => {
      const n = attendees(c.leg).length;
      const pp = c.perPerson != null ? c.perPerson : (c.total != null && n ? c.total / n : null);
      const sh = share(c);
      if (sh != null) sum += sh * n;
      const tr = el("tr");
      tr.append(td(null, c.label), td(null, legName(c.leg)),
        td("money", c.total == null ? tbd() : fmt(c.total)),
        td("money", pp == null ? tbd() : `~$${pp.toFixed(2)}/pax`),
        td(null, c.frontedBy ? personName(c.frontedBy) : "—"),
        td(null, c.status == null ? "—" : el("span", `badge badge-${c.status}`, c.status)));
      tb.append(tr);
    });
    const fr = el("tr", "total-row"), a = td(null, "Shared total (fronted only)"), z = td(null, "");
    a.colSpan = 2;
    z.colSpan = 3;
    fr.append(a, td("money", fmt(sum)), z);
    tb.append(fr);
    s.append(el("p", "muted", "Rows with no fronter are informational — everyone pays their own. TBD rows are excluded from the split until totals land."));
    app.append(s);
  }

  function split() {
    const s = el("section"), picker = el("select", "picker"), pw = el("p");
    s.append(el("h2", null, "Per-person split"));
    const o0 = el("option", null, "Highlight a person…");
    o0.value = "";
    picker.append(o0);
    TRIP.people.forEach(p => {
      const o = el("option", null, p.name);
      o.value = p.id;
      picker.append(o);
    });
    pw.append(picker);
    s.append(pw);
    const tb = mkTable(["Person", ...TRIP.legs.map(l => l.name), "Total"], s);
    const rows = {};
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
      rows[p.id] = tr;
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
    s.append(el("p", "muted", "Each leg splits only among the people on that leg."));
    picker.addEventListener("change", () => {
      Object.values(rows).forEach(r => r.classList.remove("total-row"));
      if (rows[picker.value]) rows[picker.value].classList.add("total-row");
    });
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
    const nets = TRIP.people.map(p => ({ id: p.id, net: fronted[p.id] - owes[p.id] }));
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
    TRIP.people.forEach(p => { remaining[p.id] = fronted[p.id] - owes[p.id]; });
    const updateRemaining = () => TRIP.people.forEach(p => {
      const v = remaining[p.id], cell = remCells[p.id];
      cell.className = "money" + (v > 0.004 ? " pos" : v < -0.004 ? " neg" : "");
      cell.textContent = fmt(v);
    });

    const tb = mkTable(["Person", "Fronted", "Owes", "Net", "Remaining"], s);
    TRIP.people.forEach(p => {
      const net = fronted[p.id] - owes[p.id];
      const tr = el("tr"), rem = td("money", fmt(net));
      remCells[p.id] = rem;
      tr.append(td(null, p.name), td("money", fmt(fronted[p.id])), td("money", fmt(owes[p.id])),
        td("money" + (net > 0.004 ? " pos" : net < -0.004 ? " neg" : ""), fmt(net)), rem);
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

  const run = () => { header(); costs(); split(); settlement(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
