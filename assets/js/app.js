// Width and Height for canvas
var svgWidth = 950;
var svgHeight = 650;

// Set svg margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 150,
  left: 75
};

// This is done because the (0,0) starts in far right top to bottom
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3.select("#scatter").append("div").classed("chart", true);

// Creating canvas to append the SVG group using variables defined. .
var svg = chart.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// ChartGroup for data and adjust margins to fit
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Get data from CSV
d3.csv("./assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    //parse data
    censusData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

  //  Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([9, d3.max(censusData, d => d.income)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([18, d3.max(censusData, d => d.obesity)])
    .range([height, 0]);

  // Create axis functions by calling the scale functions
  var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale)

  //Chart group append
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")


  // Append text to circles 
  var circlesGroup = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style('fill', 'blue')
    .text(d => (d.abbr));

  // Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Income: ${d.income}%<br>Obesity: ${d.obesity}% `);
    });

  //Tooltip in the chart
  chartGroup.call(toolTip);

  // Event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Income (%)");
});





  
  