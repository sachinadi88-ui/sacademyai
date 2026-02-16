function showLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
}

async function generateText() {

  const prompt = document.getElementById("prompt").value;
  showLoader(true);

  const res = await fetch("/api/text", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  showLoader(false);

  const text =
    data?.choices?.[0]?.message?.content || "No response";

  document.getElementById("result").innerHTML = `
    <p>${text}</p>
    <button onclick="downloadText()">Download</button>
  `;
}

async function generateImage() {

  const prompt = document.getElementById("prompt").value;
  showLoader(true);

  const res = await fetch("/api/image", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  showLoader(false);

  const url = data?.data?.[0]?.url || data?.url;

  document.getElementById("result").innerHTML = `
    <img src="${url}">
    <a href="${url}" download>
      <button>Download</button>
    </a>
  `;
}

async function generateVideo() {

  const prompt = document.getElementById("prompt").value;
  showLoader(true);

  const res = await fetch("/api/video", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  showLoader(false);

  const url = data?.data?.[0]?.url || data?.url;

  document.getElementById("result").innerHTML = `
    <video src="${url}" controls></video>
    <a href="${url}" download>
      <button>Download</button>
    </a>
  `;
}

function downloadText() {
  const text = document.getElementById("result").innerText;
  const blob = new Blob([text], {type: "text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ai-text.txt";
  a.click();
}
