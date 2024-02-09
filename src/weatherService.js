const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

async function defaultCityWeather() {
    return await fetchWeather('Madrid');
} 

async function fetchWeather(city) {
    try {
        const currentWeatherResponse = await fetch(apiUrlCurrent + city + '&appid=' + apiKey);
        const forecastWeatherResponse = await fetch(apiUrlForecast + city + '&appid=' + apiKey);

        const currentWeather = await currentWeatherResponse.json();
        const forecastWeather = await forecastWeatherResponse.json();

        return { currentWeather, forecastWeather };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

function getUserCoordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords; // Obtener coordenadas de ubicación del usuario
                resolve({ latitude, longitude }); // Resolver la promesa con las coordenadas
            },
            error => { // Rechazar la promesa con el error
                if (error.code === error.PERMISSION_DENIED) {
                    reject("Solicitud de geolocalización denegada. Restablezca los permisos de ubicación para conceder acceso nuevamente.");
                } else {
                    reject("Error en la solicitud de geolocalización. Restablezca los permisos de ubicación.");
                }
            }
        );
    });
}

async function geolocation(latitude, longitude) {
    const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener la información de ubicación inversa.');
        }

        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error en la solicitud de geocodificación inversa:', error);
        throw error;
    }
}


const weatherApi = {fetchWeather, defaultCityWeather, getUserCoordinates, geolocation};
export default weatherApi;