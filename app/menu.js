////////////// Set Up D3 Vars //////////////

var Space = {
  width : window.innerWidth,
  height : window.innerHeight
}

var BASE_NODE_PARAMS = {
  name: Date.now().toString(),
  color: "transparent",
  cx: Space.width/2,
  cy: Space.height/2 + (Space.height < 750 ? 50 : 110),
  class: "modal-trigger menu" + this.name.toLocaleLowerCase().replace(/\s/g, "-"),
  id: "overwrite_me",
  padding: 4, // separation between nodes
  menuOffset: (Space.height < 750 ? 50 : 110), // offset from middle
  radiusOffset: (Space.height < 750 ? 0.7 : 1),
  text: "howdy!",
  textSize: (Space.height < 750 ? '1em' : '1.3em'),
  textColor: "white",
  textOffset: (Space.height < 750 ? 4 : 6), // offset for text inside circle elements
  maxRadius: (50 * (Space.height < 750 ? 0.7 : 1)), // radii
  cursor: 'pointer',
  strokeWidth: 1,
  normalStrokeWidth: 1,
  highLightStrokeWidth: 2.5,
  stroke: "#FFFFFF", // perimeter color
  strokeDash: 0,
  radius: 50,
  text_anchor: "middle",
  font_family: "'Raleway', sans-serif",
  font_weight: "200",
}

function createNode(params){
  return {
    name: textToId(params["text"]) || BASE_NODE_PARAMS["name"],
    id: textToId(params["text"]) || BASE_NODE_PARAMS["id"],
    color: params["color"] || BASE_NODE_PARAMS["color"],
    cx: params["cx"] || BASE_NODE_PARAMS["cx"],
    cy: params["cy"] || BASE_NODE_PARAMS["cy"],
    class: params["class"] || BASE_NODE_PARAMS["class"],
    menuOffset: params["menuOffset"] || BASE_NODE_PARAMS["menuOffset"],
    padding: params["padding"] || BASE_NODE_PARAMS["padding"],
    radiusOffset: params["radiusOffset"] || BASE_NODE_PARAMS["radiusOffset"],
    text: params["text"] || BASE_NODE_PARAMS["text"],
    textSize: params["textSize"] || BASE_NODE_PARAMS["textSize"],
    textColor: params["textColor"] || BASE_NODE_PARAMS["textColor"],
    textOffset: params["textOffset"] || BASE_NODE_PARAMS["textOffset"],
    maxRadius: params["maxRadius"] || BASE_NODE_PARAMS["maxRadius"],
    cursor: params["cursor"] || BASE_NODE_PARAMS["cursor"],
    strokeWidth: params["strokeWidth"] || BASE_NODE_PARAMS["strokeWidth"],
    highLightStrokeWidth: params["highLightStrokeWidth"] || BASE_NODE_PARAMS["highLightStrokeWidth"],
    stroke: params["stroke"] || BASE_NODE_PARAMS["stroke"],
    strokeDash: params["strokeDash"] || BASE_NODE_PARAMS["strokeDash"],
    radius: params["radius"] || BASE_NODE_PARAMS["radius"],
    text_anchor: params["text_anchor"] || BASE_NODE_PARAMS["text_anchor"],
    font_family: params["font_family"] || BASE_NODE_PARAMS["font_family"],
    font_weight: params["font_weight"] || BASE_NODE_PARAMS["font_weight"],
  };
}

function textToId(name){
  if (!name) { return null }
  return name.toLocaleLowerCase().split(" ").join("_")
}

function createMenuItems(){
  return [
    createNode({
      "radius": 24,
      "text": "CV"
    }),
    createNode({
      "radius": 32,
      "text": "Blog"
     }),
    createNode({
      "radius": 37,
      "text": "About"
     }),
    createNode({
      "radius": 49,
      "text": "Connect"
     }),
    createNode({
      "radius": 50,
      "text": "My Work"
     }),
    createNode({
      "radius": 35,
      "textSize": "0.9em",
      "color": "#ff00a0",
      "textColor": "pink",
      "text": "Drag Me",
      "strokeWidth": '0',
      "highLightStrokeWidth": '0',
      "padding": 0.1
    })
  ];
}


