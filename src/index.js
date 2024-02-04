// fetchCountries.js
const fetchCountries = async name => {
  try {
    const url = `https://restcountries.com/v2/name/${name}?fields=name,flags,languages,population,capital`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};

// main.js
import notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchBox = document.getElementById('search-box');
const resultsContainer = document.getElementById('results-container');

searchBox.addEventListener('input', debounce(handleSearch, 300));

async function handleSearch() {
  const searchTerm = searchBox.value.trim();
  if (!searchTerm) {
    clearResults();
    return;
  }

  try {
    const countries = await fetchCountries(searchTerm);
    if (countries.length > 10) {
      showTooManyMatchesAlert();
    } else if (countries.length > 1) {
      displayCountryList(countries);
    } else if (countries.length === 1) {
      displayCountryInfo(countries[0]);
    } else {
      showNotFoundError();
    }
  } catch (error) {
    console.error(error);
    showNotFoundError();
  }
}

function clearResults() {
  resultsContainer.innerHTML = '';
}

function showTooManyMatchesAlert() {
  notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
}

function displayCountryList(countries) {
  clearResults();
  countries.forEach(country => {
    const countryCard = createCountryCard(country);
    resultsContainer.appendChild(countryCard);
  });
}

function displayCountryInfo(country) {
  clearResults();
  const countryCard = createCountryCard(country);
  resultsContainer.appendChild(countryCard);

  const additionalInfoCountryCard = document.createElement('div'); 
  resultsContainer.appendChild(additionalInfoCountryCard);

  const countryCapital = document.createElement('p');
  countryCapital.innerHTML = `<strong>Capital: </strong> ${country.capital}`;
  additionalInfoCountryCard.appendChild(countryCapital);

  const countryPopulation = document.createElement('p');
  countryPopulation.innerHTML = `<strong>Population: </strong> ${country.population}`;
  additionalInfoCountryCard.appendChild(countryPopulation);

  const countryLanguages = document.createElement('p');
  countryLanguages.innerHTML = '<strong>Languages: </strong> ' + country.languages.map(lang => lang.name).join(', ');
  additionalInfoCountryCard.appendChild(countryLanguages);
}

function createCountryCard(country) {
  const countryCard = document.createElement('div');
  countryCard.classList.add('country-card');

  const flagImg = document.createElement('img');
  flagImg.src = country.flags.svg;
  flagImg.alt = `${country.name} flag`;
  countryCard.appendChild(flagImg);

  const countryName = document.createElement('p');
  countryName.textContent = country.name;
  countryCard.appendChild(countryName);

  return countryCard;
}

function showNotFoundError() {
  notiflix.Notify.failure('Oops, there is no country with that name.');
}

