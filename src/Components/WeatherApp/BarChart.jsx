import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'; // Open-meteo API base URL

const BarChart = ({ latitude, longitude } ) => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
     
      const response = await axios.get(BASE_URL, {
        params: {
          latitude,
          longitude,
          hourly: 'precipitation', // Request hourly precipitation data
        },
      });
      const rainData = response.data.hourly.precipitation.map((value, index) => ({
        hour: index + 1, // Start hour from 1 (current hour)
        rain: value, // Assuming value represents rain chance
        category: value > 5 ? 'Heavy' : value > 0.5 ? 'Rainy' : 'Sunny', // Categorize rain based on thresholds
      }));
      setData(rainData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return; // Skip rendering if data is empty

    const svg = d3.select(chartRef.current).append('svg');
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.hour))
      .range([margin.left, width + margin.left])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rain)]) // Adjust domain based on rain data
      .range([height, margin.top]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    g.append('g')
      .attr('class', 'axis x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis y')
      .call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.hour))
      .attr('y', d => y(d.rain))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.rain))
      .attr('fill', d => d.category === 'Heavy' ? '#c0392b' : d.category === 'Rainy' ? '#1f77b4' : '#ffff00'); // Color based on category

    svg.append('text')
      .attr('class', 'title')
      .attr('x', (width + margin.left) / 2)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .text('Hourly Rain Chance');
  }, [data]);

  return <div ref={chartRef} />;
};

export default BarChart;