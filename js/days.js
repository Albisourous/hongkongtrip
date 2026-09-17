/* Days page — day-by-day plan rendered into #app.
   Day chips pick a day, the detail card supports horizontal swipe,
   and checklist state persists in localStorage (hkcheck:{date}:{i}). */
(function () {
  "use strict";

  var app = document.getElementById("app");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function legDots(ids) {
    var s = el("span", "leg-dots");
    (ids || []).forEach(function (id) {
      s.appendChild(el("span", "leg-dot leg-" + id));
    });
    return s;
  }

  var store = window.SyncStore || {
    get: function (k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try {
        if (v == null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      } catch (e) {}
    },
  };

  function checkKey(day, i) {
    return "hkcheck:" + day.date + ":" + i;
  }

  function doneCount(day) {
    var n = 0;
    day.checklist.forEach(function (_, i) {
      if (store.get(checkKey(day, i)) === "1") n++;
    });
    return n;
  }

  var head = el("header");
  head.appendChild(el("h1", null, "Days"));
  head.appendChild(el("p", "tagline",
    "The plan for each day — tap a chip or swipe the card sideways."));
  app.appendChild(head);

  var section = el("section");

  var chips = el("div", "day-chips");
  var detail = el("div", "day-detail");
  section.appendChild(chips);
  section.appendChild(detail);
  app.appendChild(section);

  var foot = el("footer");
  foot.appendChild(el("p", "muted", "Checklist marks sync across devices (30s refresh)."));
  app.appendChild(foot);

  var chipButtons = [];
  var chipProgs = [];
  var progressEl = null;
  var current = 0;

  function refreshProgress(i) {
    var day = TRIP.days[i];
    var total = day.checklist.length;
    if (!total) return;
    var done = doneCount(day);
    chipProgs[i].textContent = done === total ? "✓" : done + "/" + total;
    chipButtons[i].classList.toggle("day-chip-done", done === total);
    if (i === current && progressEl) {
      progressEl.textContent = done + "/" + total + " done";
    }
  }

  function show(i, scrollChip) {
    current = Math.max(0, Math.min(TRIP.days.length - 1, i));
    var day = TRIP.days[current];

    chipButtons.forEach(function (b, j) {
      b.classList.toggle("active", j === current);
    });
    if (scrollChip && chipButtons[current].scrollIntoView) {
      chipButtons[current].scrollIntoView({
        block: "nearest", inline: "center", behavior: "smooth",
      });
    }

    detail.textContent = "";

    var head = el("div", "day-head");
    var h3 = el("h3");
    if (day.legs && day.legs.length) h3.appendChild(legDots(day.legs));
    h3.appendChild(document.createTextNode(
      day.date + " · " + day.day + " — " + day.base));
    head.appendChild(h3);
    progressEl = day.checklist.length ? el("span", "day-progress") : null;
    if (progressEl) head.appendChild(progressEl);
    detail.appendChild(head);
    var stay = el("p", "muted", "Stay: " + day.stay);
    if (/TBD/i.test(day.stay)) {
      var bookLink = el("a", "badge badge-to-book", "to book");
      bookLink.href = "bookings.html";
      stay.appendChild(document.createTextNode(" "));
      stay.appendChild(bookLink);
    }
    detail.appendChild(stay);

    [["Morning", day.morning],
     ["Afternoon", day.afternoon],
     ["Evening", day.evening],
     ["Places", day.places ? day.places.join(" · ") : null],
     ["Veg eats", day.eats]].forEach(function (pair) {
      if (pair[1] == null) return;
      var block = el("div", "block");
      block.appendChild(el("span", "block-label", pair[0]));
      block.appendChild(document.createTextNode(pair[1]));
      detail.appendChild(block);
    });

    if (day.checklist.length) {
      var ul = el("ul", "checklist");
      day.checklist.forEach(function (item, k) {
        var li = el("li");
        var label = el("label");
        var cb = el("input");
        cb.type = "checkbox";
        var k2 = checkKey(day, k);
        cb.checked = store.get(k2) === "1";
        li.classList.toggle("done", cb.checked);
        cb.addEventListener("change", function () {
          store.set(k2, cb.checked ? "1" : null);
          li.classList.toggle("done", cb.checked);
          refreshProgress(current);
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(" "));
        label.appendChild(el("span", "time", item.t));
        label.appendChild(document.createTextNode(" " + item.task));
        li.appendChild(label);
        ul.appendChild(li);
      });
      detail.appendChild(ul);
    }

    if (day.notes) detail.appendChild(el("p", "muted day-notes", day.notes));
    refreshProgress(current);
  }

  TRIP.days.forEach(function (day, i) {
    var b = el("button", "day-chip");
    b.type = "button";
    if (day.legs && day.legs.length) b.appendChild(legDots(day.legs));
    b.appendChild(document.createTextNode(day.date + " · " + day.day));
    if (day.checklist.length) {
      chipProgs[i] = el("span", "day-chip-prog");
      b.appendChild(chipProgs[i]);
    }
    b.addEventListener("click", function () { show(i, true); });
    chipButtons[i] = b;
    chips.appendChild(b);
  });
  TRIP.days.forEach(function (_, i) { refreshProgress(i); });

  // Swipe left/right on the detail card to move between days.
  var touchX = 0;
  var touchY = 0;
  detail.addEventListener("touchstart", function (e) {
    var t = e.changedTouches[0];
    touchX = t.clientX;
    touchY = t.clientY;
  }, { passive: true });
  detail.addEventListener("touchend", function (e) {
    var t = e.changedTouches[0];
    var dx = t.clientX - touchX;
    var dy = t.clientY - touchY;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
    show(current + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  // Re-render when another device's marks arrive.
  if (window.SyncStore) SyncStore.onChange(function () {
    TRIP.days.forEach(function (_, i) { refreshProgress(i); });
    show(current, false);
  });

  show(0, false);
})();
