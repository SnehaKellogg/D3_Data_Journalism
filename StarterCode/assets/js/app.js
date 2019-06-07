// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
// SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;



// remove it and replace it with a resized version of the chart
  var svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
//Read CSV
 d3.csv("/assets/data/data.csv",function(error, acsdata) {
  if(error) return console.warn(error);
  console.log(acsdata[0]);
  acsdata.forEach(function (data) {
    data.age = +data.age;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
    var id = data.map(data => data.id);
    console.log("id", id);
  });
});

var chosenAxis = "";

function xScale(acsdata, chosenAxis){
// scale x to chart width
var xLinearScale = d3.scaleLinear()
  .domain([d3.min(acsdata, d => d[chosenAxis])* 0.8,
  d3.max(acsdata, d => d[chosenAxis])* 1.2])
  .range([0, Width])
  .padding(0.05);

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
  if (chosenXAxis === "smokers") {
    var label = "Smokers: ";
  }
  else if 
    (chosenAxis === "healthcare"){
    var label = "Healthcare:";
    }
  else if
  (chosenAxis === "obesity"){
    var label = "Obese:";
    }
   else if
    (chosenAxis === "obesity"){
      var label = "Obese:";
      }

  }

  // Step 1: Append a div to the body to create tooltips, assign it a class
  // =======================================================
  var toolTip = d3.tip().attr("class", "d3-tip")
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
 
// scale y to chart height
var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(acsdata, d => d.income)])
.range([height, 0]);

// create axes
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

// set x to the bottom of the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(xAxis);

// set y to the y axis
// This syntax allows us to call the axis function
// and pass in the selector without breaking the chaining
chartGroup.append("g")
  .call(yAxis);


var circlesGroup = chartGroup.selectAll("circle")
  .data(acsdata)
  .enter()
  .append("circle")
  .attr("class", "stateCircle")
  .attr("cx", d => xLinearScale(d[chosenAxis]))
  .attr("cy", d => yLinearScale(d.income))
  .attr("r", 15)
  .attr("opacity", ".7");

};
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);