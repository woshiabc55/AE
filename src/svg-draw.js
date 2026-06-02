const fs = require('fs');
const path = require('path');

class SVGDrawingTool {
  constructor(width = 500, height = 500) {
    this.width = width;
    this.height = height;
    this.elements = [];
  }

  addElement(element) {
    this.elements.push(element);
  }

  rect(x, y, width, height, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<rect x="${x}" y="${y}" width="${width}" height="${height}" ${attrs}/>`);
  }

  circle(cx, cy, r, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`);
  }

  ellipse(cx, cy, rx, ry, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${attrs}/>`);
  }

  line(x1, y1, x2, y2, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`);
  }

  polyline(points, options = {}) {
    const pointsStr = points.map(p => p.join(',')).join(' ');
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<polyline points="${pointsStr}" ${attrs}/>`);
  }

  polygon(points, options = {}) {
    const pointsStr = points.map(p => p.join(',')).join(' ');
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<polygon points="${pointsStr}" ${attrs}/>`);
  }

  path(d, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<path d="${d}" ${attrs}/>`);
  }

  text(x, y, content, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<text x="${x}" y="${y}" ${attrs}>${content}</text>`);
  }

  group(children, options = {}) {
    const attrs = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    this.addElement(`<g ${attrs}>${children.join('')}</g>`);
  }

  toString() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  ${this.elements.join('\n  ')}
</svg>`;
  }

  save(filename) {
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, this.toString(), 'utf8');
    console.log(`SVG saved to ${filename}`);
  }

  clear() {
    this.elements = [];
  }
}

module.exports = SVGDrawingTool;
