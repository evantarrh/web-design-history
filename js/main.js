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

d3.csv("newdata.csv", function(d) {
    var strArray = d.url.split(".");
    return {
        url: strArray[0],
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
	    arrays[++urlCount][0] = dataset[j];
	    snapshotCount = 1;
	}
    }
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
	.attr("class", function(d) {
	    return "tables " + d.url;
	})
	.attr("visibility", "hidden")
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

function makeLines(){
    for (var i = 0; i < NUM_SITES; i++) {
	svg.append("path")
	    .datum(arrays[i])
	    .attr("d", function(d) {
		    console.log(d);
		    var arrLen = d.length;
		    var j = 0;
		    var pathData = "M";
		    for (var j = 0; j < arrLen; j++) {
			if (j !== 0) {
			    pathData += "L";
			}
			pathData += " " + hortScale(d[j].time) + " " + vertScale(d[j].tables_num);
		    }
		    return pathData;
	    })
	    .attr("class", "line")
	    .attr("stroke-width", 2)
	    .attr("stroke", "rgba(200,200,200,0.5)")
	    .attr("fill", "none")
	    .on("mouseover", function(d) {
		return d3.selectAll("." + d[0].url).attr("visibility", "visibile");
	    })
	    .on("mouseout", function(d) {
		return d3.selectAll("." + d[0].url).attr("visibility", "hidden");
	    });
    }
}

