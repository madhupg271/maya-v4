
// MAYA V4 — identity, cloud-ready memory, avatar state, presentation mode

const accountBtn = document.getElementById("accountBtn");
const accountModal = document.getElementById("accountModal");
const closeAccount = document.getElementById("closeAccount");
const saveAccount = document.getElementById("saveAccount");
const displayName = document.getElementById("displayName");
const identityQuestion = document.getElementById("identityQuestion");
const memoryUserLabel = document.getElementById("memoryUserLabel");
const memorySyncText = document.getElementById("memorySyncText");
const demoBtn = document.getElementById("demoModeBtn");
const demoOverlay = document.getElementById("demoOverlay");
const closeDemo = document.getElementById("closeDemo");
const demoPrev = document.getElementById("demoPrev");
const demoNext = document.getElementById("demoNext");
const demoSteps = [...document.querySelectorAll(".demo-step")];
const liveEmotion = document.getElementById("liveEmotion");

const PROFILE_KEY = "maya_v4_profile";
const MEMORY_KEY = "maya_v4_memory";

function profile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); }
  catch { return null; }
}
function memories() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || "[]"); }
  catch { return []; }
}
function saveProfile(p) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  if (p.fact) {
    const arr = memories();
    if (!arr.includes(p.fact)) arr.unshift(p.fact);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(arr.slice(0,20)));
  }
  updateIdentityUI();
  if (typeof renderMemories === "function") renderMemories();
}
function updateIdentityUI() {
  const p = profile();
  const name = p?.name || "Guest";
  if (accountBtn) accountBtn.textContent = `${name} · ${p ? "Profile" : "Sign in"}`;
  if (memoryUserLabel) memoryUserLabel.textContent = name;
  if (memorySyncText) memorySyncText.textContent = p ? "Profile memory · local" : "Local session";
}
function openAccount() {
  const p = profile();
  if (p) {
    displayName.value = p.name || "";
    identityQuestion.value = p.fact || "";
  }
  accountModal.classList.add("open");
  accountModal.setAttribute("aria-hidden","false");
}
function closeAccountModal() {
  accountModal.classList.remove("open");
  accountModal.setAttribute("aria-hidden","true");
}
accountBtn?.addEventListener("click", openAccount);
closeAccount?.addEventListener("click", closeAccountModal);
saveAccount?.addEventListener("click", () => {
  const name = displayName.value.trim();
  const fact = identityQuestion.value.trim();
  if (!name) return;
  saveProfile({name, fact});
  closeAccountModal();
});

function renderMemories() {
  const list = document.getElementById("memoryList");
  if (!list) return;
  const arr = memories();
  list.innerHTML = arr.length
    ? arr.map((m,i)=>`<div class="memory-item"><span>MEMORY ${String(i+1).padStart(2,"0")}</span>${escapeHtml(m)}</div>`).join("")
    : `<div class="empty-memory">No memories saved yet.</div>`;
}
document.getElementById("clearMemory")?.addEventListener("click", () => {
  localStorage.removeItem(MEMORY_KEY);
  renderMemories();
});
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
updateIdentityUI();
renderMemories();

// Emotion-aware avatar state.
window.mayaSetEmotionV4 = function(emotion) {
  const normalized = ["Happy","Concerned","Curious","Calm"].includes(emotion) ? emotion : "Calm";
  liveEmotion && (liveEmotion.textContent = normalized.toUpperCase());
  document.querySelectorAll(".maya-orb").forEach(o => o.dataset.emotion = normalized);
  document.querySelectorAll(".profile-orb").forEach(o => o.dataset.emotion = normalized);
};

// Demo mode
let demoIndex = 0;
function showDemo(i) {
  demoIndex = Math.max(0, Math.min(demoSteps.length-1, i));
  demoSteps.forEach((s,idx) => s.classList.toggle("active", idx === demoIndex));
  if (demoPrev) demoPrev.disabled = demoIndex === 0;
  if (demoNext) demoNext.textContent = demoIndex === demoSteps.length-1 ? "Finish ✓" : "Next →";
}
function openDemo() {
  demoOverlay.classList.add("open");
  demoOverlay.setAttribute("aria-hidden","false");
  showDemo(0);
}
function endDemo() {
  demoOverlay.classList.remove("open");
  demoOverlay.setAttribute("aria-hidden","true");
}
demoBtn?.addEventListener("click", openDemo);
closeDemo?.addEventListener("click", endDemo);
demoPrev?.addEventListener("click", () => showDemo(demoIndex-1));
demoNext?.addEventListener("click", () => demoIndex === demoSteps.length-1 ? endDemo() : showDemo(demoIndex+1));
document.addEventListener("keydown", e => {
  if (!demoOverlay.classList.contains("open")) return;
  if (e.key === "ArrowRight") demoNext.click();
  if (e.key === "ArrowLeft") demoPrev.click();
  if (e.key === "Escape") endDemo();
});

// Keyboard shortcut: M opens memory.
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "m" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
    document.getElementById("memoryBtn")?.click();
  }
});
