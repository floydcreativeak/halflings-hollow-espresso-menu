/* =========================================================
   Brew — Coffee Shop Menu
   Easy customization: edit the DRINKS array below.
   Each drink:
     id, name, category ('hot' | 'cold'), price, description
     sizes:   [{ label, oz }]
     options: [{ label, layer? }]  // layer optionally adds a band to the cup
     layers:  [{ label, color, ratio }]  // bottom -> top, ratios are % of cup height
   ========================================================= */

const DRINKS = [
  {
    id: "espresso",
    name: "Espresso",
    category: "hot",
    price: 3.0,
    description: "A concentrated shot pulled to a rich golden crema.",
    sizes: [{ label: "Single", oz: 1 }, { label: "Double", oz: 2 }],
    options: [
      { label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } },
      { label: "Ristretto" },
      { label: "Sugar" },
    ],
    layers: [
      { label: "Espresso", color: "#4b2e1e", ratio: 26 },
      { label: "Crema", color: "#b5793f", ratio: 8 },
    ],
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "hot",
    price: 4.25,
    description: "Equal parts espresso, steamed milk and a deep cap of airy foam.",
    sizes: [{ label: "S", oz: 8 }, { label: "M", oz: 12 }, { label: "L", oz: 16 }],
    options: [
      { label: "Oat milk" },
      { label: "Almond milk" },
      { label: "Extra foam", layer: { label: "Extra foam", color: "#faf4e6", ratio: 8 } },
      { label: "Cinnamon" },
    ],
    layers: [
      { label: "Espresso", color: "#4b2e1e", ratio: 18 },
      { label: "Steamed milk", color: "#efe1c4", ratio: 24 },
      { label: "Foam", color: "#faf3e3", ratio: 20 },
    ],
  },
  {
    id: "latte",
    name: "Caffè Latte",
    category: "hot",
    price: 4.5,
    description: "Smooth espresso with plenty of steamed milk and a thin foam crown.",
    sizes: [{ label: "S", oz: 8 }, { label: "M", oz: 12 }, { label: "L", oz: 16 }],
    options: [
      { label: "Oat milk" },
      { label: "Vanilla" },
      { label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } },
      { label: "Sugar-free" },
    ],
    layers: [
      { label: "Espresso", color: "#4b2e1e", ratio: 16 },
      { label: "Steamed milk", color: "#f1e6cf", ratio: 40 },
      { label: "Foam", color: "#faf3e3", ratio: 8 },
    ],
  },
  {
    id: "mocha",
    name: "Caffè Mocha",
    category: "hot",
    price: 4.95,
    description: "Espresso and steamed milk swirled with rich chocolate.",
    sizes: [{ label: "S", oz: 8 }, { label: "M", oz: 12 }, { label: "L", oz: 16 }],
    options: [
      { label: "Whipped cream", layer: { label: "Whip", color: "#fbf6ec", ratio: 12 } },
      { label: "Oat milk" },
      { label: "Dark chocolate" },
      { label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } },
    ],
    layers: [
      { label: "Chocolate", color: "#3a2418", ratio: 12 },
      { label: "Espresso", color: "#4b2e1e", ratio: 14 },
      { label: "Steamed milk", color: "#e8d6b6", ratio: 34 },
    ],
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "hot",
    price: 4.5,
    description: "Velvety microfoam poured over a double ristretto.",
    sizes: [{ label: "S", oz: 6 }, { label: "M", oz: 8 }],
    options: [{ label: "Oat milk" }, { label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } }],
    layers: [
      { label: "Ristretto", color: "#43291b", ratio: 22 },
      { label: "Microfoam", color: "#ecdfc6", ratio: 30 },
    ],
  },
  {
    id: "americano",
    name: "Americano",
    category: "hot",
    price: 3.5,
    description: "Espresso lengthened with hot water for a clean, bold cup.",
    sizes: [{ label: "S", oz: 8 }, { label: "M", oz: 12 }, { label: "L", oz: 16 }],
    options: [{ label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } }, { label: "Room for milk" }],
    layers: [
      { label: "Espresso", color: "#4b2e1e", ratio: 20 },
      { label: "Hot water", color: "#7a5a40", ratio: 36 },
    ],
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    category: "cold",
    price: 4.75,
    description: "Chilled espresso and milk poured over a tall glass of ice.",
    sizes: [{ label: "M", oz: 16 }, { label: "L", oz: 20 }],
    options: [
      { label: "Oat milk" },
      { label: "Vanilla" },
      { label: "Caramel", layer: { label: "Caramel", color: "#c87f3a", ratio: 8 } },
      { label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } },
    ],
    layers: [
      { label: "Espresso", color: "#4b2e1e", ratio: 16 },
      { label: "Cold milk", color: "#ede2cc", ratio: 28 },
      { label: "Ice", color: "#dcecf2", ratio: 18 },
    ],
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "cold",
    price: 4.5,
    description: "Steeped 18 hours for a naturally sweet, low-acid brew.",
    sizes: [{ label: "M", oz: 16 }, { label: "L", oz: 20 }],
    options: [{ label: "Sweet cream", layer: { label: "Sweet cream", color: "#e9dcc2", ratio: 12 } }, { label: "Vanilla" }],
    layers: [
      { label: "Cold brew", color: "#3f2716", ratio: 44 },
      { label: "Ice", color: "#dcecf2", ratio: 14 },
    ],
  },
  {
    id: "iced-mocha",
    name: "Iced Mocha",
    category: "cold",
    price: 5.0,
    description: "Chocolate, espresso and cold milk over ice, topped with whip.",
    sizes: [{ label: "M", oz: 16 }, { label: "L", oz: 20 }],
    options: [
      { label: "Whipped cream", layer: { label: "Whip", color: "#fbf6ec", ratio: 12 } },
      { label: "Oat milk" },
      { label: "Extra shot", layer: { label: "Extra shot", color: "#3a2316", ratio: 8 } },
    ],
    layers: [
      { label: "Chocolate", color: "#3a2418", ratio: 10 },
      { label: "Espresso", color: "#4b2e1e", ratio: 12 },
      { label: "Cold milk", color: "#e8d6b6", ratio: 26 },
      { label: "Ice", color: "#dcecf2", ratio: 14 },
    ],
  },
  {
    id: "iced-matcha",
    name: "Iced Matcha Latte",
    category: "cold",
    price: 5.25,
    description: "Stone-ground matcha whisked with cold milk over ice.",
    sizes: [{ label: "M", oz: 16 }, { label: "L", oz: 20 }],
    options: [{ label: "Oat milk" }, { label: "Vanilla" }, { label: "Honey" }],
    layers: [
      { label: "Matcha", color: "#7fa650", ratio: 22 },
      { label: "Cold milk", color: "#eee6d2", ratio: 26 },
      { label: "Ice", color: "#dcecf2", ratio: 14 },
    ],
  },
];

