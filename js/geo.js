/* Shared map helpers — used by the Map page and the per-day maps on Days.
   Pins are stored WGS-84 in data.js; China requires published maps to be
   offset (GCJ-02 "Mars coordinates"), so convert before placing markers on
   the Amap tiles. Load after vendor/leaflet/leaflet.js. */
window.GeoKit = (function () {
  "use strict";

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

  // Amap raster tiles — bilingual labels, reachable on mainland networks.
  var TILE_URL = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_en&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
  var TILE_OPTS = {
    subdomains: ["1", "2", "3", "4"],
    maxZoom: 18,
    attribution: "© Amap / AutoNavi"
  };

  var CAT = {
    stay: "Stay", eat: "Food & drink", see: "See & do",
    shop: "Shopping", tech: "Tech", move: "Transit"
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function legName(id) {
    var l = (TRIP.legs || []).find(function (l) { return l.id === id; });
    return l ? l.name : id;
  }

  // Colored dot marker — color comes from the leg-* class via --leg.
  function pinIcon(leg) {
    return L.divIcon({
      className: "map-pin leg-" + leg,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -9]
    });
  }

  // Popup content for a TRIP.places entry. Food names go green.
  function popup(p) {
    var pop = el("div", "map-pop");
    pop.appendChild(el("p",
      "map-pop-name" + (p.cat === "eat" ? " map-eat" : ""), p.name));
    pop.appendChild(el("p", "map-pop-meta",
      (CAT[p.cat] || p.cat) + " · " + legName(p.leg) + (p.day ? " · " + p.day : "")));
    if (p.note) pop.appendChild(el("p", "map-pop-note", p.note));
    return pop;
  }

  // Does a place belong to a given day? day strings look like "Sep 25",
  // "Sep 25/27", "Sep 25–28 (opt)", "Sep 29–Oct 1".
  var ORD = { Sep: 0, Oct: 30 };
  function onDay(place, dateStr) {
    var spec = place.day || "";
    // expand slash-lists that share a month: "Sep 25/27" → "Sep 25/Sep 27"
    spec = spec.replace(/([A-Za-z]{3}\s*\d{1,2})((?:\s*\/\s*\d{1,2})+)/g,
      function (all, head, tails) {
        return head + tails.replace(/\d{1,2}/g, head.slice(0, 3) + " $&");
      });
    if (spec.indexOf(dateStr) !== -1) return true;
    var m = spec.match(/([A-Za-z]{3})\s*(\d{1,2})\s*[–-]\s*([A-Za-z]{3})?\s*(\d{1,2})/);
    if (!m) return false;
    var a = ORD[m[1]] + (+m[2]);
    var b = ORD[m[3] || m[1]] + (+m[4]);
    var cur = ORD[dateStr.slice(0, 3)] + parseInt(dateStr.slice(3), 10);
    return cur >= a && cur <= b;
  }

  return { gcj: gcj, TILE_URL: TILE_URL, TILE_OPTS: TILE_OPTS,
    pinIcon: pinIcon, popup: popup, onDay: onDay };
})();
