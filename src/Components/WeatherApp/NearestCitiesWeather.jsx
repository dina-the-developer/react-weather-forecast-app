import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NearestCitiesWeather = ({ lat, long }) => {
  //console.log(lat, long )
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API key for OpenCage, ensure you keep this secure and do not commit to public repos
  const GEOCODING_API_KEY = '381dd746312747bbb46c7a65ca4a1837';

  // Function to fetch coordinates based on location input
  const fetchCoordinates = async (lat, long ) => {
    if (lat && long ) {
      try {
        setLoading(true); // Start loading when fetching coordinates
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: lat+','+long ,
            key: GEOCODING_API_KEY,
            no_annotations: 1
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
    fetchCoordinates(lat, long ); // Fetch coordinates when city changes
    
  }, [lat, long ]); // Dependency array ensures fetching when city changes

  useEffect(() => {
    console.log(latitude, longitude);
    const fetchNearestCitiesAndWeather = async () => {
      if (lat && long) {
        try {
          const cityResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
              q: `${lat},${long}`,
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

          // console.log(cityData);

          const weatherPromises = cityData.map((lat, long ) =>
            axios.get('https://api.open-meteo.com/v1/forecast', {
              params: {
                latitude: '40.7128,51.50,48.85,41.89',
                longitude: '74.00,-0.11,2.35,12.48',
                current_weather: true, // Fetch current weather
                wind_speed_10m: true
              },
            })
          );

          const weatherResponses = await Promise.all(weatherPromises);
          // console.log(weatherResponses);
          const weatherMap = weatherResponses.reduce((acc, res, index) => {
            const cityName = cityData[index].city;
            acc[cityName] = res.data.current_weather;
            return acc;
          }, {});

          setWeatherData(weatherMap);
          setLoading(false);
          // console.log(weatherMap);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }
    };

    if (latitude && longitude) {
      fetchNearestCitiesAndWeather(); // Fetch data when coordinates are available
    }
  }, []);

  useEffect(() => {
    if (weatherData) {
      // console.log(weatherData);
    }
  });

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

        <div className="chart-bar" id="bar"></div>
      </div>
    </div>
  );
};


export default NearestCitiesWeather;
