import React, { useState, useEffect } from "react";
import weatherApiService from "../../weatherService.js";
import "./nextDays.css";

function WeatherForecastComponent({ forecastWeather, isDarkTheme, isFahrenheit }) {
  const [dailyForecast, setDailyForecast] = useState([]);

  useEffect(() => {
    if (forecastWeather) {
      // Agrupar los pronósticos por día
      const dailyForecasts = groupForecastsByDay(forecastWeather.list);
      setDailyForecast(dailyForecasts);
    } else {
      weatherApiService
        .defaultCityWeather()
        .then((data) => {
          const forecastWeather = data && data.forecastWeather;
          if (forecastWeather) {
            const dailyForecasts = groupForecastsByDay(forecastWeather.list);
            setDailyForecast(dailyForecasts);
          }
        })
        .catch((error) => {
          console.error("Error fetching default city weather:", error);
        });
    }
  }, [forecastWeather]);

  // Función para agrupar los pronósticos por día
  const groupForecastsByDay = (forecasts) => {
    const groupedForecasts = {};
    forecasts.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
      if (!groupedForecasts[date]) {
        groupedForecasts[date] = [];
      }
      groupedForecasts[date].push(forecast);
    });
    return Object.values(groupedForecasts);
  };

  // Función para obtener el día de la semana a partir de una fecha
  const getDayOfWeek = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  return (
    <div className="days-container">
      {/* Renderizar el pronóstico del clima para los próximos días */}
      {dailyForecast.map((dayForecast, index) => (
        <div key={index} className="days">
          <p>{index === 0 ? "Today" : getDayOfWeek(new Date(dayForecast[0].dt * 1000))}</p>
          <div>
            <img src={`/assets/img/${dayForecast[0].weather[0].icon}.png`} alt="weather" />
            <p>{dayForecast[0].weather[0].description}</p>
          </div>
          <p className="temps">
            <span className={`temperature ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
              <span className={`span-bold ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
                {(() => {
                  const tempMax = Math.round(
                    isFahrenheit
                      ? (Math.max(...dayForecast.map(f => f.main.temp_max)) * 9) / 5 + 32
                      : Math.max(...dayForecast.map(f => f.main.temp_max))
                  );
                  return `${tempMax}º${isFahrenheit ? "F" : ""}`;
                })()}
              </span>
              {"/"}
              <span className={isDarkTheme ? "dark-theme" : "light-theme"}>
                {(() => {
                  const tempMin = Math.round(
                    isFahrenheit
                      ? (Math.min(...dayForecast.map(f => f.main.temp_min)) * 9) / 5 + 32
                      : Math.min(...dayForecast.map(f => f.main.temp_min))
                  );
                  return `${tempMin}º${isFahrenheit ? "F" : ""}`;
                })()}
              </span>
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeatherForecastComponent;
