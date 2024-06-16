import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const TodayForecastExtra = ({latitude, longitude}) => {
  console.log(latitude + ' - ' + longitude);
  
  const [uvData, setUvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get( BASE_URL, {
          params: {
            latitude : latitude,
            longitude : longitude,
            current : 'precipitation,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,pressure_msl,surface_pressure'
          },
        });

        setUvData(response.data);
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

  if (!uvData) {
    return <p>No weather data available.</p>;
  }


  return (
    <div className='today-weather-extra'>
      <div className='today-weather-extra__container'>
        <div className='text-white p-3 card'>
          {/* <h2>{weatherIcons[weatherData.current.weather_code]}</h2> */}
          <p>Humidity: {uvData.current.relative_humidity_2m} {uvData.current_units.relative_humidity_2m}</p>
            <Row>
              <Col>
                <p>Wind Gusts</p>
                {uvData.current.pressure_msl} {uvData.current_units.pressure_msl}
              </Col>
              <Col>
              <p>Wind Speed</p>
              {uvData.current.surface_pressure} {uvData.current_units.surface_pressure}
              </Col>
            </Row>
          </div>
        </div>
      </div>
  )
}

export default TodayForecastExtra;

