"use strict";

// Global variabel til alle film
let allMovies = [];

// #0: Listen for page load - og start app ved at kalde funktionen initApp
window.addEventListener("load", initApp);

// #1: Initialize the app
function initApp() {
  console.log("initApp: app.js is running 🎉");
  getMovies();

  // Event listeners for alle filtre
  document
    .querySelector("#search-input")
    .addEventListener("input", filterMovies);
  document
    .querySelector("#genre-select")
    .addEventListener("change", filterMovies);
  document
    .querySelector("#sort-select")
    .addEventListener("change", filterMovies);
  document.querySelector("#year-from").addEventListener("input", filterMovies);
  document.querySelector("#year-to").addEventListener("input", filterMovies);
  document
    .querySelector("#rating-from")
    .addEventListener("input", filterMovies);
  document.querySelector("#rating-to").addEventListener("input", filterMovies);
  document
    .querySelector("#clear-filters")
    .addEventListener("click", clearAllFilters);
}

// #2: Fetch movies from JSON file
async function getMovies() {
  const response = await fetch(
    "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/movies.json"
  );
  allMovies = await response.json();
  console.log("📁 Movies loaded:", allMovies.length);
  populateGenreDropdown(); // Udfyld dropdown med genrer fra data
  displayMovies(allMovies);
}

// #3: Display all movies
function displayMovies(movies) {
  const movieList = document.querySelector("#movie-list");
  movieList.innerHTML = "";

  if (movies.length === 0) {
    movieList.innerHTML =
      '<p class="no-results">Ingen film matchede dine filtre 😢</p>';
    return;
  }

  for (const movie of movies) {
    displayMovie(movie);
  }
}
// #4: Render a single movie card and add event listeners
function displayMovie(movie) {
  const movieList = document.querySelector("#movie-list");

  const movieHTML = `
    <article class="movie-card">
      <img src="${movie.image}" 
           alt="Poster of ${movie.title}" 
           class="movie-poster" />
      <div class="movie-info">
        <h3>${movie.title} <span class="movie-year">(${movie.year})</span></h3>
        <p class="movie-genre">${movie.genre.join(", ")}</p>
        <p class="movie-rating">⭐ ${movie.rating}</p>
        <p class="movie-director"><strong>Director:</strong> ${
          movie.director
        }</p>
      </div>
    </article>
  `;

  movieList.insertAdjacentHTML("beforeend", movieHTML);

  // Tilføj click event til den nye card
  const newCard = movieList.lastElementChild;
  newCard.addEventListener("click", function () {
    console.log(`🎬 Klik på: "${movie.title}"`);
    showMovieModal(movie); // ÆNDRET: Fra showMovieDetails til showMovieModal
  });
}

