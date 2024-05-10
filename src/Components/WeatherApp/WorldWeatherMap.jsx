import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import worldGeoJSON from '../Assets/world-110m.json'; // Example GeoJSON data for the world

// const API_KEY = 'YOUR_GEOCODING_API_KEY'; // Replace with your weather API key

const capitalCities = [
  { country: 'Afghanistan', capital: 'Kabul', lat: 34.5553, lon: 69.2075 },
  { country: 'Albania', capital: 'Tirana', lat: 41.3275, lon: 19.8189 },
  // Add more capitals with coordinates here
];

const WorldWeatherMap = () => {
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const svg = d3.select('#world-map')
      .attr('width', 800) // Set width
      .attr('height', 600); // Set height

    // Create a projection and path generator for the world map
    const projection = d3.geoMercator().scale(130).translate([400, 300]);
    const path = d3.geoPath().projection(projection);

    // Load and display the world map
    d3.json(worldGeoJSON, (error, world) => {
      if (error) throw error;

      svg.append('path')
        .datum({ type: 'FeatureCollection', features: world.features })
        .attr('class', 'land')
        .attr('d', path);
    });

    // Plot the capitals
    svg.selectAll('circle')
      .data(capitalCities)
      .enter()
      .append('circle')
      .attr('cx', (d) => projection([d.lon, d.lat])[0])
      .attr('cy', (d) => projection([d.lon, d.lat])[1])
      .attr('r', 4)
      .attr('fill', 'red');

    // Fetch weather data for each capital
    const fetchWeather = async () => {
      const weatherPromises = capitalCities.map((city) => 
        axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: city.lat,
            longitude: city.lon,
            current_weather: true,
          },
        })
      );

      const weatherResponses = await Promise.all(weatherPromises);

      const weatherMap = weatherResponses.reduce((acc, res, index) => {
        acc[capitalCities[index].capital] = res.data.current_weather;
        return acc;
      }, {});

      setWeatherData(weatherMap);
    };

    fetchWeather();
  }, []);

  // Render the SVG with weather information
  return (
    <div>
      <svg id="world-map"></svg>
      <div>
        {capitalCities.map((city, index) => (
          <div key={index}>
            <h3>{city.capital}, {city.country}</h3>
            {weatherData[city.capital] ? (
              <p>
                Temperature: {weatherData[city.capital].temperature}°C <br />
                Wind Speed: {weatherData[city.capital].windspeed} m/s
              </p>
            ) : (
              <p>Loading weather data...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldWeatherMap;
