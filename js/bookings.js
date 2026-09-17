(() => {
  "use strict";

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
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
  const res = cat => TRIP.resources.find(r => r.cat === cat) || {};
  const day = date => TRIP.days.find(d => d.date === date) || {};
  // Sentence(s) of a day's notes mentioning a keyword (e.g. "ferry").
  const dayNote = (date, kw) => (day(date).notes || "")
    .split(". ").filter(s => s.toLowerCase().includes(kw)).join(" ");

  // ---- Action items -------------------------------------------------------

  const REQUIRED_CATS = ["Visa/legal", "HSR", "Ferry SZ→Macau", "Ferry Macau→HK"];

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
  const ferryOut = res("Ferry Macau→HK");
  const walled = (day("Sep 27").checklist || []).find(i => /walled city/i.test(i.task)) || {};

  const REQUIRED = [
    ...TRIP.costs.filter(c => c.status === "to-book").map(hotelItem),
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
      title: "HSR tickets · West Kowloon → Guangzhou South + GZ↔SZ commutes",
      cost: hsr.cost,
      when: "Opens 15 days out (~Sep 13) · WKL→GZ Sep 28 · A&M medical commutes Sep 29–30 · GZ→SZ Sep 30",
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
      id: "ferry-mo-hk", urgent: true, legs: ["hk2"],
      title: "Ferry · Macau → Hong Kong",
      cost: ferryOut.cost,
      when: `${dayNote("Oct 2", "ferry") || "Book ahead"} Travel Oct 2`,
      why: ferryOut.detail,
      url: ferryOut.url, linkLabel: ferryOut.linkLabel,
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
    el("p", "tagline", "What still needs locking in — red items need action before they're gone.")
  );
  const summary = el("p", "book-summary");
  const secToBook = el("section"), secOpt = el("section"), secDone = el("section");
  const foot = el("footer");
  foot.append(el("p", "muted", "Booked marks sync across devices (30s refresh)."));
  app.append(head, summary, secToBook, secOpt, secDone, foot);

  const isDone = it => store.get(`hkbooked:${it.id}`) === "1";

  const costNode = it => it.cost == null
    ? el("span", "tbd", "TBD")
    : el("span", "book-cost", it.cost);

  function card(it, done) {
    const c = el("div",
      "book-item" + (done ? " book-item-done" : it.urgent ? "" : " book-item-opt"));

    const hd = el("div", "book-head");
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
    lab.append(cb, title);

    const right = el("div", "book-right");
    right.append(costNode(it), el("span",
      done ? "badge badge-booked" : it.urgent ? "badge badge-to-book" : "badge",
      done ? "booked" : it.urgent ? "to book" : "optional"));
    hd.append(lab, right);
    c.append(hd);

    if (it.why) c.append(el("p", "book-why", it.why));

    const meta = el("p", "book-meta");
    if (it.when) meta.append(el("span", "book-when", it.when));
    if (it.url) {
      const a = el("a", "book-link", it.linkLabel || it.url);
      a.href = it.url;
      a.target = "_blank";
      a.rel = "noopener";
      meta.append(a);
    }
    if (meta.childNodes.length) c.append(meta);
    return c;
  }

  function render() {
    [secToBook, secOpt, secDone].forEach(s => { s.textContent = ""; });

    const reqPend = REQUIRED.filter(i => !isDone(i));
    const optPend = OPTIONAL.filter(i => !isDone(i));
    const done = [...REQUIRED, ...OPTIONAL].filter(isDone);

    summary.textContent = "";
    const n = reqPend.length;
    if (n) {
      summary.append(el("strong", "book-count", String(n)),
        n === 1 ? " thing left to book" : " things left to book");
    } else {
      summary.append(el("strong", "book-count book-count-ok", "Nothing left to book"), " — all set.");
    }
    if (optPend.length) {
      summary.append(el("span", "muted",
        ` · ${optPend.length} optional link${optPend.length > 1 ? "s" : ""} below`));
    }

    secToBook.append(el("h2", null, "To book"));
    if (reqPend.length) {
      const list = el("div", "book-list");
      reqPend.forEach(i => list.append(card(i, false)));
      secToBook.append(list);
    } else {
      secToBook.append(el("p", "muted", "Everything's booked."));
    }

    if (optPend.length) {
      secOpt.append(el("h2", null, "Optional & links"));
      const list = el("div", "book-list");
      optPend.forEach(i => list.append(card(i, false)));
      secOpt.append(list);
    }

    if (done.length) {
      secDone.append(el("h2", null, "Done"));
      const list = el("div", "book-list");
      done.forEach(i => list.append(card(i, true)));
      secDone.append(list);
    }
  }

  if (window.SyncStore) SyncStore.onChange(render);
  render();
})();
