import type { Live2DPart, Live2DProjectData, Live2DParameter } from '@/types';

// 评估参数表达式 (轻量沙箱:仅支持数字字面量、参数名、基本算术)
export function evalExpression(expr: string, values: Record<string, number>, parameters: Live2DParameter[]): number {
  if (!expr.trim()) return 0;
  // 把参数名替换为数字字面量
  const paramMap = new Map<string, number>();
  for (const p of parameters) {
    paramMap.set(p.name, values[p.id] ?? p.default);
  }
  const safe = expr.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (m) => {
    if (paramMap.has(m)) return String(paramMap.get(m));
    if (m === 'pi') return String(Math.PI);
    if (m === 'e') return String(Math.E);
    if (m === 'sin' || m === 'cos' || m === 'tan' || m === 'abs' || m === 'min' || m === 'max' || m === 'sqrt' || m === 'pow') {
      return `Math.${m}`;
    }
    return '0';
  });
  try {
    // 限制运算符白名单
    if (!/^[\s\d+\-*/().,%Math.absincossqrpowtminmx]+$/.test(safe)) return 0;
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict";return (${safe});`)();
    return typeof v === 'number' && isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

// 部件基础顶点 = 默认网格 (rows+1)*(cols+1) 的二维点,放在 [0..width]x[0..height] 的方框中,根据 path 形状做投影
export function buildDefaultVertices(part: Live2DPart, canvasW: number, canvasH: number): number[] {
  const rows = part.meshRows;
  const cols = part.meshCols;
  // 默认位置:根据 part.kind 给一个合理位置
  const anchor = part.anchor;
  const w = partWidth(part);
  const h = partHeight(part);
  const verts: number[] = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = anchor.x - w / 2 + (c / cols) * w;
      const y = anchor.y - h / 2 + (r / rows) * h;
      verts.push(x, y);
    }
  }
  return verts;
}

function partWidth(part: Live2DPart) {
  switch (part.kind) {
    case 'head':
      return 220;
    case 'eye':
      return 60;
    case 'mouth':
      return 70;
    case 'hair':
      return 240;
    case 'body':
      return 280;
    case 'arm':
      return 60;
    case 'leg':
      return 70;
    case 'accessory':
      return 80;
  }
}
function partHeight(part: Live2DPart) {
  switch (part.kind) {
    case 'head':
      return 240;
    case 'eye':
      return 40;
    case 'mouth':
      return 30;
    case 'hair':
      return 180;
    case 'body':
      return 320;
    case 'arm':
      return 200;
    case 'leg':
      return 240;
    case 'accessory':
      return 80;
  }
}

export function defaultAnchorFor(part: Live2DPart, canvasH: number) {
  const cx = 300;
  switch (part.kind) {
    case 'head':
      return { x: cx, y: 220 };
    case 'eye':
      return { x: cx - 40, y: 200 };
    case 'mouth':
      return { x: cx, y: 280 };
    case 'hair':
      return { x: cx, y: 160 };
    case 'body':
      return { x: cx, y: 460 };
    case 'arm':
      return { x: cx + 160, y: 460 };
    case 'leg':
      return { x: cx, y: canvasH - 80 };
    case 'accessory':
      return { x: cx, y: 240 };
  }
}

// 用三角网格把四边形形变输出:返回 triangle strip 路径
export function buildMeshPath(vertices: number[], rows: number, cols: number): string {
  const parts: string[] = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const i = (r * (cols + 1) + c) * 2;
      if (c === 0) parts.push(`M ${vertices[i]} ${vertices[i + 1]}`);
      else parts.push(`L ${vertices[i]} ${vertices[i + 1]}`);
    }
  }
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      const i = (r * (cols + 1) + c) * 2;
      if (c === 0) parts.push(`M ${vertices[i]} ${vertices[i + 1]}`);
      else parts.push(`L ${vertices[i]} ${vertices[i + 1]}`);
    }
  }
  return parts.join(' ');
}

