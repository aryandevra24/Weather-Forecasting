// CONFIG

const API_KEY = "2e9e546f6ff93e7ec5e88c36c52ab522";

const API = {
    GEO: "https://api.openweathermap.org/geo/1.0/direct",
    CURRENT: "https://api.openweathermap.org/data/2.5/weather",
    FORECAST: "https://api.openweathermap.org/data/2.5/forecast",
    UV: "https://api.openweathermap.org/data/2.5/uvi",
    AQI: "https://api.openweathermap.org/data/2.5/air_pollution",
    ICON: "https://openweathermap.org/img/wn/"
};


// DOM CACHE (avoid re-query)

const DOM = {
    form: document.querySelector("form"),
    cityInput: document.querySelector(".city-input"),

    searchPage: document.querySelector(".search-city"),
    weatherPage: document.querySelector(".weather-info"),
    notFoundPage: document.querySelector(".not-found"),

    cityName: document.querySelector(".country-txt"),
    dateText: document.querySelector(".current-date-txt"),
    tempText: document.querySelector(".temp-txt"),
    conditionText: document.querySelector(".condition-txt"),
    weatherIcon: document.querySelector(".weather-summary-img"),

    humidityText: document.querySelector(".humidity-value-txt"),
    windText: document.querySelector(".wind-value-txt"),
    uvText: document.querySelector(".uv-value-txt"),
    aqiText: document.querySelector(".aqi-value-txt"),

    forecastDates: document.querySelectorAll(".forecast-item-date"),
    forecastTemps: document.querySelectorAll(".forecast-item-temp"),
    forecastIcons: document.querySelectorAll(".forecast-item-img")
};


// API FUNCTIONS

async function getCoordinates(cityName) {
    const url = `${API.GEO}?q=${cityName}&limit=1&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0];
}

async function getCurrentWeather(lat, lon) {
    const url = `${API.CURRENT}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
}

async function getForecast(lat, lon) {
    const url = `${API.FORECAST}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
}

async function getUVIndex(lat, lon) {
    const url = `${API.UV}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
}

async function getAirQuality(lat, lon) {
    const url = `${API.AQI}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
}


// HELPER FUNCTIONS

function formatDate(timestamp, country) {
    const date = new Date(timestamp * 1000);
    const day = date.toLocaleString(`en-${country}`, { weekday: "short" });
    const dayNum = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString(`en-${country}`, { month: "short" });
    return `${day}, ${dayNum} ${month}`;
}

function getWeatherIcon(iconCode) {
    return `${API.ICON}${iconCode}@2x.png`;
}

function convertWindToKmH(speedMs) {
    return (speedMs * 3.6).toFixed(1);
}

function getAQILabel(aqiNumber) {
    const map = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    };
    return map[aqiNumber] || "Unknown";
}


// PAGE VISIBILITY

function showWeatherPage() {
    DOM.searchPage.style.display = "none";
    DOM.notFoundPage.style.display = "none";
    DOM.weatherPage.style.display = "";
}

function showNotFoundPage() {
    DOM.searchPage.style.display = "none";
    DOM.weatherPage.style.display = "none";
    DOM.notFoundPage.style.display = "";
}


// UI UPDATE FUNCTIONS


// Basic weather
function updateMainWeatherUI(weather) {
    DOM.cityName.textContent = weather.name;
    DOM.dateText.textContent = formatDate(weather.dt, weather.sys.country);
    DOM.tempText.innerHTML = `${Math.trunc(weather.main.temp)}&#176;C`;
    DOM.conditionText.textContent = weather.weather[0].main;
    DOM.weatherIcon.src = getWeatherIcon(weather.weather[0].icon);
}

// Humidity
function updateHumidityUI(weather) {
    DOM.humidityText.textContent = `${weather.main.humidity}%`;
}

// Wind
function updateWindUI(weather) {
    DOM.windText.textContent = `${convertWindToKmH(weather.wind.speed)} km/h`;
}

// UV
function updateUVUI(uvData) {
    DOM.uvText.textContent = uvData.value;
}

// AQI
function updateAQIUI(aqiData) {
    const aqiNum = aqiData.list[0].main.aqi;
    DOM.aqiText.textContent = getAQILabel(aqiNum);
}

// Forecast
function updateForecastUI(forecast) {
    const noonData = forecast.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    noonData.forEach((day, i) => {
        const date = new Date(day.dt * 1000);
        const dayNum = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString(`en-${forecast.city.country}`, { month: "short" });

        DOM.forecastDates[i].textContent = `${dayNum} ${month}`;
        DOM.forecastTemps[i].innerHTML = `${Math.trunc(day.main.temp)}&#176;C`;
        DOM.forecastIcons[i].src = getWeatherIcon(day.weather[0].icon);
    });
}


// MAIN CONTROLLER

async function handleCitySearch(e) {
    e.preventDefault();

    const cityName = DOM.cityInput.value.trim();
    if (!cityName) return alert("Please enter a city");

    try {
        const coords = await getCoordinates(cityName);
        if (!coords) return showNotFoundPage();

        showWeatherPage();

        const { lat, lon } = coords;

        const weather = await getCurrentWeather(lat, lon);
        const forecast = await getForecast(lat, lon);
        const uv = await getUVIndex(lat, lon);
        const aqi = await getAirQuality(lat, lon);

        updateMainWeatherUI(weather);
        updateHumidityUI(weather);
        updateWindUI(weather);
        updateUVUI(uv);
        updateAQIUI(aqi);
        updateForecastUI(forecast);

    } catch (error) {
        console.error(error);
        showNotFoundPage();
    }
}


// MAIN FUNCTION

function main() {
    DOM.form.addEventListener("submit", handleCitySearch);
}

// invoke app
main();
