const MAX_POKEMON = 151; // total number of Pokémon
const listWrapper = document.querySelector(".list-wrapper"); // get reference to first HTML element with class attribute of list-wrapper
const searchInput = document.querySelector("#search-input"); // get reference to first HTML element with id attribute of search-input
const numberFilter = document.querySelector("#number"); // get reference to first HTML element with id attribute of number
const nameFilter = document.querySelector("#name"); // get reference to first HTML element with id attribute of name
const notFoundMessage = document.querySelector("#not-found-message"); // get reference to first HTML element with id attribute of not-found-message

let allPokemon = []; // create empty array that will store all the Pokémon

// fetch Pokémon from PokéAPI and display them
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`) // fetch list of Pokémon from PokéAPI
  .then((response) => response.json()) // convert response to json
  .then((data) => {
    allPokemon = data.results; // store results array from fetched data in allPokemon array
    // console.log(allPokemon); // log allPokemon array to console

    displayPokemons(allPokemon); // display all Pokémon
    notFoundMessage.style.display = "none"; // hide not found message
  });


// fetch Pokémon data before redirecting to detail page after click
async function fetchPokemonDataBeforeRedirect(id) {
  try {
    // fetch Pokémon data from PokéAPI using Pokémon ID before redirecting to detail page
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => response.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
      .then((response) => response.json())
    ]);
    return true; // return true if Pokémon data is successfully fetched before redirect
  } catch (error) {
    console.error("Failed to fetch Pokémon data before redirect");  // log error to console if there is an error while fetching Pokémon data before redirect
  }
}

// display all Pokémon
function displayPokemons(pokemon) {
  listWrapper.innerHTML = ""; // clear contents of list wrapper

  // create html structure for each Pokémon
  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6]; // split URL string using '/' as separator to access item after 6th '/' (pokemon number)
    const listItem = document.createElement("div"); // create new div element
    listItem.className = "list-item"; // set class attribute of new div element to list-item
    listItem.innerHTML = `
    <div class="number-wrap">
      <p class="caption-fonts">#${pokemonID}</p>
    </div>
    <div class="img-wrap">
      <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}"/>
    </div>
    <div class="name-wrap">
      <p class="body1-fonts">${pokemon.name}</p>
    </div>
    `;

    // add event listener to redirect to Pokémon's detail page on click
    listItem.addEventListener("click", async() => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if(success){
        window.location.href = `./detail.html?id=${pokemonID}`; // redirect to detail.html page with Pokémon ID as query parameter
      }
    });

    listWrapper.appendChild(listItem); // append new div element to list wrapper
  });
}

// add event listener to search input field
searchInput.addEventListener("keyup", handleSearch);

// check if string is a number
function isNumber(string){
  return (string.trim() !== "") && !isNaN(Number(string));
}

// handle search input in search field
function handleSearch(){
  const searchTerm = searchInput.value.toLowerCase(); // convert search term to lowercase
  let filteredPokemons;

  // filter Pokémon by number
  if(isNumber(searchTerm)){
    // create filtered array of Pokémon whose numbers start with search term
    filteredPokemons = allPokemon.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6]; // split URL string using '/' as separator to access item after 6th '/' (pokemon number)
      return pokemonID.startsWith(searchTerm)   // determine if Pokémon number starts with search term
    });
  }
  // filter Pokémon by name
  else{
    // create filtered array of Pokémon whose names start with search term
    filteredPokemons = allPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().startsWith(searchTerm); // determine if Pokémon name starts with search term
    });
  }

  displayPokemons(filteredPokemons); // display filtered Pokémon

  if(filteredPokemons.length === 0){
    notFoundMessage.style.display = "block"; // show not found message
  }
  else{
    notFoundMessage.style.display = "none"; // hide not found message
  }
}

// add event listener to clear search input field on click of search close icon
const closeButton = document.querySelector(".search-close-icon"); // get reference to first HTML element with search-close-icon class attribute
closeButton.addEventListener("click", clearSearch); // add event listener to clear search input field on click

// clear search input field and display all Pokémon
function clearSearch(){
  searchInput.value = ""; // clear search input field
  displayPokemons(allPokemon); // display all Pokémon
  notFoundMessage.style.display = "none"; // hide not found message
}