/* ---------- Helpers ---------- */

// Choose readable text color (dark or light) for a given hex background.
function textOn(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#2b2118" : "rgba(255,255,255,0.92)";
}

// Build the cutaway cup markup. size = 'sm' | 'lg'. layers bottom -> top.
function cupMarkup(layers, size) {
  const totalFill = layers.reduce((sum, l) => sum + l.ratio, 0);
  const empty = Math.max(0, 100 - totalFill);

  const layerHTML = layers
    .map((l) => {
      const showLabel = size === "lg";
      return `<div class="layer" style="height:${l.ratio}%;background:${l.color};color:${textOn(l.color)}">${
        showLabel ? l.label : ""
      }</div>`;
    })
    .join("");

  // column-reverse means first child renders at the bottom, so put spacer last.
  const spacer = `<div class="layer layer-spacer" style="height:${empty}%"></div>`;

  return `
    <div class="cup ${size}">
      <div class="cup-fill">${layerHTML}${spacer}</div>
      <svg class="cup-outline" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M8 4 L92 4 L78 116 L22 116 Z" />
      </svg>
    </div>`;
}

function priceLabel(n) {
  return "$" + n.toFixed(2);
}

// Turn a size label into a spoken word (S -> small, etc.).
function sizeWord(label) {
  const map = { S: "small", M: "medium", L: "large" };
  return map[label] || label.toLowerCase();
}

// Join a list naturally: ["a"] -> "a"; ["a","b"] -> "a and b"; ["a","b","c"] -> "a, b and c".
function joinList(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

/* ---------- Rendering the grid ---------- */

const grid = document.getElementById("menu-grid");
const emptyState = document.getElementById("empty-state");
let activeCategory = "all";
let searchTerm = "";

function getFiltered() {
  return DRINKS.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const matchSearch =
      !searchTerm ||
      d.name.toLowerCase().includes(searchTerm) ||
      d.description.toLowerCase().includes(searchTerm);
    return matchCat && matchSearch;
  });
}

