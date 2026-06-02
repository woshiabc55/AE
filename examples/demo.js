const SVGDrawingTool = require('../src/svg-draw');

const svg = new SVGDrawingTool(800, 600);

svg.rect(50, 50, 200, 150, {
  fill: 'lightblue',
  stroke: 'blue',
  'stroke-width': 3
});

svg.circle(350, 125, 75, {
  fill: 'lightgreen',
  stroke: 'green',
  'stroke-width': 3
});

svg.ellipse(550, 125, 80, 50, {
  fill: 'lightyellow',
  stroke: 'orange',
  'stroke-width': 3
});

svg.line(700, 50, 700, 200, {
  stroke: 'purple',
  'stroke-width': 4
});

svg.polygon([[100, 300], [200, 250], [300, 300], [250, 380], [150, 380]], {
  fill: 'pink',
  stroke: 'red',
  'stroke-width': 3
});

svg.polyline([[400, 300], [450, 350], [500, 300], [550, 350], [600, 300]], {
  fill: 'none',
  stroke: 'teal',
  'stroke-width': 3
});

svg.path('M 100 450 Q 200 380 300 450 T 500 450', {
  fill: 'none',
  stroke: 'brown',
  'stroke-width': 3
});

svg.text(400, 520, 'SVG Drawing Tool Demo', {
  'font-size': 24,
  'text-anchor': 'middle',
  fill: 'darkblue'
});

svg.save('output/demo.svg');
