/* Map page — interactive map of every POI in TRIP.places.
   Leaflet is vendored in vendor/leaflet (no CDN). Tiles are Amap raster
   tiles — reachable on mainland networks; pin conversion WGS-84 → GCJ-02
   and shared pin/popup helpers live in js/geo.js (window.GeoKit). */
(function () {
  "use strict";

  var app = document.getElementById("app");
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

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

  var map = L.map(mapEl, { scrollWheelZoom: true });
  L.tileLayer(GeoKit.TILE_URL, GeoKit.TILE_OPTS).addTo(map);

  var entries = (TRIP.places || []).map(function (p) {
    var ll = GeoKit.gcj(p.lat, p.lng);
    var m = L.marker(ll, { icon: GeoKit.pinIcon(p.leg) });
    m.bindPopup(GeoKit.popup(p));
    return { leg: p.leg, marker: m, ll: ll };
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
    if (dots) b.appendChild(el("span", "leg-dot leg-" + id));
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
