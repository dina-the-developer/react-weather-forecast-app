import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


import './WeatherApp.css'; 
import WeatherForecast from './WeatherForecast';
// import NearestCitiesWeather from './NearestCitiesWeather';

const WeatherApp = () => {
  return (
    <div className='weather-app-container'>
      <Container fluid>
        <Row>
          <Col sm={9}>
            <WeatherForecast />
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
