// get element by id for all 
const apiKey = "2425953c91d7a770579b0d2693211ba8"; 
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherBox = document.getElementById("weatherBox");
const forecast = document.getElementById("forecast");
const recentCities = document.getElementById("recentCities");
const errorMsg = document.getElementById("errorMsg");
let isCelsius = true;
// search button functioning
searchBtn.onclick = () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else showError("Please enter a city name");
};
// location button functioning
locationBtn.onclick = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  }
};

recentCities.onchange = e => getWeather(e.target.value);
// implementing async function
async function getWeather(city) {
  try {
    const res = await fetch(
      https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
    saveCity(city);
    getForecast(city);
  } catch (err) {
    showError(err.message);
  }
}
// implementing async function get weather
async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}
  );
  const data = await res.json();
  displayWeather(data);
  getForecast(data.name);
}
// creating display weather function
function displayWeather(data) {
  weatherBox.classList.remove("hidden");
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temperature").textContent = ${Math.round(data.main.temp)}°C;
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = Humidity: ${data.main.humidity}%;
  document.getElementById("wind").textContent = Wind: ${data.wind.speed} m/s;

  // Background
  setBackground(data.weather[0].main);

  // Extreme alert
  if (data.main.temp > 40) alert("🔥 Extreme heat alert!");
}
// function set backgroung
function setBackground(condition) {
  document.body.className = "";
  if (condition.includes("Rain")) document.body.classList.add("rainy");
  else if (condition.includes("Cloud")) document.body.classList.add("cloudy");
  else document.body.classList.add("sunny");
}
// using async function with parameter city
async function getForecast(city) {
  // await fetch method
  const res = await fetch(
    https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}
  );
  const data = await res.json();
  showForecast(data.list);
}
// show forecast function
function showForecast(list) {
  forecast.innerHTML = "";
  for (let i = 0; i < list.length; i += 8) {
    const day = list[i];
    const card = document.createElement("div");
    card.className = "forecast-card";
    // giving interactive buttons
    card.innerHTML = `
      <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
      <p>🌡 ${Math.round(day.main.temp)}°C</p>
      <p>💧 ${day.main.humidity}%</p>
      <p>🌬 ${day.wind.speed} m/s</p>
    `;
    forecast.appendChild(card);
  }
}
// function save city with parameter city
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(cities));
    updateCityDropdown();
  }
}
// function for update city dropdown
function updateCityDropdown() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (cities.length > 0) {
    recentCities.classList.remove("hidden");
    recentCities.innerHTML = cities.map(c => <option>${c}</option>).join("");
  }
}
// error message
function showError(msg) {
  errorMsg.textContent = msg;
  setTimeout(() => (errorMsg.textContent = ""), 3000);
}
// getting id unit toggle
document.getElementById("unitToggle").onclick = () => {
  const tempElem = document.getElementById("temperature");
  let temp = parseFloat(tempElem.textContent);
  if (isCelsius) tempElem.textContent = ${Math.round(temp * 9/5 + 32)}°F;
  else tempElem.textContent = ${Math.round((temp - 32) * 5/9)}°C;
  isCelsius = !isCelsius;
};
// function call
updateCityDropdown();