// 默认 Live2D 角色装配
export function createDefaultCharacter(canvas: { width: number; height: number }): Live2DProjectData {
  const baseDefs: Omit<Live2DPart, 'vertices'>[] = [
    { id: 'p_body', name: '身体', kind: 'body', z: 10, visible: true, path: '', fill: '#2A2A38', stroke: '#1F1F2A', meshRows: 4, meshCols: 3, anchor: { x: 300, y: 460 }, bindings: [] },
    { id: 'p_hair_back', name: '后发', kind: 'hair', z: 20, visible: true, path: '', fill: '#1F1F2A', stroke: '#0B0B12', meshRows: 4, meshCols: 4, anchor: { x: 300, y: 170 }, bindings: [] },
    { id: 'p_head', name: '头部', kind: 'head', z: 30, visible: true, path: '', fill: '#FFE0CC', stroke: '#FFB4A0', meshRows: 5, meshCols: 4, anchor: { x: 300, y: 220 }, bindings: [] },
    { id: 'p_eye_l', name: '左眼', kind: 'eye', z: 40, visible: true, path: '', fill: '#7CF9FF', stroke: '#0B0B12', meshRows: 2, meshCols: 3, anchor: { x: 260, y: 200 }, bindings: [] },
    { id: 'p_eye_r', name: '右眼', kind: 'eye', z: 40, visible: true, path: '', fill: '#7CF9FF', stroke: '#0B0B12', meshRows: 2, meshCols: 3, anchor: { x: 340, y: 200 }, bindings: [] },
    { id: 'p_mouth', name: '嘴巴', kind: 'mouth', z: 50, visible: true, path: '', fill: '#FF6A3D', stroke: '#7CF9FF', meshRows: 2, meshCols: 3, anchor: { x: 300, y: 270 }, bindings: [] },
    { id: 'p_hair_front', name: '前发', kind: 'hair', z: 60, visible: true, path: '', fill: '#FF6A3D', stroke: '#7CF9FF', meshRows: 3, meshCols: 4, anchor: { x: 300, y: 170 }, bindings: [] },
  ];
  const parts: Live2DPart[] = baseDefs.map((p) => {
    const { ...rest } = p;
    return { ...rest, vertices: buildDefaultVertices({ ...rest } as Live2DPart, canvas.width, canvas.height) };
  });

  const parameters: Live2DParameter[] = [
    { id: 'par_angle_x', name: 'ParamAngleX', min: -30, max: 30, default: 0 },
    { id: 'par_angle_y', name: 'ParamAngleY', min: -30, max: 30, default: 0 },
    { id: 'par_angle_z', name: 'ParamAngleZ', min: -30, max: 30, default: 0 },
    { id: 'par_eye_l_open', name: 'ParamEyeLOpen', min: 0, max: 1, default: 1 },
    { id: 'par_eye_r_open', name: 'ParamEyeROpen', min: 0, max: 1, default: 1 },
    { id: 'par_eye_l_smile', name: 'ParamEyeLSmile', min: 0, max: 1, default: 0 },
    { id: 'par_eye_r_smile', name: 'ParamEyeRSmile', min: 0, max: 1, default: 0 },
    { id: 'par_mouth_open', name: 'ParamMouthOpenY', min: 0, max: 1, default: 0 },
    { id: 'par_mouth_form', name: 'ParamMouthForm', min: -1, max: 1, default: 0 },
    { id: 'par_breath', name: 'ParamBreath', min: 0, max: 1, default: 0 },
  ];

  // 给部件绑定参数
  const find = (id: string) => parts.find((p) => p.id === id)!;
  find('p_head').bindings = [
    { parameterId: 'par_angle_x', mode: 'rotate', weight: 0.6 },
    { parameterId: 'par_angle_y', mode: 'translate', weight: 1.4 },
    { parameterId: 'par_breath', mode: 'scale', weight: 0.04 },
  ];
  find('p_hair_front').bindings = [
    { parameterId: 'par_angle_x', mode: 'rotate', weight: 0.9 },
    { parameterId: 'par_breath', mode: 'scale', weight: 0.05 },
  ];
  find('p_hair_back').bindings = [
    { parameterId: 'par_angle_x', mode: 'rotate', weight: 0.4 },
    { parameterId: 'par_breath', mode: 'scale', weight: 0.05 },
  ];
  find('p_eye_l').bindings = [
    { parameterId: 'par_eye_l_open', mode: 'scale', weight: 1 },
    { parameterId: 'par_eye_l_smile', mode: 'scale', weight: 0.3 },
  ];
  find('p_eye_r').bindings = [
    { parameterId: 'par_eye_r_open', mode: 'scale', weight: 1 },
    { parameterId: 'par_eye_r_smile', mode: 'scale', weight: 0.3 },
  ];
  find('p_mouth').bindings = [
    { parameterId: 'par_mouth_open', mode: 'scale', weight: 1 },
    { parameterId: 'par_mouth_form', mode: 'translate', weight: 6 },
  ];
  find('p_body').bindings = [{ parameterId: 'par_breath', mode: 'scale', weight: 0.06 }];

  return {
    canvas,
    background: 'radial-gradient(circle at 50% 35%, #1F1F2A 0%, #0B0B12 70%)',
    parts,
    parameters,
    motions: [
      {
        id: 'm_idle',
        name: '待机呼吸',
        trigger: 'idle',
        fadeIn: 0.5,
        fadeOut: 0.5,
        loop: true,
        tracks: [
          {
            parameterId: 'par_breath',
            keyframes: [
              { time: 0, value: 0, easing: 'easeInOut' },
              { time: 1.5, value: 1, easing: 'easeInOut' },
              { time: 3, value: 0, easing: 'easeInOut' },
            ],
          },
          {
            parameterId: 'par_angle_x',
            keyframes: [
              { time: 0, value: -2, easing: 'easeInOut' },
              { time: 1.5, value: 2, easing: 'easeInOut' },
              { time: 3, value: -2, easing: 'easeInOut' },
            ],
          },
        ],
      },
      {
        id: 'm_blink',
        name: '眨眼',
        trigger: 'idle',
        fadeIn: 0.1,
        fadeOut: 0.1,
        loop: false,
        tracks: [
          {
            parameterId: 'par_eye_l_open',
            keyframes: [
              { time: 0, value: 1, easing: 'linear' },
              { time: 0.08, value: 0.05, easing: 'easeOut' },
              { time: 0.16, value: 1, easing: 'easeIn' },
            ],
          },
          {
            parameterId: 'par_eye_r_open',
            keyframes: [
              { time: 0, value: 1, easing: 'linear' },
              { time: 0.08, value: 0.05, easing: 'easeOut' },
              { time: 0.16, value: 1, easing: 'easeIn' },
            ],
          },
        ],
      },
      {
        id: 'm_tap',
        name: '点击',
        trigger: 'tap',
        fadeIn: 0.1,
        fadeOut: 0.2,
        loop: false,
        tracks: [
          {
            parameterId: 'par_angle_y',
            keyframes: [
              { time: 0, value: 0, easing: 'easeOutBack' },
              { time: 0.2, value: -15, easing: 'easeOutBack' },
              { time: 0.6, value: 0, easing: 'easeInOut' },
            ],
          },
        ],
      },
    ],
    expressions: [
      {
        id: 'e_happy',
        name: '开心',
        setParameters: [
          { id: 'par_eye_l_smile', value: 1 },
          { id: 'par_eye_r_smile', value: 1 },
          { id: 'par_mouth_form', value: 0.8 },
        ],
      },
      {
        id: 'e_surprised',
        name: '惊讶',
        setParameters: [
          { id: 'par_eye_l_open', value: 1.2 },
          { id: 'par_eye_r_open', value: 1.2 },
          { id: 'par_mouth_open', value: 0.8 },
        ],
      },
    ],
  };
}
