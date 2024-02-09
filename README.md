#WeatherApp 🌤️

This is a React app that provides weather information. By default, information about Madrid appears, but it has a search function to retrieve weather data for any city, you can switch between light and dark themes, a button to change the temperature between Celsius and Fahrenheit and a button to search for the current location of the user and show their weather.

##Characteristics

- **Default Weather:** Upon loading, the app displays the current weather for Madrid, Spain.
- **Search Functionality:** Users can search any city to see its current weather conditions.
- **Toggle Theme:** Users can switch between light and dark themes for better readability.
- **Temperature Scale:** Users can choose between Celsius and Fahrenheit temperature scales.
- **Location based weather:** Users can click a button to get their current location and see the weather.

## Weather Service API 🌦️

- ** (`fetchWeather(city)`):** Gets current and forecast weather data for the specified city using the OpenWeather API.
- ** (`defaultCityWeather()`):** Gets weather data for the default city (Madrid) when the application loads.
- **(`getUserCoordinates()` ):** Retrieves the user's current geolocation coordinates.
- ** (`geolocation (latitude, longitude)`):** Gets location information based on latitude and longitude using the reverse geocoding function of the OpenWeather API.

##How to run the application 🚀
1. Clone this repository.
2. Open the project in your preferred IDE.
4. Create an .env file with the api key and put: REACT_APP_WEATHER_API_KEY=your_api_key
3. Run the app as a React app.
