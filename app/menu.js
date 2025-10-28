import * as d3 from 'd3';

////////////// Set Up D3 Vars //////////////

const Space = {
  width: window.innerWidth,
  height: window.innerHeight
};

const BASE_NODE_PARAMS = {
  name: Date.now().toString(),
  color: "transparent",
  cx: Space.width / 2,
  cy: Space.height / 2 + (Space.height < 750 ? 50 : 110),
  class: "modal-trigger menu",
  id: "overwrite_me",
  padding: 4,
  menuOffset: (Space.height < 750 ? 50 : 110),
  radiusOffset: (Space.height < 750 ? 0.7 : 1),
  text: "howdy!",
  textSize: (Space.height < 750 ? '1em' : '1.3em'),
  textColor: "white",
  textOffset: (Space.height < 750 ? 4 : 6),
  maxRadius: (50 * (Space.height < 750 ? 0.7 : 1)),
  cursor: 'pointer',
  strokeWidth: 1,
  normalStrokeWidth: 1,
  highLightStrokeWidth: 2.5,
  stroke: "#FFFFFF",
  strokeDash: 0,
  radius: 50,
  text_anchor: "middle",
  font_family: "'Raleway', sans-serif",
  font_weight: "200",
};

function createNode(params) {
  const textToId = (name) => {
    if (!name) return null;
    return name.toLowerCase().split(" ").join("_");
  };

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

function createMenuItems() {
  return [
    createNode({ "radius": 24, "text": "CV" }),
    createNode({ "radius": 32, "text": "Blog" }),
    createNode({ "radius": 37, "text": "About" }),
    createNode({ "radius": 49, "text": "Connect" }),
    createNode({ "radius": 50, "text": "My Work" }),
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

const nodes = createMenuItems();

// D3 v7 uses forceSimulation instead of force layout
const simulation = d3.forceSimulation(nodes)
  .force("center", d3.forceCenter(Space.width / 2, Space.height / 2))
  .force("charge", d3.forceManyBody().strength(0))
  .force("collide", d3.forceCollide().radius(d => d.radius + d.maxRadius + d.padding).iterations(2))
  .on("tick", tick);

const svg = d3.select("body").append("svg")
  .attr("width", Space.width)
  .attr("height", Space.height)
  .style("position", 'fixed')
  .style("top", 0);

const circle = svg.selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("class", d => d.class)
  .attr("id", d => d.id)
  .attr("r", d => d.radius)
  .style("fill", d => d.color)
  .style("cursor", d => d.cursor)
  .style("stroke-width", d => d.strokeWidth)
  .style("stroke", d => d.stroke)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

const text = svg.selectAll("text")
  .data(nodes)
  .join("text")
  .attr("class", d => d.class)
  .attr("id", d => d.id + "_text")
  .attr("text-anchor", d => d.text_anchor)
  .attr("font-family", d => d.font_family)
  .attr("font-weight", d => d.font_weight)
  .attr("font-size", d => d.textSize)
  .attr("fill", d => d.textColor)
  .style("cursor", d => d.cursor)
  .text(d => d.text)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

function tick() {
  circle
    .each(gravity(0.025))
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  text
    .attr("x", d => d.x)
    .attr("y", d => d.y + d.textOffset);
}

function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
  setMenuPosition(d);
  checkOverlapWithUntouchables(event.target);
}

function highlightNode(node) {
  document.getElementById(node.id).style.strokeWidth = node.highLightStrokeWidth;
}

function unhighlightNode(node) {
  document.getElementById(node.id).style.strokeWidth = node.strokeWidth;
}

function getNodeById(id) {
  return nodes.find(node => node.id === id) || {};
}

function getNonTargetNodesByName(id) {
  return nodes.filter(node => node.id !== id);
}

function focusNode(id) {
  const targetNode = getNodeById(id);
  highlightNode(targetNode);
  const otherNodes = getNonTargetNodesByName(id);

  otherNodes.forEach(node => {
    node.cx = targetNode.x;
    node.cy = targetNode.y;
    unhighlightNode(node);
  });

  simulation.alpha(0.3).restart();
  return targetNode;
}

function defocusNode(id) {
  const targetNode = getNodeById(id);
  unhighlightNode(targetNode);
  simulation.alpha(0.3).restart();
  return targetNode;
}

function setMenuPosition(centralNode) {
  const x = parseInt(centralNode.x);
  const y = parseInt(centralNode.y);
  const positionString = x.toString() + "," + y.toString();
  localStorage.setItem("menuPosition", positionString);
}

function resetMenuPosition() {
  localStorage.removeItem("menuPosition");
}

function resetPosition() {
  nodes.forEach(node => {
    node.cx = Space.width / 2;
    node.cy = Space.height / 2 + node.menuOffset;
  });
  simulation.alpha(0.3).restart();
  resetMenuPosition();
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  svg.attr('width', width).attr('height', height);

  const menuOffset = height > 750 ? 110 : 50;
  const radiusOffset = height > 750 ? 1 : 0.7;

  nodes.forEach(node => {
    node.cx = width / 2;
    node.cy = height / 2 + menuOffset;
    node.radius = node.radius * radiusOffset;
  });

  simulation.force("center", d3.forceCenter(width / 2, height / 2));
  simulation.alpha(0.3).restart();
}

function elementsAreOverlapping(a, b, padding = 0) {
  const rectA = a.getBoundingClientRect();
  const rectB = b.getBoundingClientRect();

  return !(
    rectA.right + padding < rectB.left + padding ||
    rectA.left + padding > rectB.right + padding ||
    rectA.bottom + padding < rectB.top + padding ||
    rectA.top + padding > rectB.bottom + padding
  );
}

function checkOverlapWithUntouchables(element) {
  const untouchables = [
    document.getElementById("my-logo"),
    document.getElementById("name"),
    document.getElementById("description")
  ];

  for (const untouchable of untouchables) {
    if (untouchable && elementsAreOverlapping(element, untouchable, -20)) {
      resetPosition();
      break;
    }
  }
}

////////////// Set Up Event Listeners //////////////

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('resize', resize);

  // Social media links
  const github = '<a target="_blank" href="https://github.com/cdepman" rel="noopener noreferrer"><i id="github" class="hvr-shrink connect-icon fa fa-github-square fa-5x"></i></a>';
  const email = '<a target="_blank" href="mailto:cdepman@gmail.com" rel="noopener noreferrer"><i id="email" class="hvr-shrink connect-icon fa fa-envelope-square fa-5x"></i></a>';
  const linkedIn = '<a target="_blank" href="https://linkedin.com/in/cdepman" rel="noopener noreferrer"><i id="linked-in" class="hvr-shrink connect-icon fa fa-linkedin-square fa-5x"></i></a>';
  const facebook = '<a target="_blank" href="https://facebook.com/cdepman" rel="noopener noreferrer"><i id="facebook" class="hvr-shrink connect-icon fa fa-facebook-square fa-5x"></i></a>';

  const connections = `<div class="connectors">${github}${email}${linkedIn}${facebook}</div>`;
  document.body.insertAdjacentHTML('beforeend', connections);

  const connectorsEl = document.querySelector('.connectors');
  connectorsEl.style.display = 'none';

  const connect = () => {
    const overlay = document.getElementById('lean_overlay');
    const background = document.querySelector('.connectors-background');
    const outline = document.querySelector('.connectors-outline');
    const closeBtn = document.querySelector('.close-connectors');

    connectorsEl.style.display = connectorsEl.style.display === 'none' ? 'block' : 'none';
    overlay.style.display = 'block';
    background.style.display = 'block';
    outline.style.display = 'block';
    closeBtn.style.display = 'block';
  };

  // Event listeners for menu items
  const connectBtn = document.getElementById('connect');
  const connectText = document.getElementById('connect_text');
  if (connectBtn) connectBtn.addEventListener('click', connect);
  if (connectText) connectText.addEventListener('click', connect);

  const aboutBtn = document.getElementById('about');
  const aboutText = document.getElementById('about_text');
  const handleAboutClick = () => {
    const headShot = document.getElementById('head-shot');
    const overlay = document.getElementById('lean_overlay');
    const modal = document.getElementById('modal1');
    const title = document.querySelector('.title');

    headShot.style.display = 'block';
    overlay.style.display = 'block';
    modal.style.display = 'block';
    title.style.zIndex = '10080';
  };

  if (aboutBtn) aboutBtn.addEventListener('click', handleAboutClick);
  if (aboutText) aboutText.addEventListener('click', handleAboutClick);

  const overlay = document.getElementById('lean_overlay');
  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.getElementById('head-shot').style.display = 'none';
    connectorsEl.style.display = 'none';
    document.getElementById('modal1').style.display = 'none';
    document.querySelector('.connectors-background').style.display = 'none';
    document.querySelector('.connectors-outline').style.display = 'none';
    document.querySelector('.close-connectors').style.display = 'none';
    setTimeout(() => {
      document.querySelector('.title').style.zIndex = '1';
    }, 500);
  });

  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('lean_overlay').style.display = 'none';
      document.getElementById('modal1').style.display = 'none';
      document.getElementById('head-shot').style.display = 'none';
      setTimeout(() => {
        document.querySelector('.title').style.zIndex = '1';
      }, 500);
    });
  }

  const cvBtn = document.getElementById('cv');
  const cvText = document.getElementById('cv_text');
  const handleCVClick = () => {
    window.open('app/assets/CharlieDepmanResume.pdf', '_blank');
  };
  if (cvBtn) cvBtn.addEventListener('click', handleCVClick);
  if (cvText) cvText.addEventListener('click', handleCVClick);

  const myWorkBtn = document.getElementById('my_work');
  const myWorkText = document.getElementById('my_work_text');
  const handleMyWorkClick = () => {
    window.location.href = 'app/myWork.html';
  };
  if (myWorkBtn) myWorkBtn.addEventListener('click', handleMyWorkClick);
  if (myWorkText) myWorkText.addEventListener('click', handleMyWorkClick);

  const blogBtn = document.getElementById('blog');
  const blogText = document.getElementById('blog_text');
  const handleBlogClick = () => {
    window.open('https://blog.charlied.xyz', '_blank');
  };
  if (blogBtn) blogBtn.addEventListener('click', handleBlogClick);
  if (blogText) blogText.addEventListener('click', handleBlogClick);

  const closeConnectors = document.querySelector('i.close-connectors');
  if (closeConnectors) {
    closeConnectors.addEventListener('click', () => {
      overlay.style.display = 'none';
      closeConnectors.style.display = 'none';
      connectorsEl.style.display = 'none';
      document.querySelector('.connectors-background').style.display = 'none';
      document.querySelector('.connectors-outline').style.display = 'none';
    });
  }

  // Mouse enter/leave for highlighting
  nodes.forEach(node => {
    const nodeEl = document.getElementById(node.id);
    const nodeTextEl = document.getElementById(node.id + "_text");

    if (nodeEl) {
      nodeEl.addEventListener('mouseenter', () => focusNode(node.id));
      nodeEl.addEventListener('mouseleave', (e) => {
        const n = defocusNode(node.id);
        setMenuPosition(n);
        checkOverlapWithUntouchables(e.target);
      });
    }

    if (nodeTextEl) {
      nodeTextEl.addEventListener('mouseenter', () => focusNode(node.id));
    }
  });
});
