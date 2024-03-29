// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "smokes";

// function used for updating x-scale var upon click on axis label
function xScale(mydata, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(mydata, d => d[chosenXAxis]) * 0.8,
      d3.max(mydata, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  
  return circlesGroup;
};


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  if (chosenXAxis === "smokes") {
    var label = "Smokers: ";
  }
  else {
    var label = "Healthcare:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}% <br> Income: ${d.income}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
};
  
  // Retrieve data from the CSV file and execute everything below
  d3.csv("/assets/data/data.csv")
  .then(function(mydata) {
console.log(mydata[0])
  //parse data
  mydata.forEach(function(data) {
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
  });
 
  //xLinearScale function above csv import
  var xLinearScale = xScale(mydata, chosenXAxis);
  //console.log(xLinearScale);
  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(mydata, d => d.income)])
    .range([height, 0]);
  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
  
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(mydata)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", 15)
    .attr("opacity", ".7");

  // var circlesText = chartGroup.selectAll("g")
  //     .data(mydata)
  //     .enter()
  //     .append("text")
  //     .attr("class", "stateText")
  //     .attr("dx", d => xLinearScale(d[chosenXAxis]))
  //     .attr("dy", d => yLinearScale(d.income))
  //     .text(function(d) {
  //     return d.abbr;
  //     });
  
  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var smokesLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "smokes") // value to grab for event listener
    .classed("active", true)
    .text("Smokers (%)");
  
  var healthcareLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");
  
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Income");
  
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      // replaces chosenXaxis with value
      chosenXAxis = value;
      //console.log(chosenXAxis)
      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(mydata, chosenXAxis);
      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
      // changes classes to change bold text
      if (chosenXAxis === "smokes") {
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
});