function cardMarkup(d) {
  const catIcon = d.category === "hot" ? "thermometer" : "wind";
  const sizeTags = d.sizes.map((s) => `<span class="tag">${s.label} &middot; ${s.oz}oz</span>`).join("");
  return `
    <article class="card" data-id="${d.id}" tabindex="0" role="button" aria-label="Customize ${d.name}">
      <div class="card-top">
        ${cupMarkup(d.layers, "sm")}
        <div class="card-info">
          <span class="badge ${d.category}"><i data-feather="${catIcon}"></i> ${d.category === "hot" ? "Hot" : "Cold"}</span>
          <h3>${d.name}</h3>
          <p class="card-desc">${d.description}</p>
        </div>
      </div>
      <div class="tag-row">${sizeTags}</div>
      <div class="card-foot">
        <span class="price">${priceLabel(d.price)}</span>
        <span class="customize-hint"><i data-feather="sliders"></i> Customize</span>
      </div>
    </article>`;
}

function renderGrid() {
  const list = getFiltered();
  grid.innerHTML = list.map(cardMarkup).join("");
  emptyState.hidden = list.length > 0;
  if (window.feather) feather.replace();
}

/* ---------- Modal ---------- */

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

let modalState = null; // { mode:'customize'|'order', drink, sizeIndex, selectedOptions:Set, editIndex }

/* ---------- Cart (persistent order) ---------- */
const STORAGE_KEY = "hobbits-order";
let cart = []; // [{ drinkId, sizeIndex, options:[label] }]

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Drop any items that no longer match the current menu.
    return parsed.filter((it) => it && DRINKS.find((d) => d.id === it.drinkId));
  } catch (_) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (_) {}
}

function updateOrderButton(bump) {
  const btn = document.getElementById("order-btn");
  const count = document.getElementById("order-count");
  const n = cart.length;
  count.textContent = String(n);
  count.hidden = n === 0;
  btn.classList.toggle("has-items", n > 0);
  if (bump && n > 0) {
    count.classList.remove("bump");
    void count.offsetWidth; // restart the animation
    count.classList.add("bump");
  }
}

function computeLayers(drink, selectedOptions) {
  // Base layers plus any option-added layers (inserted near the top).
  const extra = [];
  drink.options.forEach((opt) => {
    if (opt.layer && selectedOptions.has(opt.label)) extra.push(opt.layer);
  });
  return [...drink.layers, ...extra];
}

/* ---------- Order description + combined script ---------- */

// Describe a single cart item into readable parts.
function describeItem(item) {
  const drink = DRINKS.find((d) => d.id === item.drinkId);
  const size = drink.sizes[item.sizeIndex] || drink.sizes[0];
  const word = sizeWord(size.label);
  const mods = (item.options || []).filter((label) => drink.options.find((o) => o.label === label));
  const name = `${word.charAt(0).toUpperCase() + word.slice(1)} (${size.oz}oz) ${drink.name}`;
  const phrase = mods.length ? ` with ${joinList(mods.map((m) => m.toLowerCase()))}` : "";
  const line = `a ${word} ${drink.name}${phrase}`;
  return { drink, size, mods, name, line };
}

// Build the combined order script as both display lines and copyable text.
function buildScriptParts() {
  if (cart.length === 0) return { lines: [], text: "" };
  if (cart.length === 1) {
    const s = `Hi! Could I get ${describeItem(cart[0]).line}, please?`;
    return { lines: [s], text: s };
  }
  const lines = [
    `Hi! Could I get ${cart.length} drinks, please?`,
    ...cart.map((it, i) => {
      const l = describeItem(it).line;
      return `${i + 1}. ${l.charAt(0).toUpperCase() + l.slice(1)}.`;
    }),
    "Thank you!",
  ];
  return { lines, text: lines.join("\n") };
}

