var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var marginTwo = {top: 30, right: 30, bottom: 70, left: 60},
width2 = 900 - marginTwo.left - marginTwo.right,
height2 = 400 - marginTwo.top - marginTwo.bottom;

// append the svg object to the body of the page
var svg = d3.select("#main")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#second")
.append("svg")
    .attr("width", width2 + marginTwo.left + marginTwo.right)
    .attr("height", height2 + marginTwo.top + marginTwo.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginTwo.left + "," + marginTwo.top + ")");

function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChart(category);
}

function onCategoryChangedTwo() {
  var select = d3.select('#categorySelectTwo').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChartTwo(category);
}

// Parse the Data
d3.csv("dataset.csv").then(function(dataset) {
  // sort data
  data = dataset;

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
 
  // Bars
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
      .attr("y", function(d) { 
        console.log(d.Country); 
        return yScale(+d["GDP per capita in $ (PPP) 2021"]); 
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        console.log(d.Country);
        d3.select(this).attr("fill", "red");
        svg.append("text")
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
        console.log(d.Country);

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



})

// global variable to store Country name to GDP value.
let CountryToGDP = new Map();

// START - Code for second bar chart, specifically the whole GDP section (should be displayed first as default) //
// storing of the country name to GDP value initialization also happens here // 
updateChartGDPWhole();
function updateChartGDPWhole() {
d3.csv("dataset.csv").then(function(data) {
  svg2.selectAll(".bar").remove();
  svg2.select(".x-axis").remove();
  svg2.select(".y-axis").remove();
  svg2.select(".y-axis-title").remove();
  svg2.select(".baseline").remove();
  svg2.select(".baseline-country").remove();
  // console.log(data.columns.slice(1)[9]); // column header string value for health ***testing***

  // console.log(groups)  
  

  data.sort(function(a, b) {
    // console.log((+a["GDP ($USD billions PPP) 2018"], +b["GDP ($USD billions PPP) 2018"]));
    return d3.descending(+a["GDP ($USD billions PPP) 2019"], +b["GDP ($USD billions PPP) 2019"]);
  });
  /////////
  // X axis
  var xScale2 = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Country; }))
  .padding(0.2);
svg2.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height2 + ")")
  .call(d3.axisBottom(xScale2))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "6px");

  

    // var yScale2 = d3.scaleLinear()
    // .domain([[0,7000], [7000, 22000]])
    // .scope([[0, 0.5], [0.5,1]])
    // .range([0,100]);
    // svg2.append("g")
    // .call(d3.axisLeft(yScale2));
    var yScale2 = d3.scaleLinear()
    .domain([0, 4000, 22000])
    .range([height2, 0]);
    svg2.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale2));

    svg2.append("text")
    .attr("class", ".y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - marginTwo.left)
    .attr("x",0 - (height2 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP ($USD billions PPP) 2019");


  let baseline_value; 
  
  // Bars
  svg2.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale2(+d["GDP ($USD billions PPP) 2019"]);
        }
        // STORE in MAP: store d.Country to GDP value in our Hashmap for Future access // 
        CountryToGDP.set(d.Country, +d["GDP ($USD billions PPP) 2019"]);
        return xScale2(d.Country); 
      })
      .attr("y", function(d) { return yScale2(+d["GDP ($USD billions PPP) 2019"]); })
      .attr("width", xScale2.bandwidth())
      .attr("height", function(d) { return height2 - yScale2(+d["GDP ($USD billions PPP) 2019"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg2.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale2(d.Country) + xScale2.bandwidth() / 2)
          .attr("y", yScale2(+d["GDP ($USD billions PPP) 2019"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg2.select(".bar-label").remove(); 
      })
      .on("click", function(d){
        svg2.select(".baseline").remove(); 
        svg2.select(".baseline-country").remove(); 

        baseline_value = yScale2(+d["GDP ($USD billions PPP) 2019"]);
        svg2.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width2)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        svg2.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale2(d.Country) + xScale2.bandwidth() / 2)
          .attr("y", yScale2(+d["GDP ($USD billions PPP) 2019"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      }); 
      // console.log(CountryToGDP);
})
}

// END - Code for second bar chart // 

function updateChartTwo(category) {
  if(category === "gdp") {
    updateChartGDPWhole();
  } else if (category === "healthMilitaryPortion") {
    updateChartHealthMilitaryTwoPortion();
  }
}

function updateChart(category){
  if(category === "gdp-per-capita") {
    updateChartGDP();
  } else if (category === "health-expenditure"){
    updateChartHealth();
  } else {
    updateChartHealthGDP();
  }
}

// update for stacked health in total gdp  **second chart
function updateChartHealthMilitaryTwoPortion() {

  d3.csv("chartTwoDataset.csv").then(function(data2) {
  svg2.selectAll(".bar").remove();
  svg2.select(".x-axis").remove();
  svg2.select(".y-axis").remove();
  svg2.select(".y-axis-title").remove();
  svg2.select(".baseline").remove();
  svg2.select(".baseline-country").remove();

  data2.sort(function(a, b) {
    // console.log((+a["GDP ($USD billions PPP) 2018"], +b["GDP ($USD billions PPP) 2018"]));
    return d3.descending(+a["GDP without H and M"], +b["GDP without H and M"]);
  });

  // let ourHealthColumn = data.columns.slice(1)[9]; // fetch "expenditure % of GDP" 
  // problem 5/1/23 - These are percentage value as a whole. 
  // need to convert into percentage in decimal form and multiple by the gdp to get the rates we want. 
  // fixed - Store country to GDP in global hashmap so raw value derived from percentages can be calculated later. 

  var subgroups = data2.columns.slice(1);
  // console.log(subgroups);
  // var groups = d3.map(data, function(d){return(d.group)}).keys()
  var xScale2 = d3.scaleBand()
  .range([ 0, width2 ])
  .domain(data2.map(function(d) { return d.Country; }))
  .padding(0.2);
  svg2.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height2 + ")")
  .call(d3.axisBottom(xScale2).tickSizeOuter(0))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "6px");


   var yScale2 = d3.scaleLinear()
    .domain([0, 500])
    .range([height2, 0]);
    svg2.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale2));

    svg2.append("text")
    .attr("class", ".y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - marginTwo.left)
    .attr("x",0 - (height2 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP ($USD billions PPP) 2019");
  
    // color palette choices 
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data2)
    console.log(stackedData);

  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale2(d.data.Country); })                                                                     //.attr("x", function(d) { return xScale2(d.data.group); })
        .attr("y", function(d) { return yScale2(d[1]); })
        .attr("height", function(d) { return yScale2(d[0]) - yScale2(d[1]); })
        .attr("width",xScale2.bandwidth())

       
})
}

