
// MAYA V3 Experience Layer
const memoryDrawer = document.getElementById("memoryDrawer");
const memoryBtn = document.getElementById("memoryBtn");
const closeMemory = document.getElementById("closeMemory");
const clearMemory = document.getElementById("clearMemory");
const memoryList = document.getElementById("memoryList");
const revealModal = document.getElementById("revealModal");
const revealBtn = document.getElementById("revealBtn");
const closeReveal = document.getElementById("closeReveal");
const mayaOrb = document.getElementById("mayaOrb");
const profileOrb = document.getElementById("profileOrb");
const emotionPill = document.querySelector(".emotion-pill");

const KEY = "maya_v3_memories";

function getMemories() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
function saveMemory(text) {
  if (!text) return;
  const arr = getMemories();
  if (!arr.includes(text)) {
    arr.unshift(text);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 12)));
  }
  renderMemories();
}
function renderMemories() {
  const arr = getMemories();
  memoryList.innerHTML = arr.length
    ? arr.map((m,i)=>`<div class="memory-item"><span>MEMORY ${String(i+1).padStart(2,"0")}</span>${escapeHtml(m)}</div>`).join("")
    : `<div class="empty-memory">No memories saved in this browser yet.</div>`;
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function openDrawer() {
  renderMemories(); memoryDrawer.classList.add("open"); memoryDrawer.setAttribute("aria-hidden","false");
}
function closeDrawer() {
  memoryDrawer.classList.remove("open"); memoryDrawer.setAttribute("aria-hidden","true");
}
memoryBtn?.addEventListener("click", openDrawer);
closeMemory?.addEventListener("click", closeDrawer);
clearMemory?.addEventListener("click", () => {
  localStorage.removeItem(KEY); renderMemories();
});

// Demo memory extraction for the V3 browser-only layer.
document.getElementById("chatForm")?.addEventListener("submit", () => {
  setTimeout(() => {
    const input = document.getElementById("chatInput");
    const value = input?.value?.trim() || "";
    const m = value.match(/(?:my name is|i am|i'm)\s+([a-z][a-z .'-]{1,40})/i);
    if (m) saveMemory(`User identity: ${m[1].trim()}`);
  }, 30);
});

// Emotion visual feedback from the assistant message.
function setEmotionVisual(emotion) {
  if (!mayaOrb) return;
  mayaOrb.dataset.emotion = emotion;
  if (emotionPill) emotionPill.textContent = `◌ ${emotion}`;
}
window.mayaSetEmotion = setEmotionVisual;

revealBtn?.addEventListener("click", () => {
  revealModal.classList.add("open"); revealModal.setAttribute("aria-hidden","false");
});
closeReveal?.addEventListener("click", () => {
  revealModal.classList.remove("open"); revealModal.setAttribute("aria-hidden","true");
});
revealModal?.addEventListener("click", e => {
  if (e.target === revealModal) closeReveal.click();
});

renderMemories();
