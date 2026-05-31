export interface SvgTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
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
    category: "分形",
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
    id: "mandelbox-3d",
    name: "Mandelbox等轴测",
    description: "等轴测投影的Mandelbox分形，带3D深度暗示",
    category: "分形",
    params: [
      { key: "depth", label: "递归深度", min: 1, max: 4, default: 2, step: 1 },
      { key: "size", label: "主体尺寸", min: 40, max: 160, default: 100, step: 10 },
      { key: "perspective", label: "透视偏移", min: 5, max: 30, default: 15, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#f0f0f0"/>
  <g transform="translate(200,180)" stroke="#1a3a6b" fill="none">
    {{ISO_BOXES}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-lotus",
    name: "缠枝莲纹",
    description: "传统青花瓷缠枝莲花纹SVG图案",
    category: "青花瓷纹饰",
    params: [
      { key: "petals", label: "花瓣数", min: 4, max: 12, default: 8, step: 1 },
      { key: "radius", label: "花径", min: 30, max: 120, default: 70, step: 5 },
      { key: "strokeWidth", label: "线宽", min: 5, max: 30, default: 10, step: 5 },
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
    id: "qinghua-wave",
    name: "海水江崖纹",
    description: "青花瓷海水江崖边框纹饰，波浪与山崖",
    category: "青花瓷纹饰",
    params: [
      { key: "waves", label: "波浪数", min: 3, max: 10, default: 5, step: 1 },
      { key: "amplitude", label: "波幅", min: 10, max: 40, default: 20, step: 2 },
      { key: "strokeWidth", label: "线宽", min: 5, max: 25, default: 10, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <rect width="400" height="120" fill="#ffffff"/>
  <g stroke="#1a3a6b" fill="none">
    {{WAVE_PATHS}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-keyfret",
    name: "回纹边框",
    description: "传统回纹（Key-fret）几何边框图案",
    category: "青花瓷纹饰",
    params: [
      { key: "unitSize", label: "单元尺寸", min: 8, max: 24, default: 14, step: 2 },
      { key: "repeats", label: "重复次数", min: 4, max: 20, default: 10, step: 1 },
      { key: "strokeWidth", label: "线宽", min: 5, max: 20, default: 10, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" width="400" height="60">
  <rect width="400" height="60" fill="#ffffff"/>
  <g transform="translate(10,10)" stroke="#1a3a6b" fill="none">
    {{KEYFRET_PATH}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-peony",
    name: "折枝牡丹",
    description: "折枝牡丹花纹，青花瓷经典花卉纹饰",
    category: "青花瓷纹饰",
    params: [
      { key: "petals", label: "花瓣数", min: 5, max: 10, default: 7, step: 1 },
      { key: "radius", label: "花径", min: 30, max: 100, default: 60, step: 5 },
      { key: "layers", label: "花瓣层数", min: 1, max: 3, default: 2, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <g transform="translate(200,200)" stroke="#1a3a6b" fill="none">
    {{PEONY_PATHS}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-cloud",
    name: "云肩纹",
    description: "云肩（如意云头）纹饰图案",
    category: "青花瓷纹饰",
    params: [
      { key: "clouds", label: "云头数", min: 3, max: 8, default: 5, step: 1 },
      { key: "radius", label: "云径", min: 30, max: 80, default: 50, step: 5 },
      { key: "strokeWidth", label: "线宽", min: 5, max: 20, default: 10, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <g transform="translate(200,200)" stroke="#1a3a6b" fill="none">
    {{CLOUD_PATHS}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-scroll",
    name: "缠枝卷草纹",
    description: "缠枝卷草纹（Scrollwork）连续图案",
    category: "青花瓷纹饰",
    params: [
      { key: "scrolls", label: "卷草数", min: 2, max: 8, default: 4, step: 1 },
      { key: "amplitude", label: "波幅", min: 15, max: 50, default: 30, step: 5 },
      { key: "strokeWidth", label: "线宽", min: 5, max: 20, default: 10, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100">
  <rect width="400" height="100" fill="#ffffff"/>
  <g transform="translate(0,50)" stroke="#1a3a6b" fill="none">
    {{SCROLL_PATHS}}
  </g>
</svg>`,
  },
  {
    id: "qinghua-bamboo",
    name: "竹叶纹",
    description: "竹叶纹饰，呼应成都主题暗示",
    category: "青花瓷纹饰",
    params: [
      { key: "leaves", label: "叶片数", min: 3, max: 12, default: 6, step: 1 },
      { key: "leafLen", label: "叶长", min: 20, max: 60, default: 35, step: 5 },
      { key: "strokeWidth", label: "线宽", min: 5, max: 20, default: 10, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#ffffff"/>
  <g stroke="#1a3a6b" fill="none">
    {{BAMBOO_PATHS}}
  </g>
</svg>`,
  },
  {
    id: "grid-overlay",
    name: "技术网格",
    description: "离线档案风格技术网格背景",
    category: "UI框架",
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
    category: "UI碎片",
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
    category: "UI框架",
    params: [
      { key: "armLen", label: "臂长", min: 10, max: 40, default: 20, step: 2 },
      { key: "strokeW", label: "线宽", min: 3, max: 20, default: 8, step: 2 },
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
    category: "UI框架",
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
  {
    id: "icon-toolbar",
    name: "图标工具栏",
    description: "垂直图标工具栏，含几何图标序列",
    category: "UI碎片",
    params: [
      { key: "icons", label: "图标数", min: 4, max: 12, default: 8, step: 1 },
      { key: "iconSize", label: "图标尺寸", min: 8, max: 20, default: 12, step: 2 },
      { key: "spacing", label: "间距", min: 16, max: 36, default: 24, step: 2 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 300" width="30" height="300">
  <rect width="30" height="300" fill="#e8e8e8" rx="1"/>
  <g stroke="#1a1a1a" fill="none" stroke-width="0.5">
    {{ICON_SHAPES}}
  </g>
</svg>`,
  },
  {
    id: "progress-bar",
    name: "进度条",
    description: "UI碎片风格进度条元素",
    category: "UI碎片",
    params: [
      { key: "width", label: "宽度", min: 80, max: 300, default: 160, step: 10 },
      { key: "fill", label: "填充百分比", min: 0, max: 100, default: 60, step: 5 },
      { key: "height", label: "高度", min: 6, max: 16, default: 8, step: 2 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} {{height}}" width="{{width}}" height="{{height}}">
  <rect width="{{width}}" height="{{height}}" fill="#e0e0e0" rx="1"/>
  <rect width="{{width}}*{{fill}}/100" height="{{height}}" fill="#1a3a6b" rx="1"/>
</svg>`,
  },
  {
    id: "dimension-line",
    name: "尺寸标注线",
    description: "建筑图纸风格尺寸标注线",
    category: "UI框架",
    params: [
      { key: "length", label: "线长", min: 60, max: 300, default: 150, step: 10 },
      { key: "label", label: "标注文字大小", min: 6, max: 14, default: 8, step: 1 },
      { key: "capSize", label: "端帽大小", min: 3, max: 10, default: 5, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{length}} 30" width="{{length}}" height="30">
  <g stroke="#1a1a1a" fill="none" stroke-width="0.3">
    <line x1="0" y1="15" x2="{{length}}" y2="15"/>
    <line x1="0" y1="10" x2="0" y2="20"/>
    <line x1="{{length}}" y1="10" x2="{{length}}" y2="20"/>
  </g>
  <text x="{{length}}/2" y="10" font-family="monospace" font-size="{{label}}" fill="#909090" text-anchor="middle">SCALE 1:2.4</text>
</svg>`,
  },
  {
    id: "registration-mark",
    name: "配准标记",
    description: "印刷配准标记（十字准星+同心圆）",
    category: "UI框架",
    params: [
      { key: "size", label: "尺寸", min: 20, max: 60, default: 30, step: 5 },
      { key: "circles", label: "圆环数", min: 2, max: 4, default: 3, step: 1 },
      { key: "strokeW", label: "线宽", min: 2, max: 8, default: 3, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{size}} {{size}}" width="{{size}}" height="{{size}}">
  <g transform="translate({{size}}/2,{{size}}/2)" stroke="#909090" fill="none" stroke-width="{{strokeW}}">
    {{REG_CIRCLES}}
    <line x1="-{{size}}/2" y1="0" x2="{{size}}/2" y2="0"/>
    <line x1="0" y1="-{{size}}/2" x2="0" y2="{{size}}/2"/>
  </g>
</svg>`,
  },
  {
    id: "craquelure",
    name: "冰裂纹",
    description: "瓷器冰裂纹（Craquelure）纹理覆层",
    category: "质感",
    params: [
      { key: "density", label: "裂纹密度", min: 5, max: 25, default: 12, step: 1 },
      { key: "opacity", label: "不透明度", min: 2, max: 15, default: 5, step: 1 },
      { key: "size", label: "画布尺寸", min: 100, max: 400, default: 300, step: 50 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{size}} {{size}}" width="{{size}}" height="{{size}}">
  <g stroke="#c0c8d0" fill="none" stroke-width="0.2" opacity="{{opacity}}">
    {{CRACK_LINES}}
  </g>
</svg>`,
  },
  {
    id: "dot-pattern",
    name: "圆点矩阵",
    description: "装饰性圆点矩阵图案",
    category: "装饰",
    params: [
      { key: "cols", label: "列数", min: 3, max: 15, default: 8, step: 1 },
      { key: "rows", label: "行数", min: 2, max: 10, default: 4, step: 1 },
      { key: "dotSize", label: "圆点尺寸", min: 1, max: 6, default: 2, step: 0.5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
  <g fill="#1a1a1a">
    {{DOT_MATRIX}}
  </g>
</svg>`,
  },
  {
    id: "barcode",
    name: "条形码装饰",
    description: "装饰性条形码图案（非功能性）",
    category: "装饰",
    params: [
      { key: "width", label: "宽度", min: 60, max: 200, default: 120, step: 10 },
      { key: "height", label: "高度", min: 20, max: 60, default: 35, step: 5 },
      { key: "bars", label: "条数", min: 15, max: 50, default: 30, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} {{height}}" width="{{width}}" height="{{height}}">
  <rect width="{{width}}" height="{{height}}" fill="#ffffff"/>
  <g fill="#1a1a1a">
    {{BAR_LINES}}
  </g>
</svg>`,
  },
  {
    id: "qr-deco",
    name: "二维码装饰",
    description: "装饰性二维码图案（非功能性）",
    category: "装饰",
    params: [
      { key: "size", label: "尺寸", min: 40, max: 120, default: 60, step: 10 },
      { key: "cells", label: "单元格数", min: 5, max: 15, default: 8, step: 1 },
      { key: "density", label: "填充密度", min: 20, max: 60, default: 40, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{size}} {{size}}" width="{{size}}" height="{{size}}">
  <rect width="{{size}}" height="{{size}}" fill="#ffffff" stroke="#1a1a1a" stroke-width="0.3"/>
  <g fill="#1a1a1a">
    {{QR_CELLS}}
  </g>
</svg>`,
  },
  {
    id: "chinese-seal",
    name: "印章",
    description: "传统中式印章风格标记",
    category: "装饰",
    params: [
      { key: "size", label: "尺寸", min: 30, max: 80, default: 50, step: 5 },
      { key: "rotation", label: "旋转", min: -15, max: 15, default: -3, step: 1 },
      { key: "borderW", label: "边框宽度", min: 1, max: 4, default: 2, step: 0.5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{size}} {{size}}" width="{{size}}" height="{{size}}">
  <g transform="rotate({{rotation}}, {{size}}/2, {{size}}/2)">
    <rect x="2" y="2" width="{{size}}-4" height="{{size}}-4" fill="none" stroke="#c03030" stroke-width="{{borderW}}" rx="1"/>
    <text x="{{size}}/2" y="{{size}}/2+4" font-family="serif" font-size="{{size}}*0.35" fill="#c03030" text-anchor="middle">瓷</text>
  </g>
</svg>`,
  },
  {
    id: "cross-section",
    name: "瓷器截面图",
    description: "瓷器釉面截面示意图（学术风格）",
    category: "学术",
    params: [
      { key: "width", label: "宽度", min: 100, max: 300, default: 200, step: 10 },
      { key: "layers", label: "层数", min: 3, max: 6, default: 4, step: 1 },
      { key: "labelSize", label: "标注大小", min: 6, max: 12, default: 8, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} 120" width="{{width}}" height="120">
  <g>
    {{SECTION_LAYERS}}
  </g>
</svg>`,
  },
  {
    id: "wireframe-diagram",
    name: "线框示意图",
    description: "分形结构线框缩略示意图",
    category: "学术",
    params: [
      { key: "size", label: "尺寸", min: 40, max: 120, default: 60, step: 10 },
      { key: "detail", label: "细节级别", min: 1, max: 4, default: 2, step: 1 },
      { key: "opacity", label: "不透明度", min: 10, max: 50, default: 20, step: 5 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{size}} {{size}}" width="{{size}}" height="{{size}}">
  <g stroke="#1a3a6b" fill="none" stroke-width="0.3" opacity="{{opacity}}">
    {{WIREFRAME}}
  </g>
</svg>`,
  },
  {
    id: "typography-header",
    name: "标题排版块",
    description: "瓷器设计风格标题排版块",
    category: "文字",
    params: [
      { key: "width", label: "宽度", min: 200, max: 600, default: 400, step: 20 },
      { key: "fontSize", label: "字号", min: 20, max: 60, default: 36, step: 2 },
      { key: "tracking", label: "字距", min: 0, max: 20, default: 4, step: 2 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} 80" width="{{width}}" height="80">
  <rect width="{{width}}" height="80" fill="#faf8f5"/>
  <text x="20" y="50" font-family="sans-serif" font-weight="900" font-size="{{fontSize}}" fill="#1a1a1a" letter-spacing="{{tracking}}">瓷器设计</text>
  <line x1="20" y1="60" x2="{{width}}-20" y2="60" stroke="#1a3a6b" stroke-width="0.5"/>
</svg>`,
  },
  {
    id: "typography-subtitle",
    name: "副标题排版块",
    description: "青花瓷风格副标题排版块",
    category: "文字",
    params: [
      { key: "width", label: "宽度", min: 150, max: 400, default: 250, step: 10 },
      { key: "fontSize", label: "字号", min: 14, max: 36, default: 24, step: 2 },
      { key: "tracking", label: "字距", min: 0, max: 15, default: 2, step: 1 },
    ],
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} 50" width="{{width}}" height="50">
  <rect x="5" y="5" width="{{width}}-10" height="40" fill="#ffffff" stroke="#1a3a6b" stroke-width="0.5" rx="1"/>
  <text x="{{width}}/2" y="32" font-family="sans-serif" font-weight="700" font-size="{{fontSize}}" fill="#1a3a6b" text-anchor="middle" letter-spacing="{{tracking}}">青花瓷</text>
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
      boxes += `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" opacity="${opacity}"/>\n`;
      if (d < depth - 1) {
        const innerS = s - gap * 2;
        if (innerS > 0) {
          boxes += `<rect x="${-innerS / 2}" y="${-innerS / 2}" width="${innerS}" height="${innerS}" stroke-dasharray="2,2" opacity="${opacity * 0.5}"/>\n`;
        }
      }
    }
    code = code.replace("{{RECURSIVE_BOXES}}", boxes);
  }

  if (template.id === "mandelbox-3d") {
    const depth = paramValues.depth ?? 2;
    const size = paramValues.size ?? 100;
    const px = paramValues.perspective ?? 15;
    let boxes = "";
    for (let d = 0; d < depth; d++) {
      const s = size - d * 30;
      if (s <= 0) break;
      const off = d * px;
      const opacity = 1 - d * 0.2;
      boxes += `<rect x="${-s / 2 + off}" y="${-s / 2 - off}" width="${s}" height="${s}" opacity="${opacity}"/>\n`;
      boxes += `<line x1="${-s / 2 + off}" y1="${-s / 2 - off}" x2="${-s / 2}" y2="${-s / 2}" opacity="${opacity * 0.3}"/>\n`;
      boxes += `<line x1="${s / 2 + off}" y1="${-s / 2 - off}" x2="${s / 2}" y2="${-s / 2}" opacity="${opacity * 0.3}"/>\n`;
      boxes += `<line x1="${-s / 2 + off}" y1="${s / 2 - off}" x2="${-s / 2}" y2="${s / 2}" opacity="${opacity * 0.3}"/>\n`;
    }
    code = code.replace("{{ISO_BOXES}}", boxes);
  }

  if (template.id === "qinghua-lotus") {
    const petals = paramValues.petals ?? 8;
    const radius = paramValues.radius ?? 70;
    const sw = (paramValues.strokeWidth ?? 10) / 10;
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

  if (template.id === "qinghua-wave") {
    const waves = paramValues.waves ?? 5;
    const amp = paramValues.amplitude ?? 20;
    const sw = (paramValues.strokeWidth ?? 10) / 10;
    let paths = "";
    for (let w = 0; w < 3; w++) {
      const yOff = 30 + w * 25;
      const opacity = 1 - w * 0.25;
      let d = `M 0 ${yOff}`;
      for (let i = 0; i < waves; i++) {
        const x1 = (400 / waves) * i + 400 / waves / 4;
        const x2 = (400 / waves) * (i + 0.5);
        const x3 = (400 / waves) * (i + 0.75);
        const x4 = (400 / waves) * (i + 1);
        d += ` Q ${x1} ${yOff - amp} ${x2} ${yOff} Q ${x3} ${yOff + amp * 0.6} ${x4} ${yOff}`;
      }
      paths += `<path d="${d}" stroke-width="${sw}" opacity="${opacity}"/>\n`;
    }
    for (let i = 0; i < 3; i++) {
      const bx = 60 + i * 130;
      paths += `<polygon points="${bx},80 ${bx + 8},60 ${bx + 16},80" stroke-width="${sw * 0.6}" stroke="#3a6aaa" opacity="0.5"/>\n`;
    }
    code = code.replace("{{WAVE_PATHS}}", paths);
  }

  if (template.id === "qinghua-keyfret") {
    const unit = paramValues.unitSize ?? 14;
    const repeats = paramValues.repeats ?? 10;
    const sw = (paramValues.strokeWidth ?? 10) / 10;
    let path = "";
    for (let i = 0; i < repeats; i++) {
      const x = i * unit * 2;
      path += `M ${x} 10 L ${x + unit} 10 L ${x + unit} 25 L ${x + unit * 2} 25 L ${x + unit * 2} 10 `;
    }
    code = code.replace("{{KEYFRET_PATH}}", `<path d="${path}" stroke-width="${sw}"/>\n<line x1="0" y1="35" x2="${repeats * unit * 2}" y2="35" stroke-width="${sw * 0.5}" stroke="#3a6aaa"/>`);
  }

  if (template.id === "qinghua-peony") {
    const petals = paramValues.petals ?? 7;
    const radius = paramValues.radius ?? 60;
    const layers = paramValues.layers ?? 2;
    let paths = "";
    for (let l = 0; l < layers; l++) {
      const r = radius * (1 - l * 0.3);
      const sw = 1 - l * 0.2;
      for (let i = 0; i < petals; i++) {
        const angle = (360 / petals) * i + l * (360 / petals / 2);
        const rx = r * 0.22;
        const ry = r * 0.5;
        paths += `<ellipse cx="0" cy="${-r * 0.45}" rx="${rx}" ry="${ry}" transform="rotate(${angle})" stroke-width="${sw}" ${l > 0 ? 'stroke="#3a6aaa"' : ''}/>\n`;
      }
    }
    paths += `<circle r="${radius * 0.12}" stroke-width="0.8"/>\n`;
    paths += `<circle r="${radius * 0.05}" fill="#1a3a6b"/>\n`;
    code = code.replace("{{PEONY_PATHS}}", paths);
  }

  if (template.id === "qinghua-cloud") {
    const clouds = paramValues.clouds ?? 5;
    const radius = paramValues.radius ?? 50;
    const sw = (paramValues.strokeWidth ?? 10) / 10;
    let paths = "";
    for (let i = 0; i < clouds; i++) {
      const angle = (360 / clouds) * i;
      const cx = Math.cos((angle * Math.PI) / 180) * radius * 0.5;
      const cy = Math.sin((angle * Math.PI) / 180) * radius * 0.5;
      paths += `<path d="M ${cx - 15} ${cy} Q ${cx - 15} ${cy - 18} ${cx} ${cy - 18} Q ${cx + 15} ${cy - 18} ${cx + 15} ${cy} Q ${cx + 15} ${cy + 8} ${cx} ${cy + 8} Q ${cx - 15} ${cy + 8} ${cx - 15} ${cy}" stroke-width="${sw}"/>\n`;
    }
    paths += `<circle r="${radius * 0.15}" stroke-width="${sw * 0.7}" stroke="#3a6aaa"/>\n`;
    code = code.replace("{{CLOUD_PATHS}}", paths);
  }

  if (template.id === "qinghua-scroll") {
    const scrolls = paramValues.scrolls ?? 4;
    const amp = paramValues.amplitude ?? 30;
    const sw = (paramValues.strokeWidth ?? 10) / 10;
    let paths = "";
    const segW = 400 / scrolls;
    for (let i = 0; i < scrolls; i++) {
      const x0 = i * segW;
      paths += `<path d="M ${x0} 0 C ${x0 + segW * 0.25} ${-amp} ${x0 + segW * 0.75} ${amp} ${x0 + segW} 0" stroke-width="${sw}"/>\n`;
      paths += `<circle cx="${x0 + segW * 0.5}" cy="${amp * 0.5 * (i % 2 === 0 ? 1 : -1)}" r="4" stroke-width="${sw * 0.5}" stroke="#3a6aaa"/>\n`;
    }
    code = code.replace("{{SCROLL_PATHS}}", paths);
  }

  if (template.id === "qinghua-bamboo") {
    const leaves = paramValues.leaves ?? 6;
    const leafLen = paramValues.leafLen ?? 35;
    const sw = (paramValues.strokeWidth ?? 10) / 10;
    let paths = "";
    paths += `<line x1="200" y1="280" x2="200" y2="40" stroke-width="${sw * 1.5}"/>\n`;
    paths += `<line x1="200" y1="40" x2="200" y2="20" stroke-width="${sw * 0.8}" stroke="#3a6aaa"/>\n`;
    for (let i = 0; i < leaves; i++) {
      const y = 60 + i * 35;
      const side = i % 2 === 0 ? 1 : -1;
      const angle = side * (20 + Math.random() * 15);
      paths += `<line x1="200" y1="${y}" x2="${200 + side * leafLen * 0.3}" y2="${y - leafLen * 0.6}" stroke-width="${sw * 0.5}" stroke="#3a6aaa"/>\n`;
      paths += `<ellipse cx="${200 + side * leafLen * 0.4}" cy="${y - leafLen * 0.5}" rx="${leafLen * 0.12}" ry="${leafLen * 0.35}" transform="rotate(${angle}, ${200 + side * leafLen * 0.4}, ${y - leafLen * 0.5})" stroke-width="${sw * 0.7}"/>\n`;
    }
    code = code.replace("{{BAMBOO_PATHS}}", paths);
  }

  if (template.id === "grid-overlay") {
    const major = paramValues.majorGrid ?? 20;
    const minorDiv = paramValues.minorDiv ?? 4;
    const opacity = (paramValues.opacity ?? 40) / 100;
    const minor = major / minorDiv;
    let lines = "";
    for (let x = 0; x <= 400; x += minor) {
      const isMajor = Math.round(x) % major === 0;
      lines += `<line x1="${x}" y1="0" x2="${x}" y2="400" stroke="${isMajor ? '#d0d0d0' : '#e0e0e0'}" stroke-width="${isMajor ? 0.25 : 0.15}" opacity="${opacity}"/>\n`;
    }
    for (let y = 0; y <= 400; y += minor) {
      const isMajor = Math.round(y) % major === 0;
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
    const strokeW = (paramValues.strokeW ?? 8) / 10;
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

  if (template.id === "icon-toolbar") {
    const icons = paramValues.icons ?? 8;
    const iconSize = paramValues.iconSize ?? 12;
    const spacing = paramValues.spacing ?? 24;
    let shapes = "";
    const shapeTypes = ["rect", "circle", "triangle", "diamond", "line", "cross", "dot", "square-dot", "arc", "zigzag", "plus", "minus"];
    for (let i = 0; i < icons; i++) {
      const y = 12 + i * spacing;
      const s = iconSize / 2;
      const cx = 15;
      const shape = shapeTypes[i % shapeTypes.length];
      switch (shape) {
        case "rect": shapes += `<rect x="${cx - s}" y="${y - s}" width="${iconSize}" height="${iconSize}"/>\n`; break;
        case "circle": shapes += `<circle cx="${cx}" cy="${y}" r="${s}"/>\n`; break;
        case "triangle": shapes += `<polygon points="${cx},${y - s} ${cx - s},${y + s} ${cx + s},${y + s}"/>\n`; break;
        case "diamond": shapes += `<polygon points="${cx},${y - s} ${cx + s},${y} ${cx},${y + s} ${cx - s},${y}"/>\n`; break;
        case "line": shapes += `<line x1="${cx - s}" y1="${y}" x2="${cx + s}" y2="${y}"/>\n`; break;
        case "cross": shapes += `<line x1="${cx - s}" y1="${y}" x2="${cx + s}" y2="${y}"/><line x1="${cx}" y1="${y - s}" x2="${cx}" y2="${y + s}"/>\n`; break;
        case "dot": shapes += `<circle cx="${cx}" cy="${y}" r="${s * 0.4}" fill="#1a1a1a"/>\n`; break;
        default: shapes += `<rect x="${cx - s}" y="${y - s}" width="${iconSize}" height="${iconSize}"/>\n`;
      }
    }
    code = code.replace("{{ICON_SHAPES}}", shapes);
  }

  if (template.id === "progress-bar") {
    const w = paramValues.width ?? 160;
    const fill = paramValues.fill ?? 60;
    const h = paramValues.height ?? 8;
    const fillW = Math.round(w * fill / 100);
    code = code.replace(/\{\{width\}\}/g, String(w));
    code = code.replace(/\{\{fill\}\}/g, String(fill));
    code = code.replace(/\{\{height\}\}/g, String(h));
    code = code.replace("{{width}}*{{fill}}/100", String(fillW));
  }

  if (template.id === "dimension-line") {
    const length = paramValues.length ?? 150;
    const label = paramValues.label ?? 8;
    code = code.replace(/\{\{length\}\}/g, String(length));
    code = code.replace(/\{\{label\}\}/g, String(label));
  }

  if (template.id === "registration-mark") {
    const size = paramValues.size ?? 30;
    const circles = paramValues.circles ?? 3;
    const strokeW = (paramValues.strokeW ?? 3) / 10;
    let regC = "";
    for (let i = 1; i <= circles; i++) {
      regC += `<circle r="${(size / 2 / circles) * i}" stroke-width="${strokeW}"/>\n`;
    }
    code = code.replace(/\{\{size\}\}/g, String(size));
    code = code.replace(/\{\{circles\}\}/g, String(circles));
    code = code.replace(/\{\{strokeW\}\}/g, String(strokeW));
    code = code.replace("{{REG_CIRCLES}}", regC);
  }

  if (template.id === "craquelure") {
    const density = paramValues.density ?? 12;
    const opacity = (paramValues.opacity ?? 5) / 100;
    const size = paramValues.size ?? 300;
    let cracks = "";
    const seed = 42;
    for (let i = 0; i < density; i++) {
      const x1 = ((seed * (i + 1) * 7) % size);
      const y1 = ((seed * (i + 1) * 13) % size);
      const x2 = x1 + ((seed * (i + 1) * 3) % 80) - 40;
      const y2 = y1 + ((seed * (i + 1) * 11) % 80) - 40;
      const x3 = x2 + ((seed * (i + 1) * 5) % 60) - 30;
      const y3 = y2 + ((seed * (i + 1) * 17) % 60) - 30;
      cracks += `<path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}" opacity="${opacity}"/>\n`;
      if (i % 3 === 0) {
        const bx = x2 + ((seed * (i + 1) * 9) % 40) - 20;
        const by = y2 + ((seed * (i + 1) * 19) % 40) - 20;
        cracks += `<path d="M ${x2} ${y2} L ${bx} ${by}" opacity="${opacity * 0.7}"/>\n`;
      }
    }
    code = code.replace(/\{\{density\}\}/g, String(density));
    code = code.replace(/\{\{opacity\}\}/g, String(opacity));
    code = code.replace(/\{\{size\}\}/g, String(size));
    code = code.replace("{{CRACK_LINES}}", cracks);
  }

  if (template.id === "dot-pattern") {
    const cols = paramValues.cols ?? 8;
    const rows = paramValues.rows ?? 4;
    const dotSize = paramValues.dotSize ?? 2;
    let dots = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 15 + c * 22;
        const y = 15 + r * 22;
        dots += `<circle cx="${x}" cy="${y}" r="${dotSize}"/>\n`;
      }
    }
    code = code.replace("{{DOT_MATRIX}}", dots);
  }

  if (template.id === "barcode") {
    const width = paramValues.width ?? 120;
    const height = paramValues.height ?? 35;
    const bars = paramValues.bars ?? 30;
    let barLines = "";
    const bw = width / bars;
    for (let i = 0; i < bars; i++) {
      const isBar = (i * 7 + 3) % 3 !== 0;
      if (isBar) {
        const barWidth = bw * (0.4 + ((i * 13) % 7) / 14);
        barLines += `<rect x="${i * bw}" y="2" width="${barWidth}" height="${height - 4}"/>\n`;
      }
    }
    code = code.replace(/\{\{width\}\}/g, String(width));
    code = code.replace(/\{\{height\}\}/g, String(height));
    code = code.replace(/\{\{bars\}\}/g, String(bars));
    code = code.replace("{{BAR_LINES}}", barLines);
  }

  if (template.id === "qr-deco") {
    const size = paramValues.size ?? 60;
    const cells = paramValues.cells ?? 8;
    const density = paramValues.density ?? 40;
    let qrCells = "";
    const cellSize = (size - 8) / cells;
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if ((r * cells + c) * 17 % 100 < density) {
          qrCells += `<rect x="${4 + c * cellSize}" y="${4 + r * cellSize}" width="${cellSize - 0.5}" height="${cellSize - 0.5}"/>\n`;
        }
      }
    }
    code = code.replace(/\{\{size\}\}/g, String(size));
    code = code.replace(/\{\{cells\}\}/g, String(cells));
    code = code.replace(/\{\{density\}\}/g, String(density));
    code = code.replace("{{QR_CELLS}}", qrCells);
  }

  if (template.id === "chinese-seal") {
    const size = paramValues.size ?? 50;
    const rotation = paramValues.rotation ?? -3;
    const borderW = paramValues.borderW ?? 2;
    code = code.replace(/\{\{size\}\}/g, String(size));
    code = code.replace(/\{\{rotation\}\}/g, String(rotation));
    code = code.replace(/\{\{borderW\}\}/g, String(borderW));
  }

  if (template.id === "cross-section") {
    const width = paramValues.width ?? 200;
    const layers = paramValues.layers ?? 4;
    const labelSize = paramValues.label ?? 8;
    const layerNames = ["釉面 Glaze", "釉下彩 Underglaze", "胎体 Body", "釉底 Slip", "火石 Rust", "底足 Foot"];
    const layerColors = ["#a8c8e8", "#1a3a6b", "#e0d8c8", "#c8b898", "#a09070", "#807060"];
    let sectionLayers = "";
    const layerH = 20;
    for (let i = 0; i < layers; i++) {
      const y = 10 + i * layerH;
      sectionLayers += `<rect x="40" y="${y}" width="${width - 80}" height="${layerH}" fill="${layerColors[i]}" stroke="#1a1a1a" stroke-width="0.3"/>\n`;
      sectionLayers += `<text x="${width - 35}" y="${y + layerH / 2 + 3}" font-family="monospace" font-size="${labelSize}" fill="#1a1a1a">${layerNames[i] || "Layer"}</text>\n`;
    }
    sectionLayers += `<line x1="35" y1="10" x2="35" y2="${10 + layers * layerH}" stroke="#1a1a1a" stroke-width="0.5"/>\n`;
    code = code.replace(/\{\{width\}\}/g, String(width));
    code = code.replace(/\{\{layers\}\}/g, String(layers));
    code = code.replace(/\{\{label\}\}/g, String(labelSize));
    code = code.replace("{{SECTION_LAYERS}}", sectionLayers);
  }

  if (template.id === "wireframe-diagram") {
    const size = paramValues.size ?? 60;
    const detail = paramValues.detail ?? 2;
    const opacity = (paramValues.opacity ?? 20) / 100;
    let wf = "";
    const s = size * 0.4;
    wf += `<rect x="${(size - s) / 2}" y="${(size - s) / 2}" width="${s}" height="${s}"/>\n`;
    if (detail >= 2) {
      const s2 = s * 0.6;
      wf += `<rect x="${(size - s2) / 2}" y="${(size - s2) / 2}" width="${s2}" height="${s2}" stroke-dasharray="1,1"/>\n`;
    }
    if (detail >= 3) {
      const s3 = s * 0.35;
      wf += `<rect x="${(size - s3) / 2}" y="${(size - s3) / 2}" width="${s3}" height="${s3}"/>\n`;
    }
    if (detail >= 4) {
      wf += `<line x1="${size / 2}" y1="${(size - s) / 2}" x2="${size / 2}" y2="${(size + s) / 2}" stroke-dasharray="0.5,1"/>\n`;
      wf += `<line x1="${(size - s) / 2}" y1="${size / 2}" x2="${(size + s) / 2}" y2="${size / 2}" stroke-dasharray="0.5,1"/>\n`;
    }
    code = code.replace(/\{\{size\}\}/g, String(size));
    code = code.replace(/\{\{detail\}\}/g, String(detail));
    code = code.replace(/\{\{opacity\}\}/g, String(opacity));
    code = code.replace("{{WIREFRAME}}", wf);
  }

  if (template.id === "typography-header") {
    const width = paramValues.width ?? 400;
    const fontSize = paramValues.fontSize ?? 36;
    const tracking = paramValues.tracking ?? 4;
    code = code.replace(/\{\{width\}\}/g, String(width));
    code = code.replace(/\{\{fontSize\}\}/g, String(fontSize));
    code = code.replace(/\{\{tracking\}\}/g, String(tracking));
  }

  if (template.id === "typography-subtitle") {
    const width = paramValues.width ?? 250;
    const fontSize = paramValues.fontSize ?? 24;
    const tracking = paramValues.tracking ?? 2;
    code = code.replace(/\{\{width\}\}/g, String(width));
    code = code.replace(/\{\{fontSize\}\}/g, String(fontSize));
    code = code.replace(/\{\{tracking\}\}/g, String(tracking));
  }

  return code;
}

export const templateCategories = [
  { id: "分形", label: "分形结构" },
  { id: "青花瓷纹饰", label: "青花瓷纹饰" },
  { id: "UI框架", label: "UI框架" },
  { id: "UI碎片", label: "UI碎片" },
  { id: "质感", label: "质感纹理" },
  { id: "装饰", label: "装饰元素" },
  { id: "学术", label: "学术图表" },
  { id: "文字", label: "文字排版" },
];
