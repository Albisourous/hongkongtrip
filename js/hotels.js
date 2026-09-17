/* Hotels page — who sleeps where, night by night.
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
  const legName = id => (TRIP.legs.find(l => l.id === id) || {}).name || id;
  const fmt = n => "$" + n.toFixed(2);

  // Where someone actually is when they split off from the group stay —
  // `where` for the card, `short` for the by-person matrix cell.
  const AWAY = {
    brendan: { where: "flies home after HK", short: "home" },
    ehsan: { where: "own plans in HK", short: "HK" },
    scott: { where: "own plans in HK", short: "HK" },
    kli: { where: "skips Macau — in HK", short: "HK" },
  };

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
        names2.append(p.name + (AWAY[p.id] ? " — " + AWAY[p.id].where : ""));
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

  function matrix() {
    const s = el("section");
    s.append(el("h2", null, "By person"));
    const wrap = el("div", "table-wrap"), t = el("table", "hotel-matrix");
    const thd = el("thead"), tb = el("tbody"), hr = el("tr");
    hr.append(el("th", null, "Person"));
    stays.forEach(b => {
      const th = el("th");
      const leg = blockLeg(b);
      if (leg) th.append(legDot(leg), " ");
      th.append(dateRange(b));
      hr.append(th);
    });
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
          cell.append(el("span", "muted", AWAY[p.id] ? AWAY[p.id].short : "—"));
        }
        tr.append(cell);
      });
      tb.append(tr);
    });
    t.append(thd, tb);
    wrap.append(t);
    s.append(wrap, el("p", "muted",
      "✓ sleeps with the group — anything else is where they actually are."));
    return s;
  }

  const app = document.getElementById("app");
  const head = el("header");
  head.append(el("h1", null, "Hotels"),
    el("p", "tagline",
      "Who sleeps where, night by night — only people on that leg are listed."));
  app.append(head);

  const sec = el("section");
  sec.append(el("h2", null, "By stay"));
  const list = el("div", "hotel-list");
  stays.forEach(b => list.append(hotelCard(b)));
  sec.append(list);
  app.append(sec, matrix());

  const foot = el("footer");
  foot.append(el("p", "muted",
    "Sleeping lists come from each person's legs in data.js — update there."));
  app.append(foot);
})();
