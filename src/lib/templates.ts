import { uid } from '@/lib/utils';
import type { SvgProjectData, SvgLayer, SvgTrack, SvgKeyframe, Live2DProjectData } from '@/types';
import { createDefaultCharacter } from '@/engine/live2d';

function kf(time: number, value: number | string, easing: SvgKeyframe['easing'] = 'easeInOut'): SvgKeyframe {
  return { id: uid('kf'), time, value, easing };
}

function track(layerId: string, property: SvgTrack['property'], keyframes: SvgKeyframe[]): SvgTrack {
  return { id: uid('tr'), layerId, property, keyframes };
}

export interface SvgTemplate {
  id: string;
  name: string;
  description: string;
  category: 'loop' | 'intro' | 'transition' | 'character' | 'data';
  duration: number;
  build: () => { data: SvgProjectData; thumbnail: string };
}

const makeRect = (overrides: Partial<SvgLayer> = {}): SvgLayer => ({
  id: uid('ly'),
  name: '矩形',
  kind: 'rect',
  visible: true,
  locked: false,
  attrs: { x: 0, y: 0, width: 120, height: 120, rx: 0 },
  style: { fill: '#7CF9FF', stroke: 'none', strokeWidth: 0 },
  transform: { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 },
  ...overrides,
});

const makeCircle = (overrides: Partial<SvgLayer> = {}): SvgLayer => ({
  id: uid('ly'),
  name: '圆形',
  kind: 'circle',
  visible: true,
  locked: false,
  attrs: { cx: 0, cy: 0, r: 60 },
  style: { fill: '#FF6A3D', stroke: 'none', strokeWidth: 0 },
  transform: { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 },
  ...overrides,
});

const makeText = (overrides: Partial<SvgLayer> = {}): SvgLayer => ({
  id: uid('ly'),
  name: '文字',
  kind: 'text',
  visible: true,
  locked: false,
  attrs: { x: 0, y: 0, fontSize: 64 },
  style: { fill: '#F5F5F7', fontWeight: 700 },
  transform: { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 },
  text: 'AniForge',
  ...overrides,
});

