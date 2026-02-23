const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

let currentId = 132;
let currentTab = "info";
let currentPokemonData = null;

const spriteEl = document.getElementById("pokeSprite");
const nameEl = document.getElementById("pokeName");
const typesRowEl = document.getElementById("typesRow");

const panelTitleEl = document.getElementById("panelTitle");
const panelContentEl = document.getElementById("panelContent");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const infoTabBtn = document.getElementById("infoTab");
const movesTabBtn = document.getElementById("movesTab");

function formatMoveName(name) {
  return name.replaceAll("-", " ");
}

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Pokemon ${id} not found`);
  return res.json();
}

function renderTypes(types) {
  typesRowEl.innerHTML = "";
  for (const t of types) {
    const typeName = t.type.name;
    const chip = document.createElement("div");
    chip.className = "type-chip";
    chip.textContent = typeName;
    chip.style.background = TYPE_COLORS[typeName] ?? "#ddd";
    typesRowEl.appendChild(chip);
  }
}

function getStatMap(statsArr) {
  const map = {};
  for (const s of statsArr) {
    map[s.stat.name] = s.base_stat;
  }
  return map;
}

function renderInfoPanel(data) {
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);

  const stat = getStatMap(data.stats);

  const lines = [
    `height: ${heightM}m`,
    `weight: ${weightKg}kg`,
    `hp: ${stat["hp"] ?? ""}`,
    `attack: ${stat["attack"] ?? ""}`,
    `defense: ${stat["defense"] ?? ""}`,
    `special-attack: ${stat["special-attack"] ?? ""}`,
    `special-defense: ${stat["special-defense"] ?? ""}`,
    `speed: ${stat["speed"] ?? ""}`,
  ];

  panelTitleEl.textContent = "Info";
  panelContentEl.textContent = lines.join("\n");
}

function renderMovesPanel(data) {
  const moves = data.moves.map((m) => formatMoveName(m.move.name));

  panelTitleEl.textContent = "Moves";
  panelContentEl.textContent = moves.join("\n");
}

function renderPanel() {
  if (!currentPokemonData) return;

  if (currentTab === "info") {
    infoTabBtn.classList.add("tab-active");
    movesTabBtn.classList.remove("tab-active");
    renderInfoPanel(currentPokemonData);
  } else {
    movesTabBtn.classList.add("tab-active");
    infoTabBtn.classList.remove("tab-active");
    renderMovesPanel(currentPokemonData);
  }
}

function renderPokemon(data) {
  currentPokemonData = data;

  // sprite (pixel style)
  const spriteUrl = data.sprites?.front_default ?? "";
  spriteEl.src = spriteUrl;
  spriteEl.alt = data.name;

  // name
  nameEl.textContent = data.name;

  // types
  renderTypes(data.types);

  // right panel
  renderPanel();
}

async function loadPokemon(id) {
  if (id < 1) return; // prevent 0
  try {
    const data = await fetchPokemon(id);
    currentId = id;
    renderPokemon(data);
  } catch (err) {
    // If invalid ID (rare), just ignore and keep current
    console.warn(err);
  }
}

prevBtn.addEventListener("click", () => loadPokemon(currentId - 1));
nextBtn.addEventListener("click", () => loadPokemon(currentId + 1));

infoTabBtn.addEventListener("click", () => {
  currentTab = "info";
  renderPanel();
});

movesTabBtn.addEventListener("click", () => {
  currentTab = "moves";
  renderPanel();
});

// initial load
loadPokemon(currentId);
