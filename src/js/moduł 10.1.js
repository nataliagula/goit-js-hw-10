// fetchCountries.js
const fetchCountries = async (name) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v2/name/${name}?fields=name.official,capital,population,flags.svg,languages`
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export default fetchCountries;

// main.js
import fetchCountries from "./fetchCountries.js";
import notiflix from "notiflix"; // Assuming notiflix is used for notifications

import debounce from "loadash.debounce";
import fetchCountries from "./fetchCountries.js";

const searchBox = document.getElementById("search-box");
const resultsContainer = document.getElementById("results-container");

searchBox.addEventListener("input", debounce(handleSearch, 300));

function handleSearch() {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === "") {
    clearResults();
    return;
  }

  fetchCountries(searchTerm)
    .then((countries) => {
      if (countries.length > 10) {
        showTooManyMatchesAlert();
      } else if (countries.length >= 2 && countries.length <= 10) {
        displayCountryList(countries);
      } else if (countries.length === 1) {
        displayCountryInfo(countries[0]);
      } else {
        showNotFoundError();
      }
    })
    .catch((error) => {
      console.error(error.message);
      showNotFoundError();
    });
}

function clearResults() {
  resultsContainer.innerHTML = "";
}

function showTooManyMatchesAlert() {
  notiflix.Notify.warning(
    "Too many matches found. Please enter a more specific name."
  );
}

function displayCountryList(countries) {
  clearResults();
  countries.forEach((country) => {
    const countryCard = createCountryCard(country);
    resultsContainer.appendChild(countryCard);
  });
}

function createCountryCard(country) {
  const countryCard = document.createElement("div");
  countryCard.classList.add("country-card");

  const flagImg = document.createElement("img");
  flagImg.src = country.flags.svg; // Corrected variable name
  flagImg.alt = `${country.name.official} flag`; // Corrected template literal

  countryCard.appendChild(flagImg);

  const countryInfo = document.createElement("div");

  const countryName = document.createElement("p");
  countryName.textContent = country.name.official;

  const countryCapital = document.createElement("p");
  countryCapital.textContent = `Capital: ${country.capital || "N/A"}`; // Corrected syntax

  const countryPopulation = document.createElement("p");
  countryPopulation.textContent = `Population: ${country.population || "N/A"}`;

  const countryLanguages = document.createElement("p");
  countryLanguages.textContent = `Languages: ${
    country.languages ? country.languages.join(",") : "N/A"
  }`;

  countryInfo.appendChild(countryName);
  countryInfo.appendChild(countryCapital);
  countryInfo.appendChild(countryPopulation);
  countryInfo.appendChild(countryLanguages);

  countryCard.appendChild(countryInfo);

  return countryCard;
}

function showNotFoundError() {
  notiflix.Notify.failure("Oops, there is no country with that name");
}