// Briefly flash a "Copied!" state on a button.
function copyText(text, btn) {
  const original = btn.innerHTML;
  const done = () => {
    btn.innerHTML = '<i data-feather="check"></i> Copied!';
    if (window.feather) feather.replace();
    setTimeout(() => {
      btn.innerHTML = original;
      if (window.feather) feather.replace();
    }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    done();
  }
}

/* ---------- Modal rendering ---------- */

function renderModal() {
  if (modalState.mode === "order") return renderOrder();
  renderCustomize();
}

function renderCustomize() {
  modalBody.className = "modal-body";
  const { drink, sizeIndex, selectedOptions, editIndex } = modalState;
  const editing = editIndex !== null && editIndex !== undefined;
  const layers = computeLayers(drink, selectedOptions);

  const sizeChips = drink.sizes
    .map(
      (s, i) =>
        `<button class="chip ${i === sizeIndex ? "selected" : ""}" data-size="${i}" type="button">${s.label} &middot; ${s.oz}oz</button>`
    )
    .join("");

  const optionChips = drink.options
    .map(
      (o) =>
        `<button class="chip ${selectedOptions.has(o.label) ? "selected" : ""}" data-option="${o.label}" type="button">${o.label}</button>`
    )
    .join("");

  modalBody.innerHTML = `
    <div class="modal-cup">
      ${cupMarkup(layers, "lg")}
      <span class="price">${priceLabel(drink.price)}</span>
    </div>
    <div class="modal-details">
      <span class="badge ${drink.category}"><i data-feather="${drink.category === "hot" ? "thermometer" : "wind"}"></i> ${drink.category === "hot" ? "Hot" : "Cold"}</span>
      <h2 id="modal-title">${drink.name}</h2>
      <p class="modal-desc">${drink.description}</p>

      <div class="option-group">
        <h4>Size</h4>
        <div class="chip-row" id="size-chips">${sizeChips}</div>
      </div>

      <div class="option-group">
        <h4>Options</h4>
        <div class="chip-row" id="option-chips">${optionChips}</div>
      </div>

      <div class="modal-foot">
        <span class="customize-hint"><i data-feather="check-circle"></i> ${selectedOptions.size} option${selectedOptions.size === 1 ? "" : "s"} added</span>
        <div class="modal-foot-btns">
          ${editing ? '<button class="btn-secondary" type="button" data-action="cancel-edit"><i data-feather="arrow-left"></i> Cancel</button>' : ""}
          <button class="add-btn" type="button" data-action="add"><i data-feather="${editing ? "check" : "shopping-bag"}"></i> ${editing ? "Update order" : "Add to order"}</button>
        </div>
      </div>
    </div>`;

  if (window.feather) feather.replace();
}

// The combined "My Order" view: every drink, edit/remove, and a recite-ready script.
function renderOrder() {
  modalBody.className = "modal-body order";

  const head = `
    <div class="prep-head">
      <span class="prep-brand"><i data-feather="coffee"></i> The Hobbits Hollow Espresso</span>
      <p class="prep-tagline">Not all who wander are lost&hellip; some are just looking for coffee.</p>
    </div>`;

  if (cart.length === 0) {
    modalBody.innerHTML = `
      ${head}
      <div class="order-empty">
        <i data-feather="shopping-bag"></i>
        <p>Your order is empty. Tap a drink on the menu to customize it and add it here.</p>
      </div>`;
    if (window.feather) feather.replace();
    return;
  }

  const items = cart
    .map((it, i) => {
      const { name, mods } = describeItem(it);
      const modsText = mods.length ? mods.join(" &middot; ") : "As it comes";
      return `
        <li class="order-item">
          <div class="order-item-main">
            <h3 class="order-item-name">${name}</h3>
            <p class="order-item-mods">${modsText}</p>
          </div>
          <div class="order-item-actions">
            <button class="icon-btn" type="button" data-edit="${i}" aria-label="Edit ${name}"><i data-feather="edit-2"></i></button>
            <button class="icon-btn danger" type="button" data-remove="${i}" aria-label="Remove ${name}"><i data-feather="trash-2"></i></button>
          </div>
        </li>`;
    })
    .join("");

  const { lines } = buildScriptParts();
  const scriptHTML = lines.map((l) => `<p class="script-line">${l}</p>`).join("");

  modalBody.innerHTML = `
    ${head}
    <div class="order-head">
      <span class="prep-label"><i data-feather="shopping-bag"></i> Your order (${cart.length})</span>
      <ul class="order-list">${items}</ul>
    </div>
    <div class="prep-script">
      <span class="prep-label"><i data-feather="mic"></i> Read this at the counter</span>
      ${scriptHTML}
    </div>
    <div class="order-actions">
      <button class="btn-secondary" type="button" data-action="clear-order"><i data-feather="trash-2"></i> Clear order</button>
      <button class="add-btn" type="button" data-action="copy-order"><i data-feather="copy"></i> Copy script</button>
    </div>`;

  if (window.feather) feather.replace();
}

function openCustomize(id, editIndex) {
  const item = editIndex != null ? cart[editIndex] : null;
  const drink = DRINKS.find((d) => d.id === (item ? item.drinkId : id));
  if (!drink) return;
  modalState = {
    mode: "customize",
    drink,
    sizeIndex: item ? item.sizeIndex : 0,
    selectedOptions: new Set(item ? item.options : []),
    editIndex: editIndex != null ? editIndex : null,
  };
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  renderModal();
}

function openOrder() {
  modalState = { mode: "order" };
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  renderModal();
}

function closeModal() {
  modal.hidden = true;
  modalState = null;
  document.body.style.overflow = "";
}

/* ---------- Events ---------- */

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openCustomize(card.dataset.id);
});
grid.addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openCustomize(card.dataset.id);
  }
});

