import {
  clearWeather,
  renderCurrentWeather,
  renderEightDayForecast,
} from './dom';
import { getByGeolocation, getLocation } from './api';
import { removeLoader, addMessage, cleanupMessages } from './dom';

const searchInput = document.querySelector('#input');
const details = document.querySelector('#details');

const searchFieldListener = async () => {
  if (searchInput.value === '') return;

  // Reset
  cleanupMessages();
  removeLoader();
  clearWeather();

  const response = await getLocation(searchInput.value);

  if (response !== null) {
    renderCurrentWeather(response.weatherData);
    renderEightDayForecast(response.oneCallData);
    searchInput.value = '';
    details.classList.remove('none');
    removeLoader();
  } else {
    addMessage('error', 'Error retrieving data');
  }
};

export const currentLocationListener = async () => {
  // Reset
  cleanupMessages();
  removeLoader();

  // Get current location from Geolocation
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await getByGeolocation(latitude, longitude);

        if (response !== null) {
          renderCurrentWeather(response.weatherData);
          renderEightDayForecast(response.oneCallData);
          searchInput.value = '';
          details.classList.remove('none');
        } else {
          addMessage('error', 'Error retrieving data');
        }
      },
      () => {
        // Add error message if location is declined
        addMessage('error', 'Please enable location services in your browser');
      }
    );
  }
};

export default searchFieldListener;
