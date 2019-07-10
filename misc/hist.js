/**
 * Created by Kui Xu on 2017/8/7.
 * mail: xukui.cs@gmail.com
 */
var data = d3.range(1000).map(d3.randomBates(10));

var formatCount = d3.format(",.0f");

var svg = d3.select("svg"),
  margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 30
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
  .rangeRound([200, 600]);

var bins = d3.histogram()
  .domain(x.domain())
  .thresholds(x.ticks(200))
  (data);

var y = d3.scaleLinear()
  .domain([0, d3.max(bins, function(d) {
    return d.length;
  })])
  .range([height, 0]);

var bar = g.selectAll(".bar")
  .data(bins)
  .enter().append("g")
  .attr("class", "bar")
  .attr("transform", function(d) {
    var str = "translate(" + x(d.x0) + "," + y(d.length) + ")";
    return str;
  });

bar.append("rect")
  .attr("x", 1)
  .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
  .attr("height", function(d) {
    return height - y(d.length);
  });

bar.append("text")
  .attr("dy", ".75em")
  .attr("y", 6)
  .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
  .attr("text-anchor", "middle");
//.text(function(d) { return formatCount(d.length); });

g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0.25," + height + ")")
  .call(d3.axisBottom(x));
