var NUM_SITES = 21;
var dataset;
var svg;
var w = window.innerWidth;
var h = window.innerHeight;
var padding = 30;
var hortScale;
var vertScale;

var arrays;
var tooltip;

var line = d3.svg.line()
    .x(function(d) { if (undefined != d) {return hortScale(d.date); }})
    .y(function(d) { if (undefined != d) {return vertScale(d.tables_num); }})
    .interpolate("linear");

d3.csv("newdata.csv", function(d) {
    return {
    	url: d.url,
   	time: new Date(parseInt(d.time.substring(0, 4)), parseInt(d.time.substring(4, 6)),
	    d.time.substring(6, 8)),
    	tables_num: parseInt(d.tables_num)
  	};
    }, function(error, data) {
    if (error) {
	console.log(error);
    } else {

    arrays = new Array(NUM_SITES);
    for (var i = 0; i < NUM_SITES; i++) {
    	arrays[i] = new Array();
    }
    svg = d3.select("body")
	.append("svg")
    	.attr("width", w)
	.attr("height", h);
    dataset = data;

    tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "visible")
	.text("a simple tooltip");

    hortScale = d3.time.scale()
			.domain([new Date(2000, 0, 1), d3.max(dataset, function(d) { return d.time; })])
			.range([padding, w - padding * 2]);
    vertScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) { return d.tables_num;})])
			.range([h - padding, padding]);

    makeCircles();
    makeAxes();
    getUrlCollections();
    makeLines();
    }
});

function makeCircles() {
    var dataPoints = svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
	    return hortScale(d.time);	
	})
	.attr("cy", function(d) {
	    return vertScale(d.tables_num);
	})
	.attr("r", 2)
	.attr("fill", "rgba(170,150,150,0.5)")
	.on("mouseover", function(d) {
	    return tooltip.style("visibility", "visible")
			.text(d.url + ", " + d.tables_num);
	})
	.on("mousemove", function(){
	    return tooltip.style("top", (d3.event.pageY - 10) + "px")
			.style("left", (d3.event.pageX + 10) + "px");
	})
	.on("mouseout", function(){
	    return tooltip.style("visibility", "hidden");
	});
}

function makeAxes() {
    var xAxis = d3.svg.axis()
	.scale(hortScale)
	.orient("bottom")
	.ticks(d3.time.year, 1)
	.tickFormat(d3.time.format("%Y"));
    var yAxis = d3.svg.axis()
	.scale(vertScale)
	.orient("left")
	.ticks(5);
    svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (h - padding) + ")") 
	.call(xAxis);
    svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + padding + ",0)")
	.call(yAxis);
}

function getUrlCollections(){
    var urlName = dataset[0].url;
    var urlCount = 0;
    var snapshotCount = 0;
    for (var j = 0; j < dataset.length; j++) {
	if (dataset[j].url === urlName) {
	    arrays[urlCount][snapshotCount++] = dataset[j];
	}
	else {
	    urlName = dataset[j].url;
	    urlCount++;
	    snapshotCount = 0;
	}
    }
}

function makeLines(){
    for (var i = 0; i < NUM_SITES; i++) {
	svg.append("path")
	    .datum("d", line(arrays))
	    .attr("class", "line")
	    .attr("stroke-width", 1)
	    .attr("stroke", "#999")
	    .attr("fill", "none");
    }
}


function makeLabels() {
    svg.selectAll("circle").on("mouseover", function() {
	svg.selectAll("text")
	    .data(dataset)
	    .enter()
	    .append("text")
	    .text(function(d) {
	        return d.url + ", " + d.tables_num;
	    })
	    .attr("x", function(d) {
	        var x = parseInt(d.time.substring(4, 6)); // starts with just month
	        x += parseInt(d.time.substring(2, 4)) * 12; // adds years by converting them to months
	        return hortScale(x);
	    })
	    .attr("y", function(d) {
	        return h - vertScale(parseInt(d.tables_num));
	    })
	    .attr("font-family", "Source Sans Pro")
	    .attr("font-size", "11px")
	    .attr("fill", "#eee");
	});
}
