/* Map page — interactive map of every POI in TRIP.places.
   Leaflet is vendored in vendor/leaflet (no CDN, works offline of CDNs).
   Base tiles are Amap raster tiles (bilingual labels, reachable on mainland
   networks — Google/OSM are not). Pins are stored WGS-84 in data.js and
   converted to GCJ-02 here so they align with the mainland tiles. */
(function () {
  "use strict";

  // ---- WGS-84 → GCJ-02 ("Mars coordinates") ----
  // China requires published maps to be offset; Amap tiles are GCJ-02, so
  // pins must be shifted to match. Outside the mainland box it no-ops.
  var PI = 3.1415926535897932384626;
  var AX = 6378245.0;
  var EE = 0.00669342162296594323;

  function outOfChina(lat, lng) {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
  }
  function tLat(x, y) {
    var r = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    r += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3;
    r += (20 * Math.sin(y * PI) + 40 * Math.sin(y / 3 * PI)) * 2 / 3;
    r += (160 * Math.sin(y / 12 * PI) + 320 * Math.sin(y * PI / 30)) * 2 / 3;
    return r;
  }
  function tLng(x, y) {
    var r = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    r += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3;
    r += (20 * Math.sin(x * PI) + 40 * Math.sin(x / 3 * PI)) * 2 / 3;
    r += (150 * Math.sin(x / 12 * PI) + 300 * Math.sin(x / 30 * PI)) * 2 / 3;
    return r;
  }
  function gcj(lat, lng) {
    if (outOfChina(lat, lng)) return [lat, lng];
    var dLat = tLat(lng - 105, lat - 35);
    var dLng = tLng(lng - 105, lat - 35);
    var rad = lat / 180 * PI;
    var magic = 1 - EE * Math.sin(rad) * Math.sin(rad);
    var sq = Math.sqrt(magic);
    dLat = (dLat * 180) / ((AX * (1 - EE)) / (magic * sq) * PI);
    dLng = (dLng * 180) / (AX / sq * Math.cos(rad) * PI);
    return [lat + dLat, lng + dLng];
  }

  // ---- DOM ----

  var app = document.getElementById("app");
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  var legName = function (id) {
    var l = TRIP.legs.find(function (l) { return l.id === id; });
    return l ? l.name : id;
  };

  var CAT = {
    stay: "Stay", eat: "Food & drink", see: "See & do",
    shop: "Shopping", tech: "Tech", move: "Transit"
  };

  var head = el("header");
  head.appendChild(el("h1", null, "Map"));
  head.appendChild(el("p", "tagline",
    "Every pin on the plan — tap for the day and details. Amap tiles work in mainland China."));
  app.appendChild(head);

  var chips = el("div", "day-chips map-chips");
  app.appendChild(chips);

  var mapEl = el("div");
  mapEl.id = "map";
  app.appendChild(mapEl);

  var foot = el("footer");
  foot.appendChild(el("p", "muted",
    "Tiles © Amap / AutoNavi — bilingual, reachable in mainland China. Pin colors = leg colors."));
  app.appendChild(foot);

  // ---- Map ----

  var map = L.map(mapEl, { scrollWheelZoom: true });
  L.tileLayer(
    "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_en&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    { subdomains: ["1", "2", "3", "4"], maxZoom: 18, attribution: "© Amap / AutoNavi" }
  ).addTo(map);

  var entries = (TRIP.places || []).map(function (p) {
    var icon = L.divIcon({
      className: "map-pin leg-" + p.leg,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -9]
    });
    var m = L.marker(gcj(p.lat, p.lng), { icon: icon });

    var pop = el("div", "map-pop");
    pop.appendChild(el("p",
      "map-pop-name" + (p.cat === "eat" ? " map-eat" : ""), p.name));
    pop.appendChild(el("p", "map-pop-meta",
      (CAT[p.cat] || p.cat) + " · " + legName(p.leg) + (p.day ? " · " + p.day : "")));
    if (p.note) pop.appendChild(el("p", "map-pop-note", p.note));
    m.bindPopup(pop);

    return { leg: p.leg, marker: m, ll: gcj(p.lat, p.lng) };
  });

  function fitTo(legId) {
    var pts = entries
      .filter(function (e) { return legId === "all" || e.leg === legId; })
      .map(function (e) { return e.ll; });
    if (pts.length === 1) {
      map.setView(pts[0], 15);
    } else if (pts.length) {
      map.fitBounds(L.latLngBounds(pts).pad(0.15));
    }
  }

  function setFilter(legId) {
    entries.forEach(function (e) {
      var on = legId === "all" || e.leg === legId;
      if (on) e.marker.addTo(map); else map.removeLayer(e.marker);
    });
    fitTo(legId);
  }

  function chip(id, label, dots) {
    var b = el("button", "day-chip");
    b.type = "button";
    if (dots) {
      var d = el("span", "leg-dot leg-" + id);
      b.appendChild(d);
    }
    b.appendChild(document.createTextNode(label));
    b.addEventListener("click", function () {
      chips.querySelectorAll(".day-chip").forEach(function (c) {
        c.classList.toggle("active", c === b);
      });
      setFilter(id);
    });
    return b;
  }

  var all = chip("all", "All (" + entries.length + ")", false);
  all.classList.add("active");
  chips.appendChild(all);
  TRIP.legs.forEach(function (leg) {
    var n = entries.filter(function (e) { return e.leg === leg.id; }).length;
    if (n) chips.appendChild(chip(leg.id, leg.name + " (" + n + ")", true));
  });

  setFilter("all");
})();
