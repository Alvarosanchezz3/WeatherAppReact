import React, { useState, useEffect } from "react";
import weatherApiService from "../../weatherService.js";
import "./nextHours.css";

  // Formatear hora a esto --> 3:00 PM
  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amPm}`;
  }

  function NextHoursComponent({ forecastWeather, isDarkTheme, isFahrenheit }) {
    const [hourlyForecast, setHourlyForecast] = useState([]);

    useEffect(() => {
        if (forecastWeather) {
            setHourlyForecast(forecastWeather.list.slice(0, 6)); // Solo toma las primeras 6 entradas
        } else {
            weatherApiService
                .defaultCityWeather()
                .then((data) => {
                    const forecastWeather = data && data.forecastWeather;
                    if (forecastWeather) {
                        setHourlyForecast(forecastWeather.list.slice(0, 6)); // Solo toma las primeras 6 entradas
                    }
                })
                .catch((error) => {
                    console.error("Error fetching default city weather:", error);
                });
        }
    }, [forecastWeather]);

    return (
        <div className="hours-container">
            {/* Renderizar el pronóstico del clima por hora */}
            {hourlyForecast &&
                hourlyForecast.map((hourlyData, index) => (
                    <div key={index} className="hours">
                        <p className={isDarkTheme ? "" : "light-theme"}>
                            {formatTime(hourlyData.dt_txt)}
                        </p>
                        <img
                            src={`/assets/img/${hourlyData.weather[0].icon}.png`}
                            alt="weather"
                        ></img>
                        {/* Convertir la temperatura solo si isFahrenheit es verdadero */}
                        <h2>
                            {Math.round(isFahrenheit ? (hourlyData.main.temp * 9/5) + 32 : hourlyData.main.temp)}{isFahrenheit ? " ºF" : "º"}
                        </h2>
                    </div>
                ))}
        </div>
    );
}

export default NextHoursComponent;