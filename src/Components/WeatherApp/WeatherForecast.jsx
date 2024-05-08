import React, { useEffect, useState } from 'react';

// API endpoint and key (make sure to replace YOUR_API_KEY with your OpenWeatherMap API key)
const API_KEY = 'bfed2bf4b1a5bbe0342acfb956f95eaf';
const BASE_URL = 'https://api.open-meteo.com/v1/forecast?latitude=11.01&longitude=76.95&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';

const WeatherForecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error('Error fetching weather data');
        }
        const data = await response.json();
        setForecast(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const convertKelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2); // Convert to Celsius with two decimal places
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { // UK/European style date format with time
      // weekday : 'short',
      // day: 'numeric',
      // month: 'short',
      // year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <div>
      <h2>Weather Forecast</h2>
      
      {formatDate(forecast.current.time)}
      {/* <h4>{forecast.current.temperature_2m} &deg;C</h4> */}
      {/* <p>{forecast.hourly.time} - {forecast.hourly.temperature_2m}</p> */}
      {forecast.hourly.time[0]}
      {/* foreach with index */}
      {forecast.hourly.time.map((time, idx) => (
        <div key={idx}>
          <p>{formatDate(time)}</p>
        </div>
      )).slice(0, 4)}
      {forecast.hourly.temperature_2m.map((temp, id) => (
        <div key={id}>
          <p>{temp}</p>
        </div>
      )).slice(0, 4)}
    </div>
  );
};

export default WeatherForecast;