import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherIcons = {
  0: '☀️',
  1: '⛅',
  2: '🌥️',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌦️',
  63: '🌧️',
  65: '🌧️',
  66: '🌨️',
  67: '🌨️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  77: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '❄️',
  86: '❄️',
  95: '🌩️',
  96: '🌩️',
  99: '🌩️',
};

const TodayForecastExtra = ({latitude, longitude}) => {
  console.log(latitude + ' - ' + longitude);
  
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get( BASE_URL, {
          params: {
            latitude : latitude,
            longitude : longitude,
            current : 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m'
          },
        });

        setWeatherData(response.data);
        console.log(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return <div className='text-center'>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (error) {
    return <p>Error fetching weather data: {error.message}</p>;
  }

  if (!weatherData) {
    return <p>No weather data available.</p>;
  }


  return (
    <div className='today-weather-extra'>
      <div className='today-weather-extra__container'>
        <div className='text-white p-3 card'>
          {/* <h2>{weatherIcons[weatherData.current.weather_code]}</h2> */}
          <p>{weatherData.current.relative_humidity_2m} {weatherData.current_units.relative_humidity_2m}</p>
            <Row>
              <Col>
                <p>Wind Gusts</p>
                {weatherData.current.wind_gusts_10m} {weatherData.current_units.wind_gusts_10m}
              </Col>
              <Col>
              <p>Wind Speed</p>
              {weatherData.current.wind_speed_10m} {weatherData.current_units.wind_speed_10m}
              </Col>
            </Row>
          </div>
        </div>
      </div>
  )
}

export default TodayForecastExtra;

