# 🌦️ Weather Forecasting Web App

A beautiful and minimal weather application that shows real-time weather data, air quality, UV index and 5-day forecast for any city in the world.

Built using HTML, CSS and Vanilla JavaScript and powered by the OpenWeatherMap API.

---

## ✨ Features

* 🔎 Search weather by city name
* 🌡️ Current temperature & condition
* 💧 Humidity information
* 💨 Wind speed in km/h
* ☀️ UV Index
* 🌫️ Air Quality Index (AQI)
* 📅 5-Day weather forecast
* ❌ City not found state
* 📱 Clean and responsive UI

---

## 🖼️ Preview

Simple weather dashboard UI with blurred glass effect and forecast cards.

---

## 🛠️ Tech Stack

* HTML5  
* CSS3 (Glassmorphism UI)  
* Vanilla JavaScript  
* OpenWeatherMap API

---

## 📂 Project Structure

```
Weather-Forecasting/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── bg.jpg
│   └── message/
│       ├── search-city.png
│       └── not-found.png
└── README.md
```

---

## 🔑 API Used

This app uses the OpenWeatherMap API to fetch:
* Current weather
* 5-day forecast
* Air Pollution (AQI)
* UV Index
* City coordinates (Geocoding)

---

## ⚙️ How It Works

1. User enters a city name.
2. App converts city → coordinates using Geocoding API.
3. Using coordinates, it fetches:
    * Current weather
    * Forecast data
    * UV index
    * Air quality
4. UI updates dynamically with results.

The app automatically shows:
* Weather page when city is found
* Not found page when city doesn't exist

## 🚀 How to Run Locally

1. Clone the repository
    ```bash
    git clone https://github.com/aryandevra24/Weather-Forecasting.git
    ```
2. Open project folder
    ```bash
    cd Weather-Forecasting
    ```
3. Open index.html in browser

That’s it 🎉

---

## 🔐 Important Note (API Key)

In script.js, replace the API key with your own:
```js
const KEY = "YOUR_API_KEY"
```

Get a free key from:
https://openweathermap.org/api

---

## 💡 Future Improvements

* Auto detect user location 🌍
* Dark/Light theme toggle 🌗
* Hourly forecast ⏰

---

## 📜 License

This project is open source and free to use.

---