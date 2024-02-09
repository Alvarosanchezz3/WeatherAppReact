import "./App.css";
import React, { useState, useEffect } from "react";
import ChangeTheme from "./components/Theme_dark-light/changeTheme";
import weatherApiService from "./weatherService";
import WeatherForecastComponent from "./components/days/nextDays";
import NextHoursComponent from "./components/hours/nextHours";

function App() { 
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);

  useEffect(() => {
    weatherApiService.defaultCityWeather().then((data) => {
      setCurrentWeather(data.currentWeather);
      setForecastWeather(data.forecastWeather);
    });
    
  }, []);

  function getCurrentPosition() {
    weatherApiService
      .getUserCoordinates()
      .then((coords) => {
        // Se consiguen la latitud y longitud del usuario
        return weatherApiService.geolocation(coords.latitude, coords.longitude);
      })
      .then((locationInfo) => {
        // Se usa esa latitud y longitud para saber la ciudad y así ver el tiempo de ella
        weatherApiService.fetchWeather(locationInfo.name).then((data) => {
          if (data && data.currentWeather && data.currentWeather.main) {
            setCurrentWeather(data.currentWeather);
            setForecastWeather(data.forecastWeather);
            console.log(data);
          } else {
            console.error(
              "No se encontraron datos de temperatura en la respuesta de la API."
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error al obtener las coordenadas del usuario:", error);
      });
  }

  // Formatear fecha a --> Monday, Feb 5
  function getDayAndDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);

    const format = { weekday: "long", day: "numeric", month: "short" };

    return date.toLocaleDateString("en-US", format);
  }

  // Convertir hora de UNIX a TimeStamp
  function convertirHora(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Agrega ceros a la izquierda si es necesario
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return formattedHours + ":" + formattedMinutes;
  }

  // Clasificar la visibilidad por la distancia en metros
  function classifyVisibility(visibility) {
    if (visibility >= 10000) {
      return "Excellent";
    } else if (visibility >= 5000) {
      return "Good";
    } else if (visibility >= 2000) {
      return "Moderate";
    } else if (visibility >= 1000) {
      return "Limited";
    } else {
      return "Poor";
    }
  }

  // Cambiar la imagen de grados Celsius a Farenheit al hacer click en el btn
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  const changeDegrees = () => {
    setIsFahrenheit(!isFahrenheit);
  };

  // Cambiar el tema oscuro-claro
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Estado para manejar el valor de búsqueda
  const [searchValue, setSearchValue] = useState("");

  // Manejar cambios en la entrada de texto
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Manejar el (Enter) del input
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      weatherApiService.fetchWeather(searchValue).then((data) => {
        if (data && data.currentWeather && data.currentWeather.main) {
          setCurrentWeather(data.currentWeather);
          setForecastWeather(data.forecastWeather);
        } else {
          console.error(
            "No se encontraron datos de temperatura en la respuesta de la API."
          );
        }
      });
    }
  };

  return (
    <div className={`background ${isDarkTheme ? "" : "light-theme"}`}>
      <div className={`container ${isDarkTheme ? "" : "light-theme"}`}>
        <div className={`content ${isDarkTheme ? "" : "light-theme"}`}>
          <div className="options-btns">
            <ChangeTheme isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            <button
              className={`btn-options ${isDarkTheme ? "" : "light-theme"}`}
              onClick={changeDegrees}
            >
              {isFahrenheit ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    className={isDarkTheme ? "" : "light-theme"}
                    fill="#ffffff"
                    d="M16.5 5c1.55 0 3 .47 4.19 1.28l-1.16 2.89A4.47 4.47 0 0 0 16.5 8C14 8 12 10 12 12.5s2 4.5 4.5 4.5c1.03 0 1.97-.34 2.73-.92l1.14 2.85A7.47 7.47 0 0 1 16.5 20A7.5 7.5 0 0 1 9 12.5A7.5 7.5 0 0 1 16.5 5M6 3a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    className={isDarkTheme ? "" : "light-theme"}
                    fill="#ffffff"
                    d="M11 20V5h9v3h-6v3h5v3h-5v6zM6 3a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1"
                  />
                </svg>
              )}
            </button>
            <button
              className={`btn-options btn-location ${
                isDarkTheme ? "" : "light-theme"
              }`}
              onClick={getCurrentPosition}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path
                  className={isDarkTheme ? "" : "light-theme"}
                  fill="#ffffff"
                  d="M16 2A11.013 11.013 0 0 0 5 13a10.889 10.889 0 0 0 2.216 6.6s.3.395.349.452L16 30l8.439-9.953c.044-.053.345-.447.345-.447l.001-.003A10.885 10.885 0 0 0 27 13A11.013 11.013 0 0 0 16 2m0 15a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4"
                />
                <circle cx="16" cy="13" r="4" fill="none" />
              </svg>
              Get current location
            </button>
          </div>

          <div className="content-left">
            <div className="input-div">
              <input
                className={isDarkTheme ? "" : "light-theme"}
                type="text"
                name="city"
                placeholder="Search for cities"
                value={searchValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="content-left1">
              <div className="city-temp">
                <h1 className={isDarkTheme ? "" : "light-theme"}>
                  {currentWeather?.name}
                </h1>
                <p>{getDayAndDate(currentWeather?.dt)}</p>
                <h1 className={`degrees ${isDarkTheme ? "" : "light-theme"}`}>
                  {Math.round(
                    isFahrenheit
                      ? (currentWeather?.main.temp * 9) / 5 + 32
                      : currentWeather?.main.temp
                  )}{" "}
                  {isFahrenheit ? "ºF" : "º"}
                </h1>
              </div>
              <img
                src={`/assets/img/${currentWeather?.weather[0].icon}.png`}
                alt="weather"
              ></img>
            </div>

            <div
              className={`content-left2 ${isDarkTheme ? "" : "light-theme"}`}
            >
              <p className={`titule ${isDarkTheme ? "" : "light-theme"}`}>
                TODAY'S FORECAST
              </p>
              <NextHoursComponent
                forecastWeather={forecastWeather}
                isDarkTheme={isDarkTheme}
                isFahrenheit={isFahrenheit}
              ></NextHoursComponent>
            </div>
            <div
              className={`content-left3 ${isDarkTheme ? "" : "light-theme"}`}
            >
              <p className={`titule ${isDarkTheme ? "" : "light-theme"}`}>
                WEATHER DETAILS
              </p>
              <div className="details-container">
                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Sunrise</p>
                    <h3>{convertirHora(currentWeather?.sys.sunrise)}</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="192"
                    height="192"
                    viewBox="0 0 16 16"
                  >
                    <path
                      className={`ruta ${isDarkTheme ? "" : "light-theme"}`}
                      fill="#ffffff"
                      d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707m11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0M8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7m3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10m13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Sunset</p>
                    <h3>{convertirHora(currentWeather?.sys.sunset)}</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="192"
                    height="192"
                    viewBox="0 0 16 16"
                  >
                    <path
                      className={`ruta ${isDarkTheme ? "" : "light-theme"}`}
                      fill="#ffffff"
                      d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7m3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10m13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Pressure</p>
                    <h3>{currentWeather?.main.pressure} mb</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="192"
                    height="192"
                    viewBox="0 0 32 32"
                  >
                    <path
                      className={`ruta ${isDarkTheme ? "" : "light-theme"}`}
                      fill="#ffffff"
                      d="M22 30H10v-5H6l10-9l10 9h-4zm-6-14L6 7h4V2h12v5h4z"
                    />
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Wind</p>
                    <h3>{Math.round(currentWeather?.wind.speed)} km/h</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="192"
                    height="192"
                    viewBox="0 0 256 256"
                  >
                    <path
                      className={`ruta ${isDarkTheme ? "" : "light-theme"}`}
                      fill="#ffffff"
                      d="M184 184a32 32 0 0 1-32 32c-13.7 0-26.95-8.93-31.5-21.22a8 8 0 0 1 15-5.56C137.74 195.27 145 200 152 200a16 16 0 0 0 0-32H40a8 8 0 0 1 0-16h112a32 32 0 0 1 32 32m-64-80a32 32 0 0 0 0-64c-13.7 0-26.95 8.93-31.5 21.22a8 8 0 0 0 15 5.56C105.74 60.73 113 56 120 56a16 16 0 0 1 0 32H24a8 8 0 0 0 0 16Zm88-32c-13.7 0-26.95 8.93-31.5 21.22a8 8 0 0 0 15 5.56C193.74 92.73 201 88 208 88a16 16 0 0 1 0 32H32a8 8 0 0 0 0 16h176a32 32 0 0 0 0-64"
                    />
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Humidity</p>
                    <h3>{currentWeather?.main.humidity} %</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="192"
                    height="192"
                    viewBox="0 0 16 16"
                  >
                    <path
                      className={`ruta ${isDarkTheme ? "" : "light-theme"}`}
                      fill="#ffffff"
                      d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002l-.006.007l-.022.023l-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733C2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212c-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023l-.006-.007l-.002-.001zm0 0l-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144c.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827c.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267"
                    />
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Temp min</p>
                    <h3>
                      {(() => {
                        const tempMin = Math.round(
                          isFahrenheit
                            ? (currentWeather?.main.temp_min * 9) / 5 + 32
                            : currentWeather?.main.temp_min
                        );
                        return `${tempMin}º${isFahrenheit ? "F" : ""}`;
                      })()}
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                  >
                    <g fill="currentColor">
                      <path d="M5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585A1.5 1.5 0 0 1 5 12.5" />
                      <path d="M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1m5 1a.5.5 0 0 1 .5.5v1.293l.646-.647a.5.5 0 0 1 .708.708L9 5.207v1.927l1.669-.963l.495-1.85a.5.5 0 1 1 .966.26l-.237.882l1.12-.646a.5.5 0 0 1 .5.866l-1.12.646l.884.237a.5.5 0 1 1-.26.966l-1.848-.495L9.5 8l1.669.963l1.849-.495a.5.5 0 1 1 .258.966l-.883.237l1.12.646a.5.5 0 0 1-.5.866l-1.12-.646l.237.883a.5.5 0 1 1-.966.258L10.67 9.83L9 8.866v1.927l1.354 1.353a.5.5 0 0 1-.708.708L9 12.207V13.5a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5" />
                    </g>
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Temp max</p>
                    <h3>
                      {(() => {
                        const tempMax = Math.round(
                          isFahrenheit
                            ? (currentWeather?.main.temp_max * 9) / 5 + 32
                            : currentWeather?.main.temp_max
                        );
                        return `${tempMax}º${isFahrenheit ? "F" : ""}`;
                      })()}
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="currentColor"
                      d="M26 13h4v2h-4zm-3-5.414l2.828-2.828l1.414 1.414L24.414 9zm0 12.828L24.414 19l2.828 2.828l-1.414 1.414zM17 2h2v4h-2zm1 6a6.037 6.037 0 0 0-1 .09v2.052A3.957 3.957 0 0 1 18 10a4 4 0 0 1 0 8v2a6 6 0 0 0 0-12m-8 12.184V7H8v13.184a3 3 0 1 0 2 0"
                    />
                    <path
                      fill="currentColor"
                      d="M9 30a6.993 6.993 0 0 1-5-11.89V7a5 5 0 0 1 10 0v11.11A6.993 6.993 0 0 1 9 30M9 4a3.003 3.003 0 0 0-3 3v11.983l-.332.299a5 5 0 1 0 6.664 0L12 18.983V7a3.003 3.003 0 0 0-3-3"
                    />
                  </svg>
                </div>

                <div className={`details ${isDarkTheme ? "" : "light-theme"}`}>
                  <div className="details-info">
                    <p>Visibility</p>
                    <h3>{classifyVisibility(currentWeather?.visibility)}</h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={`ruta ${isDarkTheme ? "" : "light-theme"}`}
                      fill="ffffff"
                      d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="content-right">
            <div
              className={`week-forecast ${isDarkTheme ? "" : "light-theme"}`}
            >
              <p className={`titule ${isDarkTheme ? "" : "light-theme"}`}>
                5-DAY FORECAST
              </p>
              <WeatherForecastComponent
                forecastWeather={forecastWeather}
                isDarkTheme={isDarkTheme}
                isFahrenheit={isFahrenheit}
              ></WeatherForecastComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
