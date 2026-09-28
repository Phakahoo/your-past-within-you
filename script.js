"use strict";

/* =====================================================
   1. CONTENT — edit questions, text, paths, station message
   ===================================================== */
const AUDIO_PATHS = {
  ambient: "assets/audio/ambient.mp3",
  select: "assets/audio/select.mp3",
  reveal: "assets/audio/reveal.mp3"
};
const AUDIO_VOLUME = { ambient: 0.12, select: 0.4, reveal: 0.5 }; // ambient 0.08–0.15 recommended

/* Costume station message (shown by FIND YOUR COSTUME) */
const STATION = {
  eyebrow: "YOUR COSTUME AWAITS YOU",
  en: "Please show this screen to the event staff at the costume station.",
  th: "แสดงหน้านี้แก่ทีมงาน<br>ที่จุดรับชุดในงาน",
  close: "CLOSE ×"
};

const CLOSING_LINE = "วันนี้ ลองสวมบทบาท<br>ของตัวตนที่ซ่อนอยู่ในตัวคุณ";

/* =====================================================
   2. SCORING — s(ROYAL, SABAI, VILLAGE, LOCAL)
   ===================================================== */
const IDS = ["ROYAL", "SABAI", "VILLAGE", "LOCAL"]; // also the final tie-break order
const WEIGHTS = [1, 1, 1, 1.2];                     // per-question weight (Q4 = 1.2)
const s = (r, sb, v, l) => ({ ROYAL: r, SABAI: sb, VILLAGE: v, LOCAL: l });

const questions = [
  { category: "THE FIRST IMPRESSION",
    question: "คุณเดินเข้าไปในสถานที่แห่งหนึ่งที่ไม่เคยมาเยือนมาก่อน รอบตัวเต็มไปด้วยผู้คนและเรื่องราวที่คุณไม่รู้จัก สิ่งแรกที่คุณทำคืออะไร?",
    answers: [
      { id: "A", text: "สังเกตผู้คนและบรรยากาศรอบตัว", scores: s(4, 1, 2, 0) },
      { id: "B", text: "มองหาคนที่รู้จักสถานที่นี้ดี", scores: s(2, 4, 0, 1) },
      { id: "C", text: "เดินเข้าไปสำรวจด้วยตัวเองทันที", scores: s(0, 2, 4, 1) },
      { id: "D", text: "มองหาสิ่งที่บอกเล่าความเป็นมาของสถานที่", scores: s(1, 0, 2, 4) } ] },
  { category: "THE MEMORY",
    question: "มีคนมอบของเก่าชิ้นหนึ่งให้คุณ พร้อมบอกว่า “ของชิ้นนี้มีเรื่องราวของคนรุ่นก่อนซ่อนอยู่” คุณจะทำอย่างไร?",
    answers: [
      { id: "A", text: "ค้นหาว่ามันเคยเป็นของใคร", scores: s(4, 2, 0, 1) },
      { id: "B", text: "อยากรู้เรื่องราวของเจ้าของเดิม", scores: s(1, 4, 2, 0) },
      { id: "C", text: "ถามคนในครอบครัวหรือชุมชน", scores: s(0, 1, 4, 2) },
      { id: "D", text: "ศึกษาวิธีทำและรายละเอียดของสิ่งของ", scores: s(2, 0, 1, 4) } ] },
  { category: "THE INSTINCT",
    question: "ระหว่างงานสำคัญ เกิดเหตุการณ์ไม่คาดคิดขึ้นอย่างกะทันหัน คุณจะทำอะไรเป็นอย่างแรก?",
    answers: [
      { id: "A", text: "ตั้งสติและมองภาพรวม", scores: s(4, 0, 2, 1) },
      { id: "B", text: "เข้าไปช่วยคนที่กำลังลำบาก", scores: s(2, 1, 0, 4) },
      { id: "C", text: "เข้าไปจัดการปัญหาทันที", scores: s(1, 4, 2, 0) },
      { id: "D", text: "หาต้นเหตุแล้วแก้ด้วยสิ่งที่มี", scores: s(0, 2, 4, 1) } ] },
  { category: "THE LEGACY",
    question: "หากเรื่องราวของคุณถูกเล่าต่อไปยังคนรุ่นหลัง คุณอยากให้พวกเขาจดจำคุณในเรื่องใดมากที่สุด?",
    answers: [
      { id: "A", text: "คนที่ทำทุกอย่างอย่างประณีตและรู้ว่าตัวเองกำลังทำอะไร", scores: s(4, 1, 0, 2) },
      { id: "B", text: "คนที่ทำให้คนรอบตัวรู้สึกอบอุ่นและได้รับการเข้าใจ", scores: s(0, 4, 2, 1) },
      { id: "C", text: "คนธรรมดาที่พร้อมยืนหยัดเพื่อสิ่งที่รักจนถึงที่สุด", scores: s(2, 0, 4, 1) },
      { id: "D", text: "คนที่ไม่เคยลืมว่าตัวเองมาจากไหน", scores: s(1, 2, 0, 4) } ] }
];

