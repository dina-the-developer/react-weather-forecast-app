import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Includes/Header';

const NearestCitiesWeather = ({ city }) => {
  console.log(city)
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API key for OpenCage, ensure you keep this secure and do not commit to public repos
  const GEOCODING_API_KEY = '381dd746312747bbb46c7a65ca4a1837';

  // Function to fetch coordinates based on location input
  const fetchCoordinates = async (cityName) => {
    if (cityName) {
      try {
        setLoading(true); // Start loading when fetching coordinates
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: cityName,
            key: GEOCODING_API_KEY,
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
 

  useEffect(() => {
    fetchCoordinates(city); // Fetch coordinates when city changes
  }, [city]); // Dependency array ensures fetching when city changes
  useEffect(() => {
    const fetchNearestCitiesAndWeather = async () => {
      if (latitude && longitude) {
        try {
          const cityResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
              q: `${latitude},${longitude}`,
              key: GEOCODING_API_KEY,
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

          const weatherPromises = cityData.map((city) =>
            axios.get('https://api.open-meteo.com/v1/forecast', {
              params: {
                latitude: city.lat,
                longitude: city.lon,
                current_weather: true, // Fetch current weather
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
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }
    };

    if (latitude && longitude) {
      fetchNearestCitiesAndWeather(); // Fetch data when coordinates are available
    }
  }, [latitude, longitude]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Weather for Nearest 5 Cities</h2>
      <div>
        {cities.map((city, index) => (
          <div key={index} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
            <h3>{city.city}</h3>
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