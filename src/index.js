// fetchCountries.js
const fetchCountries = async name => {
  try {
    const response = await fetch(
      `https://restcountries.com/v2/name/${name}?fields=name,flags`
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

// main.js
import notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchBox = document.getElementById('search-box');
const resultsContainer = document.getElementById('results-container');

searchBox.addEventListener('input', debounce(handleSearch, 300));

function handleSearch() {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === '') {
    clearResults();
    return;
  }

  fetchCountries(searchTerm)
    .then(countries => {
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
    .catch(error => {
      console.error(error.message);
      showNotFoundError();
    });
}

function clearResults() {
  resultsContainer.innerHTML = '';
}

function showTooManyMatchesAlert() {
  notiflix.Notify.warning(
    'Too many matches found. Please enter a more specific name.'
  );
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
}

function createCountryCard(country) {
  const countryCard = document.createElement('div');
  countryCard.classList.add('country-card');

  const flagImg = document.createElement('img');
  flagImg.src = country.flags.svg; // Corrected variable name
  flagImg.alt = `${country.name} flag`; // Displaying only the name

  countryCard.appendChild(flagImg);

  const countryInfo = document.createElement('div');

  const countryName = document.createElement('p');
  countryName.textContent = country.name;

  countryInfo.appendChild(countryName);

  countryCard.appendChild(countryInfo);

  return countryCard;
}

function showNotFoundError() {
  notiflix.Notify.failure('Oops, there is no country with that name');
}