/* =====================================================
   3. CHARACTER DATA — names, images, palettes, accent colors
   ===================================================== */
const characters = {
  ROYAL: { name: "ผู้ดีแห่งสยาม", title: "THE REFINED SOUL", traits: ["REFINED", "OBSERVANT", "ELEGANT"],
    description: "คุณเป็นคนที่มองเห็นรายละเอียด<br>ให้คุณค่ากับความประณีต<br>และรู้ว่าตัวเองกำลังมุ่งหน้าไปทางไหน",
    costume: "ชุดสยามในแบบ ร.5", mood: "Refined / Elegant / Sophisticated", accent: "#6E3030",
    palette: [["Burgundy", "#6E3030"], ["Cream", "#EFE4CF"], ["Brown", "#5B4232"]],
    image: "assets/characters/royal.webp", costumeImage: "assets/costumes/royal.webp" },
  SABAI: { name: "นางแห่งเรือนสยาม", title: "THE GRACEFUL SOUL", traits: ["GRACEFUL", "EMPATHETIC", "SENSITIVE"],
    description: "คุณเป็นคนละเอียดอ่อน<br>รับรู้ความรู้สึกของคนรอบตัวได้ดี<br>และมีเสน่ห์จากสิ่งเล็ก ๆ ที่คุณทำ",
    costume: "ชุดสไบ", mood: "Graceful / Soft / Romantic", accent: "#B98A8F",
    palette: [["Dusty Rose", "#B98A8F"], ["Cream", "#EFE4CF"], ["Muted Gold", "#B59A5B"]],
    image: "assets/characters/sabai.webp", costumeImage: "assets/costumes/sabai.webp" },
  VILLAGE: { name: "นักสู้แห่งบางระจัน", title: "THE FEARLESS SOUL", traits: ["FEARLESS", "LOYAL", "RESILIENT"],
    description: "คุณเป็นคนที่พร้อมยืนหยัดเพื่อสิ่งที่รัก<br>ไม่กลัวอุปสรรค<br>และพร้อมปกป้องคนที่มีความหมายสำหรับคุณ",
    costume: "ชุดชาวบ้าน", mood: "Raw / Strong / Fearless", accent: "#3F5378",
    palette: [["Indigo", "#2F3E5C"], ["Brown", "#5B4232"], ["Dark Red", "#6B2222"]],
    image: "assets/characters/village.webp", costumeImage: "assets/costumes/village.webp" },
  LOCAL: { name: "ลูกหลานแห่งถิ่น", title: "THE ROOTED SOUL", traits: ["AUTHENTIC", "ROOTED", "INDIVIDUAL"],
    description: "คุณรู้ว่าตัวเองมาจากไหน<br>ภูมิใจกับรากของตัวเอง<br>และไม่กลัวที่จะเป็นตัวของตัวเอง",
    costume: "ชุดพื้นถิ่น", mood: "Organic / Rooted / Authentic", accent: "#A65D3F",
    palette: [["Terracotta", "#A65D3F"], ["Olive", "#73725D"], ["Natural Beige", "#C9BDA8"]],
    image: "assets/characters/local.webp", costumeImage: "assets/costumes/local.webp" }
};

