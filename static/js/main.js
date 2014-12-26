

// <svg width="200" height="200">
//   <rect x="50" y="5" width="20" height="40" rx="3" ry="3" />
// </svg>

var w = 500, h = 100;

var svg = d3.select('body')
	.append('svg')
	.attr('width', w)
	.attr('height', h);


exampleData = {'20000101': 60, '20000601': 78, '20010101': 41, '20010601': 35}

// databaseMethods.fillSnapshotDatabase();
// crawlMethods.addLinks();

basetime = 19990101;

svg.selectAll('rect')
	.data(exampleData)
	.enter()
	.append('rect')
	.attr('x', function(d, i) {
		return i * (w / exampleData.length);
	})
	.attr('y', function(d, i) {
		if (i % 2 === 0){
				basetime += 10000;
		}
		else{
				basetime += 600;
		}
		return exampleData[basetime] - (d * 9);
	}
	)
	.attr('width', w / sleepData.length - 2)
	.attr('height', function(d) {
		return d * 9;
	});
