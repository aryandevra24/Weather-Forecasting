const KEY = "2e9e546f6ff93e7ec5e88c36c52ab522"
const currentWeatherBaseURL = "https://api.openweathermap.org/data/2.5/weather"

const forecastBaseURL = "https://api.openweathermap.org/data/2.5/forecast"

const aqiBaseURL = "https://api.openweathermap.org/data/2.5/air_pollution"

const uvIndexBaseURL = "https://api.openweathermap.org/data/2.5/uvi"

const iconBaseURL = "https://openweathermap.org/img/wn/"

async function setForecast(cityCoords) {
    const forcastURL = `${forecastBaseURL}?lat=${cityCoords[0]}&lon=${cityCoords[1]}&appid=${KEY}&units=metric`

    const forecastItems = document.querySelectorAll(".forecast-item")
    const forecastDateItems = document.querySelectorAll(".forecast-item-date")
    const forecastImgItems = document.querySelectorAll(".forecast-item-img")
    const forecastTempItems = document.querySelectorAll(".forecast-item-temp")

    const response = await ((await fetch(forcastURL)).json())

    const filteredData = response.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    filteredData.forEach((day, i) => {

        const date = new Date(day.dt * 1000)
        const dateNum = date.getDate()
        const monthName = date.toLocaleString(`en-${response.city.country}`, { month: "short" })

        forecastDateItems[i].textContent = `${dateNum < 10 ? `0${dateNum}` : dateNum} ${monthName}`

        forecastTempItems[i].innerHTML = `${Math.trunc(day.main.temp)}&#176;C`

        const iconURL = `${iconBaseURL}${day.weather[0].icon}@2x.png`
        forecastImgItems[i].src = iconURL

    })

}

function getAQILevel(aqi) {
    if (aqi === 1) return "Good";
    if (aqi === 2) return "Fair";
    if (aqi === 3) return "Moderate";
    if (aqi === 4) return "Poor";
    return "Very Poor";
}

async function findWeather(cityCoords) {
    const currentWeatherURL = `${currentWeatherBaseURL}?lat=${cityCoords[0]}&lon=${cityCoords[1]}&units=metric&appid=${KEY}`

    const response = await (await fetch(currentWeatherURL)).json()

    const cityName = document.querySelector(".country-txt")
    cityName.textContent = response.name

    const dateTxt = document.querySelector(".current-date-txt")

    const date = new Date(response.dt * 1000)
    const dayName = date.toLocaleString(`en-${response.sys.country}`, { weekday: "short" })
    const dateNum = date.getDate()
    const monthName = date.toLocaleString(`en-${response.sys.country}`, { month: "short" })

    dateTxt.textContent = `${dayName}, ${dateNum < 10 ? `0${dateNum}` : dateNum} ${monthName}`

    const tempTxt = document.querySelector(".temp-txt");
    tempTxt.innerHTML = `${Math.trunc(response.main.temp)}&#176;C`

    const conditionTxt = document.querySelector(".condition-txt")
    conditionTxt.textContent = `${response.weather[0].main}`

    const mainImg = document.querySelector(".weather-summary-img")


    const iconURL = `${iconBaseURL}${response.weather[0].icon}@2x.png`
    mainImg.src = iconURL

    const humidityTxt = document.querySelector(".humidity-value-txt")
    const windSpeedTxt = document.querySelector(".wind-value-txt")
    const uvIndexTxt = document.querySelector(".uv-value-txt")
    const aqiTxt = document.querySelector(".aqi-value-txt")

    const humidityVal = response.main.humidity
    humidityTxt.textContent = `${humidityVal}%`

    const windSpeedVal = (response.wind.speed * 3.6).toFixed(1)

    windSpeedTxt.textContent = `${windSpeedVal} km/h`

    const uvIndexURL = `${uvIndexBaseURL}?lat=${cityCoords[0]}&lon=${cityCoords[1]}&appid=${KEY}`
    const uvIndexVal = (await (await fetch(uvIndexURL)).json()).value
    uvIndexTxt.textContent = uvIndexVal

    const aqiURL = `${aqiBaseURL}?lat=${cityCoords[0]}&lon=${cityCoords[1]}&appid=${KEY}`
    const aqiRes = await (await fetch(aqiURL)).json()
    const aqiVal = getAQILevel(parseInt(aqiRes.list[0].main.aqi))

    aqiTxt.textContent = aqiVal;

    await setForecast(cityCoords)
}

const coordinateBaseURL = "https://api.openweathermap.org/geo/1.0/direct"

function main() {
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const city = document.querySelector(".city-input").value;

        if (!city) {
            alert("Please! Enter a City.")
            return
        };
        const coordinateURL = `${coordinateBaseURL}?q=${city}&limit=1&appid=${KEY}`
        const response = await fetch(coordinateURL)

        const coords = await response.json()

        const weatherPage = document.querySelector(".weather-info")
        const searchCityPage = document.querySelector(".search-city")
        const notFoundPage = document.querySelector(".not-found")

        if (coords.length === 0) {
            searchCityPage.style.display = "none";
            weatherPage.style.display = "none";
            notFoundPage.style.display = ""
        } else {
            searchCityPage.style.display = "none";
            notFoundPage.style.display = "none"
            weatherPage.style.display = "";

            await findWeather([coords[0].lat, coords[0].lon])
        }

    })
}

main()