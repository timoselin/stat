angular
	.module('statisticApp')
	.directive('barChart', function() {

  return {
    scope: { 'data': '=' },
    restrict: 'E',
    link: link
  };

	function link(scope, element) {
		if(scope.$parent.dataObj.length === 0) {
			return;
		}
		
		var el = element[0];
		var fullWidth = 800;
		var fullHeight = 800;
		var margin = {
			top: 15,
			right: 15,
			left: 50,
			bottom: 50
		};

		var width = fullWidth - margin.left - margin.right;
		var height = fullHeight - margin.top - margin.bottom;
		var barHeight = (fullHeight - margin.top - margin.bottom *2)* 0.9/scope.$parent.dataObj.length;

		var	parseDate = d3.timeFormat("%a %d %B %I:%M:%S");

		var minimum = d3.min(scope.$parent.dataObj, function(d) { return d.value; });
		var max = d3.max(scope.$parent.dataObj, function(d) { return d.value; });

		var canvas = d3.select(el).append('svg')
   			.attr('class', 'bar-chart-component')
			.attr("width", fullWidth)
    		.attr("height", fullHeight)
  			.append("g")
				.attr("transform", "translate(" + margin.left + ',' + margin.top + ")");
		
		var div = d3.select(el).append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

		var x = d3.scaleLinear()
    		.domain(d3.extent(scope.$parent.dataObj, function(d) { return d.value; }))
			.range([0, width]);

		var y = d3.scaleBand()
			.domain(scope.$parent.dataObj.map(function(d) { return d.date; }))
			.rangeRound([0, height])
    		.padding(0.3);

		var xAxis = d3.axisBottom()
			.scale(x);

		var yAxis = d3.axisLeft()
			.scale(y)
			.ticks(10)
			.tickFormat(d3.timeFormat('%a %e'));

		if (minimum < 0) {
			var transTrans = x(0);
		} else {
			var transTrans = 0;
		}

		canvas.append('text')
			.attr('text-anchor', 'middle')
			.attr('x', width/2)
			.attr('y', height + margin.top)
			.attr('dy', '1.5em')
			.text('Measurement value');
	
		canvas.append('text')
			.attr('text-anchor', 'end')
			.attr('x', 0)
			.attr('y', width - margin.right)
			.attr('dy', '-3.4em')
			.attr('transform', 'rotate(-90)')
			.text('Date');
		
		scale = d3.scaleLinear()
            .domain([0, max])
            .range([0, width]);
		
		if (minimum < 0) {
			canvas.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			canvas.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + transTrans + ",0)")
			.call(yAxis);
			
			canvas.selectAll(".bar")
				.data(scope.$parent.dataObj)
				.enter().append("rect")
				.attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
				.attr("x", function(d) { return x(Math.min(0, d.value)); })
				.attr("y", function(d) { return y(d.date); })
				.attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
				.attr("height", barHeight)
				.on("mouseover", function(d) {
					div.transition()
						.duration(200)
						.style("opacity", .9);
					div.html(parseDate(d.date) + "<br/> <br/>" + d.value)
						.style("left", (d3.event.pageX - 251) + "px")
						.style("top", (d3.event.pageY - 175) + "px");
					})
				.on("mouseout", function(d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
					});
		} else {
			y.domain(scope.$parent.dataObj.map(function(d) { return d.date; }));
  			x.domain([0, max]);
			
			canvas.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			canvas.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + 0 + ",0)")
			.call(yAxis);
			
			canvas.selectAll(".bar")
				.data(scope.$parent.dataObj)
				.enter().append("rect")
				.attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
				.attr("x", function(d) { return x(Math.min(0, d.value)); })
				.attr("y", function(d) { return y(d.date); })
				.attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
				.attr("height", barHeight)
				.on("mouseover", function(d) {
					div.transition()
						.duration(200)
						.style("opacity", .9);
					div.html(parseDate(d.date) + "<br/> <br/>" + d.value)
						.style("left", (d3.event.pageX - 251) + "px")
						.style("top", (d3.event.pageY - 175) + "px");
					})
				.on("mouseout", function(d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
					});
		}
	
		
		var canvas2 = d3.select(el).append('svg')
			.attr('class', 'bar-chart-component')
			.attr("width", fullWidth)
			.attr("height", fullHeight)
			.append("g")
				.attr("transform", "translate(" + margin.left + ',' + margin.top + ")");
		
		var div = d3.select(el).append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
		var x = d3.scaleBand()
			.domain(scope.$parent.dataObj.map(function(d) { return d.date; }))
			.rangeRound([0, width])
			.padding(0.1);
		
		var y = d3.scaleLinear()
			.domain(d3.extent(scope.$parent.dataObj, function(d) { return d.value; }))
			.range([height, 0]);

		var xAxis = d3.axisBottom()
			.scale(x)
			.ticks(5)
			.tickFormat(d3.timeFormat('%a %e'));
		
		var yAxis = d3.axisLeft()
			.scale(y)
			.ticks(5);

		if (minimum < 0) {
			var transFo = y(0);
		} else {
			var transFo = height;
		}

		canvas2.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + transFo + ")")
			.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", "-.55em")
				.attr("transform", "rotate(-90)" );

		canvas2.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + 0 + ",0)")
			.call(yAxis);

		canvas2.append("text")
			.attr("class", "axis-label")
			.attr('text-anchor', 'middle')
			.attr("dx", "-2em")
			.attr("transform", "translate(" + 0 + ',' + height + ")")
			.text("Date");
	
		canvas2.append("text")
			.attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("x", -30)
			.attr("y", 20)
			.attr("dy", "-3.4em")
			.attr("transform", "rotate(-90)")
			.text("Measurement value");
		
		if (minimum < 0) {
			canvas2.selectAll("bar")
				.data(scope.$parent.dataObj)
					.enter()
						.append("rect")
						.attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
						.attr("x", function(d){ return x(d.date); })
						.attr("y", function(d){ return y(Math.max(0, d.value)); })
						.attr("width", x.bandwidth())
						.attr("height", function(d){ return Math.abs(y(d.value) - y(0)); })
						.on("mouseover", function(d) {
							div.transition()
								.duration(200)
								.style("opacity", .9);
							div.html(parseDate(d.date) + "<br/><br/>" + d.value)
								.style("left", (d3.event.pageX - 251) + "px")
								.style("top", (d3.event.pageY - 175) + "px");
							})
						.on("mouseout", function(d) {
							div.transition()
								.duration(500)
								.style("opacity", 0);
							});
		} else {
			canvas2.selectAll("bar")
				.data(scope.$parent.dataObj)
					.enter()
						.append("rect")
						.attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
						.attr("x", function(d) { return x(d.date); })
						.attr("width", x.bandwidth())
						.attr("y", function(d) { return y(d.value); })
						.attr("height", function(d) { return height - y(d.value); })
						.on("mouseover", function(d) {
							div.transition()
								.duration(200)
								.style("opacity", .9);
							div.html(parseDate(d.date) + "<br/><br/>" + d.value)
								.style("left", (d3.event.pageX - 251) + "px")
								.style("top", (d3.event.pageY - 175) + "px");
							})
						.on("mouseout", function(d) {
							div.transition()
								.duration(500)
								.style("opacity", 0);
							});
		}
	}
});


