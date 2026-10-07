
const API_BASE = window.MAYA_API_BASE || "http://localhost:8000";

const messages = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const voiceButton = document.createElement("button");
voiceButton.type = "button";
voiceButton.className = "voice-button";
voiceButton.setAttribute("aria-label", "Voice input");
voiceButton.textContent = "🎙";
form.insertBefore(voiceButton, form.lastElementChild);

let conversation = [];
let recognition = null;

function addMessage(text, type) {
  const wrap = document.createElement("div");
  wrap.className = `message ${type === "user" ? "user-message" : "maya-message"}`;
  wrap.innerHTML = `
    <div class="message-avatar">${type === "user" ? "U" : "M"}</div>
    <div>
      <span class="speaker">${type === "user" ? "YOU" : "MAYA"}</span>
      <p>${escapeHtml(text)}</p>
    </div>`;
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

async function sendMessage(text) {
  text = text.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  conversation.push({role:"user", content:text});

  const typing = document.createElement("div");
  typing.className = "message maya-message";
  typing.innerHTML = `<div class="message-avatar">M</div><div><span class="speaker">MAYA</span><p>Thinking…</p></div>`;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message:text, history:conversation.slice(-12)})
    });
    const data = await res.json();
    typing.remove();

    if (!res.ok) throw new Error(data.detail || "Request failed");
    addMessage(data.reply, "maya");
    conversation.push({role:"assistant", content:data.reply});
    if (data.emotion) { updateEmotion(data.emotion); window.mayaSetEmotionV4?.(data.emotion); }
    if (data.memory) showMemoryHint(data.memory);
    speak(data.reply);
  } catch (err) {
    typing.remove();
    addMessage(
      "I'm in local-demo mode right now. Start the backend with your Gemini API key to enable live intelligence.",
      "maya"
    );
    console.error(err);
  }
}

function updateEmotion(emotion) {
  const pill = document.querySelector(".emotion-pill");
  if (pill) pill.textContent = `◌ ${emotion}`;
}

function showMemoryHint(memory) {
  if (!memory) return;
  const facts = document.querySelector(".profile-facts");
  if (!facts) return;
  let item = document.createElement("div");
  item.innerHTML = `<span>Memory</span><b>${escapeHtml(memory)}</b>`;
  facts.appendChild(item);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll(".suggestions button").forEach(btn => {
  btn.addEventListener("click", () => sendMessage(btn.dataset.message));
});

// Browser speech-to-text. No API key required.
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.onresult = e => {
    input.value = e.results[0][0].transcript;
    sendMessage(input.value);
  };
  recognition.onerror = () => updateVoiceButton(false);
  recognition.onend = () => updateVoiceButton(false);
  voiceButton.addEventListener("click", () => {
    updateVoiceButton(true);
    recognition.start();
  });
} else {
  voiceButton.disabled = true;
  voiceButton.title = "Speech recognition is not supported by this browser.";
}

function updateVoiceButton(active) {
  voiceButton.classList.toggle("active", active);
  voiceButton.textContent = active ? "◉" : "🎙";
}

// Browser text-to-speech. No API key required.
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.96;
  utterance.pitch = 1.02;
  speechSynthesis.speak(utterance);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