/* =====================================================
   4. STATE
   ===================================================== */
const state = { index: 0, perQuestion: [], locked: false, run: 0, muted: false, observer: null, lastFocus: null };
const SCREENS = ["landing-screen", "intro-screen", "quiz-screen", "analysis-screen", "result-screen"];

/* =====================================================
   5. AUDIO — every call is guarded; missing files never break the page
   ===================================================== */
const sounds = {};
function getSound(name) {
  try {
    if (!sounds[name]) {
      const a = new Audio(AUDIO_PATHS[name]);
      a.preload = "auto"; a.volume = AUDIO_VOLUME[name];
      if (name === "ambient") a.loop = true;
      a.addEventListener("error", () => {}, { once: true });
      sounds[name] = a;
    }
    return sounds[name];
  } catch (e) { return null; }
}
function playSound(name) {
  if (state.muted) return;
  try {
    const a = getSound(name); if (!a) return;
    if (name !== "ambient") a.currentTime = 0;
    const p = a.play(); if (p && p.catch) p.catch(() => {});
  } catch (e) {}
}
function startAmbient() { playSound("ambient"); }
function setMuted(m) {
  state.muted = m;
  try { sessionStorage.setItem("muted", m ? "1" : "0"); } catch (e) {}
  try {
    const a = sounds.ambient;
    if (a) { if (m) a.pause(); else { const p = a.play(); if (p && p.catch) p.catch(() => {}); } }
  } catch (e) {}
  const b = $("sound-btn");
  b.textContent = m ? "SOUND OFF" : "♪ SOUND ON";
  b.setAttribute("aria-pressed", String(!m));
  b.setAttribute("aria-label", m ? "Sound off. Tap to turn on." : "Sound on. Tap to mute.");
}

/* =====================================================
   6. HELPERS
   ===================================================== */
const $ = (id) => document.getElementById(id);
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion() ? Math.min(ms, 120) : ms));
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pad = (n) => String(n).padStart(2, "0");

function figure(src, label, alt, extra = "") {
  return `<div class="figure ph" data-ph="${esc(label)}" ${extra}><img src="${src}" alt="${esc(alt)}" loading="lazy" onload="this.parentNode.classList.remove('ph')" onerror="this.remove()"></div>`;
}

/* =====================================================
   7. SCREEN FLOW
   ===================================================== */
async function showScreen(id) {
  const tok = state.run;
  const cur = SCREENS.find((s) => !$(s).hidden);
  if (cur && cur !== id) {
    $(cur).classList.add("leaving");
    await wait(450);
    if (tok !== state.run) return;
    $(cur).classList.remove("leaving");
  }
  SCREENS.forEach((s) => { $(s).hidden = s !== id; });
  window.scrollTo(0, 0);
  const f = $(id).querySelector("[data-focus]");
  if (f) f.focus({ preventScroll: true });
}

function startExperience() { startAmbient(); showScreen("intro-screen"); }

function restartQuiz() {
  state.run++;                       // cancels any pending timers/sequences
  if (state.observer) { state.observer.disconnect(); state.observer = null; }
  state.index = 0; state.perQuestion = []; state.locked = false;
  closeModal(true);
  $("result-screen").innerHTML = "";
  showScreen("landing-screen");
}

/* =====================================================
   8. QUIZ
   ===================================================== */
function beginQuiz() {
  state.index = 0; state.perQuestion = []; state.locked = false;
  const tok = state.run;
  showScreen("quiz-screen").then(() => { if (tok === state.run) renderQuestion(true); });
}

