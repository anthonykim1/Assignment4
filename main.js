// import {scaleLinear} from "d3-scale-break"

var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var marginTwo = {top: 30, right: 30, bottom: 70, left: 60},
width2 = 900 - marginTwo.left - marginTwo.right,
height2 = 400 - marginTwo.top - marginTwo.bottom;


// append the svg object to the body of the page
var svg1 = d3.select("#first")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChart(category);
}


// Parse the Data
d3.csv("dataset.csv").then(function(dataset) {
  // sort data
  data = dataset;


  data.sort(function(a, b) {
    // console.log(d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]));
    return d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]);
  });




  // X axis
  xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "5px");




        
  // Add Y axis
  yScale = d3.scaleLinear()
    .domain([0, 140000])
    .range([ height, 0]);
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));
 
  // Add Y axis label
  svg.append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP per capita in $ (PPP) 2021");






  let baseline_value;
 
  // Bars
  svg1.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        }
        return xScale(d.Country);
      })
      .attr("y", function(d) { return yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg1.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country + " " + d["GDP per capita in $ (PPP) 2021"]);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg.select(".bar-label").remove(); 
      })
      .on("click", function(d){
        svg.select(".baseline").remove(); 
        svg.select(".baseline-country").remove(); 

        baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        svg1.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        svg1.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      });




})

function updateChartHelath(){
  console.log("update chart Health expenditure"); 
}


function updateChartGDP(){
  console.log("update chart GDP per capita");
  svg.selectAll(".bar").remove();
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll(".y-axis-title").remove();
  svg.selectAll(".baseline").remove();
  svg.selectAll(".baseline-country").remove();


  data.sort(function(a, b) {
    return d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]);
  });




  // X axis
  xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "5px");




  // Add Y axis
  yScale = d3.scaleLinear()
    .domain([0, 140000])
    .range([ height, 0]);
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));
 
  // Add Y axis label
  svg.append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP per capita in $ (PPP) 2021");






  let baseline_value;
 
 


  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        }
        return xScale(d.Country);
      })
      .attr("y", function(d) { return yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg1.select(".bar-label").remove();
      })
      .on("click", function(d){
        svg1.select(".baseline").remove();
        svg1.select(".baseline-country").remove();


        baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        svg.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        svg.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      });
}


function updateChartHealthGDP(){
  console.log("update chart GDP & Health");
 
  svg.selectAll(".bar").remove();
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll(".y-axis-title").remove();
  svg.selectAll(".baseline").remove();
  svg.selectAll(".baseline-country").remove();


  data.sort(function(a, b) {
    return d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]);
  });




  // X axis
  xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "5px");




  // Add Y axis
  yScale = d3.scaleLinear()
    .domain([0, 140000])
    .range([ height, 0]);
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));
 
  // Add Y axis label
  svg.append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP per capita in $ (PPP) 2021");






  let baseline_value;
 
 


  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        }
        return xScale(d.Country);
      })
      .attr("y", function(d) { return yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg1.select(".bar-label").remove();
      })
      .on("click", function(d){
        svg1.select(".baseline").remove();
        svg.select(".baseline-country").remove();


        baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        svg.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        svg.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      });
}



})

function updateChartHelath(){
  console.log("update chart Health expenditure"); 
}

function militarySpendingAsPercentageClicked(){
  
}