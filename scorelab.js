/* JDAC 寫譜工作室(網頁版)——鼓機格子 + 譜面對照 + YouTube 同步播放。
 *
 * 與本機「修譜工作室」同一套資料模型(48 tick/小節,支援三連音),
 * 差別:音源改 YouTube 內嵌(不下載不存檔)、拍點網格改「第1拍+BPM」
 * 均勻網格(學員寫譜情境)、專案存 localStorage、匯入/匯出 JSON。
 * 老師測試版:網址要帶 ?t=<token> 才開。
 */

/* ── 門禁 ─────────────────────────────────────────────── */
const TOKEN = "jdac-teacher-2026";
(function gate() {
  const q = new URLSearchParams(location.search);
  if (q.get("t") === TOKEN) localStorage.slTeacher = "1";
  if (localStorage.slTeacher === "1") {
    document.getElementById("gate").remove();
  } else {
    throw new Error("gated");
  }
})();

/* ── 常數(與本機版一致) ───────────────────────────────── */
const INSTS = [
  { key: "crash", label: "Crash",  hot: "c" },
  { key: "hihat", label: "Hi-hat", hot: "h" },
  { key: "hho",   label: "開放 HH", hot: "o" },
  { key: "ride",  label: "Ride",   hot: "r" },
  { key: "tom1",  label: "T1",     hot: "t" },
  { key: "tom2",  label: "T2",     hot: "y" },
  { key: "snare", label: "Snare",  hot: "s" },
  { key: "ft",    label: "Floor",  hot: "u" },
  { key: "kick",  label: "Kick",   hot: "b" },
];
const HOTKEYS = Object.fromEntries(INSTS.map((i) => [i.hot, i.key]));
const LEGACY = { tom: "tom1" };
const BARS_PER_ROW = 4;
const TPB = 12;
const VF_KEYS = {
  kick: "f/4", snare: "c/5", ft: "a/4", tom2: "d/5", tom1: "e/5",
  ride: "f/5/x2", hihat: "g/5/x2", hho: "g/5/x3", crash: "a/5/x2",
};
const HANDS = new Set(["snare", "ft", "tom2", "tom1", "ride", "hihat", "hho", "crash"]);

const $ = (id) => document.getElementById(id);
const el = {
  picker: $("projPicker"), meta: $("songMeta"), grid: $("grid"),
  dirty: $("dirty"), status: $("status"),
  play: $("playBtn"), cur: $("curTime"), tot: $("totTime"),
  rate: $("rate"), rateOut: $("rateOut"),
  loopOn: $("loopOn"), loopA: $("loopA"), loopB: $("loopB"),
  clickOn: $("clickOn"), followOn: $("followOn"), scoreOn: $("scoreOn"),
};

let song = null;
let cells = new Map();
let onSet = new Set();
let grids = {};
let undoStack = [];
let dirty = false;
let secAtMap = {};
let actx = null, curBar = -1;
let clickIdx = null, lastClockT = 0;
let rowBlocks = [];

const fmt = (t) => {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};
function setStatus(msg, cls = "") { el.status.textContent = msg; el.status.className = cls; }

/* ── YouTube 播放器(同 audio 介面) ────────────────────── */
const audio = {
  yt: null, _rate: 1, _lastRaw: 0, _lastAt: 0, _state: -1,
  get paused() { return this._state !== 1; },
  get duration() { try { return this.yt ? this.yt.getDuration() : 0; } catch (_) { return 0; } },
  get currentTime() {
    if (!this.yt || !this.yt.getCurrentTime) return 0;
    let raw;
    try { raw = this.yt.getCurrentTime(); } catch (_) { return 0; }
    const now = performance.now() / 1000;
    if (raw !== this._lastRaw) { this._lastRaw = raw; this._lastAt = now; }
    // YT 的 getCurrentTime 更新有階梯,播放中用自己的時鐘內插補平
    if (this.paused) return raw;
    return this._lastRaw + Math.min(0.4, (now - this._lastAt) * this._rate);
  },
  set currentTime(t) { if (this.yt) try { this.yt.seekTo(t, true); this._lastRaw = t; this._lastAt = performance.now() / 1000; } catch (_) {} },
  get playbackRate() { return this._rate; },
  set playbackRate(r) { this._rate = r; if (this.yt) try { this.yt.setPlaybackRate(r); } catch (_) {} },
  play() { if (this.yt) try { this.yt.playVideo(); } catch (_) {} },
  pause() { if (this.yt) try { this.yt.pauseVideo(); } catch (_) {} },
};

let ytReady = false, ytPendingId = null;
window.onYouTubeIframeAPIReady = function () {
  ytReady = true;
  if (ytPendingId) loadVideo(ytPendingId);
};
(function loadYTAPI() {
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);
})();

function loadVideo(videoId) {
  if (!ytReady) { ytPendingId = videoId; return; }
  ytPendingId = null;
  if (audio.yt) {
    try { audio.yt.cueVideoById(videoId); } catch (_) {}
    return;
  }
  audio.yt = new YT.Player("ytplayer", {
    videoId,
    playerVars: { controls: 1, rel: 0, playsinline: 1 },
    events: {
      onReady: () => { el.tot.textContent = fmt(audio.duration); },
      onStateChange: (e) => {
        audio._state = e.data;
        const playing = e.data === 1;
        el.play.textContent = playing ? "❚❚" : "▶";
        el.play.classList.toggle("on", playing);
        if (playing) { clickIdx = null; ensureCtx(); if (actx.state === "suspended") actx.resume(); }
      },
    },
  });
}

function parseVideoId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/) ||
            url.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}

function ensureCtx() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  return actx;
}

/* ── 專案(localStorage) ───────────────────────────────── */
const STORE = "slProjects";

