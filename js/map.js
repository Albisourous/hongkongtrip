/* Map page — interactive map of every POI in TRIP.places.
   Leaflet is vendored in vendor/leaflet (no CDN). Tiles are Amap raster
   tiles — reachable on mainland networks; pin conversion WGS-84 → GCJ-02
   and shared pin/popup helpers live in js/geo.js (window.GeoKit).
   Filters: by leg or by day. Deep links: #leg=gz, #day=sep-28. */
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
    "Every pin on the plan — filter by leg or pick a day. Amap tiles work in mainland China."));
  app.appendChild(head);

  var legChips = el("div", "day-chips map-chips");
  var dayChips = el("div", "day-chips map-chips");
  app.appendChild(legChips);
  app.appendChild(dayChips);

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
    return { p: p, leg: p.leg, marker: m, ll: ll };
  });

  function daySlug(day) {
    return day.date.toLowerCase().replace(/\s+/g, "-");
  }

  // {kind:"all"} | {kind:"leg", id} | {kind:"day", i}
  var filter = { kind: "all" };
  var chipFor = {};

  function filterKey() {
    if (filter.kind === "leg") return "leg:" + filter.id;
    if (filter.kind === "day") return "day:" + filter.i;
    return "all";
  }

  function match(e) {
    if (filter.kind === "leg") return e.leg === filter.id;
    if (filter.kind === "day") return GeoKit.onDay(e.p, TRIP.days[filter.i].date);
    return true;
  }

  function apply() {
    var pts = [];
    entries.forEach(function (e) {
      if (match(e)) {
        e.marker.addTo(map);
        pts.push(e.ll);
      } else {
        map.removeLayer(e.marker);
      }
    });
    if (pts.length === 1) map.setView(pts[0], 15);
    else if (pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.15));

    var key = filterKey();
    Object.keys(chipFor).forEach(function (k) {
      chipFor[k].classList.toggle("active", k === key);
    });

    var hash = filter.kind === "leg" ? "#leg=" + filter.id
      : filter.kind === "day" ? "#day=" + daySlug(TRIP.days[filter.i])
      : "";
    if (location.hash !== hash) {
      history.replaceState(null, "", hash || location.pathname);
    }
  }

  function chip(key, label, dotLeg, f, title) {
    var b = el("button", "day-chip");
    b.type = "button";
    if (dotLeg) b.appendChild(el("span", "leg-dot leg-" + dotLeg));
    b.appendChild(document.createTextNode(label));
    if (title) b.title = title;
    b.addEventListener("click", function () {
      filter = f;
      apply();
    });
    chipFor[key] = b;
    return b;
  }

  legChips.appendChild(
    chip("all", "All (" + entries.length + ")", false, { kind: "all" }));
  TRIP.legs.forEach(function (leg) {
    var n = entries.filter(function (e) { return e.leg === leg.id; }).length;
    if (n) legChips.appendChild(
      chip("leg:" + leg.id, leg.name + " (" + n + ")", leg.id,
        { kind: "leg", id: leg.id }));
  });

  TRIP.days.forEach(function (day, i) {
    var n = entries.filter(function (e) {
      return GeoKit.onDay(e.p, day.date);
    }).length;
    if (!n) return;
    dayChips.appendChild(
      chip("day:" + i, day.date + " (" + n + ")", false,
        { kind: "day", i: i }, day.date + " · " + day.day + " — " + day.base));
  });

  function fromHash() {
    var h = decodeURIComponent(location.hash.slice(1));
    var m = h.match(/^leg=(\w+)$/);
    if (m && chipFor["leg:" + m[1]]) {
      filter = { kind: "leg", id: m[1] };
      return apply();
    }
    m = h.match(/^day=([a-z]{3}-\d{1,2})$/);
    if (m) {
      var i = TRIP.days.findIndex(function (d) { return daySlug(d) === m[1]; });
      if (i >= 0 && chipFor["day:" + i]) {
        filter = { kind: "day", i: i };
        return apply();
      }
    }
    filter = { kind: "all" };
    apply();
  }

  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
