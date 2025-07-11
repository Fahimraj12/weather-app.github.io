const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");

const API_KEY = "fb8e14f9cbef49c682545236251107";

const createWeatherCard = (cityName, weather) => {
  return `<div class="details">
            <h2>${cityName} (${weather.last_updated.split(" ")[0]})</h2>
            <h6>Temperature: ${weather.temp_c}°C</h6>
            <h6>Wind: ${weather.wind_kph} KPH</h6>
            <h6>Humidity: ${weather.humidity}%</h6>
          </div>
          <div class="icon">
            <img src="https:${weather.condition.icon}" alt="weather-icon">
            <h6>${weather.condition.text}</h6>
          </div>`;
};

const getWeatherDetails = (query) => {
  const URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=yes`;

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.current) return alert("Weather data not found!");
      currentWeatherDiv.innerHTML = createWeatherCard(data.location.name, data.current);
    })
    .catch(() => alert("Failed to fetch weather data."));
};

const getCityWeather = () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    getWeatherDetails(cityName);
    cityInput.value = "";
  }
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      getWeatherDetails(`${latitude},${longitude}`);
    },
    error => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("Geolocation denied. Please enable location access.");
      } else {
        alert("Unable to get your location.");
      }
    }
  );
};

searchButton.addEventListener("click", getCityWeather);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityWeather());
locationButton.addEventListener("click", getUserCoordinates);
