let currentPokemonID = null;    // variable to store current Pokémon ID
const MAX_POKEMON = 151;    // total number of Pokémon

document.addEventListener("DOMContentLoaded", () =>{    // read the whole page when it is loaded
    const pokemonID = new URLSearchParams(window.location.search).get("id");    // get Pokémon ID from the query parameter in the URL
    const id = parseInt(pokemonID, 10);    // get Pokémon ID from query parameter and convert it to decimal integer

    if(id < 1 || id > MAX_POKEMON) return (window.location.href = "./index.html");    // if Pokémon ID is invalid, return to main page (index.html)

    currentPokemonID = id;    // store current Pokémon ID
    loadPokemon(id);    // load Pokémon data using Pokémon ID
});

// load Pokémon data using Pokémon ID
async function loadPokemon(id){
    try{
        // fetch Pokémon data from PokéAPI using Pokémon ID
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => response.json())
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail-move");    // get reference to first HTML element with class attributes of pokemon-detail-wrap and pokemon-detail-move
        abilitiesWrapper.innerHTML = "";    // clear the contents of the abilities wrapper
        
        // display the Pokémon's details on the page
        if(currentPokemonID === id){
            displayPokemonDetails(pokemon); // display Pokémon details using fetched Pokémon data
            const flavorText = getEnglishFlavorText(pokemonSpecies);    
            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;    
            
            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((selection) => document.querySelector(selection));
            leftArrow.removeEventListener("click", navigatePokemon);
            rightArrow.removeEventListener("click", navigatePokemon);

            if(id !== 1) leftArrow.addEventListener("click", () => navigatePokemon(id - 1));
            if(id !== MAX_POKEMON) rightArrow.addEventListener("click", () => navigatePokemon(id + 1));
            
            window.history.pushState({}, "", `./detail.html?id=${id}`);   // update URL with new Pokémon ID without reloading the page
        }

        return true;    // return true if Pokémon data is successfully fetched
    }
    catch(error){
        console.error("An error occurred while fetching Pokémon data:", error);    // log error to console if there is an error while fetching Pokémon data
        return false;   // return false if there is an error while fetching Pokémon data
    }
}

// update current Pokémon ID and load new Pokémon data
async function navigatePokemon(id){
    currentPokemonID = id;    // update current Pokémon ID
    await loadPokemon(id);    // load new Pokémon data using updated Pokémon ID
}

// Pokémon type colors
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
};

// convert hex color to RGB format
function rgbaFromHex(hexColor){
    return [
        parseInt(hexColor.slice(1, 3), 16), // get red component of hex color and convert it to decimal
        parseInt(hexColor.slice(3, 5), 16), // get green component of hex color and convert it to decimal
        parseInt(hexColor.slice(5, 7), 16), // get blue component of hex color and convert it to decimal
    ].join(", ");   // join the RGB components with a comma and space to create an RGB string
}

// darken hex color (for dark-mode)
function darkenHex(hexColor, percent){
    // get the r,g,b components
    let r = parseInt(hexColor.slice(1, 3), 16); // get red component of hex color and convert it to decimal
    let g = parseInt(hexColor.slice(3, 5), 16); // get green component of hex color and convert it to decimal
    let b = parseInt(hexColor.slice(5, 7), 16); // get blue component of hex color and convert it to decimal

    // calculate the reduction factor
    const factor = 1 - (percent/100);

    // get the new r,g,b components
    r = Math.min(255, Math.floor(r*factor));
    g = Math.min(255, Math.floor(g*factor));
    b = Math.min(255, Math.floor(b*factor));

    // convert back to hex
    const toHex = (val) => val.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// set the background color of the Pokémon detail page based on the Pokémon's type
function setTypeBackgroundColor(pokemon){
    const mainType = pokemon.types[0].type.name;    // get the first type listed for the Pokémon from the Pokémon data
    let color = typeColors[mainType]; // get the color corresponding to the Pokémon's type

    // check if type color is defined
    if(!color){
        console.warn(`Color not defined for type: ${mainType}`);    // log warning to console if color is not defined
        return;
    }

    darkenedColor = darkenHex(color, 25);
    document.documentElement.style.setProperty("--dark-type-color", darkenedColor);
    document.documentElement.style.setProperty("--dark-darkened-type-color", darkenHex(darkenedColor, 20));
    document.documentElement.style.setProperty("--light-type-color", color);
    document.documentElement.style.setProperty("--light-darkened-type-color", darkenHex(color, 20));

    const rgbaColor = rgbaFromHex(color);    // convert Pokemon's type color (hex) to RGB format
    const darkrgbaColor = rgbaFromHex(darkenedColor);    // convert Pokemon's darkened type color (hex) to RGB format
    document.documentElement.style.setProperty("--dark-rgba-type-color", darkrgbaColor);
    document.documentElement.style.setProperty("--light-rgba-type-color", rgbaColor);
}

// capitalize the first letter of a string
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);    // capitalize the first letter of the string and return it
}