// #5: Udfyld genre-dropdown med alle unikke genrer fra data
function populateGenreDropdown() {
  const genreSelect = document.querySelector("#genre-select");
  const genres = new Set();

  // Samle alle unikke genrer fra alle film
  for (const movie of allMovies) {
    for (const genre of movie.genre) {
      genres.add(genre);
    }
  }

  // Fjern gamle options undtagen 'Alle genrer'
  genreSelect.innerHTML = '<option value="all">Alle genrer</option>';

  // Sortér genres alfabetisk og tilføj dem som options
  const sortedGenres = Array.from(genres).sort();
  for (const genre of sortedGenres) {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`
    );
  }

  console.log("🎭 Genres loaded:", sortedGenres.length, "unique genres");
}

// #6: Vis movie details (Session 3 version - bliver erstattet med modal i Del 2)
function showMovieDetails(movie) {
  alert(`
🎬 ${movie.title} (${movie.year})

🎭 Genre: ${movie.genre.join(", ")}
⭐ Rating: ${movie.rating}
🎥 Director: ${movie.director}
👥 Actors: ${movie.actors.join(", ")}

📝 ${movie.description}
  `);
}

// #7: Ryd alle filtre
function clearAllFilters() {
  console.log("🗑️ Rydder alle filtre");

  // Ryd alle input felter
  document.querySelector("#search-input").value = "";
  document.querySelector("#genre-select").value = "all";
  document.querySelector("#sort-select").value = "none";
  document.querySelector("#year-from").value = "";
  document.querySelector("#year-to").value = "";
  document.querySelector("#rating-from").value = "";
  document.querySelector("#rating-to").value = "";

  // Kør filtrering igen (vil vise alle film)
  filterMovies();
}

// #8: Komplet filtrering med alle funktioner
function filterMovies() {
  console.log("🔄 ===== STARTER KOMPLET FILTRERING =====");

  // Hent alle filter værdier
  const searchValue = document
    .querySelector("#search-input")
    .value.toLowerCase();
  const genreValue = document.querySelector("#genre-select").value;
  const sortValue = document.querySelector("#sort-select").value;
  const yearFrom = Number(document.querySelector("#year-from").value) || 0;
  const yearTo = Number(document.querySelector("#year-to").value) || 9999;
  const ratingFrom = Number(document.querySelector("#rating-from").value) || 0;
  const ratingTo = Number(document.querySelector("#rating-to").value) || 10;

  console.log(`🔍 Søgeterm: "${searchValue}"`);
  console.log(`🎭 Genre: "${genreValue}"`);
  console.log(`📅 År range: ${yearFrom} - ${yearTo}`);
  console.log(`⭐ Rating range: ${ratingFrom} - ${ratingTo}`);
  console.log(`📊 Sortering: "${sortValue}"`);

  // Start med alle film
  let filteredMovies = allMovies;
  console.log(`📋 Starter med: ${filteredMovies.length} movies`);

  // FILTER 1: Søgetekst
  if (searchValue) {
    console.log(`🔍 Anvender søgetekst filter`);
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.title.toLowerCase().includes(searchValue);
    });
    console.log(`📊 Efter søgetekst: ${filteredMovies.length} movies`);
  }

  // FILTER 2: Genre
  if (genreValue !== "all") {
    console.log(`🎭 Anvender genre filter`);
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.genre.includes(genreValue);
    });
    console.log(`📊 Efter genre: ${filteredMovies.length} movies`);
  }

  // FILTER 3: År range
  if (yearFrom > 0 || yearTo < 9999) {
    console.log(`📅 Anvender år filter`);
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.year >= yearFrom && movie.year <= yearTo;
    });
    console.log(`📊 Efter år filter: ${filteredMovies.length} movies`);
  }

  // FILTER 4: Rating range
  if (ratingFrom > 0 || ratingTo < 10) {
    console.log(`⭐ Anvender rating filter`);
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.rating >= ratingFrom && movie.rating <= ratingTo;
    });
    console.log(`📊 Efter rating filter: ${filteredMovies.length} movies`);
  }

  // SORTERING (altid til sidst)
  if (sortValue === "title") {
    console.log(`📝 Sorterer alfabetisk`);
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "year") {
    console.log(`📅 Sorterer på år (nyeste først)`);
    filteredMovies.sort((a, b) => b.year - a.year);
  } else if (sortValue === "rating") {
    console.log(`⭐ Sorterer på rating (højeste først)`);
    filteredMovies.sort((a, b) => b.rating - a.rating);
  }

  console.log(`✅ FINAL RESULTAT: ${filteredMovies.length} movies`);
  console.log("🔄 ===== FILTRERING FÆRDIG =====\n");

  displayMovies(filteredMovies);
}

// #9: Vis movie i modal dialog
function showMovieModal(movie) {
  console.log("🎭 Åbner modal for:", movie.title);

  // Byg HTML struktur dynamisk
  const dialogContent = document.querySelector("#dialog-content");
  dialogContent.innerHTML = `
    <img src="${movie.image}" alt="Poster af ${
    movie.title
  }" class="movie-poster">
    <div class="dialog-details">
      <h2>${movie.title} <span class="movie-year">(${movie.year})</span></h2>
      <p class="movie-genre">${movie.genre.join(", ")}</p>
      <p class="movie-rating">⭐ ${movie.rating}</p>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p><strong>Actors:</strong> ${movie.actors.join(", ")}</p>
      <p class="movie-description">${movie.description}</p>
    </div>
  `;

  // Åbn modalen
  document.querySelector("#movie-dialog").showModal();
}
