import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './WeatherApp.css'; 
import WeatherForecast from './WeatherForecast';
import HourlyForecastChart from './HourlyForecastChart';

import NearestCitiesWeather from './NearestCitiesWeather';
import TodayForecastExtra from './TodayForecastExtra';

const WeatherApp = ({latitude, longitude}) => {
  return (
    <div className='weather-app-container'>
      <Container fluid>
        <Row>
          <Col sm={9}>
            <WeatherForecast latitude={latitude} longitude={longitude}/>
          </Col>
          <Col sm={3}>
            <TodayForecastExtra latitude={latitude} longitude={longitude} />
          </Col>
        </Row>
        <Row>
          <Col sm={9}>
            <HourlyForecastChart latitude={latitude} longitude={longitude} />
          </Col>
          <Col sm={3}>
            <NearestCitiesWeather lat={latitude} long={longitude} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default WeatherApp
