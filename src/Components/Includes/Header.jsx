import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';


import './Header.css';

const GEOCODING_API_KEY = '381dd746312747bbb46c7a65ca4a1837';

const Header = ({ onLocationSearch, locationInfo  }) => {
  // console.log(locationInfo);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length > 2) {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=`+GEOCODING_API_KEY);
        const suggestions = response.data.results.map(result => result.formatted);
        setSuggestions(suggestions);
        // console.log(response);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const handleSuggestionClick = (suggestion) => {
  //   setInputValue(suggestion);
  //   setSuggestions([]);
  // };

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
                {/* <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                  <span className="material-symbols-outlined">search</span>
                </Button> */}
                {suggestions.length > 0 && (
                  <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => handleSearch(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
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
