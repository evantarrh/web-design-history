var dataset;
var svg;
var w = window.innerWidth;
var h = window.innerHeight;
var hortScale = d3.scale.linear()
			.domain([0, 180])
			.range([0, w]);
var vertScale = d3.scale.linear()
			.domain([0, 600])
			.range([0, h]);

d3.csv("newdata.csv", function(error, data) {
    if (error) {
	console.log(error);
    } else {
	console.log(data);

	svg = d3.select("body")
	    .append("svg")
    	    .attr("width", w)
	    .attr("height", h);
	dataset = data;
	makeCircles();
	makeAxes();
    }
});

function makeCircles() {
    var dataPoints = svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle");
    dataPoints.attr("cx", function(d) {
	    var x = parseInt(d.time.substring(4, 6)); // starts with just month
	    x += parseInt(d.time.substring(2, 4)) * 12; // adds years by converting them to months
	    console.log(d.url + " at " + d.time + " returns as its months " + x);
	    return hortScale(x);	
	})
	.attr("cy", function(d) {
	    var y = vertScale(parseInt(d.tables_num));
	    console.log(d.url + " at " + d.time + " has this many tables: " + d.tables_num + " and its y is " + y);
	    return h - y;
	})
	.attr("r", 5);
    makeAxes(svg);
}

function makeAxes() {
    var xAxis = d3.svg.axis()
	.scale(hortScale)
	.orient("bottom");
    var yAxis = d3.svg.axis()
	.scale(vertScale)
	.orient("left");
    svg.append("g")
	.call(xAxis);
    svg.append("g")
	.call(yAxis);
}