function renderQuestion(first = false) {
  const q = questions[state.index], n = state.index + 1;
  $("q-count").textContent = `${pad(n)} / ${pad(questions.length)}`;
  $("bar-fill").style.width = `${(state.index / questions.length) * 100}%`;
  const bar = $("bar");
  bar.setAttribute("aria-valuenow", state.index);
  bar.setAttribute("aria-valuetext", `Question ${n} of ${questions.length}`);
  $("q-cat").textContent = q.category;
  $("q-text").textContent = q.question;
  const list = $("q-answers");
  list.className = "answers";
  list.innerHTML = q.answers.map((a, i) =>
    `<button type="button" class="card" data-i="${i}" aria-label="${a.id}. ${esc(a.text)}"><span class="k" aria-hidden="true">${a.id}</span><span>${esc(a.text)}</span></button>`).join("");
  const box = $("q-box");
  box.classList.remove("out", "in"); void box.offsetWidth; box.classList.add("in");
  state.locked = false;
  $("q-text").focus({ preventScroll: true });
}

async function selectAnswer(i) {
  if (state.locked || $("quiz-screen").hidden) return;
  state.locked = true;
  const tok = state.run;
  const answer = questions[state.index].answers[i];
  const list = $("q-answers");
  list.classList.add("locked");
  list.children[i].classList.add("selected");
  playSound("select");
  updateScore(state.index, answer);
  await wait(650);
  if (tok !== state.run) return;
  $("bar-fill").style.width = `${((state.index + 1) / questions.length) * 100}%`;
  $("q-box").classList.add("out");
  await wait(350);
  if (tok !== state.run) return;
  if (state.index < questions.length - 1) { state.index++; renderQuestion(); }
  else showAnalysis();
}

/* Stores each question's weighted contribution (kept in memory only) */
function updateScore(qIndex, answer) {
  const c = {};
  IDS.forEach((id) => { c[id] = answer.scores[id] * WEIGHTS[qIndex]; });
  state.perQuestion[qIndex] = c;
}

/* Highest total wins. Ties: Q4 → Q3 → Q2 → Q1 → fixed IDS order. Fully deterministic. */
function calculateResult() {
  const total = (id) => state.perQuestion.reduce((sum, q) => sum + q[id], 0);
  const same = (a, b) => Math.abs(a - b) < 1e-9;
  const top = Math.max(...IDS.map(total));
  let tied = IDS.filter((id) => same(total(id), top));
  for (let q = state.perQuestion.length - 1; q >= 0 && tied.length > 1; q--) {
    const best = Math.max(...tied.map((id) => state.perQuestion[q][id]));
    tied = tied.filter((id) => same(state.perQuestion[q][id], best));
  }
  return tied[0];
}

/* =====================================================
   9. ANALYSIS — title-sequence style
   ===================================================== */
async function showAnalysis() {
  const tok = state.run;
  await showScreen("analysis-screen");
  if (tok !== state.run) return;
  const box = $("analysis-steps");
  const add = (t, cls = "") => { const p = document.createElement("p"); p.className = `line ${cls}`; p.textContent = t; box.appendChild(p); };
  const step = async (fn, ms) => { if (tok !== state.run) return false; box.innerHTML = ""; fn(); await wait(ms); return tok === state.run; };
  if (!await step(() => add("ANALYZING", "small"), 1200)) return;
  if (!await step(() => add("YOUR ANSWERS"), 800)) return;
  if (!await step(() => { add("YOUR ANSWERS"); add("↓", "small"); add("YOUR INSTINCTS"); }, 900)) return;
  if (!await step(() => { add("YOUR INSTINCTS"); add("↓", "small"); add("YOUR IDENTITY"); }, 1000)) return;
  if (!await step(() => { add("SOMETHING FROM THE PAST", "big"); add("IS STILL WITHIN YOU.", "big"); }, 2200)) return;
  showResult(calculateResult());
}

/* =====================================================
   10. RESULT — identity reveal, then costume reveal
   ===================================================== */
