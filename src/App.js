import './Components/Assets/css/bootstrap.css';
// import './Components/Assets/css/weather-icons.min.css';
import './Style.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Components/Includes/Footer';
import Header from './Components/Includes/Header';
import WeatherApp from './Components/WeatherApp/WeatherApp';

const API_KEY = '381dd746312747bbb46c7a65ca4a1837'; 

function App() { 
  
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  useEffect(() => {
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        getLocationInfo(position.coords.latitude,position.coords.longitude);
        
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-73.93');
  const [locationInfo, setLocationInfo] = useState('40.7128');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchCoordinates = async (location) => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: location,
          key: API_KEY,
          no_annotations: 1,
        },
      });

      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        setLatitude(firstResult.geometry.lat);
        setLongitude(firstResult.geometry.lng);
        
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationInfo = (latitude, longitude) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=`+API_KEY;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        if (data.status.code === 200) {
          //console.log("results:", data.results[0].components.city + ', ' +data.results[0].components.state);
          // setLocation(data.results[0].formatted);
          if(data.results[0].components.city === undefined){
            setLocationInfo(data.results[0].components.county + ', ' + data.results[0].components.state);
          }else{
            setLocationInfo(data.results[0].components.city + ', ' +data.results[0].components.state);
          }
        } else {
          console.log("Reverse geolocation request failed.");
        }
      })
      .catch((error) => console.error(error));
  }

  getLocationInfo(latitude, longitude);
  
  const handleLocationSearch = (location) => {
    fetchCoordinates(location); // Trigger coordinate fetching based on user input
    // getLocationInfo(latitude, longitude);
  };

  if (loading) {
    return <div className='text-center'>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="App">
      <Header onLocationSearch={handleLocationSearch} locationInfo={locationInfo}/>
        <WeatherApp latitude={latitude} longitude={longitude} />      
      <Footer />
    </div>
  );
}

export default App;