function allProjects() {
  try { return JSON.parse(localStorage[STORE] || "{}"); } catch (_) { return {}; }
}
function persistNow() {
  if (!song) return;
  const byCell = new Map();
  for (const k of onSet) {
    const [b, t, i] = k.split(":");
    const kk = `${b}:${t}`;
    if (!byCell.has(kk)) byCell.set(kk, []);
    byCell.get(kk).push(i);
  }
  song.events = [...byCell.entries()].map(([kk, insts]) => {
    const [b, t] = kk.split(":").map(Number);
    return [b, t, insts.sort()];
  }).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  song.grids = {};
  for (const [b, g] of Object.entries(grids)) {
    if (!(g.beats.every((m) => m === 4) && !g.qt[0] && !g.qt[1]))
      song.grids[b] = g;
  }
  song.tempo = song.yt.bpm;
  song.tick_format = 48;
  song.savedAt = new Date().toISOString();
  const all = allProjects();
  all[song.id] = song;
  localStorage[STORE] = JSON.stringify(all);
  setDirty(false);
}
let saveTimer = null;
function setDirty(v) {
  dirty = v;
  el.dirty.hidden = !v;
  if (v) { clearTimeout(saveTimer); saveTimer = setTimeout(persistNow, 800); }
}

function rebuildBeats() {
  const { t0, bpm } = song.yt;
  const n = song.n_bars * 4 + 1;
  const ibi = 60 / (bpm || 100);
  song.beats = Array.from({ length: n }, (_, i) => (t0 || 0) + i * ibi);
}

function refreshPicker(selectId = null) {
  const all = allProjects();
  el.picker.innerHTML = "";
  const ids = Object.keys(all);
  if (!ids.length) {
    el.picker.innerHTML = "<option value=''>（沒有專案）</option>";
    return;
  }
  for (const id of ids) {
    const o = document.createElement("option");
    o.value = id;
    o.textContent = `${all[id].title}(${all[id].n_bars} 小節)`;
    el.picker.appendChild(o);
  }
  el.picker.value = selectId && all[selectId] ? selectId : ids[0];
}

function loadProject(id) {
  const all = allProjects();
  const p = all[id];
  if (!p) return;
  song = p;
  song.id = id;
  song.yt = song.yt || { id: null, t0: 0, bpm: song.tempo || 100 };
  onSet = new Set();
  for (const [b, t, names] of song.events || [])
    for (const n of names) onSet.add(`${b}:${t}:${LEGACY[n] || n}`);
  grids = {};
  for (const [k, v] of Object.entries(song.grids || {}))
    grids[+k] = { beats: v.beats || [4, 4, 4, 4], qt: v.qt || [false, false] };
  undoStack = [];
  dirty = false; el.dirty.hidden = true;
  clickIdx = null; curBar = -1;
  rebuildBeats();
  $("bpmIn").value = song.yt.bpm;
  $("t0Out").textContent = song.yt.t0 != null && song.yt.id
    ? `第1拍 = ${song.yt.t0.toFixed(2)}s` : "未設定";
  el.loopB.value = Math.min(4, song.n_bars);
  render();
  refreshMeta();
  if (song.yt.id) loadVideo(song.yt.id);
  setStatus(`已載入「${song.title}」`
    + (song.yt.id ? "" : " · 這個專案沒有影片連結(只能編輯,不能播放)"), "ok");
}

function refreshMeta() {
  el.meta.textContent =
    `${song.n_bars} 小節 · ${Math.round(song.yt.bpm)} BPM · ${onSet.size} 個音符`;
}

$("newBtn").onclick = () => {
  const title = prompt("歌名 / 專案名稱?");
  if (!title) return;
  const url = prompt("YouTube 連結?(可留空,之後再補)") || "";
  const vid = parseVideoId(url);
  if (url && !vid) { setStatus("看不懂這個 YouTube 連結", "err"); return; }
  const bpm = +(prompt("BPM?(之後可用 TAP 修)", "100") || 100);
  const bars = +(prompt("先開幾小節?(之後可加)", "32") || 32);
  const id = "p" + Date.now();
  const proj = {
    id, title, yt: { id: vid, url, t0: 0, bpm: Math.max(30, Math.min(260, bpm)) },
    n_bars: Math.max(4, Math.min(300, bars)),
    tick_format: 48, events: [], grids: {}, sections: [0], sec_labels: {},
  };
  const all = allProjects();
  all[id] = proj;
  localStorage[STORE] = JSON.stringify(all);
  refreshPicker(id);
  loadProject(id);
};

$("delProjBtn").onclick = () => {
  if (!song) return;
  if (!confirm(`刪除專案「${song.title}」?(不可復原)`)) return;
  const all = allProjects();
  delete all[song.id];
  localStorage[STORE] = JSON.stringify(all);
  song = null;
  refreshPicker();
  if (el.picker.value) loadProject(el.picker.value);
  else el.grid.innerHTML = '<div class="empty">建立或選擇一個專案開始</div>';
};

el.picker.onchange = () => loadProject(el.picker.value);

