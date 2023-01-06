// csv data (parse data)
var data = d3.csvParse('index,gal,temperature\n0,0.89,69.2\n1,0.89,69.5\n2,0.92,71.7\n3,0.93,72.5\n4,0.85,67.5\n5,0.85,67.3\n6,0.90,69.4\n7,0.89,69.0\n8,0.97,72.9\n9,0.98,72.7\n10,0.96,73.0\n11,1.02,75.8\n12,0.99,74.0\n13,1.02,75.5\n14,1.03,76.3\n15,1.09,78.9\n16,1.07,77.8\n17,1.07,77.8\n18,1.10,78.4\n19,1.07,76.5\n20,0.98,72.4\n21,1.05,76.9\n22,1.00,74.6\n23,1.02,75.8\n24,1.06,77.9\n');




var data = [ {heure: 0, gal: 0, temperature: -2},
    {heure: 1, gal: 1, temperature: -1},
    {heure: 2, gal: 1, temperature: 0},
    {heure: 3, gal: 1, temperature: 0},
    {heure: 4, gal: 1, temperature: 0},
    {heure: 5, gal: 1, temperature: 0},
    {heure: 6, gal: 3, temperature: 2},
    {heure: 7, gal: 4, temperature: 3},
    {heure: 8, gal: 5, temperature: 4},
    {heure: 9, gal: 5, temperature: 5},
    {heure: 10, gal: 5, temperature: 6},
    {heure: 11, gal: 6, temperature: 6},
    {heure: 12, gal: 9, temperature: 8},
    {heure: 13, gal: 10, temperature: 9},
    {heure: 14, gal: 15, temperature: 10},
    {heure: 15, gal: 18, temperature: 11},
    {heure: 16, gal: 18, temperature: 12},
    {heure: 17, gal: 20, temperature: 11},
    {heure: 18, gal: 19, temperature: 8},
    {heure: 19, gal: 19, temperature: 5},
    {heure: 20, gal: 10, temperature: 3},
    {heure: 21, gal: 5, temperature: 0},
    {heure: 22, gal: 3, temperature: -2},
    {heure: 23, gal: 2, temperature: -3},
    {heure: 24, gal: 0, temperature: -5}
];

console.log(data);
// === 1. Boilerplate setup
// Set canvas margins
var margin = {
  top: 50,
  right: 80,
  bottom: 70,
  left: 70
};
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// Add color dynamically
var color = d3.scaleOrdinal(d3.schemeCategory10);

var color = d3.scaleOrdinal(["#ff7f0e","#1f77b4"]);

// Create svg object
var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// === 2. Set scales and draw line
// Set x (timeseries) and y (linear) scales
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var yScale2 = d3.scaleLinear().range([height, 0]);

// draw line callback function using d3.line helper passing in x and y coordinates
var line1 = d3.line()
  .x(d => xScale(d.heure))
  .y(d => yScale(d.gal))

var line2 = d3.line()
  .x(d => xScale(d.heure))
  .y(d => yScale2(d.temperature))

// === 3. Append data and start drawing
// create parseTime helper to turn string into time format (11-Apr-12) into datetime JS object
var parseTime = d3.timeParse('%H');
// Iterate through each data point and parse strings into time and number format
data.forEach(function(d) {
  d.heure = d.heure;
  d.gal = parseFloat(d.gal);
  d.temperature = parseFloat(d.temperature);
});

// Set the x and y scales to the data ranges x based on min and max date range (d3.extent()) and y based on 0 to max value
xScale.domain([0, 24]);
yScale.domain([0, 40]);
yScale2.domain([-5, 30]);

// Add gridlines
svg.append('g')
  .attr('class', 'grid')
  .style('stroke', color('GAL/min'))
  .call(d3.axisLeft(yScale).tickSize(-width).tickValues(yScale.ticks(10).concat(yScale.domain())));

svg.append('g')
  .attr('class', 'grid')
  .attr('transform', `translate(${width},0)`)
  .style('stroke', color('Temperature'))
  .call(d3.axisRight(yScale2).ticks(5))

// Draw the line svg by appending the data to a new svg path giving a class of line and d value based on the d3.line callback
// Append line1 path
svg.append('path')
  .data([data])
  .attr('class', 'line')
  .style('stroke', color('GAL/min'))
  .attr('d', line1)

// Append line2 path
svg.append('path')
  .data([data])
  .attr('class', 'line')
  .style('stroke', color('Temperature'))
  .attr('d', line2)

// Add the axis 
var xAxis = d3.axisBottom(xScale)
  .ticks(24);

svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis);

// Add labels
// add title
svg.append('text')
  .text('Station St-Michel (5000) Entailles')
  .style('font-size', '20px')
  .attr('text-anchor', 'middle')
  .style('font-weight', 'bold')
  .attr('transform', `translate(${width/2}, ${0-(margin.top/2)})`)
  
  svg.append('text')
  .text('Total de l\'année : 100000 L')
  .style('font-size', '16px')
  .style('font-weight', 'bold')
  .attr('transform', `translate(${width/16}, ${50-(margin.top/2)})`)

  svg.append('text')
  .text('Total 24 heures : 5000 L')
  .style('font-size', '16px')
  .style('font-weight', 'bold')
  .attr('transform', `translate(${width/16}, ${70-(margin.top/2)})`)

  svg.append('text')
  .text('GPJ/Entaille : 0.9')
  .style('font-size', '16px')
  .style('font-weight', 'bold')
  .attr('transform', `translate(${width/16}, ${90-(margin.top/2)})`)


  // Add x label 
svg.append('text')
  .text('Heure')
  .attr('text-anchor', 'middle')
  .attr('transform', `translate(${width/2}, ${height + (margin.bottom/2)})`)

// Add Y label 
svg.append('text')
  .text('GAL/min')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .style('stroke', color('GAL/min'))
  .attr('y', 0 - (margin.left / 2))
  .attr('x', 0 - height / 2)

svg.append('text')
  .text('Temp ° C')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(90)')
  .style('stroke', color('Temperature'))
  .attr('x', height/2)
  .attr('y', 0 - (width + margin.right / 2))

// add legend 
var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')

legend.append('text')
  .text(d => d)
  .attr('transform', (d, i) => `translate(${i * 120}, ${height + (margin.bottom)})`)

legend.append('rect')
  .attr('width', 100)
  .attr('height', 5)
  .style('fill', color)
  .attr('transform', (d, i) => `translate(${i * 120}, ${height + (margin.bottom - 25)})`)

