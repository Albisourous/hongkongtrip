/* Shared checkmark store — syncs hkcheck:/hkpaid:/hkbooked: marks across
   devices via a free JSON bin (extendsclass json-storage, no auth; anyone
   with the URL can write — fine for checkmarks). localStorage mirrors
   everything so pages work offline; remote wins when its timestamp is
   newer. Exposed as window.SyncStore with get/set/onChange. */
window.SyncStore = (() => {
  "use strict";
  const BIN = "https://extendsclass.com/api/json-storage/bin/afdbfdc";
  const POLL_MS = 30000;
  const PUSH_DEBOUNCE_MS = 1200;
  const MARK = /^(hkcheck|hkpaid|hkbooked):/;

  const state = {}; // key -> { v: "1"|null, t: ms }
  const listeners = [];
  let pushTimer = null;

  const mirror = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };

  // Seed from marks already on this device (t=0, so remote always wins).
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && MARK.test(k) && mirror.get(k) === "1") state[k] = { v: "1", t: 0 };
    }
  } catch (e) {}

  const apply = (k, entry) => { state[k] = entry; mirror.set(k, entry.v); };

  // Merge a remote doc into local state. Returns true if anything changed.
  function merge(remote) {
    let changed = false;
    if (remote && typeof remote === "object") {
      Object.keys(remote).forEach(k => {
        if (!MARK.test(k) || !remote[k]) return;
        if (!state[k] || remote[k].t > state[k].t) { apply(k, remote[k]); changed = true; }
      });
    }
    return changed;
  }

  const get = k => (state[k] && state[k].v) || null;

  function set(k, v) {
    apply(k, { v: v === "1" ? "1" : null, t: Date.now() });
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, PUSH_DEBOUNCE_MS);
  }

  // GETs are CDN-cached ~2h; a unique query busts it.
  const fresh = () => `${BIN}?t=${Date.now()}`;

  async function pull() {
    try {
      const res = await fetch(fresh());
      if (res.ok && merge(await res.json())) listeners.forEach(cb => cb());
    } catch (e) {}
  }

  // Read-merge-write so two devices don't clobber each other's keys.
  async function push() {
    try {
      const res = await fetch(fresh());
      const remote = res.ok ? await res.json() : {};
      const doc = (remote && typeof remote === "object") ? remote : {};
      Object.keys(state).forEach(k => {
        if (!doc[k] || state[k].t > doc[k].t) doc[k] = state[k];
      });
      const put = await fetch(BIN, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      if (put.ok) merge(doc);
    } catch (e) {}
  }

  const onChange = cb => { if (typeof cb === "function") listeners.push(cb); };

  pull();
  setInterval(pull, POLL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") pull();
  });

  return { get, set, onChange };
})();
