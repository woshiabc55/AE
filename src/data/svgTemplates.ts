export interface SvgTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  params: SvgParam[];
}

export interface SvgParam {
  key: string;
  label: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

export const svgTemplates: SvgTemplate[] = [
  {
    id: "mandelbox-wireframe",
    name: "Mandelbox线框",
    description: "递归立方体线框结构，模拟Mandelbox分形",
    params: [
      { key: "depth", label: "递归深度", min: 1, max: 5, default: 3, step: 1 },
      { key: "size", label: "主体尺寸", min: 60, max: 200, default: 120, step: 10 },
      { key: "gap", label: "层间距", min: 5, max: 30, default: 15, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#f0f0f0"/>
  <g transform="translate(200,200)" stroke="#1a3a6b" stroke-width="0.5" fill="none">
    {{RECURSIVE_BOXES}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-lotus",
    name: "缠枝莲纹",
    description: "传统青花瓷缠枝莲花纹SVG图案",
    params: [
      { key: "petals", label: "花瓣数", min: 4, max: 12, default: 8, step: 1 },
      { key: "radius", label: "花径", min: 30, max: 120, default: 70, step: 5 },
      { key: "strokeWidth", label: "线宽", min: 0.5, max: 3, default: 1, step: 0.5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <g transform="translate(200,200)" stroke="#1a3a6b" fill="none">
    {{LOTUS_PETALS}}
    <circle r="8" fill="#1a3a6b" opacity="0.3"/>
    <circle r="3" fill="#1a3a6b"/>
  </g>
</svg>`,
  },
  {
    id: "grid-overlay",
    name: "技术网格",
    description: "离线档案风格技术网格背景",
    params: [
      { key: "majorGrid", label: "主网格间距", min: 15, max: 40, default: 20, step: 5 },
      { key: "minorDiv", label: "细分倍数", min: 2, max: 6, default: 4, step: 1 },
      { key: "opacity", label: "不透明度", min: 10, max: 100, default: 40, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#f0f0f0"/>
  {{GRID_LINES}}
  {{CROP_MARKS}}
</svg>`,
  },
  {
    id: "paper-tag",
    name: "纸质标签",
    description: "浮动纸质标签元素",
    params: [
      { key: "width", label: "宽度", min: 60, max: 200, default: 100, step: 10 },
      { key: "height", label: "高度", min: 20, max: 60, default: 30, step: 5 },
      { key: "rotation", label: "旋转角度", min: -8, max: 8, default: -2, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 80" width="250" height="80">
  <g transform="rotate({{rotation}}, 125, 40)">
    <rect x="10" y="10" width="{{width}}" height="{{height}}" fill="#ffffff" stroke="#1a1a1a" stroke-width="0.5" rx="1"/>
    <polygon points="{{width}}-2,10 {{width}}+4,10 {{width}}-2,16" fill="#f0f0f0" stroke="#1a1a1a" stroke-width="0.3"/>
    <text x="20" y="{{height}}/2+14" font-family="monospace" font-size="10" fill="#1a1a1a">LABEL</text>
  </g>
</svg>`,
  },
  {
    id: "corner-bracket",
    name: "角括号装饰",
    description: "L形角括号装饰元素",
    params: [
      { key: "armLen", label: "臂长", min: 10, max: 40, default: 20, step: 2 },
      { key: "strokeW", label: "线宽", min: 0.3, max: 2, default: 0.75, step: 0.25 },
      { key: "canvasSize", label: "画布尺寸", min: 100, max: 400, default: 200, step: 50 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{canvasSize}} {{canvasSize}}" width="{{canvasSize}}" height="{{canvasSize}}">
  <rect width="{{canvasSize}}" height="{{canvasSize}}" fill="none"/>
  <g stroke="#1a1a1a" stroke-width="{{strokeW}}" fill="none">
    <polyline points="5,{{armLen}} 5,5 {{armLen}},5"/>
    <polyline points="{{canvasSize}}-{{armLen}},5 {{canvasSize}}-5,5 {{canvasSize}}-5,{{armLen}}"/>
    <polyline points="5,{{canvasSize}}-{{armLen}} 5,{{canvasSize}}-5 {{armLen}},{{canvasSize}}-5"/>
    <polyline points="{{canvasSize}}-{{armLen}},{{canvasSize}}-5 {{canvasSize}}-5,{{canvasSize}}-5 {{canvasSize}}-5,{{canvasSize}}-{{armLen}}"/>
  </g>
</svg>`,
  },
  {
    id: "info-panel",
    name: "信息面板",
    description: "垂直信息面板，含标题和元数据字段",
    params: [
      { key: "panelW", label: "面板宽度", min: 80, max: 200, default: 120, step: 10 },
      { key: "panelH", label: "面板高度", min: 150, max: 400, default: 280, step: 10 },
      { key: "fields", label: "字段数", min: 2, max: 8, default: 5, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{panelW}} {{panelH}}" width="{{panelW}}" height="{{panelH}}">
  <rect width="{{panelW}}" height="{{panelH}}" fill="#ffffff" stroke="#1a1a1a" stroke-width="0.5" rx="2"/>
  <rect width="{{panelW}}" height="24" fill="#1a3a6b" rx="2"/>
  <rect y="20" width="{{panelW}}" height="4" fill="#1a3a6b"/>
  <text x="8" y="16" font-family="monospace" font-size="8" fill="#ffffff">ARCHIVE-0047</text>
  {{FIELD_ROWS}}
</svg>`,
  },
];

export function generateSvg(template: SvgTemplate, paramValues: Record<string, number>): string {
  let code = template.code;

  for (const param of template.params) {
    const val = paramValues[param.key] ?? param.default;
    code = code.replace(new RegExp(`\\{\\{${param.key}\\}\\}`, 'g'), String(val));
  }

  if (template.id === "mandelbox-wireframe") {
    const depth = paramValues.depth ?? 3;
    const size = paramValues.size ?? 120;
    const gap = paramValues.gap ?? 15;
    let boxes = "";
    for (let d = 0; d < depth; d++) {
      const s = size - d * gap * 2;
      if (s <= 0) break;
      const opacity = 1 - d * 0.15;
      boxes += `<rect x="${-s/2}" y="${-s/2}" width="${s}" height="${s}" opacity="${opacity}"/>\n`;
      if (d < depth - 1) {
        const innerS = s - gap * 2;
        if (innerS > 0) {
          boxes += `<rect x="${-innerS/2}" y="${-innerS/2}" width="${innerS}" height="${innerS}" stroke-dasharray="2,2" opacity="${opacity * 0.5}"/>\n`;
        }
      }
    }
    code = code.replace("{{RECURSIVE_BOXES}}", boxes);
  }

  if (template.id === "qinghua-lotus") {
    const petals = paramValues.petals ?? 8;
    const radius = paramValues.radius ?? 70;
    const sw = paramValues.strokeWidth ?? 1;
    let paths = "";
    for (let i = 0; i < petals; i++) {
      const angle = (360 / petals) * i;
      paths += `<ellipse cx="0" cy="${-radius * 0.5}" rx="${radius * 0.18}" ry="${radius * 0.45}" transform="rotate(${angle})" stroke-width="${sw}"/>\n`;
    }
    for (let i = 0; i < petals; i++) {
      const angle = (360 / petals) * i + 360 / petals / 2;
      paths += `<ellipse cx="0" cy="${-radius * 0.3}" rx="${radius * 0.1}" ry="${radius * 0.25}" transform="rotate(${angle})" stroke-width="${sw * 0.7}" stroke="#3a6aaa"/>\n`;
    }
    paths += `<circle r="${radius * 0.15}" stroke-width="${sw}"/>\n`;
    code = code.replace("{{LOTUS_PETALS}}", paths);
  }

  if (template.id === "grid-overlay") {
    const major = paramValues.majorGrid ?? 20;
    const minorDiv = paramValues.minorDiv ?? 4;
    const opacity = (paramValues.opacity ?? 40) / 100;
    const minor = major / minorDiv;
    let lines = "";
    for (let x = 0; x <= 400; x += minor) {
      const isMajor = x % major === 0;
      lines += `<line x1="${x}" y1="0" x2="${x}" y2="400" stroke="${isMajor ? '#d0d0d0' : '#e0e0e0'}" stroke-width="${isMajor ? 0.25 : 0.15}" opacity="${opacity}"/>\n`;
    }
    for (let y = 0; y <= 400; y += minor) {
      const isMajor = y % major === 0;
      lines += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${isMajor ? '#d0d0d0' : '#e0e0e0'}" stroke-width="${isMajor ? 0.25 : 0.15}" opacity="${opacity}"/>\n`;
    }
    code = code.replace("{{GRID_LINES}}", lines);

    let crops = `<g stroke="#1a1a1a" stroke-width="0.5" opacity="${opacity}">`;
    crops += `<line x1="10" y1="10" x2="25" y2="10"/><line x1="10" y1="10" x2="10" y2="25"/>`;
    crops += `<line x1="390" y1="10" x2="375" y2="10"/><line x1="390" y1="10" x2="390" y2="25"/>`;
    crops += `<line x1="10" y1="390" x2="25" y2="390"/><line x1="10" y1="390" x2="10" y2="375"/>`;
    crops += `<line x1="390" y1="390" x2="375" y2="390"/><line x1="390" y1="390" x2="390" y2="375"/>`;
    crops += `</g>`;
    code = code.replace("{{CROP_MARKS}}", crops);
  }

  if (template.id === "paper-tag") {
    const w = paramValues.width ?? 100;
    const h = paramValues.height ?? 30;
    const rot = paramValues.rotation ?? -2;
    code = code.replace(/\{\{width\}\}/g, String(w));
    code = code.replace(/\{\{height\}\}/g, String(h));
    code = code.replace(/\{\{rotation\}\}/g, String(rot));
  }

  if (template.id === "corner-bracket") {
    const armLen = paramValues.armLen ?? 20;
    const strokeW = paramValues.strokeW ?? 0.75;
    const cs = paramValues.canvasSize ?? 200;
    code = code.replace(/\{\{armLen\}\}/g, String(armLen));
    code = code.replace(/\{\{strokeW\}\}/g, String(strokeW));
    code = code.replace(/\{\{canvasSize\}\}/g, String(cs));
  }

  if (template.id === "info-panel") {
    const pw = paramValues.panelW ?? 120;
    const ph = paramValues.panelH ?? 280;
    const fields = paramValues.fields ?? 5;
    let rows = "";
    const labels = ["DATE", "CLASS", "ORIGIN", "MATERIAL", "CONDITION", "DEPTH", "TYPE", "STATUS"];
    for (let i = 0; i < fields; i++) {
      const y = 36 + i * 22;
      rows += `<text x="8" y="${y}" font-family="monospace" font-size="7" fill="#909090">${labels[i] || "FIELD"}</text>\n`;
      rows += `<line x1="8" y1="${y + 4}" x2="${pw - 8}" y2="${y + 4}" stroke="#e0e0e0" stroke-width="0.3"/>\n`;
    }
    code = code.replace(/\{\{panelW\}\}/g, String(pw));
    code = code.replace(/\{\{panelH\}\}/g, String(ph));
    code = code.replace("{{FIELD_ROWS}}", rows);
  }

  return code;
}
