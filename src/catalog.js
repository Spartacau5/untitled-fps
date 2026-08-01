const grid = document.querySelector("#game-grid");
const count = document.querySelector("#game-count");

function card(game, index) {
  const link = document.createElement("a");
  link.className = "game-card";
  link.href = game.path;
  link.style.setProperty("--game-accent", game.accent || "#ff5a32");
  link.setAttribute("aria-label", `Launch ${game.title}`);

  const art = document.createElement("div");
  art.className = "game-art";
  if (game.cover) {
    art.style.backgroundImage = `linear-gradient(180deg, transparent 22%, rgba(4, 6, 9, .6)), url(${JSON.stringify(game.cover).slice(1, -1)})`;
    art.style.backgroundSize = "cover";
    art.style.backgroundPosition = "center";
  }

  const shade = document.createElement("div");
  shade.className = "game-shade";
  const meta = document.createElement("div");
  meta.className = "game-meta";

  const top = document.createElement("div");
  top.innerHTML = `<span class="game-number">BUILD ${String(index + 1).padStart(2, "0")}</span>`;
  const version = document.createElement("span");
  version.className = "game-version";
  version.textContent = game.version ? ` / ${game.version}` : "";
  top.append(version);

  const title = document.createElement("h3");
  title.className = "game-title";
  title.textContent = game.title;
  const description = document.createElement("p");
  description.className = "game-description";
  description.textContent = game.description || "Playable browser benchmark.";
  const launch = document.createElement("span");
  launch.className = "game-launch";
  launch.textContent = "↗";

  meta.append(top, title, description, launch);
  link.append(art, shade, meta);
  return link;
}

try {
  const response = await fetch("./games.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const games = await response.json();
  count.textContent = `${games.length} ${games.length === 1 ? "LIVE BUILD" : "LIVE BUILDS"}`;
  if (!games.length) grid.innerHTML = '<p class="empty-state">No playable builds published yet.</p>';
  games.forEach((game, index) => grid.append(card(game, index)));
} catch (error) {
  count.textContent = "CATALOG OFFLINE";
  grid.innerHTML = '<p class="empty-state">The build catalog could not be loaded.</p>';
  console.error(error);
}
