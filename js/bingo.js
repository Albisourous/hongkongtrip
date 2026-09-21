(() => {
  "use strict";

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const store = window.SyncStore || {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };

  const norm = it => (typeof it === "string" ? { t: it, d: "" } : it);
  const ITEMS = (TRIP.bingo || []).map(norm);
  const N = ITEMS.length;           // 25
  const W = Math.round(Math.sqrt(N)); // 5
  const CENTER = Math.floor(N / 2);   // star pose

  const LINES = [];
  for (let r = 0; r < W; r++) LINES.push(Array.from({ length: W }, (_, c) => r * W + c));
  for (let c = 0; c < W; c++) LINES.push(Array.from({ length: W }, (_, r) => r * W + c));
  LINES.push(Array.from({ length: W }, (_, i) => i * W + i));
  LINES.push(Array.from({ length: W }, (_, i) => i * W + (W - 1 - i)));

  const isDone = i => store.get(`hkbingo:${i}`) === "1";

  const app = document.getElementById("app");
  const head = el("header");
  head.append(
    el("h1", null, "Trip Bingo"),
    el("p", "tagline", "Tap a square when it happens — ⓘ flips it for details. First full line wins bragging rights; center square is mandatory.")
  );
  const banner = el("p", "bingo-banner");
  const progress = el("p", "bingo-progress");
  const grid = el("div", "bingo-grid");
  const foot = el("footer");
  foot.append(el("p", "muted", "Squares sync across devices (30s refresh)."));
  app.append(head, banner, progress, grid, foot);

  function render() {
    const done = new Set();
    ITEMS.forEach((_, i) => { if (isDone(i)) done.add(i); });

    const winLines = N ? LINES.filter(l => l.every(i => done.has(i))) : [];
    const winCells = new Set(winLines.flat());

    banner.textContent = winLines.length
      ? `BINGO! ${winLines.length} line${winLines.length > 1 ? "s" : ""} down`
      : "";
    banner.hidden = !winLines.length;
    progress.textContent = `${done.size} / ${N} squares`;

    grid.textContent = "";
    ITEMS.forEach((it, i) => {
      const cell = el("button",
        "bingo-cell"
        + (done.has(i) ? " bingo-cell-done" : "")
        + (winCells.has(i) ? " bingo-cell-win" : "")
        + (i === CENTER ? " bingo-cell-star" : ""));
      cell.type = "button";
      const inner = el("span", "bingo-inner");
      const front = el("span", "bingo-face bingo-front");
      front.append(el("span", "bingo-check", done.has(i) ? "✓" : ""),
        el("span", "bingo-text", it.t));
      inner.append(front);
      if (it.d) {
        front.append(el("span", "bingo-info", "ⓘ"));
        const back = el("span", "bingo-face bingo-back");
        back.append(el("span", "bingo-detail", it.d),
          el("span", "bingo-flip", "↩"));
        inner.append(back);
      }
      cell.append(inner);
      cell.addEventListener("click", e => {
        if (it.d && e.target.closest(".bingo-info")) {
          cell.classList.add("bingo-cell-flip");
          return;
        }
        if (cell.classList.contains("bingo-cell-flip")) {
          cell.classList.remove("bingo-cell-flip");
          return;
        }
        store.set(`hkbingo:${i}`, done.has(i) ? null : "1");
        render();
      });
      grid.append(cell);
    });
  }

  if (window.SyncStore) SyncStore.onChange(render);
  render();
})();
