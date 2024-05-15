import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';

import './Header.css';

const Header = ({ onLocationSearch, locationInfo  }) => {
  // console.log(locationInfo);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    if (onLocationSearch) {
      onLocationSearch(inputValue); // Pass the input value to the parent component
    }
  };

  return (
    <header>
      <Navbar fixed="top" expand="lg" className='text-light'>
        <Container fluid>
          <Navbar.Brand href="#" className='text-light'>Weather App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Navbar.Text className="mx-3" as="h5">
              <span className="material-symbols-outlined">location_on</span> {locationInfo}
            </Navbar.Text>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>
            <Form className="d-flex me-auto">
              <InputGroup className="">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className=""
                  aria-label="Search"
                  defaultValue={inputValue}
                  onChange={handleInputChange}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                  <span className="material-symbols-outlined">search</span>
                </Button>
              </InputGroup>
            </Form>
            <Nav>
              <Nav.Link href="#action1"><span className="material-symbols-outlined text-light">notifications</span></Nav.Link>
              <Nav.Link href="#action1"><span className="material-symbols-outlined text-light">person</span></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
    
  )
}

export default Header
