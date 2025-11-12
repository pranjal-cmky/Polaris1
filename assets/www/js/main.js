// Polaris Browser — main.js
console.log("🚀 Polaris loaded");

// === DOM references ===
const input = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const tabs = document.querySelectorAll(".tab");

let currentMode = "all"; // web / images / news / shopping

// === Event listeners ===
searchBtn.addEventListener("click", handleSearch);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentMode = tab.dataset.mode;
    handleSearch();
  });
});

// === Main search handler ===
async function handleSearch() {
  const query = input.value.trim();
  if (!query) return;

  results.innerHTML = `<p>🔎 Searching ${currentMode} for "<b>${query}</b>"...</p>`;

  try {
    let url;
    if (currentMode === "shopping") {
      url = `${FN}/shopping?q=${encodeURIComponent(query)}`;
    } else if (currentMode === "images") {
      url = `${FN}/search?q=${encodeURIComponent(query)}&mode=images`;
    } else if (currentMode === "news") {
      // You can plug in a news API later
      url = `${FN}/instant?q=${encodeURIComponent(query)}`;
    } else {
      url = `${FN}/search?q=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      results.innerHTML = `<p style="color:red;">⚠️ ${data.error}</p>`;
      return;
    }

    // Display based on mode
    if (currentMode === "shopping") {
      renderShopping(data.results);
    } else if (currentMode === "images") {
      renderImages(data.results);
    } else if (currentMode === "news") {
      renderInstant(data);
    } else {
      renderWeb(data.results);
    }
  } catch (err) {
    console.error(err);
    results.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
  }
}

// === Renderers ===
function renderWeb(list = []) {
  if (!list || list.length === 0) {
    results.innerHTML = `<p>No results found.</p>`;
    return;
  }
  results.innerHTML = list
    .map(
      (r) => `
      <div class="result-item">
        <a href="${r.link}" target="_blank">${r.title}</a>
        <p>${r.snippet || ""}</p>
        <small>${r.displayLink || ""}</small>
      </div>`
    )
    .join("");
}

function renderImages(list = []) {
  if (!list || list.length === 0) {
    results.innerHTML = `<p>No images found.</p>`;
    return;
  }
  results.innerHTML = `
    <div class="image-grid">
      ${list
        .map(
          (img) => `
        <a href="${img.link}" target="_blank">
          <img src="${img.link}" alt="image result" loading="lazy" />
        </a>`
        )
        .join("")}
    </div>`;
}

function renderInstant(data) {
  if (!data || !data.description) {
    results.innerHTML = `<p>No instant result found.</p>`;
    return;
  }
  results.innerHTML = `
    <div class="instant">
      ${data.thumbnail ? `<img src="${data.thumbnail}" alt="thumb" />` : ""}
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      ${data.url ? `<a href="${data.url}" target="_blank">Read more →</a>` : ""}
    </div>`;
}

function renderShopping(list = []) {
  if (!list || list.length === 0) {
    results.innerHTML = `<p>No shopping results.</p>`;
    return;
  }
  results.innerHTML = `
    <div class="shop-grid">
      ${list
        .map(
          (r) => `
        <div class="shop-item">
          <img src="${r.thumbnail}" alt="${r.title}" />
          <h4>${r.title}</h4>
          <p><b>$${r.price || "?"}</b> — ${r.source || ""}</p>
          ${r.rating ? `<small>⭐ ${r.rating}</small>` : ""}
          <a href="${r.link}" target="_blank">View</a>
        </div>`
        )
        .join("")}
    </div>`;
}

// === Add grid styling dynamically (if not in CSS) ===
const style = document.createElement("style");
style.textContent = `
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }
  .image-grid img {
    width: 100%;
    border-radius: 8px;
  }
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
  }
  .shop-item {
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 10px;
    text-align: left;
  }
  .shop-item img {
    width: 100%;
    border-radius: 8px;
  }
  .instant img {
    width: 80px;
    border-radius: 10px;
  }
`;
document.head.appendChild(style);