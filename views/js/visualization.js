//the size of the svg container

var margin = {top: 20, right: 50, bottom: 20, left: 50},
  width = 960 - margin.right - margin.left,
  height = 250 - margin.top - margin.bottom;
  
var i = 0;

//assigning variable to tree and setting size
var tree = d3.layout.tree()
  .size([height, width]);

//declaring the variable for drawing the lines
var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });


var svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the external data
// d3.json("/data", function(error, treeData) {
d3.json("js/data.json", function(error, treeData) {
  console.log(treeData);

  //treeData[0] is top level of json file.
  //to make different root, set something like treeData[0].children[#] etc
  root = treeData[0];
  //this draws the diagram
  update(root);
});

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  //horizontal distance away from previous level of graph
  nodes.forEach(function(d) { d.y = d.depth * 200; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("id", function(d) { return d.name; })
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("fill", "#fff");

  // nodeEnter.append("text")
  //   .attr("x", function(d) { 
  //     return d.children || d._children ? -13 : 13; })
  //   .attr("dy", ".35em")
  //   .attr("text-anchor", function(d) { 
  //     return d.children || d._children ? "end" : "start"; })
  //   .text(function(d) { return d.name; })
  //   .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);

click();
}

function click(){
  var g = d3.select('body').selectAll('.node')
  console.log(g);

  g.on("click", function(){
    d3.select(this)
    .append('text').text(function(g) { 
      

      return g.name; 
    })
  });
}

//   g.on("mouseout", function(){})

// }