angular
	.module('statisticApp')
	.directive('donutChart', function() {

  return {
    scope: { 'data': '=' },
    restrict: 'E',
    link: link
  };

  function link(scope, element) {

	var minimum = d3.min(scope.$parent.graphData, function(d) { return d; });

	if(scope.$parent.graphData.length > 35 || minimum < 0) {
		return;
	}

	var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
               		"#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", 
               		"#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];
	var color = d3.scaleQuantize()
 		.domain([0, scope.$parent.graphData.length])
		.range(colours);
    var el = element[0];

	var fullWidth = 600;
	var fullHeight = 600;

	var margin = {
  		top: 15,
  		right: 15,
  		left: 50,
  		bottom: 50
	};
	
	var width = fullWidth - margin.left - margin.right;
	var height = fullHeight - margin.top - margin.bottom;

    var min = Math.min(width, height) / 2;

	var data = scope.$parent.graphData;

    var arc = d3.arc()
	  	.outerRadius(min)
		.innerRadius(0);

	var pie = d3.pie()
		.value(function(d) {return d;});

	var labelArc = d3.arc()
    	.innerRadius(min - 30)
    	.outerRadius(min - 30);
		
    var canvas = d3.select(el).append('svg')
    	.attr('width', width)
    	.attr('height', height)
    	.append('g')
        	.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

	/*var div = d3.select(el).append("div")
    	.attr("class", "tooltip2")
    	.style("opacity", 0);*/
	
	var arcs = canvas.selectAll('.arc')
		.data(pie(scope.$parent.graphData))
		.enter()
			.append("g")
			.attr("class", "arc");
	
	arcs.append('path')
		.attr('d', arc)
		.attr('fill', function(d, i) { return color(i); })
		.style('stroke', 'black');
		/*.on("mouseover", function(d) {
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html(d.data)
				.style("left", (d3.event.pageX - 151) + "px")
				.style("top", (d3.event.pageY - 275) + "px");
			})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			});*/
	
	arcs.append('text')
		.attr('transform', function(d) {return "translate(" + labelArc.centroid(d) + ")";})
		.attr('text-anchor', 'middle')
		.attr('font-size', '1.5em')
		.attr('font-color', 'black')
		.text(function(d) {return d.data;});

  }
});

