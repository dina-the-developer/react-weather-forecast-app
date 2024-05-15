import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';

const WorldWeatherMap = () => {
  const [data, setData] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?current_weather=true&temperature_unit=celsius&q=London')
      .then(response => response.json())
      .then(data => setData(data));

      // console.log(data);

    const svg = d3.select('#map')
      .append('svg')
      .attr('width', 800)
      .attr('height', 600);

    setMap(svg);
  }, [data]);

  useEffect(() => {
    if (map && data) {
      const projection = d3.geoMercator()
        .center([0, 40])
        .scale(150)
        .translate([400, 300]);

      const path = d3.geoPath()
        .projection(projection);

      map.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'steelblue')
        .style('stroke', 'white')
        .style('stroke-width', 1.5);

      map.selectAll('circle')
        .data(data.features)
        .enter()
        .append('circle')
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr('r', 5)
        .style('fill', 'red');
    }
  }, [map, data]);

  return (
    <div id="map" />
  );
};
export default WorldWeatherMap;
