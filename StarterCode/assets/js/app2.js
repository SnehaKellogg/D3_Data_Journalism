var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(myData) {
    console.log(myData[0]);
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    myData.forEach(function(data) {
        data.age = +data.age;
        data.income = +data.income;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
    });
    // var chosenXAxis = "";
// function xScale(myData, chosenXAxis){
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[xLinearScale])* 0.8,
      d3.max(myData,d => d[xLinearScale])* 1.2])
      .range([0, width]);
    //   return xLinearScale;
// }

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(myData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);

    // var bottomAxis = d3.axisBottom(chosenXAxis);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // // Initialize tool tip
    // // =========================
    // function updateToolTip(chosenXAxis, circlesGroup) {
    //     if (chosenXAxis === "smokes") {
    //       var label = "Smokers: ";
    //     }
    //     else if 
    //       (chosenXAxis === "healthcare"){
    //       var label = "Healthcare:";
    //       }
    //     else if
    //     (chosenXAxis === "obesity"){
    //       var label = "Obese:";
    //       }
    //      };

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        // return (`${d.state}<br>${label}: ${d.chosenXAxis}<br>Healthcare: ${d.healthcare}`);
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });
// svg.call(toolTip);  

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    // .attr("class") //,("statecircle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "8")
    .attr("fill", "blue")
    .attr("opacity", ".7");
    
    
    // circlesGroup.on('mouseover', toolTip.show)
    // .on('mouseout', toolTip.hide);

   

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare (in %) ");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (in %)");
  });
