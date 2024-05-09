import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const WeatherForecast = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Weather icons mapping
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

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const currentTime = new Date(); // Get the current time
        const startTime = currentTime.toISOString(); // Convert to ISO 8601 format
        const endTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000).toISOString(); // +7 hours
        const response = await axios.get( BASE_URL, {
          params: {
            latitude : '11.01',
            longitude : '76.95',
            current : 'temperature_2m,weather_code',
            // hourly: 'temperature_2m,weather_code',
            daily : 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
            // start: startTime,
            // end: endTime,
          },
        });

        setWeatherData(response.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { // UK/European style date format with time
      weekday : 'short',
      // day: 'numeric',
      // month: 'short',
      // year: 'numeric',
      // hour: '2-digit',
      //minute: '2-digit',
    });
  };

  // const currentDate = weatherData.current.time;
  // const currentTemp = weatherData.current.temperature_2m;

  // Daily weather data
  const dailyData = weatherData.daily; // Extract daily weather data
  const times = dailyData.time; // Array of dates
  const code = dailyData.weather_code;
  const maxTemperatures = dailyData.temperature_2m_max; // Array of max temperatures

  // const minTemperatures = dailyData.temperature_2m_min; // Array of min temperatures

  // const precipitation = hourlyData.precipitation;
  // const windSpeed = hourlyData.wind_speed_10m;

  return (
      <Row>
        {
        times.map((time, index) => (
          index === 0 ?
          (
          <Col sm={4} key={index}>
            <Card className="bg-dark text-white today">
              <Card.Img src="https://www.appviewx.com/wp-content/uploads/2023/11/home-Case-Study-The-City-of-Cape-Town-Significantly-Improves-Service-Delivery.png" alt="Card image" />
              <Card.ImgOverlay>
                <Card.Title as='h6'>Today <span>{weatherIcons[code[index]]}</span></Card.Title>
                <Card.Text className='pt-4'>{maxTemperatures[index]}<span>&deg; C</span> </Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>
          ) : 
          <Col key={index}>
            <Card className="text-white p-3">
              <Card.Title as='h6' key={index}>{formatDate(time)}</Card.Title>
              <span>{weatherIcons[code[index]]}</span>
              <Card.Text>{maxTemperatures[index]}<span>&deg; C</span></Card.Text>
              {/* Minimum Temperature: {minTemperatures[index]}°C */}
            </Card>
          </Col>
        ))
        }
      </Row>
  );
};

export default WeatherForecast;