function showResult(id) {
  const c = characters[id];
  const el = $("result-screen");
  el.dataset.id = id;
  el.style.setProperty("--accent", c.accent);
  el.innerHTML = `
    <div class="identity">
      <p class="meta">YOUR IDENTITY</p>
      ${figure(c.image, c.name, `${c.name} — ${c.title}`)}
      <div class="r-text">
        <h1 class="display r-name" data-focus tabindex="-1">${esc(c.name)}</h1>
        <p class="r-en">${esc(c.title)}</p>
        <div class="r-traits">${c.traits.map((t, i) => `<span style="--i:${i}">${esc(t)}</span>`).join("")}</div>
        <p class="r-desc">${c.description}</p>
      </div>
      <p class="meta scroll-cue" aria-hidden="true">↓</p>
    </div>
    <div class="costume">
      <p class="meta rv" data-reveal>YOUR COSTUME</p>
      ${figure(c.costumeImage, c.costume, `${c.costume} — costume for ${c.name}`, "data-reveal")}
      <h2 class="c-name rv" data-reveal style="--d:1.6s">${esc(c.costume)}</h2>
      <p class="c-mood rv" data-reveal style="--d:2.1s">${esc(c.mood)}</p>
      <div class="swatches rv" data-reveal style="--d:2.6s" aria-label="Color palette">${c.palette.map(([n, h]) => `<span class="sw"><i style="background:${h}"></i>${esc(n)}</span>`).join("")}</div>
      <div class="rule rv" data-reveal style="--d:3s" aria-hidden="true"></div>
      <p class="closing rv" data-reveal style="--d:3.2s">${CLOSING_LINE}</p>
      <div class="actions rv" data-reveal style="--d:3.8s">
        <button type="button" class="btn" data-action="find">FIND YOUR COSTUME →</button>
        <button type="button" class="btn ghost" data-action="restart">START AGAIN</button>
      </div>
    </div>`;
  showScreen("result-screen");
  playSound("reveal");
  observeReveals(el);
}

function observeReveals(root) {
  const items = root.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) { items.forEach((n) => n.classList.add("in")); return; }
  state.observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); state.observer.unobserve(e.target); } });
  }, { threshold: 0.25 });
  items.forEach((n) => state.observer.observe(n));
}

/* =====================================================
   11. COSTUME MODAL
   ===================================================== */
function openModal() {
  const c = characters[$("result-screen").dataset.id];
  if (!c) return;
  state.lastFocus = document.activeElement;
  const m = $("modal");
  m.innerHTML = `
    <p class="meta" id="modal-title">${esc(STATION.eyebrow)}</p>
    <h2 class="m-name">${esc(c.name)}</h2>
    <p class="m-name" style="font-size:1.1rem">${esc(c.costume)}</p>
    <p style="max-width:26em;color:var(--beige);font-size:.95rem">${esc(STATION.en)}</p>
    <p class="th">${STATION.th}</p>
    <button type="button" class="close" data-action="close">${esc(STATION.close)}</button>`;
  m.hidden = false;
  m.querySelector(".close").focus();
}
function closeModal(silent = false) {
  const m = $("modal");
  if (m.hidden) return;
  m.hidden = true; m.innerHTML = "";
  if (!silent && state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
}

/* =====================================================
   12. EVENTS
   ===================================================== */
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) return selectAnswer(Number(card.dataset.i));
  if (e.target.closest("#sound-btn")) return setMuted(!state.muted);
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  switch (btn.dataset.action) {
    case "start": startExperience(); break;
    case "journey": beginQuiz(); break;
    case "find": openModal(); break;
    case "close": closeModal(); break;
    case "restart": restartQuiz(); break;
  }
});

/* =====================================================
   13. ACCESSIBILITY — keyboard: A–D / 1–4, Esc closes modal
   ===================================================== */
document.addEventListener("keydown", (e) => {
  if (!$("modal").hidden) {
    if (e.key === "Escape") closeModal();
    else if (e.key === "Tab") e.preventDefault(); // single focusable control: keep focus inside
    return;
  }
  if ($("quiz-screen").hidden || e.metaKey || e.ctrlKey || e.altKey) return;
  const map = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
  const i = map[e.key.toLowerCase()];
  if (i !== undefined) selectAnswer(i);
});

/* Init: restore this session's mute preference */
try { setMuted(sessionStorage.getItem("muted") === "1"); } catch (e) { setMuted(false); }