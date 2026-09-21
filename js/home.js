/* Home page — renders the trip overview into #app.
   Data comes from data.js (global TRIP). Vanilla DOM only. */
(function () {
  "use strict";

  var app = document.getElementById("app");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  var totalPeople = TRIP.people.length;
  var LEG_SHORT = { hk1: "Hong Kong", gz: "Guangzhou", sz: "Shenzhen", mo: "Macau", hk2: "HK airport" };

  function legShort(leg) {
    return LEG_SHORT[leg.id] || leg.name;
  }

  function skippers(legId) {
    return TRIP.people.filter(function (p) { return p.legs.indexOf(legId) === -1; });
  }

  // ---------- Hero ----------

  var hero = el("section", "home-hero");
  hero.appendChild(el("h1", null, TRIP.title));

  var firstDay = TRIP.days[0];
  var lastDay = TRIP.days[TRIP.days.length - 1];
  hero.appendChild(el("p", "home-dates",
    firstDay.date + " – " + lastDay.date + ", 2026 · " +
    totalPeople + " friends · " + TRIP.dates.nights + " nights"));
  hero.appendChild(el("p", "home-route", TRIP.route));
  hero.appendChild(el("p", "home-explainer",
    "This site tracks the plan for each day, what still needs booking, and who owes whom. " +
    "Days holds the itinerary and checklists, Map pins it all (works in mainland China), " +
    "Hotels shows who sleeps where each night, Bookings shows what's left to reserve, " +
    "and Payments splits the shared costs per leg."));
  app.appendChild(hero);

  // ---------- Leg cards ----------

  var legSection = el("section");
  legSection.appendChild(el("h2", null, "The legs"));
  var legCards = el("div", "cards home-legs");

  TRIP.legs.forEach(function (leg) {
    var card = el("div", "card home-leg leg-" + leg.id);
    card.appendChild(el("h3", null, leg.name));
    card.appendChild(el("p", "muted",
      leg.dates + " · " + leg.nights + (leg.nights === 1 ? " night" : " nights")));

    var out = skippers(leg.id);
    if (out.length === 0) {
      card.appendChild(el("p", null, "All " + totalPeople + " attending"));
    } else {
      card.appendChild(el("p", null,
        (totalPeople - out.length) + " of " + totalPeople + " attending"));
      card.appendChild(el("p", "home-leg-out",
        out.map(function (p) { return p.name; }).join(" & ") +
        (out.length === 1 ? " sits" : " sit") + " this one out"));
    }
    legCards.appendChild(card);
  });

  legSection.appendChild(legCards);
  app.appendChild(legSection);

  // ---------- Roster ----------

  var rosterSection = el("section");
  rosterSection.appendChild(el("h2", null, "The crew"));
  var roster = el("ul", "home-roster");

  TRIP.people.forEach(function (person) {
    var row = el("li");
    row.appendChild(el("span", "home-person", person.name));
    var badges = el("span", "home-person-legs");
    TRIP.legs.forEach(function (leg) {
      var on = person.legs.indexOf(leg.id) !== -1;
      var b = el("span", "badge leg-" + leg.id + (on ? "" : " home-leg-off"));
      b.appendChild(el("span", "leg-dot"));
      b.appendChild(document.createTextNode(legShort(leg)));
      badges.appendChild(b);
    });
    row.appendChild(badges);
    roster.appendChild(row);
  });

  rosterSection.appendChild(roster);
  app.appendChild(rosterSection);

  // ---------- Link cards ----------

  var toBook = TRIP.costs.filter(function (c) { return c.status === "to-book"; }).length;

  var links = [
    { href: "days.html", title: "Days",
      desc: "Day-by-day plan, where we're sleeping, and checklists." },
    { href: "map.html", title: "Map",
      desc: "Every pin on the plan — works in mainland China." },
    { href: "hotels.html", title: "Hotels",
      desc: "Who sleeps in each hotel, night by night." },
    { href: "bookings.html", title: "Bookings",
      desc: toBook === 0 ? "Everything is booked."
        : toBook + (toBook === 1 ? " thing still needs" : " things still need") + " booking." },
    { href: "payments.html", title: "Payments",
      desc: "Per-leg splits and who owes whom." },
  ];

  var linkSection = el("section");
  var linkCards = el("div", "cards home-links");
  links.forEach(function (link) {
    var a = el("a", "card home-link");
    a.href = link.href;
    a.appendChild(el("span", "card-title", link.title));
    a.appendChild(el("p", "muted", link.desc));
    a.appendChild(el("span", "home-link-arrow", "→"));
    linkCards.appendChild(a);
  });
  linkSection.appendChild(linkCards);
  app.appendChild(linkSection);
})();