// create a new HTML element with the specified tag and options, append it to the parent element, and return the new element
function createAndAppendElement(parent, tag, options = {}){
    const element = document.createElement(tag);    // create new HTML element with specified tag
    
    // set the properties of the new element based on the options object
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });

    parent.appendChild(element);    // append new element to parent element
    return element;
}

// create the elements to display the Pokémon's details
function displayPokemonDetails(pokemon){
    const {name, id, types, weight, height, abilities, stats} = pokemon;    // destructure Pokémon data to get name, id, types, weight, height, abilities, and stats
    
    const capitalizedPokemonName = capitalizeFirstLetter(name);    // capitalize the first letter of the Pokémon's name
    document.querySelector("title").textContent = capitalizedPokemonName;    // set the title of the page to the Pokémon's name

    const detailMainElement = document.querySelector(".detail-main");    // get reference to first HTML element with class attribute of detail-main
    detailMainElement.classList.add(name.toLowerCase());    // add the Pokémon's name (in lowercase) as a class to the detail-main element

    document.querySelector(".name-wrap .name").textContent = capitalizedPokemonName;    // set the text content of the name-wrap element with the class name to the Pokémon's name

    document.querySelector(".pokemon-id-wrap .id").textContent = `#${String(id).padStart(3, "0")}`; // set the text content of the pokemon-id-wrap element with the class id to the Pokémon's ID, padded with leading zeros to 3 digits
    
    const imageElement = document.querySelector(".detail-img-wrapper img"); // get the first <img> element inside the detail-img-wrapper element
    imageElement.src = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;  // set the source of the image 
    imageElement.alt = name;   // set the alt attribute of the image to the Pokémon's name

    const typeWrapper = document.querySelector(".power-wrapper");   // get the first HTML element with class attribute of power-wrapper
    typeWrapper.innerHTML = ""; // clear the contents of the type wrapper
    
    // for each type, create a new <p> element with the class attributes of body3-fonts and type, and set the text content to the type's name
    types.forEach(({type}) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body2-fonts type ${type.name}`,
            textContent: type.name, 
        });
    });

    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent = `${weight / 10} kg`;   // set the text content of the weight element
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10} m`;    // set the text content of the height element

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail-move");   // get the first HTML element with class attributes of pokemon-detail-wrap and pokemon-detail-move

    // for each ability, create a new <p> element with the class attribute of body3-fonts and set the text content to the ability's name
    abilities.forEach(({ability}) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");   // get the first HTML element with class attribute of stats-wrapper
    statsWrapper.innerHTML = "";    // clear the contents of the stats wrapper

    // mapping of stat names to their corresponding abbreviations
    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };

    // go through all the Pokemon's stats and create a new <div> element for each to contain the Pokemon's stats info
    stats.forEach(({stat, base_stat}) => {
        // create a new <div> element with the class attribute of stat-wrap and append it to the stats wrapper
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        // create a new <p> element with the class attributes of body3-fonts and stats, set the text content to the stat's name, and append it to the stat div
        createAndAppendElement(statDiv, "p", {
            className: "body2-fonts stats",
            textContent: statNameMapping[stat.name],
        });

        // create a new <p> element with the class attribute of body3-fonts, set the text content to the stat's base value (padded with leading zeros to 3 digits), and append it to the stat div
        createAndAppendElement(statDiv, "p", {
            className: "body2-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });

        // create a new <progress> element with the class attribute of progress-bar, set the value to the stat's base value, set the max value to 300, and append it to the stat div
        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 300,
        });
    });

    setTypeBackgroundColor(pokemon);    // set the background color of the Pokémon detail page based on the Pokémon's type
}

// get the Pokémon's English flavor text
function getEnglishFlavorText(pokemonSpecies){
    // go through all the flavor text entries and return the first one that is in English
    for (let entry of pokemonSpecies.flavor_text_entries){
        if(entry.language.name === "en"){
            let flavor = entry.flavor_text.replace(/\f/g, "");  // replace all form feed characters (\f) with an empty string
            return flavor;
        }
    }

    return "";
}