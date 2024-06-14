import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';

import './NearestCitiesWeather.css';

const majorCities = [
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  // { name: "Houston", lat: 29.7604, lon: -95.3698 },
  // { name: "Phoenix", lat: 33.4484, lon: -112.0740 }
];

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

const NearestCitiesWeather = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setError("Error getting location");
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch weather data for major cities
    const fetchWeatherData = async () => {
      if (location.lat && location.lon) {
        try {
          const weatherPromises = majorCities.map(city => 
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
          );
          const responses = await Promise.all(weatherPromises);
          const weatherData = responses.map((response, index) => ({
            city: majorCities[index].name,
            ...response.data.current_weather
          }));
          console.log(weatherData);
          setWeatherData(weatherData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching weather data: ", error);
          setError("Error fetching weather data");
          setLoading(false);
        }
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='nearest-cities-container'>
      {/* <h5 className='pb-2'>Major Cities Weather Forecast</h5> */}
        {weatherData.map((cityWeather, index) => (
          <Card className="text-white text-left mb-2" key={index}>
            <Row>
              <Col sm={8}>
                <Card.Title as='h4'>{cityWeather.city}</Card.Title>
                <Card.Text as='p'>{cityWeather.windspeed} km/h</Card.Text>
              </Col>
              <Col sm={4}>
                <span>{weatherIcons[cityWeather.weathercode]}</span>
                <Card.Text className="text-center">{cityWeather.temperature}<span>&deg; C</span></Card.Text>
              </Col>
            </Row>
          </Card>
        ))}
    </div>
  );
};

export default NearestCitiesWeather;
