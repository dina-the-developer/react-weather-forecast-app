import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './WeatherApp.css'; 
import WeatherForecast from './WeatherForecast';
import WeatherForecastChart from './WeatherForecastChart';
// import NearestCitiesWeather from './NearestCitiesWeather';

const WeatherApp = ({latitude, longitude}) => {
  // console.log(latitude + ' - ' + longitude)
  return (
    <div className='weather-app-container'>
      <Container fluid>
        <Row>
          <Col sm={9}>
            <WeatherForecast latitude={latitude} longitude={longitude}/>
          </Col>
          <Col sm={3}>
            {/* <NearestCitiesWeather /> */}
          </Col>
        </Row>
        <Row>
          <Col sm={9}>
            <WeatherForecastChart latitude={latitude} longitude={longitude}/>
          </Col>
          <Col sm={3}>
            {/* <NearestCitiesWeather /> */}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default WeatherApp