angular
	.module('statisticApp')
	.directive('lineChart', function() {

  return {
    scope: { 'data': '=' },
    restrict: 'E',
    link: link
  };

  function link(scope, element) {
	if(scope.$parent.dataObj.length === 0) {
		return;
	}
	
	var el = element[0];
	var fullWidth = 800;
	var fullHeight = 550;
	var margin = {
  	top: 15,
  	right: 15,
  	left: 50,
  	bottom: 50
	};

	var width = fullWidth - margin.left - margin.right;
	var height = fullHeight - margin.top - margin.bottom;

	var	parseDate = d3.timeFormat("%a %d %B");

	var canvas = d3.select(el).append('svg')
		.attr('class', 'line-chart-component')
   		.attr('width', fullWidth)
    	.attr('height', fullHeight)
  		.append('g')
			.attr('transform', "translate(" + margin.left + ',' + margin.top + ")");
	
	var div = d3.select(el).append("div")
    	.attr("class", "tooltip2")
    	.style("opacity", 0);
	
	var x = d3.scaleBand()
    	.domain(scope.$parent.dataObj.map(function(d) { return d.date; }))
		.rangeRound([0, width])
    	.padding(0.1);
		
	var y = d3.scaleLinear()
		.domain(d3.extent(scope.$parent.dataObj, function(d) { return d.value; }))
		.range([height + margin.top, 0]);
	
	var yAxis = d3.axisLeft()
		.scale(y)
		.ticks(5);
	
	var xAxis = d3.axisBottom()
		.scale(x)
		.ticks(10)
		.tickFormat(d3.timeFormat('%a %e'));
	
	canvas.append('g')
	  	.attr('class', 'axis')
	  	.call(yAxis);
	
	canvas.append('g')
		.attr('class', 'axis')
	  	.attr('transform', "translate(0," + 500 + ")")
	  	.call(xAxis)
	.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", "-1.7em")
		.attr("transform", "rotate(-90)" );
	
	canvas.append('text')
		.attr('text-anchor', 'middle')
		.attr('x', width)
		.attr('y', height + margin.bottom)
		.attr("dy", "-.8em")
		.text('Date');
	
	canvas.append('text')
		.attr('text-anchor', 'end')
		.attr('y', 6)
		.attr('dy', '-3em')
		.attr('transform', 'rotate(-90)')
		.text('Measurement value');
	
	var area = d3.area()
    	.x(function(d) { return x(d.date); })
    	.y0(height + margin.top)
    	.y1(function(d) { return y(d.value); });

	var line = d3.line()
		//.curve(d3.curveBasis)
		.x(function(d) { return x(d['date']); })
		.y(function(d) { return y(d['value']); });

	canvas.append("path")
       .data([scope.$parent.dataObj])
       .attr("class", "area")
       .attr("d", area);
	
	canvas.append('path')
		.attr('d', line(scope.$parent.dataObj))
		.style('stroke', function() { 
			return '#000000';
		})
		.style('fill', 'none')
		.style('stroke-width', '1.5');

	var dataCirclesGroup = canvas.append('g');
	var circles = dataCirclesGroup.selectAll('.data-point')
			.data(scope.$parent.dataObj);
		circles
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('fill', function() { return 'red'; })
			.attr('cx', function(d) { return x(d['date']); })
			.attr('cy', function(d) { return y(d['value']); })
			.attr('r', function() { return 3.5; })
			.on("mouseover", function(d) {
					div.transition()
						.duration(200)
						.style("opacity", .9);
					div.html(parseDate(d.date) + "<br/><br/>" + d.value)
						.style("left", (d3.event.pageX - 251) + "px")
						.style("top", (d3.event.pageY - 175) + "px");
					})
			.on("mouseout", function(d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
					});
  }
});