// TODO: refactor
// function generateNodeArray(alignment){
//   var nodeArray = [];
//   var count = 0
//   var angle = 0
//   for (nameKey in menuItems) {
//     var radius = menuItems[nameKey];
//     if (alignment === "horizontal"){
//       nodeArray.push(nodeBuilder(nameKey, radius, {x: -200 + (count+=60), y: 0}))
//     } else if (alignment === "vertical"){
//       nodeArray.push(nodeBuilder(nameKey, radius, {x: 0, y: -180 + (count+=60)}))
//     } else if (alignment === "spiral"){
//       angle = 0.2 * (count+=3.5);
//       var xOffset = -60 - (35 * angle * Math.cos(angle));
//       var yOffset = (35 * angle * Math.sin(angle));
//       nodeArray.push(nodeBuilder(nameKey, radius, {x: xOffset, y: yOffset}));
//     } else {
//       nodeArray.push(nodeBuilder(nameKey, radius, {x: 0, y: 0}))
//     }
//   }
//   return nodeArray;
// }

function fetchMenuItems(){
  if (position = getMenuPosition()){
    var positionArray = position.split(",");
    var x = positionArray[0];
    var y = positionArray[1];
    var newMenu = createMenuItems();
    newMenu.forEach(function(i){i["cx"] = x; i["cy"] = y;});
    return newMenu;
  } else {
    return null;
  }
}

var nodes = fetchMenuItems() || createMenuItems();
var n = nodes.length, // total number of nodes
m = 1; // number of distinct clusters