function updateChartHealth(){
  console.log("update chart Health expenditure");
  svg.selectAll(".bar").remove();
  svg.select(".x-axis").remove();
  svg.select(".y-axis").remove();
  svg.select(".y-axis-title").remove();
  svg.select(".baseline").remove();
  svg.select(".baseline-country").remove();

  data.sort(function(a, b) {
    return d3.descending(+a["health expenditure per person ($) 2018"], +b["health expenditure per person ($) 2018"]);
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
  // console.log(xScale);


  // Add Y axis
  yScale = d3.scaleLinear()
    .domain([0, 11000])
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
    .text("health expenditure per person ($) 2018");





  let baseline_value;
 
 

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale(+d["health expenditure per person ($) 2018"]);
        }
        return xScale(d.Country);
      })
      .attr("y", function(d) { return yScale(+d["health expenditure per person ($) 2018"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["health expenditure per person ($) 2018"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["health expenditure per person ($) 2018"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country+ " " + d["health expenditure per person ($) 2018"]);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg.select(".bar-label").remove();
      })
      .on("click", function(d){
        svg.select(".baseline").remove();
        svg.select(".baseline-country").remove();

        baseline_value = yScale(+d["health expenditure per person ($) 2018"]);
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
          .attr("y", yScale(+d["health expenditure per person ($) 2018"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      });
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
        svg.select(".bar-label").remove();
      })
      .on("click", function(d){
        svg.select(".baseline").remove();
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
        svg.select(".bar-label").remove();
      })
      .on("click", function(d){
        svg.select(".baseline").remove();
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


