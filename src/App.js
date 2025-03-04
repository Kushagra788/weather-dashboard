import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "c3961af9250b01b617b03e2324589018";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeatherData = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      // Fetch current weather data
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Fetch 5-day forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeatherData(currentWeatherResponse.data);
      setForecastData(forecastResponse.data.list.slice(0, 5)); // First 5 entries for 5-day forecast
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch weather data. Please check the city name and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="current-weather">
          <h2>Current Weather</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {forecastData && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-cards">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-card">
                <p>Date: {new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temp: {day.main.temp}°C</p>
                <p>Description: {day.weather[0].description}</p>
                <p>Humidity: {day.main.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;