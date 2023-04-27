var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#main")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("dataset.csv").then(function(data) {
  console.log(data); 
  // sort data
  data.sort(function(a, b) {
    return d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]);
  });

  // X axis
  var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "8px");

  // Add Y axis
  var yScale = d3.scaleLinear()
    .domain([0, 140000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.Country); })
      .attr("y", function(d) { return yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("fill", "#69b3a2")

})