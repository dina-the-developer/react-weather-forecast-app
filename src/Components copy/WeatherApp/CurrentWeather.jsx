import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const MAJOR_CITIES = [
  { name: 'London', longitude: -0.08, latitude: 51.5085 },
  { name: 'Tokyo', longitude: 139.6917, latitude: 35.6895 },
  // Add coordinates for other major cities
];

const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      const promises = MAJOR_CITIES.map(async (city) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m,weathercode`
        );
        const data = await response.json();
        // Extract relevant weather data from the response
        return {
          name: city.name,
          temperature_2m: data.hourly.temperature_2m[0],
          weathercode: data.hourly.weathercode[0],
          latitude: data.latitude,
          longitude: data.longitude,
        }; // Assuming weather data is in first hourly entry
      });
      const weather = await Promise.all(promises);
      setWeatherData(weather);
    };

    fetchWeather();
  }, []);

  const drawMap = () => {
    const svg = d3.select('#weather-map').select('svg');


      // If there's no existing SVG element, create a new one
      if (!svg.empty()) {
        svg.selectAll('*').remove(); // Clear any existing content within the SVG
      } else {
        svg = d3.select('#weather-map')
          .append('svg')
          .attr('width', '100%')
          .attr('height', '800');
      }

    // Load and project the world map GeoJSON data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then((world) => {
        const projection = d3.geoMercator()
          .scale(120)
          .center([0,50])

        const path = d3.geoPath().projection(projection);

        svg.append('g')
          .selectAll('path')
          .data(world.features)
          .enter()
          .append('path')
          .attr("fill", "#111111")
          .attr('d', path);

        // Add circles for weather data on major cities
        svg.selectAll('circle')
          .data(weatherData)
          .enter()
          .filter(d => d.longitude && d.latitude) // Filter out entries with missing name
          .append('circle')
          .attr('cx', (d) => {
            try {
              const longitude = d.longitude;
              const latitude = d.latitude;
              return projection([longitude, latitude])[0]; // Use 0 for x-coordinate and 1 for y-coordinate
            } catch (error) {
              console.error('Error projecting coordinates:', error);
              return 0; // Or set a default value for missing data
            }
          })
          .attr('cy', (d) => {
            try {
              const longitude = d.longitude;
              const latitude = d.latitude;
              return projection([longitude, latitude])[1];
            } catch (error) {
              console.error('Error projecting coordinates:', error);
              return 0; // Or set a default value for missing data
            }
          })
          .attr('r', 5)
          .attr('fill', (d) => getWeatherColor(d.weathercode)); // Implement logic to set color based on weather code
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
        // Handle GeoJSON loading error (e.g., display an error message)
      });
  };

  useEffect(() => {
    if (weatherData.length > 0) {
      drawMap();}
  }, [weatherData]);

  const displayWeatherInfo = (city, projection) => {
    const weather = weatherData.find((d) => d.name === city.name);
    if (weather) {
      const projection = d3.geoMercator() // Assuming you have projection defined elsewhere
        .scale(120) // Adjust scale and translate values if needed
        .translate([480, 250]);

      const [longitude, latitude] = [weather.longitude, weather.latitude];
      const projected = projection([longitude, latitude]);

      return (
        <> {/* Use a fragment to avoid unnecessary wrapper element */}
          <svg textAnchor="middle" dominantBaseline="middle">
            <text x={projected[0]} y={projected[1]} dy={-5}>  {/* Adjust dy for positioning */}
              {city.name}
            </text>
          </svg>
        </>
      );
    }
    return null;
  };

  return (
    <div className='weather-forecast-chart-container card'>
      <h2>Current Weather</h2>
      <div id="weather-map"></div>
      {weatherData.map((city) => displayWeatherInfo(city))}
    </div>
  );
};

const getWeatherColor = (code) => {
  switch (code) {
    case 0:
      return 'blue';
    case 1:
      return 'lightblue';
    // Add more cases for other weather codes
    default:
      return 'gray';
  }
};

const getWeatherDescription = (code) => {
  switch (code) {
    case 0:
      return 'Clear sky';
    case 1:
      return 'Mainly clear';
    // Add more cases for other weather codes
    default:
      return 'Unknown';
  }
};

export default CurrentWeather;