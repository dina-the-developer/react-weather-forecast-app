import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import './WeatherApp.css'; 

const WeatherApp = () => {
  return (
    <div className='weather-app-container'>
      <Container fluid>
        <Row>
          <Col sm={9}>
            <Row>
              <Col sm={4}>
                <Card className="bg-dark text-white today">
                  <Card.Img src="https://www.appviewx.com/wp-content/uploads/2023/11/home-Case-Study-The-City-of-Cape-Town-Significantly-Improves-Service-Delivery.png" alt="Card image" />
                  <Card.ImgOverlay>
                    <Card.Title as='h6'>Tue</Card.Title>
                    <span className="material-symbols-outlined">clear_day</span>
                    <Card.Text>10<span>&deg; C</span></Card.Text>
                  </Card.ImgOverlay>
                </Card>
              </Col>
              <Col>
                <Card className="text-white">
                  <Card.Title as='h6'>Wed</Card.Title>
                  <span className="material-symbols-outlined">sunny</span>
                  <Card.Text>11<span>&deg; C</span></Card.Text>
                </Card>
              </Col>
              <Col>
                <Card className="text-white">
                  <Card.Title as='h6'>Thu</Card.Title>
                  <span className="material-symbols-outlined">partly_cloudy_day</span>
                  <Card.Text>11<span>&deg; C</span></Card.Text>
                </Card>
              </Col>
              <Col>
                <Card className="text-white">
                  <Card.Title as='h6'>Fri</Card.Title>
                  <span className="material-symbols-outlined">cloud</span>
                  <Card.Text>12<span>&deg; C</span></Card.Text>
                </Card>
              </Col>
              <Col>
                <Card className="text-white">
                  <Card.Title as='h6'>Sat</Card.Title>
                  <span className="material-symbols-outlined">partly_cloudy_day</span>
                  <Card.Text>10<span>&deg; C</span></Card.Text>
                </Card>
              </Col>
              <Col>
                <Card className="text-white">
                  <Card.Title as='h6'>Sun</Card.Title>
                  <span className="material-symbols-outlined">rainy</span>
                  <Card.Text>13<span>&deg; C</span></Card.Text>
                </Card>
              </Col>
              <Col>
                <Card className="text-white">
                  <Card.Title as='h6'>Mon</Card.Title>
                  <span className="material-symbols-outlined">sunny</span>
                  <Card.Text>12<span>&deg; C</span></Card.Text>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={3}>

          </Col>
            
        </Row>
      </Container>
    </div>
  )
}

export default WeatherApp
