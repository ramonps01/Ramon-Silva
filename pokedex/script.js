const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const pokemonInfo = document.getElementById("pokemonInfo");
const loading = document.getElementById("loading");
const favBtn = document.getElementById("favBtn");
const listaFav = document.getElementById("listaFav");
const clearBtn = document.getElementById("clearFav");

let pokemonAtual = "";

// 🎨 cores por tipo
const cores = {
  fire: "#ff6b6b",
  water: "#4dabf7",
  grass: "#51cf66",
  electric: "#ffd43b",
  psychic: "#f783e8",
  ice: "#74c0fc",
  dragon: "#9775fa",
  dark: "#495057",
  fairy: "#f700ff",
  rock: "#c5c200"
};

// EVENTOS
searchBtn.addEventListener("click", buscarPokemon);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarPokemon();
});

favBtn.addEventListener("click", () => {
  salvarFavorito(pokemonAtual);
  carregarFavoritos();
});

clearBtn.addEventListener("click", () => {
  const confirmar = confirm("Tem certeza que deseja apagar todos os favoritos?");

  if (confirmar) {
    localStorage.removeItem("fav");
    carregarFavoritos();
  }
});

// 🔎 FUNÇÃO PRINCIPAL
async function buscarPokemon() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) return;

  mostrarLoading();

  try {
    const data = await pegarDados(query);
    mostrarPokemon(data);
  } catch {
    mostrarErro();
  }
}

// 🌐 BUSCAR API
async function pegarDados(query) {
  const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro");
  return await response.json();
}

// 🎯 MOSTRAR POKÉMON
function mostrarPokemon(data) {
  loading.style.display = "none";

  const tipos = data.types.map(t => t.type.name).join(", ");
  const tipoPrincipal = data.types[0].type.name;
  const cor = cores[tipoPrincipal] || "#999";

  pokemonAtual = data.name;

  pokemonInfo.innerHTML = `
    <img src="${data.sprites.front_default}">
    <h2>${capitalizar(data.name)} (#${data.id})</h2>
    <p>Tipos: ${tipos}</p>
  `;

  pokemonInfo.style.display = "block";
  pokemonInfo.style.background = cor;

  favBtn.style.display = "inline-block";
}

// ❌ ERRO
function mostrarErro() {
  loading.style.display = "none";
  pokemonInfo.innerHTML = "<p>Pokémon não encontrado!</p>";
  pokemonInfo.style.display = "block";
  pokemonInfo.style.background = "#999";
}

// ⏳ LOADING
function mostrarLoading() {
  loading.style.display = "block";
  pokemonInfo.style.display = "none";
  favBtn.style.display = "none";
}

// 🔤 CAPITALIZAR
function capitalizar(nome) {
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

// ❤️ FAVORITOS
function salvarFavorito(nome) {
  let favoritos = JSON.parse(localStorage.getItem("fav")) || [];

  if (!favoritos.includes(nome)) {
    favoritos.push(nome);
    localStorage.setItem("fav", JSON.stringify(favoritos));
  }
}

// 📂 CARREGAR FAVORITOS
function carregarFavoritos() {
  let favoritos = JSON.parse(localStorage.getItem("fav")) || [];

  listaFav.innerHTML = "";

  if (favoritos.length === 0) {
    listaFav.innerHTML = "<li>Nenhum favorito ainda</li>";
    return;
  }

  favoritos.forEach(nome => {
    const li = document.createElement("li");
    li.textContent = nome;

    // 🔥 CLICÁVEL
    li.addEventListener("click", () => {
      searchInput.value = nome;
      buscarPokemon();
    });

    listaFav.appendChild(li);
  });
}

// carregar ao abrir
carregarFavoritos();