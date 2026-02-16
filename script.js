const chat = document.getElementById("chat");

loadHistory();

function detectType(prompt) {

  const text = prompt.toLowerCase();

  if (text.includes("image") || text.includes("draw") || text.includes("picture"))
    return "image";

  if (text.includes("video") || text.includes("animation") || text.includes("movie"))
    return "video";

  return "text";
}

function addMessage(content, type) {

  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerHTML = content;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  saveHistory();
}

async function sendPrompt() {

  const input = document.getElementById("prompt");
  const prompt = input.value;

  if (!prompt) return;

  addMessage(prompt, "user");

  input.value = "";

  const mode = detectType(prompt);

  if (mode === "text") generateText(prompt);
  if (mode === "image") generateImage(prompt);
  if (mode === "video") generateVideo(prompt);
}

async function generateText(prompt) {

  const botDiv = createBotMessage();

  const res = await fetch("/api/text", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  const text =
    data?.choices?.[0]?.message?.content || "No response";

  typeEffect(botDiv, text);
}

async function generateImage(prompt) {

  const botDiv = createBotMessage("Generating image...");

  const res = await fetch("/api/image", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  const url = data?.data?.[0]?.url || data?.url;

  botDiv.innerHTML = `
    <img src="${url}">
    <br>
    <a href="${url}" download>Download</a>
  `;

  saveHistory();
}

async function generateVideo(prompt) {

  const botDiv = createBotMessage("Generating video...");

  const res = await fetch("/api/video", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  const url = data?.data?.[0]?.url || data?.url;

  botDiv.innerHTML = `
    <video src="${url}" controls></video>
    <br>
    <a href="${url}" download>Download</a>
  `;

  saveHistory();
}

function createBotMessage(text = "") {

  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

function typeEffect(element, text) {

  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, 15);
    } else {
      saveHistory();
    }
  }

  typing();
}

function saveHistory() {
  localStorage.setItem("chatHistory", chat.innerHTML);
}

function loadHistory() {
  const history = localStorage.getItem("chatHistory");
  if (history) chat.innerHTML = history;
}
