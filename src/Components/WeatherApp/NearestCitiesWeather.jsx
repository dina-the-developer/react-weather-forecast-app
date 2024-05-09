import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NearestCitiesWeather = () => {
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    // const weatherIcons = {
    //   0: '☀️',
    //   1: '⛅',
    //   2: '🌥️',
    //   3: '☁️',
    //   45: '🌫️',
    //   48: '🌫️',
    //   51: '🌧️',
    //   53: '🌧️',
    //   55: '🌧️',
    //   61: '🌦️',
    //   63: '🌧️',
    //   65: '🌧️',
    //   66: '🌨️',
    //   67: '🌨️',
    //   71: '🌨️',
    //   73: '🌨️',
    //   75: '🌨️',
    //   77: '❄️',
    //   80: '🌧️',
    //   81: '🌧️',
    //   82: '🌧️',
    //   85: '❄️',
    //   86: '❄️',
    //   95: '🌩️',
    //   96: '🌩️',
    //   99: '🌩️',
    // };

    // Function to fetch coordinates based on user input
  const fetchCoordinates = async () => {
    let query = '';

    if (city) {
      query = city;
    } else if (zip) {
      query = zip;
    } else if (country) {
      query = country;
    }

    if (query) {
      try {
        setLoading(true); // Start loading when fetching coordinates
        const response = await axios.get( 'https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: query,
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
        setLoading(false); // Stop loading on error
      }
    }
  };

  // Fetch nearest cities and weather data once latitude and longitude are obtained
  useEffect(() => {
    const fetchNearestCitiesAndWeather = async () => {
      if (latitude && longitude) {
        try {
          // Fetch the nearest cities
          const cityResponse = await axios.get( 'https://api.opencagedata.com/geocode/v1/json', {
            params: {
              q: `${latitude},${longitude}`,
              key: API_KEY,
              no_annotations: 1,
              limit: 5, // Get 5 nearest cities
            },
          });

          const cityData = cityResponse.data.results.map((result) => ({
            city: result.components.city || 'Unknown',
            lat: result.geometry.lat,
            lon: result.geometry.lng,
          }));

          setCities(cityData);

          // Fetch weather for those cities
          const weatherPromises = cityData.map((city) =>
            axios.get('https://api.open-meteo.com/v1/forecast', {
              params: {
                latitude: city.lat,
                longitude: city.lon,
                current_weather: true, // Get current weather
              },
            })
          );

          const weatherResponses = await Promise.all(weatherPromises);

          const weatherMap = weatherResponses.reduce((acc, res, index) => {
            const cityName = cityData[index].city;
            acc[cityName] = res.data.current_weather;
            return acc;
          }, {});

          setWeatherData(weatherMap);
          setLoading(false); // Stop loading once complete
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }
    };

    fetchNearestCitiesAndWeather(); // Fetch data when latitude and longitude are available
  }, [latitude, longitude]); // Dependency array ensures re-fetching when coordinates change

  const handleInputChange = (e, setFunction) => {
    setFunction(e.target.value);
  };

  const handleSearch = () => {
    fetchCoordinates(); // Fetch coordinates when search is triggered
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Nearest Cities Weather Forecast</h2>
      <div>
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => handleInputChange(e, setCity)}
          />
        </label>
        <label>
          Zip:
          <input
            type="text"
            value={zip}
            onChange={(e) => handleInputChange(e, setZip)}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => handleInputChange(e, setCountry)}
          />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {cities.map((city, index) => (
          <div key={index} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
            <h3>{city.city}</h3> {/* Display city name */}
            {weatherData[city.city] ? (
              <p>
                Temperature: {weatherData[city.city].temperature}°C <br />
                Wind Speed: {weatherData[city.city].windspeed} m/s
              </p>
            ) : (
              <p>No weather data available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearestCitiesWeather;
