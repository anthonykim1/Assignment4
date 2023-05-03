var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// margin for second bar chart
var marginTwo = {top: 30, right: 30, bottom: 70, left: 90},
width2 = 2000 - marginTwo.left - marginTwo.right, // 900 => 2000 testing
height2 = 600 - marginTwo.top - marginTwo.bottom; // 400 => 600 testing

// append the svg object to the body of the page
// svg for first bar chart
var svg = d3.select("#main")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// svg for second bar chart
var svg2 = d3.select("#second")
.append("svg")
    .attr("width", width2 + marginTwo.left + marginTwo.right)
    .attr("height", height2 + marginTwo.top + marginTwo.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginTwo.left + "," + marginTwo.top + ")");

// Drop down choice updated, fire signal to display the "correct" chart for top chart
function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChart(category);
}

// Drop down choice updated, fire signal to display the "correct" chart for bottom chart
function onCategoryChangedTwo() {
  var select = d3.select('#categorySelectTwo').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChartTwo(category);
}

/////////////////// Refactoring in progress




/////////////////// Refactoring in progress






// This is for First chart - specifically GDP per capita 
d3.csv("dataset.csv").then(function(dataset) {
  // sort data
  data = dataset;

  data.sort(function(a, b) {
    return d3.descending(+a["GDP ($USD billions PPP) 2019"], +b["GDP ($USD billions PPP) 2019"]);
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
      .attr("y", function(d) { return yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("countryName", function(d) { return d.Country}) // new May 2nd => add attribute for countryName so we can highlight both of the charts together 
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        onClickBaseline(d.Country, "svg2"); // call to trigger baseline highlighting in both places
        
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
        if (!d3.select(this).classed("bar selected")) {
          unClickBaseline(d.Country); // call to trigger baseline un-highlighting in both places

          d3.select(this).attr("fill", "#69b3a2");
          svg.select(".bar-label").remove();
        }
      })
      .on("click", function(d){
        svg.select(".baseline").remove();
        svg.select(".baseline-country").remove();
        
        svg.selectAll(".bar").classed("selected", false);
        // add the "selected" class to the clicked bar
        d3.select(this).classed("selected", true);
        // set the fill color of the selected bar to red
        svg.selectAll(".bar").attr("fill", "#69b3a2")
        d3.select(this).attr("fill", "yellow");

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




updateChartGDPWhole(); // call it once by default, will be called again when user goes back and forth in the second bar chart.

// Code for second bar chart, specifically the whole GDP section (should be displayed first as default) //
function updateChartGDPWhole() {
d3.csv("dataset.csv").then(function(data) {
  svg2.selectAll(".bar").remove();
  svg2.select(".x-axis").remove();
  svg2.select(".y-axis").remove();
  svg2.select(".y-axis-title").remove();
  svg2.select(".baseline").remove();
  svg2.select(".baseline-country").remove();
  
  // sort by highest to lowest using GDP 2019 value.
  data.sort(function(a, b) {
    return d3.descending(+a["GDP ($USD billions PPP) 2019"], +b["GDP ($USD billions PPP) 2019"]);
  });
  
  // X axis
  var xScale2 = d3.scaleBand()
  .range([ 0, width2 ])
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

  
   // attempt for scale break...
    // var yScale2 = d3.scaleLinear()
    // .domain([[0,7000], [7000, 22000]])
    // .scope([[0, 0.5], [0.5,1]])
    // .range([0,100]);
    // svg2.append("g")
    // .call(d3.axisLeft(yScale2));

    var yScale2 = d3.scaleLinear()
    .domain([0, 4000, 22000]) // ****** changing the values inside this parenthesis can change the extent of y
    .range([height2, 0]);
    svg2.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale2));

    svg2.append("text")
    .attr("class", "y-axis-title")
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
        return xScale2(d.Country); 
      })
      .attr("y", function(d) { return yScale2(+d["GDP ($USD billions PPP) 2019"]); })
      .attr("width", xScale2.bandwidth())
      .attr("height", function(d) { return height2 - yScale2(+d["GDP ($USD billions PPP) 2019"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        onClickBaseline(d.Country, "svg");

        d3.select(this).attr("fill", "red");
        svg2.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale2(d.Country) + xScale2.bandwidth() / 2)
          .attr("y", yScale2(+d["GDP ($USD billions PPP) 2019"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country + " " + d["GDP ($USD billions PPP) 2019"])
      })
      .on("mouseout", function(d) {
        unClickBaseline(d.Country);
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
     
})
}


// Let us know what we selected from the top dropdown.
function updateChart(category){
  if(category === "gdp-per-capita") {
    updateChartGDP();
  } else if (category === "health-expenditure"){
    updateChartHealth();
  } else {
    updateChartHealthGDP();
  }
}

// Let us know what we selected from bottom dropdown
function updateChartTwo(category) {
  if(category === "gdp") {
    updateChartGDPWhole();
  } else if (category === "healthMilitaryPortion") {
    updateChartHealthMilitaryTwoPortion();
  }
}

// Second chart Health & Military Stacked bar chart
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
    return d3.descending((+a["GDP without H and M"]) + (+a["health value"]) + (+a["military value"]), (+b["GDP without H and M"]) + (+b["health value"]) + (+b["military value"]));
  });

  // let ourHealthColumn = data.columns.slice(1)[9]; // fetch "expenditure % of GDP" 
  // problem 5/1/23 - These are percentage value as a whole -> fixed by yun providing new dataset 
  // need to convert into percentage in decimal form and multiple by the gdp to get the rates we want. 
  

  var subgroups = data2.columns.slice(1); // list of health value, military value, GDP without H and M columns.
  // console.log(subgroups);
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
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", -15 - marginTwo.right)
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
    // console.log(stackedData);



  //// animation
  var mouseover = function(d) {
    // what subgroup are we hovering?
    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
    console.log(subgroupName);
    var subgroupValue = d.data[subgroupName];
    // console.log(subgroupValue);
    // Reduce opacity of all rect to 0.2
    d3.selectAll(".myRect").style("opacity", 0.2)
    
      var taylorMade = subgroupName.replaceAll(' ', '.');
      // console.log(taylorMade);
      // console.log(d3.selectAll(".myRect."+taylorMade));
      d3.selectAll(".myRect."+taylorMade).style("opacity", 1);
  }
var mouseleave = function(d) {
    // Back to normal opacity: 0.8
    d3.selectAll(".myRect")
      .style("opacity",0.8)
    }

  //// animation

  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .attr("class", function(d){ return "myRect " + d.key }) // 5/3 animation attempt
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale2(d.data.Country); })                                                                     //.attr("x", function(d) { return xScale2(d.data.group); })
        .attr("y", function(d) { return yScale2(d[1]); })
        .attr("height", function(d) { return yScale2(d[0]) - yScale2(d[1]); })
        .attr("width",xScale2.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
       
})
}



// Top chart Health expenditure per person.
function updateChartHealth(){
  console.log("update chart Health expenditure");
  svg.selectAll(".bar").remove();
  svg.select(".x-axis").remove();
  svg.select(".y-axis").remove();
  svg.select(".y-axis-title").remove();
  svg.select(".baseline").remove();
  svg.select(".baseline-country").remove();

  data.sort(function(a, b) {
    return d3.descending(+a["GDP ($USD billions PPP) 2019"], +b["GDP ($USD billions PPP) 2019"]);
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

// Let other svg (top,bottom) know that one chart clicked into baseline.
// make it highlight with red
function onClickBaseline(countryName, whichSVGToCall) {// breakpoint
  // console.log("here");
  // console.log(svg2.selectAll('.rect'));
  svg.select(".bar-label").remove();
  //svg.select(".baseline").remove();
  //svg.select(".baseline-country").remove();
  svg2.select(".bar-label").remove();
  //svg2.select(".baseline").remove();
  //svg2.select(".baseline-country").remove();

if (whichSVGToCall == "svg2") {
  svg2.selectAll('rect').each(function(d,i) {
    if (d.Country == countryName) {
      d3.select(this).attr("fill", "red");
      // d3.select(this).attr('y') ----- example for getting specific attribute
      // need to show country name too
      svg2.append("text")
      .attr("class", "bar-label")
      .attr("x", d3.select(this).attr('x'))
      .attr("y", d3.select(this).attr('y'))
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d.Country)
    } else {
      d3.select(this).attr("fill", "#69b3a2");
    }
    // d3.select(i).attr("fill", "red");
  })
} else if (whichSVGToCall == "svg") {
  svg.selectAll('rect').each(function(d,i) {
    if (d.Country == countryName) {
      d3.select(this).attr("fill", "red");
      svg.append("text")
      .attr("class", "bar-label")
      .attr("x", d3.select(this).attr('x'))
      .attr("y", d3.select(this).attr('y'))
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d.Country)
    }
   
    
  })
}
  

  

}

// Let other svg (top, bottom) know that one chart moved away from baseline.
// back to the green color (which is default)
function unClickBaseline(countryName) { // breakpoint
  

  svg2.selectAll('rect').each(function(d,i) {
    if (d.Country == countryName) {
      d3.select(this).attr("fill", "#69b3a2");
    }
    // d3.select(i).attr("fill", "red");
  })

  svg.selectAll('rect').each(function(d,i) {
    if (d.Country == countryName) {
      d3.select(this).attr("fill", "#69b3a2");
    }
    // d3.select(i).attr("fill", "red");
  })
  
}

// Top chart GDP Per capita
function updateChartGDP(){
  console.log("update chart GDP per capita");
  svg.selectAll(".bar").remove();
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll(".y-axis-title").remove();
  svg.selectAll(".baseline").remove();
  svg.selectAll(".baseline-country").remove();

  data.sort(function(a, b) {
    return d3.descending(+a["GDP ($USD billions PPP) 2019"], +b["GDP ($USD billions PPP) 2019"]);
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
    return d3.descending(+a["GDP ($USD billions PPP) 2019"], +b["GDP ($USD billions PPP) 2019"]);
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