$("exportBtn").onclick = () => {
  if (!song) return;
  persistNow();
  const blob = new Blob([JSON.stringify(song, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${song.title}_events.json`;
  a.click();
  setStatus("已匯出 JSON(可傳給老師 / 匯入本機修譜工作室)", "ok");
};

$("importBtn").onclick = () => $("fileIn").click();
$("fileIn").onchange = async (e) => {
  const f = e.target.files[0];
  e.target.value = "";
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.events)) throw new Error("不是譜面 JSON");
    const mul = d.tick_format === 48 ? 1 : 3;
    const id = "p" + Date.now();
    const proj = {
      id,
      title: d.title || f.name.replace(/_events\.json$/, ""),
      yt: d.yt || { id: null, url: "", t0: 0, bpm: Math.round(d.tempo || 100) },
      n_bars: d.n_bars || (Math.max(...d.events.map((x) => x[0])) + 1),
      tick_format: 48,
      events: d.events.map(([b, t, ins]) => [b, t * mul, ins]),
      grids: d.grids || {}, sections: d.sections || [0],
      sec_labels: d.sec_labels || {},
    };
    if (!proj.yt.id) {
      const url = prompt("這份譜要配哪個 YouTube 影片?(可留空)") || "";
      proj.yt.id = parseVideoId(url); proj.yt.url = url;
    }
    const all = allProjects();
    all[id] = proj;
    localStorage[STORE] = JSON.stringify(all);
    refreshPicker(id);
    loadProject(id);
  } catch (err) { setStatus(`匯入失敗:${err.message}`, "err"); }
};

/* ── 對齊影片:第1拍 / 微調 / BPM / TAP ─────────────────── */
$("setOneBtn").onclick = () => {
  if (!song) return;
  if (!song.yt.id) { setStatus("先在專案裡設 YouTube 連結", "err"); return; }
  song.yt.t0 = audio.currentTime;
  rebuildBeats();
  $("t0Out").textContent = `第1拍 = ${song.yt.t0.toFixed(2)}s`;
  setDirty(true);
  setStatus(`第 1 拍釘在 ${song.yt.t0.toFixed(2)}s`, "ok");
};
document.getElementById("syncbar").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-nudge]");
  if (!b || !song) return;
  song.yt.t0 = (song.yt.t0 || 0) + (+b.dataset.nudge);
  rebuildBeats();
  $("t0Out").textContent = `第1拍 = ${song.yt.t0.toFixed(2)}s`;
  setDirty(true);
});
$("bpmIn").onchange = () => {
  if (!song) return;
  const v = Math.max(30, Math.min(260, +$("bpmIn").value || 100));
  song.yt.bpm = v; $("bpmIn").value = v;
  rebuildBeats(); refreshMeta(); setDirty(true);
};
let taps = [];
$("tapBtn").onclick = () => {
  const now = performance.now();
  taps = taps.filter((t) => now - t < 4000);
  taps.push(now);
  if (taps.length >= 3) {
    const iv = [];
    for (let i = 1; i < taps.length; i++) iv.push(taps[i] - taps[i - 1]);
    iv.sort((a, b) => a - b);
    const bpm = Math.round(60000 / iv[iv.length >> 1] * 10) / 10;
    $("tapOut").textContent = `${bpm}`;
    $("bpmIn").value = bpm;
    $("bpmIn").onchange();
  } else $("tapOut").textContent = `(${taps.length})`;
};

/* ── 幾何(與本機版 verbatim) ──────────────────────────── */
function barSpan(b) {
  const B = song.beats, i = b * 4;
  if (i >= B.length) return null;
  const start = B[i];
  const end = (i + 4 < B.length) ? B[i + 4]
            : start + (B[i] - B[Math.max(0, i - 4)] || 2);
  return [start, end];
}
function posAt(t) {
  const B = song.beats;
  let lo = 0, hi = B.length - 1;
  if (t < B[0]) return { bar: 0, slot: 0, beatIndex: 0 };
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (B[mid] <= t) lo = mid; else hi = mid - 1;
  }
  return { bar: Math.floor(lo / 4), beatIndex: lo };
}
function barSpans(bar) {
  const g = grids[bar];
  const beats = g?.beats || [4, 4, 4, 4];
  const qt = g?.qt || [false, false];
  const out = [];
  for (let half = 0; half < 2; half++) {
    if (qt[half]) out.push({ t0: half * 24, subs: 3, tps: 8, qt: true, cls: "tq" });
    else for (let bi = 0; bi < 2; bi++) {
      const beat = half * 2 + bi, m = beats[beat] || 4;
      out.push({ t0: beat * TPB, subs: m, tps: TPB / m, qt: false,
                 cls: m === 4 ? "" : (m === 3 ? "t3" : "t6") });
    }
  }
  return out;
}
function barTicks(bar) {
  const out = [];
  for (const sp of barSpans(bar))
    for (let i = 0; i < sp.subs; i++) out.push(sp.t0 + i * sp.tps);
  return out;
}

/* ── 畫格子(verbatim 核心) ────────────────────────────── */
function render() {
  const frag = document.createDocumentFragment();
  cells = new Map();
  rowBlocks = [];
  const secAt = {};
  for (const [bar, name] of Object.entries(song.sec_labels || {}))
    secAt[+bar] = name;
  secAtMap = secAt;

  for (let start = 0; start < song.n_bars; start += BARS_PER_ROW) {
    const block = document.createElement("div");
    block.className = "rowblock";
    const scoreDiv = document.createElement("div");
    scoreDiv.className = "rowscore";
    block.appendChild(scoreDiv);

    const row = document.createElement("div");
    row.className = "barrow";
    const labels = document.createElement("div");
    labels.className = "labels";
    labels.innerHTML = '<div class="sp"></div>' + INSTS.map(
      (i) => `<div data-inst="${i.key}" title="點一下清掉這個樂器（勾了循環就只清循環範圍）">` +
             `${i.label}<kbd>${i.hot.toUpperCase()}</kbd></div>`).join("");
    labels.onclick = (e) => {
      const d = e.target.closest("[data-inst]");
      if (d) clearInstrument(d.dataset.inst);
    };
    row.appendChild(labels);
    for (let b = start; b < Math.min(start + BARS_PER_ROW, song.n_bars); b++)
      row.appendChild(makeBar(b, secAt[b]));
    block.appendChild(row);
    frag.appendChild(block);
    rowBlocks.push({ score: scoreDiv, row, start });
  }
  el.grid.replaceChildren(frag);
  setTimeout(renderAllScores, 0);
}

function makeBar(b, secName) {
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.dataset.bar = b;
  const head = document.createElement("div");
  head.className = "barhead";
  head.innerHTML = `<span>${b + 1}</span>` +
    (secName ? `<span class="sec">${secName}</span>` : "");
  head.title = "點一下從這小節開始播放 · 雙擊改段落名稱";
  head.onclick = () => seekToBar(b);
  head.ondblclick = (e) => { e.preventDefault(); renameSection(b); };
  const secEl = head.querySelector(".sec");
  if (secEl) secEl.onclick = (e) => { e.stopPropagation(); renameSection(b); };
  bar.appendChild(head);

  const cellsEl = document.createElement("div");
  cellsEl.className = "cells";
  const spans = barSpans(b);
  for (const inst of INSTS) {
    const r = document.createElement("div");
    r.className = "row";
    for (const sp of spans) {
      const spanW = sp.qt ? 127 : 63;
      const w = (spanW - (sp.subs - 1)) / sp.subs;
      for (let i = 0; i < sp.subs; i++) {
        const tick = sp.t0 + i * sp.tps;
        const c = document.createElement("div");
        c.className = "cell" + (i === 0 ? " beat" : "") + (sp.cls ? " " + sp.cls : "");
        c.style.width = w.toFixed(2) + "px";
        c.style.setProperty("--c", `var(--${inst.key})`);
        const k = `${b}:${tick}:${inst.key}`;
        if (onSet.has(k)) c.classList.add("on");
        c.dataset.k = k; c.dataset.bar = b; c.dataset.tick = tick;
        cells.set(k, c);
        r.appendChild(c);
      }
    }
    cellsEl.appendChild(r);
  }
  bar.appendChild(cellsEl);
  const cur = document.createElement("div");
  cur.className = "cursor";
  cur.hidden = true;
  bar.appendChild(cur);
  return bar;
}

/* ── 譜面對照(verbatim) ───────────────────────────────── */
let scorePending = new Set(), scoreRaf = null;
function touchScore(bar) {
  if (!el.scoreOn?.checked || !window.Vex) return;
  scorePending.add(Math.floor(bar / BARS_PER_ROW));
  if (!scoreRaf) scoreRaf = setTimeout(() => {
    scoreRaf = null;
    const todo = [...scorePending]; scorePending.clear();
    todo.forEach((i) => rowBlocks[i] && renderRowScore(rowBlocks[i]));
  }, 30);
}
function renderAllScores() {
  if (!window.Vex || !song) return;
  const on = el.scoreOn?.checked;
  for (const blk of rowBlocks) {
    blk.score.style.display = on ? "" : "none";
    if (on) renderRowScore(blk);
  }
}
function barVoiceNotes(bar, wantHands) {
  const VF = Vex.Flow;
  const empty = { notes: [], beamRuns: [], tuplets: [] };
  let any = false;
  for (const k of onSet) {
    if (!k.startsWith(bar + ":")) continue;
    if (HANDS.has(k.split(":")[2]) === wantHands) { any = true; break; }
  }
  if (!any) {
    if (!wantHands) return empty;
    return { notes: [new VF.StaveNote({ clef: "percussion", keys: ["c/5"], duration: "wr" })],
             beamRuns: [], tuplets: [] };
  }
  const DUR4 = { 1: "16", 2: "8", 3: "8d", 4: "q" };
  const DUR3 = { 1: "8", 2: "q", 3: "q" };
  const DUR6 = { 1: "16", 2: "8", 3: "8d", 4: "q", 6: "q" };
  const DURQT = { 1: "q", 2: "h", 3: "h" };
  const NOTE_CLEAN = { 3: [3, 2, 1], 4: [4, 3, 2, 1], 6: [6, 4, 3, 2, 1] };
  const REST_CLEAN = { 3: [3, 2, 1], 4: [4, 2, 1], 6: [6, 3, 2, 1] };
  const notes = [], beamRuns = [], tuplets = [];
  for (const sp of barSpans(bar)) {
    const table = sp.qt ? DURQT : (sp.subs === 4 ? DUR4 : (sp.subs === 3 ? DUR3 : DUR6));
    const spanNotes = [];
    const mk = (keys, units, rest) => {
      const base = table[units];
      const n = new VF.StaveNote({
        clef: "percussion",
        keys: rest ? [wantHands ? "c/5" : "f/4"] : keys,
        duration: base + (rest ? "r" : ""),
        stem_direction: wantHands ? 1 : -1,
      });
      if (base.endsWith("d")) { try { n.addDotToAll(); } catch (_) {} }
      spanNotes.push(n);
    };
    const hitSubs = [];
    for (let i = 0; i < sp.subs; i++) {
      const keys = [];
      for (const inst of INSTS) {
        if (HANDS.has(inst.key) !== wantHands) continue;
        if (onSet.has(`${bar}:${sp.t0 + i * sp.tps}:${inst.key}`))
          keys.push(VF_KEYS[inst.key]);
      }
      if (keys.length) hitSubs.push([i, keys]);
    }
    const putRests = (from, n) => {
      let left = n;
      while (left > 0) { const take = REST_CLEAN[sp.subs].find((c) => c <= left); mk(null, take, true); left -= take; }
    };
    if (!hitSubs.length) putRests(0, sp.subs);
    else {
      let cursor = 0;
      for (let k = 0; k < hitSubs.length; k++) {
        const [pos, keys] = hitSubs[k];
        if (pos > cursor) putRests(cursor, pos - cursor);
        const gap = (k + 1 < hitSubs.length ? hitSubs[k + 1][0] : sp.subs) - pos;
        const clean = NOTE_CLEAN[sp.subs].find((c) => c <= gap);
        mk(keys, clean, false);
        cursor = pos + clean;
      }
      if (cursor < sp.subs) putRests(cursor, sp.subs - cursor);
    }
    if ((sp.subs !== 4 || sp.qt) && spanNotes.length > 1) {
      const num = sp.subs, occ = sp.qt ? 2 : (sp.subs === 3 ? 2 : 4);
      try { tuplets.push(new VF.Tuplet(spanNotes, { num_notes: num, notes_occupied: occ, bracketed: true })); } catch (_) {}
    }
    let run = [];
    for (const n of spanNotes) {
      const beamable = !n.isRest() && ["8", "16"].includes(n.getDuration());
      if (beamable) run.push(n);
      else { if (run.length >= 2) beamRuns.push(run); run = []; }
    }
    if (run.length >= 2) beamRuns.push(run);
    notes.push(...spanNotes);
  }
  return { notes, beamRuns, tuplets };
}
function renderRowScore(blk) {
  const VF = Vex.Flow;
  blk.score.innerHTML = "";
  const bars = [...blk.row.querySelectorAll(".bar")];
  if (!bars.length) return;
  const rowRect = blk.row.getBoundingClientRect();
  const W = blk.row.scrollWidth || blk.row.clientWidth;
  const renderer = new VF.Renderer(blk.score, VF.Renderer.Backends.SVG);
  renderer.resize(W, 108);
  const ctx = renderer.getContext();
  ctx.setFillStyle("#c9cdd6");
  ctx.setStrokeStyle("#6f7580");
  bars.forEach((barEl) => {
    const bar = +barEl.dataset.bar;
    const r = barEl.getBoundingClientRect();
    const stave = new VF.Stave(r.left - rowRect.left, 26, r.width);
    stave.setContext(ctx).draw();
    try {
      const vs = [], allBeams = [], allTuplets = [];
      for (const hands of [true, false]) {
        const { notes, beamRuns, tuplets } = barVoiceNotes(bar, hands);
        if (!notes.length) continue;
        const v = new VF.Voice({ num_beats: 4, beat_value: 4 }).setMode(VF.Voice.Mode.SOFT);
        v.addTickables(notes);
        vs.push(v);
        beamRuns.forEach((run) => allBeams.push(new VF.Beam(run)));
        allTuplets.push(...tuplets);
      }
      new VF.Formatter().joinVoices(vs).format(vs, r.width - 24);
      vs.forEach((v) => v.draw(ctx, stave));
      allBeams.forEach((b) => b.setContext(ctx).draw());
      allTuplets.forEach((t) => t.setContext(ctx).draw());
    } catch (e) { console.warn("score bar", bar, e); }
  });
}

/* ── 編輯核心(verbatim) ───────────────────────────────── */
let painting = null;
function refreshCount() { refreshMeta(); }
function applyToggle(k, want) {
  const c = cells.get(k);
  if (!c) return false;
  const has = onSet.has(k);
  if (has === want) return false;
  if (want) { onSet.add(k); c.classList.add("on"); }
  else { onSet.delete(k); c.classList.remove("on"); }
  touchScore(+k.split(":")[0]);
  return true;
}
el.grid.addEventListener("pointerdown", (e) => {
  const c = e.target.closest(".cell");
  if (!c) return;
  e.preventDefault();
  painting = !onSet.has(c.dataset.k);
  const batch = [];
  if (applyToggle(c.dataset.k, painting)) batch.push(c.dataset.k);
  undoStack.push({ want: painting, keys: batch });
  if (batch.length) setDirty(true);
});
el.grid.addEventListener("pointerover", (e) => {
  if (painting === null) return;
  const c = e.target.closest(".cell");
  if (!c) return;
  if (applyToggle(c.dataset.k, painting))
    undoStack[undoStack.length - 1].keys.push(c.dataset.k);
});
window.addEventListener("pointerup", () => {
  if (painting !== null) {
    const last = undoStack[undoStack.length - 1];
    if (last && !last.keys.length) undoStack.pop();
    if (!undoStack.length && !dirty) el.dirty.hidden = true;
    refreshCount();
  }
  painting = null;
});

let hoverPos = null;
let editPos = { bar: 0, tick: 0 };
function targetPos() { return hoverPos || editPos; }
function paintTarget() {
  el.grid.querySelectorAll(".cell.target, .cell.editpos")
    .forEach((c) => c.classList.remove("target", "editpos"));
  const t = targetPos();
  const cls = hoverPos ? "target" : "editpos";
  for (const i of INSTS) {
    const c = cells.get(`${t.bar}:${t.tick}:${i.key}`);
    if (c) c.classList.add(cls);
  }
}
el.grid.addEventListener("pointermove", (e) => {
  const c = e.target.closest(".cell");
  const p = c ? { bar: +c.dataset.bar, tick: +c.dataset.tick } : null;
  if (p && hoverPos && p.bar === hoverPos.bar && p.tick === hoverPos.tick) return;
  hoverPos = p;
  if (p) editPos = p;
  paintTarget();
});
el.grid.addEventListener("pointerleave", () => { hoverPos = null; paintTarget(); });

function hotToggle(instKey) {
  const t = targetPos();
  const k = `${t.bar}:${t.tick}:${instKey}`;
  if (!cells.has(k)) return;
  const want = !onSet.has(k);
  applyToggle(k, want);
  undoStack.push({ want, keys: [k] });
  setDirty(true);
  refreshCount();
  const name = INSTS.find((i) => i.key === instKey).label;
  const idx = barTicks(t.bar).indexOf(t.tick) + 1;
  setStatus(`${want ? "加上" : "刪掉"} ${name} @ 小節 ${t.bar + 1} 第 ${idx} 格`);
}
function moveEdit(delta) {
  let { bar, tick } = editPos;
  let seq = barTicks(bar);
  let idx = seq.indexOf(tick);
  if (idx < 0) idx = 0;
  idx += delta;
  while (idx < 0) {
    if (--bar < 0) { bar = 0; idx = 0; break; }
    seq = barTicks(bar); idx += seq.length;
  }
  while (idx >= seq.length) {
    if (++bar >= song.n_bars) { bar = song.n_bars - 1; seq = barTicks(bar); idx = seq.length - 1; break; }
    idx -= seq.length; seq = barTicks(bar);
  }
  editPos = { bar, tick: seq[idx] };
  hoverPos = null;
  paintTarget();
  const c = cells.get(`${bar}:${seq[idx]}:${INSTS[0].key}`);
  if (c) c.closest(".bar").scrollIntoView({ block: "nearest" });
}

function clearInstrument(instKey) {
  const useLoop = el.loopOn.checked;
  const a = useLoop ? Math.max(1, +el.loopA.value) - 1 : 0;
  const b = useLoop ? Math.max(a, +el.loopB.value) - 1 : song.n_bars - 1;
  const name = INSTS.find((i) => i.key === instKey).label;
  const keys = [...onSet].filter((k) => {
    const [bar, , ins] = k.split(":");
    return ins === instKey && +bar >= a && +bar <= b;
  });
  if (!keys.length) { setStatus(`${name} 在這個範圍內沒有音符`); return; }
  const where = useLoop ? `小節 ${a + 1}–${b + 1}` : "整首";
  if (!confirm(`把${where}的 ${name} 全部刪掉?共 ${keys.length} 個音符。`)) return;
  for (const k of keys) applyToggle(k, false);
  undoStack.push({ want: false, keys });
  setDirty(true);
  refreshCount();
  setStatus(`已刪掉${where} ${keys.length} 個 ${name}(按 Z 可復原)`, "ok");
}

/* 三連音 */
function snapshotBar(bar) {
  return { grid: grids[bar] ? structuredClone(grids[bar]) : null,
           keys: [...onSet].filter((k) => k.startsWith(bar + ":")) };
}
function applyGrid(bar, g, before, label) {
  const isDefault = g.beats.every((m) => m === 4) && !g.qt[0] && !g.qt[1];
  if (isDefault) delete grids[bar]; else grids[bar] = g;
  const newTicks = barTicks(bar);
  const remapped = new Set();
  for (const k of before.keys) {
    const [, t, inst] = k.split(":");
    let best = newTicks[0], bd = 1e9;
    for (const nt of newTicks) { const d = Math.abs(nt - +t); if (d < bd) { bd = d; best = nt; } }
    remapped.add(`${bar}:${best}:${inst}`);
  }
  for (const k of before.keys) onSet.delete(k);
  const newKeys = [...remapped];
  newKeys.forEach((k) => onSet.add(k));
  undoStack.push({ type: "grid", bar, prev: before, newKeys });
  setDirty(true);
  rebuildBar(bar);
  setStatus(label, "ok");
}
function setBeatMode(bar, beat, m) {
  const before = snapshotBar(bar);
  const g = grids[bar] ? structuredClone(grids[bar]) : { beats: [4, 4, 4, 4], qt: [false, false] };
  g.qt[beat >> 1] = false;
  g.beats[beat] = (m !== 4 && g.beats[beat] === m) ? 4 : m;
  const names = { 3: "八分三連音", 6: "六連音", 4: "16 分" };
  applyGrid(bar, g, before, `小節 ${bar + 1} 第 ${beat + 1} 拍 → ${names[g.beats[beat]]}`);
}
function toggleQt(bar, half) {
  const before = snapshotBar(bar);
  const g = grids[bar] ? structuredClone(grids[bar]) : { beats: [4, 4, 4, 4], qt: [false, false] };
  g.qt[half] = !g.qt[half];
  applyGrid(bar, g, before, `小節 ${bar + 1} ${half ? "後" : "前"}半 → ${g.qt[half] ? "四分三連音" : "還原"}`);
}
function rebuildBar(bar) {
  for (const k of [...cells.keys()]) if (k.startsWith(bar + ":")) cells.delete(k);
  const old = el.grid.querySelector(`.bar[data-bar="${bar}"]`);
  if (!old) return;
  old.replaceWith(makeBar(bar, secAtMap[bar]));
  touchScore(bar);
  refreshCount();
  paintTarget();
}

/* 段落 */
function renameSection(bar) {
  const key = String(bar);
  const cur = secAtMap[bar] || "";
  const name = prompt(`小節 ${bar + 1} 的段落名稱(留空=移除)`, cur);
  if (name === null) return;
  const v = name.trim();
  song.sec_labels = song.sec_labels || {};
  song.sections = song.sections || [0];
  if (v) {
    song.sec_labels[key] = v;
    if (!song.sections.includes(bar)) { song.sections.push(bar); song.sections.sort((a, b) => a - b); }
    secAtMap[bar] = v;
  } else {
    delete song.sec_labels[key];
    if (bar !== 0) song.sections = song.sections.filter((x) => x !== bar);
    delete secAtMap[bar];
  }
  rebuildBar(bar);
  setDirty(true);
}

/* 複製/貼上/刪小節/加小節 */
let clipBars = null;
function copyBars() {
  let range;
  if (el.loopOn.checked) {
    const a = Math.max(1, +el.loopA.value) - 1;
    const b = Math.max(a, +el.loopB.value) - 1;
    range = Array.from({ length: b - a + 1 }, (_, i) => a + i);
  } else range = [targetPos().bar];
  clipBars = range.map((b) => ({
    grid: grids[b] ? structuredClone(grids[b]) : null,
    notes: [...onSet].filter((k) => k.startsWith(b + ":"))
      .map((k) => { const [, t, i] = k.split(":"); return [+t, i]; }),
  }));
  setStatus(`已複製 ${range.length} 小節;⌘V 貼到游標處`, "ok");
}
function pasteBars(notesOnly = false) {
  if (!clipBars) { setStatus("剪貼簿是空的 —— 先 ⌘C 複製"); return; }
  const start = targetPos().bar;
  const items = [];
  const gridChangedBars = [];
  clipBars.forEach((cb, idx) => {
    const b = start + idx;
    if (b >= song.n_bars) return;
    items.push({ bar: b, prev: snapshotBar(b) });
    for (const k of [...onSet]) if (k.startsWith(b + ":")) onSet.delete(k);
    if (!notesOnly) {
      const before = JSON.stringify(grids[b] || null);
      if (cb.grid) grids[b] = structuredClone(cb.grid); else delete grids[b];
      if (JSON.stringify(grids[b] || null) !== before) gridChangedBars.push(b + 1);
      for (const [t, inst] of cb.notes) onSet.add(`${b}:${t}:${inst}`);
    } else {
      const seq = barTicks(b);
      for (const [t, inst] of cb.notes) {
        const tick = seq.reduce((p, c) => Math.abs(c - t) < Math.abs(p - t) ? c : p);
        onSet.add(`${b}:${tick}:${inst}`);
      }
    }
  });
  if (!items.length) { setStatus("貼不進去(超出範圍;先＋4 小節)"); return; }
  undoStack.push({ type: "bars", items });
  items.forEach((it) => rebuildBar(it.bar));
  setDirty(true);
  refreshCount();
  let msg = `已貼上 ${items.length} 小節 → 小節 ${start + 1} 起`;
  if (notesOnly) msg += "(只貼音符)";
  else if (gridChangedBars.length)
    msg += ` · ⚠ 小節 ${gridChangedBars.join("、")} 的細分被來源覆蓋(⌘⇧V 可只貼音符)`;
  setStatus(msg + " · Z 可復原", gridChangedBars.length ? "busy" : "ok");
}
function deleteBarsLocal() {
  if (!song) return;
  let from, to;
  if (el.loopOn.checked) {
    from = Math.max(1, +el.loopA.value) - 1;
    to = Math.max(from, +el.loopB.value) - 1;
  } else from = to = targetPos().bar;
  const count = to - from + 1;
  if (count >= song.n_bars) { setStatus("不能整首刪光", "err"); return; }
  if (!confirm(`把小節 ${from + 1}–${to + 1}(${count} 小節)整段刪掉?後面的小節前移。\n(這個操作不能 Z 復原)`)) return;
  const mapbar = (x) => x < from ? x : x - count;
  const ev = new Set();
  for (const k of onSet) {
    const [b, t, i] = k.split(":");
    const bb = +b;
    if (from <= bb && bb <= to) continue;
    ev.add(`${mapbar(bb)}:${t}:${i}`);
  }
  onSet = ev;
  const ng = {};
  for (const [b, g] of Object.entries(grids)) {
    const bb = +b;
    if (from <= bb && bb <= to) continue;
    ng[mapbar(bb)] = g;
  }
  grids = ng;
  song.sections = [...new Set((song.sections || [0])
    .filter((x) => !(from <= x && x <= to)).map(mapbar))].sort((a, b) => a - b);
  if (!song.sections.includes(0)) song.sections.unshift(0);
  const nl = {};
  for (const [k, v] of Object.entries(song.sec_labels || {})) {
    const bb = +k;
    if (from <= bb && bb <= to) continue;
    nl[String(mapbar(bb))] = v;
  }
  song.sec_labels = nl;
  song.n_bars -= count;
  undoStack = [];
  rebuildBeats();
  render();
  setDirty(true);
  setStatus(`已刪 ${count} 小節 · 現在 ${song.n_bars} 小節`, "ok");
}
$("addBarsBtn").onclick = () => {
  if (!song) return;
  song.n_bars += 4;
  undoStack = [];
  rebuildBeats();
  render();
  setDirty(true);
  setStatus(`已加 4 小節 · 現在 ${song.n_bars} 小節`, "ok");
};

function undo() {
  const step = undoStack.pop();
  if (!step) { setStatus("沒有可復原的了"); return; }
  if (step.type === "bars") {
    for (const it of step.items) {
      for (const k of [...onSet]) if (k.startsWith(it.bar + ":")) onSet.delete(k);
      if (it.prev.grid) grids[it.bar] = it.prev.grid; else delete grids[it.bar];
      it.prev.keys.forEach((k) => onSet.add(k));
      rebuildBar(it.bar);
    }
    setDirty(true); refreshCount();
    setStatus(`已復原貼上的 ${step.items.length} 小節`);
    return;
  }
  if (step.type === "grid") {
    for (const k of [...onSet]) if (k.startsWith(step.bar + ":")) onSet.delete(k);
    if (step.prev.grid) grids[step.bar] = step.prev.grid; else delete grids[step.bar];
    step.prev.keys.forEach((k) => onSet.add(k));
    rebuildBar(step.bar);
    setDirty(true);
    setStatus(`已復原小節 ${step.bar + 1} 的細分變更`);
    return;
  }
  for (const k of step.keys) applyToggle(k, !step.want);
  setDirty(true);
  setStatus(`已復原 ${step.keys.length} 格`);
  refreshCount();
}

/* ── 播放/游標/節拍器 ─────────────────────────────────── */
function seekToBar(b) {
  const span = barSpan(b);
  if (span) audio.currentTime = span[0];
}
el.play.onclick = () => audio.paused ? audio.play() : audio.pause();
el.rate.oninput = () => {
  audio.playbackRate = +el.rate.value;
  el.rateOut.textContent = (+el.rate.value) + "×";
};
function lowerBound(arr, x) {
  let lo = 0, hi = arr.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] < x) lo = m + 1; else hi = m; }
  return lo;
}
function scheduleClicks() {
  if (!el.clickOn.checked || audio.paused || !song?.beats?.length) { clickIdx = null; return; }
  ensureCtx();
  if (actx.state === "suspended") actx.resume();
  const B = song.beats, now = audio.currentTime;
  const rate = audio.playbackRate || 1;
  if (clickIdx === null || now < lastClockT - 0.25 ||
      (clickIdx < B.length && B[clickIdx] < now - 1.5)) {
    clickIdx = lowerBound(B, now + 0.005);
  }
  lastClockT = now;
  const horizon = now + 0.3;
  while (clickIdx < B.length && B[clickIdx] <= horizon) {
    const t = B[clickIdx];
    if (t > now - 0.03) {
      const when = actx.currentTime + Math.max(0, (t - now) / rate);
      const accent = clickIdx % 4 === 0;
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = accent ? 1600 : 1000;
      g.gain.setValueAtTime(accent ? 0.3 : 0.22, when);
      g.gain.exponentialRampToValueAtTime(0.001, when + 0.05);
      o.connect(g).connect(actx.destination);
      o.start(when); o.stop(when + 0.06);
    }
    clickIdx++;
  }
}
function markLoop() {
  const on = el.loopOn.checked;
  const a = Math.max(1, +el.loopA.value) - 1;
  const b = Math.max(a, +el.loopB.value) - 1;
  el.grid.querySelectorAll(".bar").forEach((n) => {
    const i = +n.dataset.bar;
    n.classList.toggle("inloop", on && i >= a && i <= b);
  });
}
[el.loopOn, el.loopA, el.loopB].forEach((n) => n.addEventListener("input", markLoop));

function tick() {
  requestAnimationFrame(tick);
  if (!song || !song.beats?.length || !audio.yt) return;
  const t = audio.currentTime;
  el.cur.textContent = fmt(t);
  if (audio.duration && el.tot.textContent === "0:00")
    el.tot.textContent = fmt(audio.duration);
  if (el.loopOn.checked && !audio.paused) {
    const a = Math.max(1, +el.loopA.value) - 1;
    const b = Math.max(a + 1, +el.loopB.value) - 1;
    const s = barSpan(a), e = barSpan(b);
    if (s && e && (t >= e[1] || t < s[0] - 0.5)) audio.currentTime = s[0];
  }
  scheduleClicks();
  const p = posAt(t);
  if (!p) return;
  const bar = el.grid.querySelector(`.bar[data-bar="${p.bar}"]`);
  if (p.bar !== curBar) {
    el.grid.querySelectorAll(".bar.playing").forEach((n) => {
      n.classList.remove("playing");
      const c = n.querySelector(".cursor"); if (c) c.hidden = true;
    });
    if (bar) {
      bar.classList.add("playing");
      if (el.followOn.checked && !audio.paused)
        bar.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
    curBar = p.bar;
    markLoop();
  }
  if (bar) {
    const span = barSpan(p.bar);
    const c = bar.querySelector(".cursor");
    if (span && c) {
      const frac = Math.min(1, Math.max(0, (t - span[0]) / (span[1] - span[0])));
      const w = bar.clientWidth - 8;
      c.hidden = audio.paused && t < span[0];
      c.style.left = `${4 + frac * w}px`;
    }
  }
}

el.scoreOn.onchange = renderAllScores;

/* ── 鍵盤 ─────────────────────────────────────────────── */
window.addEventListener("keydown", (e) => {
  const t = e.target;
  if (t instanceof Element && t.matches("input, select, textarea")) return;
  if (!song) return;
  if ((e.metaKey || e.ctrlKey) && (e.key === "c" || e.key === "C")) { e.preventDefault(); copyBars(); return; }
  if ((e.metaKey || e.ctrlKey) && (e.key === "v" || e.key === "V")) { e.preventDefault(); pasteBars(e.shiftKey); return; }
  if ((e.metaKey || e.ctrlKey) && e.key === "Backspace") { e.preventDefault(); deleteBarsLocal(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (e.key === " ") { e.preventDefault(); el.play.click(); return; }
  if (k === "z") { e.preventDefault(); undo(); return; }
  if (e.code === "Digit3" && e.shiftKey) {
    e.preventDefault();
    const tp = targetPos();
    toggleQt(tp.bar, tp.tick < 24 ? 0 : 1);
    return;
  }
  if (k === "3" || k === "6" || k === "4") {
    e.preventDefault();
    const tp = targetPos();
    setBeatMode(tp.bar, Math.min(3, Math.floor(tp.tick / TPB)), +k);
    return;
  }
  if (HOTKEYS[k]) { e.preventDefault(); hotToggle(HOTKEYS[k]); return; }
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    if (e.shiftKey) {
      const nb = Math.max(0, Math.min(song.n_bars - 1, editPos.bar + dir));
      editPos = { bar: nb, tick: 0 };
      hoverPos = null; paintTarget(); seekToBar(nb);
    } else moveEdit(dir);
  }
});
window.addEventListener("beforeunload", () => { if (dirty) persistNow(); });

/* ── 啟動 ─────────────────────────────────────────────── */
requestAnimationFrame(tick);
refreshPicker();
if (el.picker.value) loadProject(el.picker.value);
setStatus("老師測試版就緒 —— 新增專案貼 YouTube 連結開始", "ok");
