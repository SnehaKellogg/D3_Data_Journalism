var Chart = (function(window, d3) {

    var svg, data, x, y, xAxis, yAxis, dim, chartWrapper, line, path, margin = {},
      width, height;
  
    d3.csv('/assets/data/data.csv', convert, init); //load data, convert, then initialize chart
  
    function convert(d) {
      return {
        // date: new Date(d.date),
        age : +d.age,
        income : +d.income,
        smokes : +d.smokes,
        healthcare : +d.healthcare,
        poverty : +d.poverty,        // convert string to number
      };
    } 
  
    //called once the data is loaded
    function init(csv) {
      data = csv;
  
      //initialize scales
      xExtent = d3.extent(data, function(d, i) {
        return d.poverty;
      });
      yExtent = d3.extent(data, function(d, i) {
        return d.healthcare;
      });
      x = d3.scaleLinear().domain(xExtent);
      y = d3.scaleLinear().domain(yExtent);
  
      //initialize axis
      xAxis = d3.axisBottom();
      yAxis = d3.axisLeft();
  
      //the path generator for the line chart
      line = d3.line()
        .x(function(d) {
          return x(d.poverty)
        })
        .y(function(d) {
          return y(d.healthcare)
        });
  
      //initialize svg
      svg = d3.select('#scatter').append('svg');
      chartWrapper = svg.append('g');
      path = chartWrapper.append('path').datum(data).classed('line', true);
      chartWrapper.append('g').classed('x axis', true);
      chartWrapper.append('g').classed('y axis', true);
  
      //render the chart
      render();
    }
  
    function render() {
  
      //get dimensions based on window size
      updateDimensions(window.innerWidth);
  
      //update x and y scales to new dimensions
      x.range([0, width]);
      y.range([height, 0]);
  
      //update svg elements to new dimensions
      svg
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom);
      chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
      //update the axis and line
      xAxis.scale(x);
      yAxis.scale(y);
  
      svg.select('.x.axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
  
      svg.select('.y.axis')
        .call(yAxis);
  
      path.attr('d', line);
    }
  
    function updateDimensions(winWidth) {
      margin.top = 20;
      margin.right = 50;
      margin.left = 50;
      margin.bottom = 50;
  
      width = winWidth - margin.left - margin.right;
      height = 500 - margin.top - margin.bottom;
    }
  
    return {
      render: render
    }
  })(window, d3);
  