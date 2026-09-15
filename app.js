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

  function overview() {
    const s = $("#overview"), d = TRIP.dates, f = TRIP.flights;
    s.append(el("h2", null, "Overview"));
    s.append(el("p", null, `${TRIP.route} · ${d.nights} nights — depart ${d.depart}, land ${d.arrive}, home ${d.home}`));
    const cards = el("div", "cards");
    TRIP.legs.forEach(l => {
      const c = el("div", "card");
      c.append(el("h3", null, l.name), el("p", null, l.dates),
        el("p", "muted", `${l.nights} night${l.nights > 1 ? "s" : ""} · ${attendees(l.id).length} people`));
      cards.append(c);
    });
    const fp = el("p");
    fp.append("Flights ", el("span", "badge", "not split"), ` — ${f.out} · ${f.back}`);
    const ul = el("ul", "muted");
    TRIP.notes.forEach(n => ul.append(el("li", null, n)));
    s.append(cards, fp, el("p", "muted", f.note), ul);
  }

  function itinerary() {
    const s = $("#itinerary"), chips = el("div", "day-chips"), detail = el("div", "day-detail");
    s.append(el("h2", null, "Itinerary"), chips, detail);
    const show = i => {
      detail.textContent = "";
      chips.querySelectorAll(".day-chip").forEach((c, j) => c.classList.toggle("active", i === j));
      const d = TRIP.days[i];
      detail.append(el("h3", null, `${d.date} · ${d.day} — ${d.base}`), el("p", "muted", `Stay: ${d.stay}`));
      [["Morning", d.morning], ["Afternoon", d.afternoon], ["Evening", d.evening]].forEach(([lab, txt]) => {
        if (txt == null) return;
        const b = el("div", "block");
        b.append(el("span", "block-label", lab), document.createTextNode(txt));
        detail.append(b);
      });
      if (d.checklist.length) {
        const ul = el("ul", "checklist");
        d.checklist.forEach((it, k) => {
          const li = el("li"), lab = el("label"), cb = el("input");
          cb.type = "checkbox";
          const key = `hkcheck:${d.date}:${k}`;
          cb.checked = store.get(key) === "1";
          li.classList.toggle("done", cb.checked);
          cb.addEventListener("change", () => {
            store.set(key, cb.checked ? "1" : null);
            li.classList.toggle("done", cb.checked);
          });
          lab.append(cb, " ", el("span", "time", it.t), ` ${it.task}`);
          li.append(lab);
          ul.append(li);
        });
        detail.append(ul);
      }
      if (d.notes) detail.append(el("p", "muted", d.notes));
    };
    TRIP.days.forEach((d, i) => {
      const b = el("button", "day-chip", `${d.date} · ${d.day}`);
      b.type = "button";
      b.addEventListener("click", () => show(i));
      chips.append(b);
    });
    show(0);
  }

  function costs() {
    const s = $("#costs");
    s.append(el("h2", null, "Shared costs"));
    const tb = mkTable(["Leg", "Category", "Item", "Total", "Per person", "Fronted by", "Status", "Notes"], s);
    let sum = 0;
    TRIP.costs.forEach(c => {
      const n = attendees(c.leg).length;
      const pp = c.perPerson != null ? c.perPerson : (c.total != null && n ? c.total / n : null);
      if (c.frontedBy && c.total != null) sum += c.total;
      const tr = el("tr");
      tr.append(td(null, legName(c.leg)), td(null, c.cat), td(null, c.label),
        td("money", c.total == null ? tbd() : fmt(c.total)),
        td("money", pp == null ? tbd() : `~$${pp.toFixed(2)}/pax`),
        td(null, c.frontedBy ? personName(c.frontedBy) : "—"),
        td(null, c.status == null ? "—" : el("span", `badge badge-${c.status}`, c.status)),
        td(null, c.note || "—"));
      tb.append(tr);
    });
    const fr = el("tr", "total-row"), a = td(null, "Shared total (fronted only)"), z = td(null, "");
    a.colSpan = 3;
    z.colSpan = 4;
    fr.append(a, td("money", fmt(sum)), z);
    tb.append(fr);
  }

  function split() {
    const s = $("#split"), picker = el("select", "picker"), pw = el("p");
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
    picker.addEventListener("change", () => {
      Object.values(rows).forEach(r => r.classList.remove("total-row"));
      if (rows[picker.value]) rows[picker.value].classList.add("total-row");
    });
  }

  function settlement() {
    const s = $("#settlement"), paid = {}, owes = {};
    s.append(el("h2", null, "Settlement"));
    TRIP.people.forEach(p => { paid[p.id] = 0; owes[p.id] = 0; });
    TRIP.costs.forEach(c => {
      const sh = share(c);
      if (sh == null) return;
      const at = attendees(c.leg);
      paid[c.frontedBy] += sh * at.length;
      at.forEach(p => { owes[p.id] += sh; });
    });
    if (!TRIP.costs.some(c => share(c) != null)) {
      s.append(el("p", "muted", "No shared costs recorded yet — nothing to settle."));
      return;
    }
    const tb = mkTable(["Person", "Fronted", "Owes", "Net"], s);
    const nets = TRIP.people.map(p => ({ name: p.name, net: paid[p.id] - owes[p.id] }));
    TRIP.people.forEach(p => {
      const net = paid[p.id] - owes[p.id];
      const cls = net > 0.004 ? "pos" : net < -0.004 ? "neg" : null;
      const tr = el("tr");
      tr.append(td(null, p.name), td("money", fmt(paid[p.id])), td("money", fmt(owes[p.id])),
        td(cls ? `money ${cls}` : "money", fmt(net)));
      tb.append(tr);
    });
    s.append(el("h3", null, "Suggested payments"));
    const debt = nets.filter(x => x.net < -0.01).map(x => ({ name: x.name, amt: -x.net })).sort((a, b) => b.amt - a.amt);
    const cred = nets.filter(x => x.net > 0.01).map(x => ({ name: x.name, amt: x.net })).sort((a, b) => b.amt - a.amt);
    const pays = [];
    let i = 0, j = 0;
    while (i < debt.length && j < cred.length) {
      const pay = Math.min(debt[i].amt, cred[j].amt);
      pays.push([debt[i].name, cred[j].name, pay]);
      debt[i].amt -= pay;
      cred[j].amt -= pay;
      if (debt[i].amt < 0.01) i++;
      if (cred[j].amt < 0.01) j++;
    }
    if (!pays.length) {
      s.append(el("p", "muted", "Everyone is even — no payments needed."));
      return;
    }
    const ul = el("ul");
    pays.forEach(([from, to, amt]) => {
      const li = el("li");
      li.append(`${from} pays ${to} `, el("span", "money", fmt(amt)));
      ul.append(li);
    });
    s.append(ul);
  }

  function resources() {
    const s = $("#resources");
    s.append(el("h2", null, "Bookings & resources"));
    const tb = mkTable(["Category", "Detail", "Cost", "Link"], s);
    TRIP.resources.forEach(r => {
      let link = "—";
      if (r.url) {
        const a = el("a", null, r.linkLabel || r.url);
        a.href = r.url;
        a.target = "_blank";
        a.rel = "noopener";
        link = a;
      }
      const tr = el("tr");
      tr.append(td(null, r.cat), td(null, r.detail), td(null, r.cost == null ? "—" : r.cost), td(null, link));
      tb.append(tr);
    });
  }

  const run = () => { overview(); itinerary(); costs(); split(); settlement(); resources(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
