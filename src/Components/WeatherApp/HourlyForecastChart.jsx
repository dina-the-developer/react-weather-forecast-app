import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import './HourlyForecastChart.css';

const HourlyForecastChart = ({ latitude, longitude }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&forecast_days=1`
      );
      const responseData = await response.json();
      console.log(responseData);

      // Filter data for the current date
      const currentDate = new Date().toISOString().split('T')[0];
      const hourlyData = responseData.hourly;
      const filteredData = hourlyData.time.map((time, index) => ({
        time: new Date(time),
        temperature: hourlyData.temperature_2m[index]
      })).filter(item => item.time.toISOString().split('T')[0] === currentDate);

      setData(filteredData);
    };

    fetchData();
  }, [latitude, longitude]);

  useEffect(() => {
    if (data.length) {
      const margin = { top: 20, right: 40, bottom: 20, left: 30 };
      const width = 960 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      // Clear the SVG
      d3.select('#chart').select('svg').remove();
      
      const svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([5, width]);

      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, d => d.temperature),
          d3.max(data, d => d.temperature)
        ])
        .nice()
        .range([height, 4]);

      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M")));

      svg.append('g')
        .call(d3.axisLeft(yScale));

      // Draw temperature line
      svg.append("path")
        .datum(data)
        .style('stroke', '#ffa500')
        .style('stroke-width', '3')
        .style('fill', 'none')
        .attr("d", d3.line()
          .curve(d3.curveCardinal)
          .x((d) => xScale(d.time))
          .y((d) => height - yScale(d.temperature))
        );

      // Fill temperature area
      svg.append("path")
        .datum(data)
        .attr("fill", "#333333")
        .attr("stroke-width", "2")
        .attr("opacity", "1")
        .attr("d", d3.area()
          .curve(d3.curveCardinal)
          .x((d) => xScale(d.time))
          .y0(height)
          .y1((d) => height - yScale(d.temperature))
        );

      // Draw circles for data points
      svg.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("stroke", "#111111")
      .attr("stroke-width", "2")
      .attr("cx", (d) => xScale(d.time))
      .attr("cy", (d) => height - yScale(d.temperature))
      .attr("r", 6)
      .style("fill", "#ffa500"); // Change color as needed

    }
  }, [data]);

  return (
    <div className='weather-forecast-chart-container card'>
      <h4>Hourly Weather Forecast</h4>
      <div id="chart"></div>
    </div>
  );
};

export default HourlyForecastChart;