export const SVG_TEMPLATES: SvgTemplate[] = [
  {
    id: 'pulse-logo',
    name: '呼吸 Logo',
    description: '图形 + 文字组合,带呼吸 + 渐变循环',
    category: 'loop',
    duration: 3,
    build: () => {
      const c1 = makeCircle({ name: '主光球', attrs: { cx: 0, cy: 0, r: 90 }, style: { fill: '#7CF9FF' }, transform: { x: 200, y: 250, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 } });
      const t1 = makeText({ name: '品牌', text: 'AniForge', attrs: { x: 0, y: 0, fontSize: 72 }, style: { fill: '#0B0B12', fontWeight: 700 }, transform: { x: 320, y: 270, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 } });
      const c2 = makeCircle({ name: '光晕', attrs: { cx: 0, cy: 0, r: 120 }, style: { fill: 'none', stroke: '#7CF9FF', strokeWidth: 2 }, transform: { x: 200, y: 250, rotate: 0, scaleX: 1, scaleY: 1, opacity: 0.5 } });
      const data: SvgProjectData = {
        width: 800,
        height: 500,
        background: '#0B0B12',
        duration: 3,
        fps: 60,
        layers: [c2, c1, t1],
        tracks: [
          track(c1.id, 'scaleX', [kf(0, 1), kf(1.5, 1.15), kf(3, 1)]),
          track(c1.id, 'scaleY', [kf(0, 1), kf(1.5, 1.15), kf(3, 1)]),
          track(c1.id, 'opacity', [kf(0, 0.85), kf(1.5, 1), kf(3, 0.85)]),
          track(c2.id, 'scaleX', [kf(0, 1), kf(3, 1.6, 'easeOut')]),
          track(c2.id, 'scaleY', [kf(0, 1), kf(3, 1.6, 'easeOut')]),
          track(c2.id, 'opacity', [kf(0, 0.7), kf(3, 0)]),
        ],
      };
      return {
        data,
        thumbnail: 'radial-gradient(circle at 30% 50%, #7CF9FF, #0B0B12 65%)',
      };
    },
  },
  {
    id: 'bouncing-balls',
    name: '弹跳小球',
    description: '三个色球交替弹跳,展示物理感缓动',
    category: 'loop',
    duration: 2.4,
    build: () => {
      const colors = ['#7CF9FF', '#FF6A3D', '#B47CFF'];
      const layers: SvgLayer[] = colors.map((c, i) =>
        makeCircle({
          name: `球 ${i + 1}`,
          attrs: { cx: 0, cy: 0, r: 40 },
          style: { fill: c },
          transform: { x: 200 + i * 200, y: 350, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        }),
      );
      const tracks: SvgTrack[] = [];
      layers.forEach((l, i) => {
        const offset = (i / layers.length) * 1.2;
        tracks.push(
          track(l.id, 'y', [
            kf(0, 350),
            kf(offset + 0.6, 100, 'easeOutBack'),
            kf(offset + 1.2, 350, 'easeIn'),
            kf(2.4, 350),
          ]),
          track(l.id, 'scaleX', [
            kf(0, 1, 'linear'),
            kf(offset + 0.6, 1.2, 'easeOut'),
            kf(offset + 0.8, 1, 'easeIn'),
            kf(2.4, 1),
          ]),
          track(l.id, 'scaleY', [
            kf(0, 1, 'linear'),
            kf(offset + 0.6, 0.7, 'easeOut'),
            kf(offset + 0.8, 1.2, 'easeIn'),
            kf(2.4, 1),
          ]),
        );
      });
      return {
        data: {
          width: 800,
          height: 500,
          background: '#0B0B12',
          duration: 2.4,
          fps: 60,
          layers,
          tracks,
        },
        thumbnail: 'linear-gradient(120deg, #7CF9FF 0%, #FF6A3D 50%, #B47CFF 100%)',
      };
    },
  },
  {
    id: 'text-reveal',
    name: '标题揭示',
    description: '大标题字符逐字揭示 + 错位浮动',
    category: 'intro',
    duration: 3.2,
    build: () => {
      const chars = ['A', 'N', 'I', 'F', 'O', 'R', 'G', 'E'];
      const layers: SvgLayer[] = chars.map((c, i) =>
        makeText({
          name: `字符 ${c}`,
          text: c,
          attrs: { x: 0, y: 0, fontSize: 80 },
          style: { fill: i % 2 === 0 ? '#7CF9FF' : '#FF6A3D', fontWeight: 700 },
          transform: { x: 140 + i * 70, y: 280, rotate: 0, scaleX: 0.4, scaleY: 0.4, opacity: 0 },
        }),
      );
      const tracks: SvgTrack[] = [];
      layers.forEach((l, i) => {
        const t0 = (i / chars.length) * 1.6;
        tracks.push(
          track(l.id, 'opacity', [kf(0, 0), kf(t0, 0), kf(t0 + 0.2, 1, 'easeOut'), kf(3.2, 1)]),
          track(l.id, 'scaleX', [kf(0, 0.4), kf(t0 + 0.2, 1, 'easeOutBack'), kf(3.2, 1)]),
          track(l.id, 'scaleY', [kf(0, 0.4), kf(t0 + 0.2, 1, 'easeOutBack'), kf(3.2, 1)]),
          track(l.id, 'y', [kf(0, 280 + 30), kf(t0 + 0.2, 280, 'easeOutBack'), kf(3.2, 280)]),
        );
      });
      return {
        data: {
          width: 800,
          height: 500,
          background: '#0B0B12',
          duration: 3.2,
          fps: 60,
          layers,
          tracks,
        },
        thumbnail: 'linear-gradient(90deg, #7CF9FF, #FF6A3D)',
      };
    },
  },
  {
    id: 'orbit',
    name: '公转轨道',
    description: '中心点周围元素绕轨道循环运动',
    category: 'loop',
    duration: 4,
    build: () => {
      const center = makeCircle({ name: '中心', attrs: { cx: 0, cy: 0, r: 30 }, style: { fill: '#7CF9FF' }, transform: { x: 400, y: 250, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 } });
      const orbiters: SvgLayer[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        orbiters.push(
          makeCircle({
            name: `卫星 ${i + 1}`,
            attrs: { cx: 0, cy: 0, r: 18 },
            style: { fill: i % 2 ? '#FF6A3D' : '#B47CFF' },
            transform: { x: 400 + Math.cos(angle) * 150, y: 250 + Math.sin(angle) * 150, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 },
          }),
        );
      }
      const tracks: SvgTrack[] = [];
      orbiters.forEach((l, i) => {
        // 通过许多关键帧模拟圆周运动
        const startAngle = (i / 5) * Math.PI * 2;
        const steps = 24;
        const kfs: SvgKeyframe[] = [];
        for (let s = 0; s <= steps; s++) {
          const a = startAngle + (s / steps) * Math.PI * 2;
          kfs.push(kf((s / steps) * 4, 0, 'linear')); // placeholder
          kfs[kfs.length - 1].value = 0;
          kfs[kfs.length - 1] = { ...kfs[kfs.length - 1], time: (s / steps) * 4, value: s % 2 ? 250 + Math.sin(a) * 150 : 250 + Math.sin(a) * 150 };
          // 第二个属性稍后处理
        }
        // 直接构造 x、y 关键帧
        const xKfs: SvgKeyframe[] = [];
        const yKfs: SvgKeyframe[] = [];
        for (let s = 0; s <= steps; s++) {
          const a = startAngle + (s / steps) * Math.PI * 2;
          xKfs.push({ id: uid('kf'), time: (s / steps) * 4, value: 400 + Math.cos(a) * 150, easing: 'linear' });
          yKfs.push({ id: uid('kf'), time: (s / steps) * 4, value: 250 + Math.sin(a) * 150, easing: 'linear' });
        }
        tracks.push({ id: uid('tr'), layerId: l.id, property: 'x', keyframes: xKfs });
        tracks.push({ id: uid('tr'), layerId: l.id, property: 'y', keyframes: yKfs });
      });
      return {
        data: {
          width: 800,
          height: 500,
          background: 'radial-gradient(circle at 50% 50%, #1F1F2A, #0B0B12 70%)',
          duration: 4,
          fps: 60,
          layers: [center, ...orbiters],
          tracks,
        },
        thumbnail: 'radial-gradient(circle at 50% 50%, #7CF9FF, #B47CFF 40%, #0B0B12 80%)',
      };
    },
  },
];

export interface Live2DTemplate {
  id: string;
  name: string;
  description: string;
  build: () => Live2DProjectData;
}

export const LIVE2D_TEMPLATES: Live2DTemplate[] = [
  {
    id: 'l2d-default',
    name: '默认角色 · 凌',
    description: '完整的 Live2D 风格示例角色,含呼吸/眨眼/点击动作',
    build: () => createDefaultCharacter({ width: 600, height: 720 }),
  },
  {
    id: 'l2d-mini',
    name: 'Mini 形象',
    description: '极简部件,适合做虚拟主播桌宠',
    build: () => {
      const c = createDefaultCharacter({ width: 480, height: 540 });
      c.parts = c.parts.filter((p) => ['p_body', 'p_head', 'p_eye_l', 'p_eye_r', 'p_mouth'].includes(p.id));
      c.expressions = [];
      return c;
    },
  },
];