document.getElementById("order-btn").addEventListener("click", openOrder);

modalBody.addEventListener("click", (e) => {
  if (!modalState) return;

  // Order view: edit / remove a line.
  const editBtn = e.target.closest("[data-edit]");
  if (editBtn) {
    openCustomize(null, Number(editBtn.dataset.edit));
    return;
  }
  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    cart.splice(Number(removeBtn.dataset.remove), 1);
    saveCart();
    updateOrderButton();
    renderModal();
    return;
  }

  // Customize view: size / option toggles.
  const sizeBtn = e.target.closest("[data-size]");
  if (sizeBtn) {
    modalState.sizeIndex = Number(sizeBtn.dataset.size);
    renderModal();
    return;
  }
  const optBtn = e.target.closest("[data-option]");
  if (optBtn) {
    const label = optBtn.dataset.option;
    if (modalState.selectedOptions.has(label)) modalState.selectedOptions.delete(label);
    else modalState.selectedOptions.add(label);
    renderModal();
    return;
  }

  const actionBtn = e.target.closest("[data-action]");
  if (!actionBtn) return;
  const action = actionBtn.dataset.action;

  if (action === "add") {
    const entry = {
      drinkId: modalState.drink.id,
      sizeIndex: modalState.sizeIndex,
      options: [...modalState.selectedOptions],
    };
    if (modalState.editIndex !== null) {
      cart[modalState.editIndex] = entry;
      saveCart();
      updateOrderButton();
      modalState = { mode: "order" };
      renderModal();
    } else {
      cart.push(entry);
      saveCart();
      updateOrderButton(true);
      closeModal();
    }
  } else if (action === "cancel-edit") {
    modalState = { mode: "order" };
    renderModal();
  } else if (action === "clear-order") {
    cart = [];
    saveCart();
    updateOrderButton();
    renderModal();
  } else if (action === "copy-order") {
    copyText(buildScriptParts().text, actionBtn);
  }
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* ---------- Resume saved order prompt ---------- */

const resumeModal = document.getElementById("resume-modal");

function showResumePrompt() {
  document.getElementById("resume-text").textContent =
    `You have a saved order with ${cart.length} drink${cart.length === 1 ? "" : "s"}. Keep it, or start fresh?`;
  resumeModal.hidden = false;
  if (window.feather) feather.replace();
}

resumeModal.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-resume]");
  if (btn && btn.dataset.resume === "clear") {
    cart = [];
    saveCart();
    updateOrderButton();
    resumeModal.hidden = true;
    return;
  }
  // Keep, overlay click, or "keep" button: just dismiss.
  if (btn || e.target === resumeModal) resumeModal.hidden = true;
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!resumeModal.hidden) resumeModal.hidden = true;
  else if (!modal.hidden) closeModal();
});

// Category tabs
document.getElementById("category-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
  tab.classList.add("is-active");
  activeCategory = tab.dataset.category;
  renderGrid();
});

// Search
document.getElementById("search").addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderGrid();
});

/* ---------- Theme ---------- */

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.innerHTML = `<i data-feather="${theme === "dark" ? "sun" : "moon"}"></i>`;
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", theme === "dark" ? "#191919" : "#ffffff");
  try {
    localStorage.setItem("brew-theme", theme);
  } catch (_) {}
  if (window.feather) feather.replace();
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

(function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("brew-theme");
  } catch (_) {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
})();

/* ---------- Init ---------- */
cart = loadCart();
updateOrderButton();
renderGrid();
if (window.feather) feather.replace();
if (cart.length > 0) showResumePrompt();