var force = d3.layout.force()
  .nodes(nodes)
  .size([Space.width, Space.height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();

var svg = d3.select("body").append("svg")
  .attr("width", Space.width)
  .attr("height", Space.height)
  .style("position", 'fixed')
  .style("top", 0);

var circle = svg.selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("href", "#modal1")
  .attr("class", function(d) {return d.class})
  .attr("id", function(d){ return d.id })
  .attr("r", function(d) { return d.radius; })
  .style("fill", function(d) { return d.color; })
  .style("cursor", function(d) { return d.cursor; })
  .style("stroke-width", function(d) { return d.strokeWidth; })
  .style("stroke", function(d) { return d.stroke; })
  .call(force.drag);

var text = svg.selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .call(force.drag);

var textLabels = text
  .attr("x", function(d) { return d.cx; })
  .attr("y", function(d) { return d.cy + d.textOffset; })
  .text(function(d){ return d.text; })
  .attr("class", function(d){ return d.class })
  .attr("id", function(d){ return d.id + "_text"; })
  .attr("text-anchor", function(d){ return d.text_anchor; })
  .attr("font-family", function(d){ return d.font_family; })
  .attr("font-weight", function(d){ return d.font_weight; })
  .attr("font-size", function(d){ return d.textSize; })
  .attr("fill", function(d){ return d.textColor; } )
  .style("cursor", function(d){ return d.cursor; } );


function tick(e) {
  circle
    .each(gravity(.025 * e.alpha))
    .each(collide(.2))
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  text
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y + d.textOffset; });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + d.maxRadius + d.padding,
      nx1 = d.x - r,
      nx2 = d.x + r,
      ny1 = d.y - r,
      ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
          y = d.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + quad.point.radius + (d.color !== quad.point.color) * d.padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function highligtNode(node){
  document.getElementById(node.id).style.strokeWidth = node.highLightStrokeWidth;
}

function unhighlightNode(node){
  document.getElementById(node.id).style.strokeWidth = node.strokeWidth;
}

function focusNode(id){
  var targetNode = getNodeById(id);
  highligtNode(targetNode);
  var otherNodes = getNonTargetNodesByName(id);
  otherNodes.forEach(function(node){
    node.cx = targetNode.x;
    node.cy = targetNode.y;
    unhighlightNode(node);
  });

  d3.layout.force()
  .nodes(nodes)
  .size([Space.width, Space.height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();
  return targetNode;
}

function defocusNode(id){
  var targetNode = getNodeById(id);
  unhighlightNode(targetNode);
  d3.layout.force()
  .nodes(nodes)
  .size([Space.width, Space.height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();
  return targetNode;
}

function repositionCluster(event){
  nodes.forEach(function(node){
    node.cx = event.clientX;
    node.cy = event.clientY;
  });
}

function resetRadii(){
  for (var i = 0; i < nodes.length; i++){
    nodes[i].radius = menuItems[nodes[i].name] * nodes[i].radiusOffset;
  }
  circle.attr("r", function(d) {return d.radius});
}

function resetPosition(){
  for (var i = 0; i < nodes.length; i++){
    nodes[i].cx = Space.width / 2;
    nodes[i].cy = Space.height / 2 + nodes[i].menuOffset;
  }
  d3.layout.force()
  .nodes(nodes)
  .size([Space.width, Space.height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();
  resetMenuPosition();
}

function resize(e){
  // get width/height of resized window, update SVG, data and force accordingly
  var width = window.innerWidth;
  var height = window.innerHeight;
  svg.attr('width', width);
  svg.attr('height', height);

  menuOffset = height > 750 ? 110 : 50;
  radiusOffset = height > 750 ? 1 : .7;

  nodes.forEach(function(node){
    node.cx = width/2;
    node.cy = height/2 + menuOffset;
    node.radius = node.radius * radiusOffset;
  })

  force.size([width, height]).resume();
}

////////////// Menu Persistence //////////////


function setMenuPosition(centralNode){
  var x = parseInt(centralNode.x);
  var y = parseInt(centralNode.y);
  var positionString = x.toString() + "," + y.toString();
  localStorage.setItem("menuPosition", positionString);
}

function resetMenuPosition(){
  localStorage.removeItem("menuPosition");
}

function getMenuPosition(){
  return localStorage.getItem("menuPosition");
}

////////////// Util Functions //////////////

function getNodeById(id){
  for (var i = 0; i < nodes.length; i++){
    if (nodes[i].id === id){
      return nodes[i];
    }
  }
  return {}
}

function getNonTargetNodesByName(id){
  var others = []
  for (var i = 0; i < nodes.length; i++){
    if (nodes[i].id !== id){
      others.push(nodes[i]);
    }
  }
  return others
}

function elementsAreOverlapping(a, b, padding){
  pad = padding || 0;
  a = a.getBoundingClientRect();
  b = b.getBoundingClientRect();

  return !( a.right + pad < b.left + pad ||
            a.left + pad > b.right + pad ||
            a.bottom + pad < b.top + pad ||
            a.top + pad > b.bottom + pad )
}

$(document).on('touchstart', function() {
  documentClick = true;
});
$(document).on('touchmove', function() {
  documentClick = false;
});
$(document).on('click touchend', function(event) {
  if (event.type == "click") documentClick = true;
  if (documentClick){
    doStuff();
  }
 });

////////////// Set Up Listeners //////////////

$(function(){

  window.onresize = resize;

  var logoElement = document.getElementById("my-logo");
  var nameElement = document.getElementById("name");
  var titleElement = document.getElementById("description");
  var untouchables = [logoElement, nameElement, titleElement];

  var github = '<a target="_blank" href="http://github.com/cdepman"> <i id="github" class="hvr-shrink connect-icon fa fa-github-square fa-5x"></i> </a>';
  var email = '<a target="_blank" href="mailto:cdepman@gmail.com"> <i id="email" class="hvr-shrink connect-icon fa fa-envelope-square fa-5x"></i> </a>';
  var linkedIn = '<a target="_blank" href="http://linkedin.com/in/cdepman"> <i id="linked-in" class="hvr-shrink connect-icon fa fa-linkedin-square fa-5x"></i> </a>';
  var facebook = '<a target="_blank" href="http://facebook.com/cdepman"> <i id="facebook" class="hvr-shrink connect-icon fa fa-facebook-square fa-5x"></i> </a>';

  var connections = '<div class="connectors">' + github + email + linkedIn + facebook + '</div>';
  $('body').append(connections);
  $('.connectors').toggle();

  var connect = function(){
    $('.connectors').slideToggle("slow");
    $('#lean_overlay').fadeIn("fast");
    $('.connectors-background').fadeIn("slow");
    $('.connectors-outline').fadeIn("slow");
    $('.close-connectors').fadeIn("fast");
  };

  $('#connect, #connect_text').on('click', connect);

  function resetIfOverlappingWithUntouchables(element){
    for (var i = 0; i < untouchables.length; i++){
      if (elementsAreOverlapping(element, untouchables[i], -20)){
        return resetPosition();
      }
    }
  }

  function doMouseLeaveActions(event){
    var node = defocusNode(event.target.id);
    setMenuPosition(node);
    resetIfOverlappingWithUntouchables(event.target);
    force.stop();
  }

  function doMouseEnterActions(event){
    focusNode(event.target.id);
  }

  function doMouseEnterTextActions(event){
    var node_id = event.target.id;
    node_id = node_id.slice(0, node_id.indexOf("_text"));
    focusNode(node_id);
  }

  function doMouseDragActions(event){
    var node_id = event.target.id;
    node_id = node_id.slice(0, node_id.indexOf("_text"));
    repositionCluster(event);
  }

  function createAndSetListeners(){
    nodes.forEach(function(node){
      $("#" + node.id).on('mouseleave', doMouseLeaveActions);
      $("#" + node.id).on('mouseenter', doMouseEnterActions);
      $("#" + node.id + "_text").on('mouseenter', doMouseEnterTextActions);
      $("#drag_me").on('click', doMouseDragActions);
      $("#drag_me_text").on('click', doMouseDragActions);
    })
  }

  createAndSetListeners();

  // enter about description and set up listener
  $('#about, #about_text').on('click', function(){
    $('#head-shot').fadeIn("fast");
    $('#lean_overlay').fadeIn();
    $('#modal1').fadeIn();
    $('#head-shot-outline').fadeIn("fast");
    $('.title').css('z-index', 10080);
  })

  $('#lean_overlay').on('click',function(){
    $('#lean_overlay').fadeOut("slow");
    $('#head-shot').fadeOut();
    $('.connectors').slideUp("slow");
    $('#modal1').fadeOut();
    $('#modal2').fadeOut();
    $('.connectors-background').fadeOut("slow");
    $('.connectors-outline').fadeOut("slow");
    $('.close-connectors').fadeOut("fast");
    setTimeout(function(){
      $('.title').css('z-index', 1);
    }, 500);
    $('.cv-options').fadeOut();
  })

  $('.modal-close').on('click',function(){
    $('#lean_overlay').fadeOut();
    $('#modal1').fadeOut();
    $('#head-shot').fadeOut();
    setTimeout(function(){
      $('.title').css('z-index', 1);
    }, 500);
  })

  $('#cv, #cv_text').on('click', function(){
    window.open('/assets/CharlieDepmanResume.pdf', '_blank');
  });

  $('#my_work, #my_work_text').on('click', function(){
    window.location.href = 'myWork.html';
  });

  $('#blog, #blog_text').on('click', function(){
    window.open('http://blog.charlied.xyz', '_blank');
  });

  $('i.close-connectors').on('click', function(){
    $('#lean_overlay').fadeOut("slow");
    $('.close-connectors ').fadeOut("fast");
    $('.connectors').slideUp("slow");
    $('.connectors-background').fadeOut("slow");
    $('.connectors-outline').fadeOut("slow");
  });

});
