import {
  GlassMorphism, NoiseTexture, GradientMesh, AuroraBg, HalftoneDots,
  MagneticButton, DragCard, KeyboardVisual, LiquidButton,
  ParticleField, TypeWriter, MarqueeText, MorphingBlob,
  ColorPalette, TypographyPair, ShadowGen, GradientGen,
  GlitchText, AsciiFilter, Pixelated, ChromaticText, MagneticCursor,
  CounterUp, StickerTilt, LiquidLoader, WaveText, HoverReveal,
} from '../components/preview/Previews';
import {
  Brackets, Conic, Stripes, IsometricCard, DottedGrid, Checker, SkewFrame, DotsBubbles,
  RippleClick, ToggleSwitch, ParallaxLayers, HoverSplats, DragReorder,
  Confetti, CircularText, BouncingLetters, ProgressRing, Spinner3D, TypeAlong,
  AvatarGen, EmojiWall, PatternGen, FontStack, QrPattern, RandomShape,
  Vaporwave, Terminal, GlitchImage, AsciiPortrait, Scanlines, HalftoneImg, DataMosh, PixelShifter,
} from '../components/preview/Previews2';
import {
  GooeyFilter, KineticText, BrickWall, SplitFlap,
  SwipeCards, Hover3DTilt,
  Heartbeat, Rain, Strobe,
  LoremGen, NameGen, Waveform,
  HoloCard, PixelDissolve, LensDistort,
} from '../components/preview/Previews3';

export type Category = 'visual' | 'interaction' | 'animation' | 'generator' | 'experiment';

export interface Tool {
  slug: string;
  name: string;
  category: Category;
  tags: string[];
  description: string;
  Preview: React.FC;
  code: string;
  createdAt: string;
}

const html = (body: string) => `<!doctype html>
<html><head><meta charset="utf-8"><style>body{margin:0;font-family:sans-serif;background:#0a0a0a;}</style></head>
<body>${body}</body></html>`;

export const CATEGORIES: { id: Category; label: string; cn: string }[] = [
  { id: 'visual', label: 'Visual', cn: '视觉' },
  { id: 'interaction', label: 'Interaction', cn: '交互' },
  { id: 'animation', label: 'Animation', cn: '动画' },
  { id: 'generator', label: 'Generator', cn: '生成' },
  { id: 'experiment', label: 'Experiment', cn: '实验' },
];

export const tools: Tool[] = [
  {
    slug: 'glassmorphism',
    name: 'Glassmorphism Card',
    category: 'visual',
    tags: ['blur', 'card', 'modern'],
    description: '使用 backdrop-filter 实现的玻璃拟态卡片，常用于现代仪表盘与登录页。',
    Preview: GlassMorphism,
    code: html(`<div style="height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#ff3da5,#00e5ff,#f0ff00)">
  <div style="width:60%;padding:40px;background:rgba(255,255,255,.2);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.4);border-radius:16px;color:#fff;font-weight:900">GLASSMORPHISM</div>
</div>`),
    createdAt: '2026-01-12',
  },
  {
    slug: 'noise-texture',
    name: 'Noise Texture',
    category: 'visual',
    tags: ['grain', 'texture', 'svg'],
    description: '通过 SVG feTurbulence 滤镜生成的有机噪点纹理，可叠加任意底色。',
    Preview: NoiseTexture,
    code: html(`<div style="position:relative;height:100vh;background:#f0ff00">
  <div style="position:absolute;inset:0;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\'><filter id=\\'n\\'><feTurbulence baseFrequency=\\'0.9\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\'/></svg>')"></div>
</div>`),
    createdAt: '2026-01-14',
  },
  {
    slug: 'gradient-mesh',
    name: 'Gradient Mesh',
    category: 'visual',
    tags: ['gradient', 'radial', 'mesh'],
    description: '使用多个径向渐变叠加生成的网格渐变背景，呈现柔和的彩色烟雾感。',
    Preview: GradientMesh,
    code: html(`<div style="height:100vh;background:
  radial-gradient(at 20% 30%,#f0ff00 0,transparent 50%),
  radial-gradient(at 80% 0%,#ff3da5 0,transparent 50%),
  radial-gradient(at 0% 80%,#00e5ff 0,transparent 50%),
  #0a0a0a"></div>`),
    createdAt: '2026-01-20',
  },
  {
    slug: 'aurora-bg',
    name: 'Aurora Background',
    category: 'visual',
    tags: ['aurora', 'conic', 'animated'],
    description: '使用 conic-gradient + 大模糊实现的极光背景，缓慢旋转。',
    Preview: AuroraBg,
    code: html(`<div style="position:relative;height:100vh;background:#0a0a0a;overflow:hidden">
  <div style="position:absolute;inset:-50%;background:conic-gradient(#f0ff00,#ff3da5,#00e5ff,#f0ff00);filter:blur(80px);animation:spin 30s linear infinite"></div>
</div>
<style>@keyframes spin{to{transform:rotate(360deg)}}</style>`),
    createdAt: '2026-01-22',
  },
  {
    slug: 'halftone-dots',
    name: 'Halftone Dots',
    category: 'visual',
    tags: ['dots', 'mask', 'retro'],
    description: '使用 radial-gradient 重复生成网点，借助 mask 实现径向渐隐。',
    Preview: HalftoneDots,
    code: html(`<div style="height:100vh;background:#f5f1e8;display:grid;place-items:center;
  -webkit-mask:radial-gradient(circle,#000 0%,transparent 70%)">
  <div style="width:100%;height:100%;background-image:radial-gradient(circle,#0a0a0a 2px,transparent 3px);background-size:14px 14px"></div>
</div>`),
    createdAt: '2026-02-01',
  },
  {
    slug: 'magnetic-button',
    name: 'Magnetic Button',
    category: 'interaction',
    tags: ['hover', 'mouse', 'transform'],
    description: '鼠标悬停时按钮会跟随指针轻微位移，模拟磁力吸引效果。',
    Preview: MagneticButton,
    code: html(`<button onmousemove="event.offsetX;this.style.transform='translate('+(event.offsetX-40)*0.2+'px,'+(event.offsetY-20)*0.2+'px)'"
  onmouseleave="this.style.transform=''"
  style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:16px 32px;background:#f0ff00;border:2px solid #f5f1e8;font-weight:700">MAGNETIC</button>`),
    createdAt: '2026-02-04',
  },
  {
    slug: 'drag-card',
    name: 'Draggable Card',
    category: 'interaction',
    tags: ['drag', 'mouse', 'card'],
    description: '通过 mouse 事件实现的可拖拽卡片，纯原生 JS。',
    Preview: DragCard,
    code: html(`<div onmousedown="let x=event.clientX,y=event.clientY;const move=e=>{this.style.transform='translate('+(e.clientX-x)+'px,'+(e.clientY-y)+'px)'};document.onmousemove=move;document.onmouseup=()=>document.onmousemove=null"
  style="width:128px;height:160px;background:#0a0a0a;color:#fff;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);cursor:grab">DRAG ME</div>`),
    createdAt: '2026-02-08',
  },
  {
    slug: 'keyboard-visual',
    name: 'Keyboard Visualizer',
    category: 'interaction',
    tags: ['keyboard', 'event', 'visualizer'],
    description: '监听键盘事件并将按下的键在屏幕上高亮显示。',
    Preview: KeyboardVisual,
    code: html(`<div id="box" style="display:flex;flex-wrap:wrap;gap:4px;padding:20px;background:#0a0a0a;color:#f5f1e8"></div>
<script>
const keys='QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
box.innerHTML=keys.map(k=>'<div style="width:24px;height:24px;border:1px solid #555;display:grid;place-items:center;font:12px monospace" id="k'+k+'">'+k+'</div>').join('');
addEventListener('keydown',e=>{const el=document.getElementById('k'+e.key.toUpperCase());if(el)el.style.background='#f0ff00'});
addEventListener('keyup',e=>{const el=document.getElementById('k'+e.key.toUpperCase());if(el)el.style.background='transparent'});
</script>`),
    createdAt: '2026-02-12',
  },
  {
    slug: 'liquid-button',
    name: 'Liquid Hover Button',
    category: 'interaction',
    tags: ['hover', 'transform', 'button'],
    description: '悬停时背景色块从下方滑入填充按钮，纯 CSS。',
    Preview: LiquidButton,
    code: html(`<button style="position:relative;padding:12px 24px;border:2px solid #f5f1e8;background:transparent;color:#f5f1e8;overflow:hidden;cursor:pointer">
  <span style="position:relative;z-index:1">HOVER</span>
  <span style="position:absolute;inset:0;background:#f0ff00;transform:translateY(100%);transition:.3s" onmouseover="this.style.transform='translateY(0)'" onmouseout="this.style.transform='translateY(100%)'"></span>
</button>`),
    createdAt: '2026-02-18',
  },
  {
    slug: 'particle-field',
    name: 'Particle Field',
    category: 'animation',
    tags: ['canvas', 'particles', 'animation'],
    description: 'Canvas 粒子场，60 个粒子随机运动并撞墙反弹。',
    Preview: ParticleField,
    code: html(`<canvas id="c" style="display:block;background:#0a0a0a"></canvas>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
c.width=innerWidth;c.height=innerHeight;
const ps=Array.from({length:60},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2}));
(function d(){x.fillStyle='rgba(10,10,10,.25)';x.fillRect(0,0,c.width,c.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;x.fillStyle='#f0ff00';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()});requestAnimationFrame(d)})();
</script>`),
    createdAt: '2026-02-22',
  },
  {
    slug: 'typewriter',
    name: 'Typewriter Loop',
    category: 'animation',
    tags: ['text', 'typing', 'loop'],
    description: '经典打字机效果循环，键入-停留-删除。',
    Preview: TypeWriter,
    code: html(`<div id="t" style="font:48px/1 monospace;color:#f0ff00"></div>
<script>
const w=['FORGE','BUILD','CREATE'];let wi=0,ti=0,typing=true;
(function tick(){
  const word=w[wi%w.length];
  if(typing){ti++;if(ti>word.length){typing=false;setTimeout(tick,1200);return}}
  else{ti--;if(ti<0){typing=true;wi++;ti=0}}
  t.textContent=word.slice(0,ti);setTimeout(tick,typing?120:60)
})();
</script>`),
    createdAt: '2026-02-25',
  },
  {
    slug: 'marquee',
    name: 'Infinite Marquee',
    category: 'animation',
    tags: ['scroll', 'marquee', 'loop'],
    description: '使用 CSS animation + transform 实现的无缝无限滚动跑马灯。',
    Preview: MarqueeText,
    code: html(`<div style="display:flex;background:#f0ff00;overflow:hidden">
  <div style="display:flex;animation:m 20s linear infinite;white-space:nowrap">
    <span style="padding:0 20px;font:36px serif;font-weight:900">SKILL FORGE ★ </span>
    <span style="padding:0 20px;font:36px serif;font-weight:900">SKILL FORGE ★ </span>
    <span style="padding:0 20px;font:36px serif;font-weight:900">SKILL FORGE ★ </span>
  </div>
</div>
<style>@keyframes m{from{transform:translateX(0)}to{transform:translateX(-50%)}}</style>`),
    createdAt: '2026-03-01',
  },
  {
    slug: 'morphing-blob',
    name: 'Morphing Blob',
    category: 'animation',
    tags: ['morph', 'blob', 'css'],
    description: '通过 border-radius 关键帧动画实现的有机变形色块。',
    Preview: MorphingBlob,
    code: html(`<div style="width:200px;height:200px;background:#ff3da5;animation:morph 8s ease-in-out infinite;margin:30vh auto;border-radius:60% 40% 30% 70%/60% 30% 70% 40%"></div>
<style>@keyframes morph{
  0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;background:#ff3da5}
  33%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;background:#00e5ff}
  66%{border-radius:50% 50% 30% 60%/40% 60% 50% 50%;background:#f0ff00}
}</style>`),
    createdAt: '2026-03-04',
  },
  {
    slug: 'color-palette',
    name: 'Color Palette Generator',
    category: 'generator',
    tags: ['color', 'palette', 'random'],
    description: '点击按钮随机切换 5 色调色板，并展示色值。',
    Preview: ColorPalette,
    code: html(`<div id="g" style="display:flex;height:100vh"></div>
<button onclick="next()" style="position:fixed;bottom:0;left:0;right:0;padding:8px;background:#0a0a0a;color:#f5f1e8;border:0">SHUFFLE</button>
<script>
const ps=[['#f0ff00','#ff3da5','#00e5ff','#0a0a0a','#f5f1e8'],['#ff6b6b','#4ecdc4','#ffe66d','#1a535c','#f7fff7']];let i=0;
function draw(){g.innerHTML=ps[i].map(c=>'<div style=\"flex:1;background:'+c+'\">'+c+'</div>').join('')}
function next(){i=(i+1)%ps.length;draw()}draw();
</script>`),
    createdAt: '2026-03-08',
  },
  {
    slug: 'typography-pair',
    name: 'Typography Pair',
    category: 'generator',
    tags: ['typography', 'font', 'pair'],
    description: '展示不同显示字体与正文字体的搭配示例。',
    Preview: TypographyPair,
    code: html(`<div style="height:100vh;background:#f5f1e8;color:#0a0a0a;padding:40px;display:flex;flex-direction:column;justify-content:space-between;font-family:'Inter Tight'">
  <div>
    <div style="font:10px monospace">DISPLAY</div>
    <div style="font-family:Fraunces;font-size:60px;font-weight:900">Aa Bb 12</div>
    <div style="font:10px monospace;margin-top:20px">BODY</div>
    <div>The quick brown fox jumps over the lazy dog.</div>
  </div>
</div>`),
    createdAt: '2026-03-12',
  },
  {
    slug: 'shadow-gen',
    name: 'Shadow Generator',
    category: 'generator',
    tags: ['shadow', 'box-shadow', 'tool'],
    description: '通过滑块实时调整 X/Y/Blur 的盒子阴影生成器。',
    Preview: ShadowGen,
    code: html(`<div id="b" style="width:120px;height:120px;background:#f5f1e8;box-shadow:8px 8px 20px #f0ff00;margin:30vh auto"></div>
<input id="x" type="range" min="-30" max="30" value="8" oninput="u()">
<input id="y" type="range" min="-30" max="30" value="8" oninput="u()">
<input id="bl" type="range" min="0" max="60" value="20" oninput="u()">
<script>function u(){b.style.boxShadow=x.value+'px '+y.value+'px '+bl.value+'px #f0ff00'}</script>`),
    createdAt: '2026-03-15',
  },
  {
    slug: 'gradient-gen',
    name: 'Linear Gradient Gen',
    category: 'generator',
    tags: ['gradient', 'color', 'tool'],
    description: '调整角度与双色生成线性渐变背景。',
    Preview: GradientGen,
    code: html(`<div id="g" style="height:80vh;background:linear-gradient(135deg,#f0ff00,#ff3da5)"></div>
<input id="a" type="range" min="0" max="360" value="135" oninput="u()">
<input id="c1" type="color" value="#f0ff00" oninput="u()">
<input id="c2" type="color" value="#ff3da5" oninput="u()">
<script>function u(){g.style.background='linear-gradient('+a.value+'deg,'+c1.value+','+c2.value+')'}</script>`),
    createdAt: '2026-03-18',
  },
  {
    slug: 'glitch-text',
    name: 'Glitch Text',
    category: 'experiment',
    tags: ['glitch', 'rgb', 'text'],
    description: '通过 ::before/::after 偏移叠加生成故障艺术文字。',
    Preview: GlitchText,
    code: html(`<div data-text="GLITCH" style="position:relative;font:60px/1 serif;font-weight:900;color:#fff">GLITCH</div>
<style>
[data-text]::before,[data-text]::after{content:attr(data-text);position:absolute;inset:0;mix-blend-mode:screen}
[data-text]::before{color:#ff3da5;transform:translate(2px,0)}
[data-text]::after{color:#00e5ff;transform:translate(-2px,0)}
</style>`),
    createdAt: '2026-03-20',
  },
  {
    slug: 'ascii-filter',
    name: 'ASCII Rain',
    category: 'experiment',
    tags: ['ascii', 'rain', 'random'],
    description: '随机字符矩阵，模拟 ASCII 雨效果。',
    Preview: AsciiFilter,
    code: html(`<div id="b" style="background:#0a0a0a;color:#f0ff00;font:14px monospace;padding:10px;word-break:break-all;height:100vh;overflow:hidden"></div>
<script>const c='·°*o+x#@';setInterval(()=>{b.innerHTML=Array.from({length:200},()=>c[Math.floor(Math.random()*c.length)]).join(' ')},200)</script>`),
    createdAt: '2026-03-24',
  },
  {
    slug: 'pixelated',
    name: 'Pixelated Text',
    category: 'experiment',
    tags: ['pixel', 'text', 'shadow'],
    description: '用 text-shadow 偏移叠加实现像素化 RGB 错位效果。',
    Preview: Pixelated,
    code: html(`<div style="font:90px/1 serif;font-weight:900;color:#f0ff00;text-shadow:4px 0 #ff3da5,-4px 0 #00e5ff;background:#0a0a0a;height:100vh;display:grid;place-items:center">PIX</div>`),
    createdAt: '2026-03-26',
  },
  {
    slug: 'chromatic',
    name: 'Chromatic Text',
    category: 'experiment',
    tags: ['chromatic', 'rgb', 'offset'],
    description: '通过三层叠加 + mix-blend 实现的色散文字。',
    Preview: ChromaticText,
    code: html(`<div style="position:relative;font:80px/1 serif;font-weight:900;color:#f5f1e8;background:#0a0a0a;height:100vh;display:grid;place-items:center">
  <span style="position:absolute;transform:translateX(-4px);color:#ff3da5;mix-blend-mode:screen">RGB</span>
  <span style="position:absolute;transform:translateX(4px);color:#00e5ff;mix-blend-mode:screen">RGB</span>
  <span>RGB</span>
</div>`),
    createdAt: '2026-03-28',
  },
  {
    slug: 'magnetic-cursor',
    name: 'Magnetic Cursor',
    category: 'experiment',
    tags: ['cursor', 'mouse', 'mix-blend'],
    description: '圆形光标跟随鼠标移动，使用 mix-blend-difference 反色。',
    Preview: MagneticCursor,
    code: html(`<div id="c" style="position:relative;height:100vh;background:linear-gradient(135deg,#0a0a0a,#003a45);overflow:hidden">
  <div id="d" style="position:absolute;width:24px;height:24px;border-radius:50%;background:#f0ff00;mix-blend-mode:difference;pointer-events:none"></div>
</div>
<script>addEventListener('mousemove',e=>{d.style.left=e.clientX-12+'px';d.style.top=e.clientY-12+'px'})</script>`),
    createdAt: '2026-03-30',
  },
  {
    slug: 'counter-up',
    name: 'Counter Up',
    category: 'animation',
    tags: ['counter', 'number', 'animation'],
    description: '数字从 0 缓动增长到目标值的计数器。',
    Preview: CounterUp,
    code: html(`<div id="n" style="font:80px/1 serif;font-weight:900;color:#0a0a0a;background:#f0ff00;height:100vh;display:grid;place-items:center">0</div>
<script>
let c=0;const t=9999;const id=setInterval(()=>{c+=Math.ceil((t-c)*.1);if(c>=t){c=t;clearInterval(id)}n.textContent=c.toLocaleString()},30);
</script>`),
    createdAt: '2026-04-02',
  },
  {
    slug: 'sticker-tilt',
    name: 'Sticker 3D Tilt',
    category: 'interaction',
    tags: ['tilt', '3d', 'transform'],
    description: '鼠标移动时 3D 倾斜的卡片，营造贴纸立体感。',
    Preview: StickerTilt,
    code: html(`<div onmousemove="this.style.transform='rotateX('+(-((event.offsetY/this.offsetHeight)-.5)*25)+'deg) rotateY('+(((event.offsetX/this.offsetWidth)-.5)*25)+'deg)'"
  onmouseleave="this.style.transform=''"
  style="width:160px;height:160px;background:#0a0a0a;color:#f5f1e8;display:grid;place-items:center;font:40px serif;font-weight:900;border:2px solid #f5f1e8;margin:30vh auto;transition:.2s">3D</div>`),
    createdAt: '2026-04-04',
  },
  {
    slug: 'liquid-loader',
    name: 'Liquid Loader',
    category: 'animation',
    tags: ['loader', 'scale', 'animation'],
    description: '五个柱状条带错位弹跳的 loading 动画。',
    Preview: LiquidLoader,
    code: html(`<div style="display:flex;gap:8px;height:100vh;align-items:center;justify-content:center;background:#0a0a0a">
  ${[0,1,2,3,4].map(i=>`<div style="width:14px;height:60px;background:#f0ff00;animation:bounce 1s ease-in-out infinite;animation-delay:${i*0.1}s"></div>`).join('')}
</div>
<style>@keyframes bounce{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}</style>`),
    createdAt: '2026-04-06',
  },
  {
    slug: 'wave-text',
    name: 'Wave Text',
    category: 'animation',
    tags: ['wave', 'text', 'css'],
    description: '字符逐个起伏的波浪文字。',
    Preview: WaveText,
    code: html(`<div style="font:60px/1 serif;font-weight:900;color:#f5f1e8;background:#0a0a0a;height:100vh;display:flex;align-items:center;justify-content:center">
  ${'WAVE'.split('').map((c,i)=>`<span style="display:inline-block;animation:w 1.2s ease-in-out infinite;animation-delay:${i*0.1}s">${c}</span>`).join('')}
</div>
<style>@keyframes w{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px);color:#f0ff00}}</style>`),
    createdAt: '2026-04-08',
  },
  {
    slug: 'hover-reveal',
    name: 'Hover Light Reveal',
    category: 'experiment',
    tags: ['hover', 'light', 'glow'],
    description: '鼠标位置出现一团光晕，营造探照灯效果。',
    Preview: HoverReveal,
    code: html(`<div onmousemove="d.style.left=(event.offsetX-64)+'px';d.style.top=(event.offsetY-64)+'px'"
  style="position:relative;height:100vh;background:linear-gradient(135deg,#0a0a0a,#1a1a1a);overflow:hidden">
  <div id="d" style="position:absolute;width:128px;height:128px;border-radius:50%;background:#f0ff00;filter:blur(40px);pointer-events:none"></div>
  <div style="position:absolute;inset:0;display:grid;place-items:center;font:32px serif;font-weight:900;color:rgba(245,241,232,.3)">HOVER ME</div>
</div>`),
    createdAt: '2026-04-10',
  },
  // =============  BATCH 2  =============
  {
    slug: 'brackets', name: 'Brackets', category: 'visual', tags: ['symbol', 'mono'],
    description: '十种编程括号排成装饰带，倾斜与彩色搭配。',
    Preview: Brackets, code: html(`<div style="display:flex;flex-wrap:wrap;gap:8px;padding:20px;background:#f5f1e8;justify-content:center;align-items:center">${['{','}','[',']','(',')','<','>'].map((c,i)=>'<span style="font:80px serif;font-weight:900;color:'+['#f0ff00','#ff3da5','#00e5ff','#0a0a0a'][i%4]+';transform:rotate('+(i%2?6:-6)+'deg)">'+c+'</span>').join('')}</div>`),
    createdAt: '2026-04-15',
  },
  {
    slug: 'conic-gradient', name: 'Conic Gradient', category: 'visual', tags: ['gradient', 'rainbow'],
    description: 'conic-gradient 实现的彩虹圆盘与中央负空间。',
    Preview: Conic, code: html(`<div style="height:100vh;background:conic-gradient(from 45deg,#f0ff00,#ff3da5,#00e5ff,#f0ff00,#f5f1e8,#f0ff00)"></div>`),
    createdAt: '2026-04-16',
  },
  {
    slug: 'stripes', name: 'Diagonal Stripes', category: 'visual', tags: ['stripe', 'pattern'],
    description: '45° 黄黑条纹与巨大斜体字混合。',
    Preview: Stripes, code: html(`<div style="height:100vh;background:repeating-linear-gradient(45deg,#f0ff00 0 20px,#0a0a0a 20px 40px);display:grid;place-items:center;font:120px serif;font-style:italic;font-weight:900;color:#f5f1e8">STRIPE</div>`),
    createdAt: '2026-04-17',
  },
  {
    slug: 'isometric-card', name: 'Isometric Card', category: 'visual', tags: ['3d', 'iso'],
    description: '3D 旋转 + 硬偏移阴影营造等距卡片。',
    Preview: IsometricCard, code: html(`<div style="height:100vh;display:grid;place-items:center;background:#0a0a0a;perspective:1000px">
  <div style="width:160px;height:160px;background:#ff3da5;transform:rotateX(20deg) rotateY(-20deg);box-shadow:20px 20px 0 #f0ff00"></div>
</div>`),
    createdAt: '2026-04-18',
  },
  {
    slug: 'dotted-grid', name: 'Dotted Grid', category: 'visual', tags: ['dots', 'grid'],
    description: '米色底 + 均匀点阵的纹理背景。',
    Preview: DottedGrid, code: html(`<div style="height:100vh;background:#f5f1e8;background-image:radial-gradient(circle,#0a0a0a 1.5px,transparent 2px);background-size:12px 12px"></div>`),
    createdAt: '2026-04-19',
  },
  {
    slug: 'checker', name: 'Checker Pattern', category: 'visual', tags: ['checker', 'pattern'],
    description: '黄黑棋盘与 mix-blend-difference 文字。',
    Preview: Checker, code: html(`<div style="height:100vh;background-image:linear-gradient(45deg,#f0ff00 25%,transparent 25%),linear-gradient(-45deg,#f0ff00 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#0a0a0a 75%),linear-gradient(-45deg,transparent 75%,#0a0a0a 75%);background-size:30px 30px;background-position:0 0,0 15px,15px -15px,-15px 0;display:grid;place-items:center;font:60px serif;font-weight:900;mix-blend-mode:difference">CHECK</div>`),
    createdAt: '2026-04-20',
  },
  {
    slug: 'skew-frame', name: 'Skew Frame', category: 'visual', tags: ['skew', 'transform'],
    description: '倾斜的方框套着反向倾斜的文字。',
    Preview: SkewFrame, code: html(`<div style="height:100vh;background:#ff3da5;display:grid;place-items:center">
  <div style="width:60%;height:60%;background:#0a0a0a;transform:skewX(-8deg);display:grid;place-items:center">
    <div style="transform:skewX(8deg);color:#f5f1e8;font:48px serif;font-weight:900">SKEW</div>
  </div>
</div>`),
    createdAt: '2026-04-21',
  },
  {
    slug: 'dots-bubbles', name: 'Bubbles', category: 'visual', tags: ['float', 'circle'],
    description: '半透明白色气泡上下漂浮。',
    Preview: DotsBubbles, code: html(`<div style="position:relative;height:100vh;background:linear-gradient(135deg,#00e5ff,#ff3da5);overflow:hidden">
  ${[1,2,3,4,5,6,7,8].map((_,i)=>'<div style="position:absolute;width:'+(20+i*5)+'px;height:'+(20+i*5)+'px;border-radius:50%;background:rgba(255,255,255,.3);left:'+(i*37%100)+'%;top:'+(i*53%100)+'%;animation:fl '+(3+i%3)+'s ease-in-out infinite"></div>').join('')}
</div>
<style>@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>`),
    createdAt: '2026-04-22',
  },
  {
    slug: 'ripple-click', name: 'Ripple Click', category: 'interaction', tags: ['click', 'feedback'],
    description: '点击时扩散的圆环涟漪效果。',
    Preview: RippleClick, code: html(`<div onclick="const s=document.createElement('span');s.style.cssText='position:absolute;left:'+(event.offsetX-10)+'px;top:'+(event.offsetY-10)+'px;width:20px;height:20px;border-radius:50%;border:2px solid #f0ff00;animation:r .6s ease-out forwards';this.appendChild(s)" style="position:relative;height:100vh;background:#0a0a0a;cursor:pointer"></div>
<style>@keyframes r{to{transform:scale(20);opacity:0}}</style>`),
    createdAt: '2026-04-23',
  },
  {
    slug: 'toggle-switch', name: 'Toggle Switch', category: 'interaction', tags: ['switch', 'state'],
    description: '经典 ON / OFF 滑动开关，激活时背景变黄。',
    Preview: ToggleSwitch, code: html(`<button onclick="this.dataset.on=this.dataset.on!=='1'?'1':'0';this.style.background=this.dataset.on==='1'?'#f0ff00':'transparent';this.style.justifyContent=this.dataset.on==='1'?'flex-end':'flex-start'" style="width:64px;height:32px;border:2px solid #f5f1e8;display:flex;align-items:center;padding:2px;background:transparent;cursor:pointer">
  <span style="width:20px;height:20px;background:#f5f1e8;display:block"></span>
</button>`),
    createdAt: '2026-04-24',
  },
  {
    slug: 'parallax-layers', name: 'Parallax Layers', category: 'interaction', tags: ['parallax', 'mouse'],
    description: '鼠标移动时多层云朵以不同速度位移。',
    Preview: ParallaxLayers, code: html(`<div onmousemove="const x=((event.clientX/innerWidth)-.5)*30;this.style.setProperty('--x',x+'px')" style="height:100vh;background:linear-gradient(180deg,#ff3da5,#00e5ff);position:relative;cursor:move">
  <div style="position:absolute;inset:0;transform:translateX(calc(var(--x)*.5));font-size:120px;opacity:.3">☁ ☁ ☁</div>
  <div style="position:absolute;inset:0;transform:translateX(var(--x));font-size:80px;opacity:.5">☁ ☁</div>
</div>`),
    createdAt: '2026-04-25',
  },
  {
    slug: 'hover-splats', name: 'Hover Splats', category: 'interaction', tags: ['hover', 'paint'],
    description: '鼠标移动时随机留下彩色圆点。',
    Preview: HoverSplats, code: html(`<div onmousemove="if(Math.random()>.85){const d=document.createElement('span');d.style.cssText='position:absolute;left:'+event.offsetX+'px;top:'+event.offsetY+'px;width:8px;height:8px;border-radius:50%;background:'+['#f0ff00','#ff3da5','#00e5ff'][Math.floor(Math.random()*3)];this.appendChild(d)}" style="position:relative;height:100vh;background:#f5f1e8;overflow:hidden"></div>`),
    createdAt: '2026-04-26',
  },
  {
    slug: 'drag-reorder', name: 'Drag to Reorder', category: 'interaction', tags: ['drag', 'list'],
    description: '鼠标拖动时自动重排列表项。',
    Preview: DragReorder, code: html(`<ul id="l" style="list-style:none;padding:10px;background:#0a0a0a;min-height:200px">
  ${['A','B','C','D'].map(c=>'<li draggable="true" style="padding:10px;background:#f0ff00;color:#0a0a0a;margin:4px;cursor:move;font-weight:900">'+c+' · drag</li>').join('')}
</ul>`),
    createdAt: '2026-04-27',
  },
  {
    slug: 'confetti', name: 'Confetti Rain', category: 'animation', tags: ['party', 'fall'],
    description: '彩纸从顶部旋转落下的庆祝动画。',
    Preview: Confetti, code: html(`<div style="height:100vh;background:linear-gradient(135deg,#0a0a0a,#ff3da5,#00e5ff);position:relative;overflow:hidden">
  ${Array.from({length:40}).map((_,i)=>'<div style="position:absolute;left:'+(i*13%100)+'%;top:-10%;width:'+(6+(i%3)*3)+'px;height:'+(10+(i%3)*5)+'px;background:'+['#f0ff00','#ff3da5','#00e5ff','#f5f1e8'][i%4]+';animation:fa '+(2+(i%4))+'s linear '+(i*0.1)+'s infinite;transform:rotate('+(i*30)+'deg)"></div>').join('')}
</div>
<style>@keyframes fa{to{transform:translateY(120vh) rotate(720deg)}}</style>`),
    createdAt: '2026-04-28',
  },
  {
    slug: 'circular-text', name: 'Circular Text', category: 'animation', tags: ['svg', 'orbit'],
    description: '沿 SVG 圆形路径环绕的旋转文字。',
    Preview: CircularText, code: html(`<svg viewBox="0 0 200 200" style="width:300px;height:300px;animation:sp 20s linear infinite">
  <defs><path id="c" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"/></defs>
  <text fill="#f0ff00" font-size="14" font-weight="900" font-family="monospace">
    <textPath href="#c">★ CIRCULAR TEXT ★ LOOPING AROUND ★ </textPath>
  </text>
</svg>
<style>@keyframes sp{to{transform:rotate(360deg)}}</style>`),
    createdAt: '2026-04-29',
  },
  {
    slug: 'bouncing-letters', name: 'Bouncing Letters', category: 'animation', tags: ['letter', 'bounce'],
    description: '字母依次弹跳，落地后变黄。',
    Preview: BouncingLetters, code: html(`<div style="font:80px/1 serif;font-weight:900;display:flex;gap:4px;background:#0a0a0a;color:#f5f1e8;height:100vh;align-items:center;justify-content:center">
  ${'BOUNCE'.split('').map((c,i)=>'<span style="display:inline-block;animation:bo .8s ease-in-out '+i*0.08+'s infinite alternate">'+c+'</span>').join('')}
</div>
<style>@keyframes bo{from{transform:translateY(0)}to{transform:translateY(-20px);color:#f0ff00}}</style>`),
    createdAt: '2026-04-30',
  },
  {
    slug: 'progress-ring', name: 'Progress Ring', category: 'animation', tags: ['progress', 'svg'],
    description: 'SVG 描边的进度环，可绑定任意 0–100% 数值。',
    Preview: ProgressRing, code: html(`<svg width="120" height="120"><circle cx="60" cy="60" r="40" stroke="#333" stroke-width="8" fill="none"/><circle cx="60" cy="60" r="40" stroke="#f0ff00" stroke-width="8" fill="none" stroke-dasharray="251" stroke-dashoffset="63" style="transform:rotate(-90deg);transform-origin:center"/></svg>`),
    createdAt: '2026-05-01',
  },
  {
    slug: 'spinner-3d', name: '3D Spinner', category: 'animation', tags: ['spinner', '3d'],
    description: '三维旋转的方块加载器。',
    Preview: Spinner3D, code: html(`<div style="width:64px;height:64px;border:4px solid;border-color:transparent transparent transparent #f0ff00;animation:sp 1s linear infinite"></div>
<style>@keyframes sp{to{transform:rotateY(360deg) rotateX(360deg)}}</style>`),
    createdAt: '2026-05-02',
  },
  {
    slug: 'type-along', name: 'Type Along', category: 'animation', tags: ['type', 'cursor'],
    description: '逐字输出的等宽打字效果。',
    Preview: TypeAlong, code: html(`<div style="font:32px monospace;color:#f0ff00;background:#0a0a0a;height:100vh;display:grid;place-items:center;width:100%">Type, by, character_</div>`),
    createdAt: '2026-05-03',
  },
  {
    slug: 'avatar-gen', name: 'Avatar Generator', category: 'generator', tags: ['avatar', 'face'],
    description: '4×3 像素风格化头像组合，hover 可缩放。',
    Preview: AvatarGen, code: html(`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:8px;background:#f5f1e8;height:100vh">
  ${Array.from({length:12}).map((_,i)=>'<div style="display:grid;place-items:center;background:'+['#f0ff00','#ff3da5','#00e5ff','#0a0a0a'][i%4]+';color:'+(i%4===3?'#f5f1e8':'#0a0a0a')+';font:20px monospace">◕‿◕</div>').join('')}
</div>`),
    createdAt: '2026-05-04',
  },
  {
    slug: 'emoji-wall', name: 'Emoji Wall', category: 'generator', tags: ['emoji', 'grid'],
    description: '24 个高饱和色块上的随机 emoji。',
    Preview: EmojiWall, code: html(`<div style="display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,1fr);gap:2px;padding:8px;background:#0a0a0a;height:100vh">${['🚀','💎','🔥','⚡','🌈','🍄','👾','🎯','🌊','⭐','🪐','🌙'].map(e=>'<div style="display:grid;place-items:center;font-size:24px;background:hsl('+Math.random()*360+',60%,30%)">'+e+'</div>').join('')}</div>`),
    createdAt: '2026-05-05',
  },
  {
    slug: 'pattern-gen', name: 'Pattern Generator', category: 'generator', tags: ['pattern', 'random'],
    description: '8×8 随机色彩网格，点击重新生成。',
    Preview: PatternGen, code: html(`<div onclick="this.style.backgroundImage='linear-gradient(90deg,'+Array.from({length:8},()=>'hsl('+Math.random()*360+',70%,50%) '+Math.random()*100+'%').join(',')+')'" style="height:100vh;background:linear-gradient(90deg,#f0ff00,#ff3da5);cursor:pointer"></div>`),
    createdAt: '2026-05-06',
  },
  {
    slug: 'font-stack', name: 'Font Stack', category: 'generator', tags: ['font', 'reference'],
    description: '6 种 font-family 速查表，含中英文样张。',
    Preview: FontStack, code: html(`<div style="padding:10px;background:#f5f1e8;color:#0a0a0a;font-size:14px">
  <div style="font-family:'Georgia',serif">Georgia · 古典衬线</div>
  <div style="font-family:'Courier New',monospace">Courier New · 打字机</div>
  <div style="font-family:system-ui">system-ui · 系统默认</div>
</div>`),
    createdAt: '2026-05-07',
  },
  {
    slug: 'qr-pattern', name: 'QR Pattern', category: 'generator', tags: ['qr', 'grid'],
    description: '仿二维码的 12×12 像素矩阵。',
    Preview: QrPattern, code: html(`<div style="display:grid;grid-template-columns:repeat(12,1fr);gap:1px;width:200px;height:200px;background:#f5f1e8;padding:8px">${Array.from({length:144}).map(()=>'<div style="background:'+(Math.random()>.5?'#0a0a0a':'transparent')+'"></div>').join('')}</div>`),
    createdAt: '2026-05-08',
  },
  {
    slug: 'random-shape', name: 'Random Shape', category: 'generator', tags: ['shape', 'cycle'],
    description: '5 种几何形轮流切换展示。',
    Preview: RandomShape, code: html(`<div style="height:100vh;background:#0a0a0a;display:grid;place-items:center">
  <div style="width:160px;height:160px;border-radius:50%;background:#f0ff00;animation:sh 3s ease-in-out infinite"></div>
</div>
<style>@keyframes sh{0%,100%{border-radius:50%}33%{border-radius:0;background:#ff3da5}66%{border-radius:0 100% 0 100%;background:#00e5ff}}</style>`),
    createdAt: '2026-05-09',
  },
  {
    slug: 'vaporwave', name: 'Vaporwave', category: 'experiment', tags: ['retro', 'synth'],
    description: '粉青渐变 + 透视网格 + RGB 错位字。',
    Preview: Vaporwave, code: html(`<div style="height:100vh;background:linear-gradient(180deg,#ff71ce,#01cdfe,#b967ff,#05ffa1);position:relative;display:grid;place-items:center;font:120px serif;font-weight:900;color:#fff;text-shadow:6px 0 #ff71ce,-6px 0 #01cdfe">VAPOR</div>`),
    createdAt: '2026-05-10',
  },
  {
    slug: 'terminal', name: 'Terminal Typing', category: 'experiment', tags: ['terminal', 'cli'],
    description: '逐行出现的命令行效果，带光标闪烁。',
    Preview: Terminal, code: html(`<div style="height:100vh;background:#000;padding:20px;font:14px monospace;color:#0f0">
  <div>$ npm init forge</div>
  <div style="color:#5dd39e">✓ Initializing...</div>
  <div>$ _</div>
</div>`),
    createdAt: '2026-05-11',
  },
  {
    slug: 'glitch-image', name: 'Glitch Image', category: 'experiment', tags: ['glitch', 'rgb'],
    description: '三色错位混合的故障字体效果。',
    Preview: GlitchImage, code: html(`<div style="height:100vh;background:#0a0a0a;display:grid;place-items:center;font:120px/1 serif;font-weight:900;color:#f5f1e8;position:relative">
  <span style="position:absolute;transform:translate(3px,0);color:#ff3da5;mix-blend-mode:screen">GLITCH</span>
  <span style="position:absolute;transform:translate(-3px,0);color:#00e5ff;mix-blend-mode:screen">GLITCH</span>
  <span>GLITCH</span>
</div>`),
    createdAt: '2026-05-12',
  },
  {
    slug: 'ascii-portrait', name: 'ASCII Portrait', category: 'experiment', tags: ['ascii', 'noise'],
    description: 'ASCII 字符画风格的随机点阵。',
    Preview: AsciiPortrait, code: html(`<div style="height:100vh;background:#f5f1e8;padding:8px;font:8px/8px monospace;color:#0a0a0a;word-break:break-all;overflow:hidden">${Array.from({length:400}).map(()=>'@#%&*+=-:. '[Math.floor(Math.random()*11)]).join('')}</div>`),
    createdAt: '2026-05-13',
  },
  {
    slug: 'scanlines', name: 'CRT Scanlines', category: 'experiment', tags: ['crt', 'retro'],
    description: '复古显示器扫描线效果。',
    Preview: Scanlines, code: html(`<div style="height:100vh;background:#0a0a0a;background-image:repeating-linear-gradient(0deg,transparent 0 2px,rgba(255,255,255,0.04) 2px 4px);display:grid;place-items:center;font:48px serif;font-weight:900;color:#f0ff00">SCANLINES</div>`),
    createdAt: '2026-05-14',
  },
  {
    slug: 'halftone-img', name: 'Halftone Image', category: 'experiment', tags: ['halftone', 'dot'],
    description: '点阵半色调效果。',
    Preview: HalftoneImg, code: html(`<div style="height:100vh;background:#ff3da5;background-image:radial-gradient(circle,#0a0a0a 30%,transparent 50%);background-size:8px 8px"></div>`),
    createdAt: '2026-05-15',
  },
  {
    slug: 'data-mosh', name: 'Data Moshing', category: 'experiment', tags: ['glitch', 'data'],
    description: '模拟数据损坏的乱码流。',
    Preview: DataMosh, code: html(`<div style="height:100vh;background:#0a0a0a;padding:8px;font:10px monospace;color:#f0ff00;overflow:hidden">${Array.from({length:25}).map(()=>Array.from({length:60}).map(()=>String.fromCharCode(33+Math.floor(Math.random()*94))).join('')).join('<br>')}</div>`),
    createdAt: '2026-05-16',
  },
  {
    slug: 'pixel-shifter', name: 'Pixel Shifter', category: 'experiment', tags: ['pixel', 'shift'],
    description: '8×8 像素网格的色块循环。',
    Preview: PixelShifter, code: html(`<div style="height:100vh;background:#0a0a0a;display:grid;place-items:center">
  <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;width:60%;height:60%">
    ${Array.from({length:64}).map((_,i)=>'<div style="background:'+['#f0ff00','#ff3da5','#00e5ff','#f5f1e8','#0a0a0a'][i%5]+'"></div>').join('')}
  </div>
</div>`),
    createdAt: '2026-05-17',
  },
  // =============  BATCH 3  =============
  {
    slug: 'gooey-filter', name: 'Gooey SVG Filter', category: 'visual', tags: ['svg', 'filter'],
    description: 'SVG feGaussianBlur + feColorMatrix 制造融化效果。',
    Preview: GooeyFilter, code: html(`<svg width="0" height="0"><filter id="g"><feGaussianBlur stdDeviation="6"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/></filter></svg>
<div style="filter:url(#g);height:100vh;background:#0a0a0a;display:grid;place-items:center">
  <div style="display:flex;gap:0">
    <div style="width:80px;height:80px;border-radius:50%;background:#f0ff00"></div>
    <div style="width:80px;height:80px;border-radius:50%;background:#ff3da5;margin-left:-30px"></div>
    <div style="width:80px;height:80px;border-radius:50%;background:#00e5ff;margin-left:-30px"></div>
  </div>
</div>`),
    createdAt: '2026-05-18',
  },
  {
    slug: 'kinetic-text', name: 'Kinetic Text', category: 'visual', tags: ['text', 'type'],
    description: '主副文字组合的展示型标题。',
    Preview: KineticText, code: html(`<div style="height:100vh;background:#0a0a0a;display:grid;place-items:center;text-align:center">
  <div style="font:80px/1 serif;font-weight:900;color:#f5f1e8">KINETIC</div>
  <div style="font:14px monospace;color:#f0ff00;margin-top:8px">type in motion</div>
</div>`),
    createdAt: '2026-05-19',
  },
  {
    slug: 'brick-wall', name: 'Brick Wall', category: 'visual', tags: ['pattern', 'wall'],
    description: '用 linear-gradient 拼出的砖墙纹理。',
    Preview: BrickWall, code: html(`<div style="height:100vh;background:#0a0a0a;background-image:linear-gradient(335deg,#f0ff00 23%,transparent 23%),linear-gradient(155deg,#f0ff00 23%,transparent 23%),linear-gradient(335deg,transparent 67%,#f0ff00 67%),linear-gradient(155deg,transparent 67%,#f0ff00 67%);background-size:20px 20px;background-position:0 0,10px 0,10px -10px,0 10px"></div>`),
    createdAt: '2026-05-20',
  },
  {
    slug: 'split-flap', name: 'Split Flap Board', category: 'animation', tags: ['flip', 'board'],
    description: '机场翻页牌的 5 块字符，每隔数秒翻动一次。',
    Preview: SplitFlap, code: html(`<div style="display:flex;gap:4px;background:#0a0a0a;height:100vh;align-items:center;justify-content:center">
  ${'SKILL'.split('').map(c=>'<div style="width:56px;height:80px;background:#f5f1e8;color:#0a0a0a;display:grid;place-items:center;font:60px monospace;font-weight:900;border:2px solid #f5f1e8">'+c+'</div>').join('')}
</div>`),
    createdAt: '2026-05-21',
  },
  {
    slug: 'swipe-cards', name: 'Swipeable Cards', category: 'interaction', tags: ['swipe', 'card'],
    description: '可前后切换的卡片堆栈，每张有不同偏移。',
    Preview: SwipeCards, code: html(`<div style="position:relative;height:100vh;background:linear-gradient(135deg,#ff3da5,#00e5ff);display:grid;place-items:center">${['A','B','C','D'].map((c,i)=>'<div style="position:absolute;width:128px;height:176px;background:#0a0a0a;color:#f5f1e8;display:grid;place-items:center;font:64px serif;font-weight:900;border:2px solid #f5f1e8;transform:translateX('+(i*20)+'px) rotate('+(i*5)+'deg);z-index:'+(4-i)+'">'+c+'</div>').join('')}</div>`),
    createdAt: '2026-05-22',
  },
  {
    slug: 'hover-3d-tilt', name: 'Hover 3D Tilt', category: 'interaction', tags: ['3d', 'tilt'],
    description: 'hover 时根据鼠标位置 3D 倾斜卡片。',
    Preview: Hover3DTilt, code: html(`<div onmousemove="this.style.transform='perspective(800px) rotateY('+(((event.offsetX/this.offsetWidth)-.5)*30)+'deg) rotateX('+(((event.offsetY/this.offsetHeight)-.5)*-30)+'deg)'" onmouseleave="this.style.transform=''" style="width:160px;height:224px;background:#f0ff00;color:#0a0a0a;display:grid;place-items:center;font:32px serif;font-weight:900;transition:.1s">HOVER</div>`),
    createdAt: '2026-05-23',
  },
  {
    slug: 'heartbeat', name: 'Heartbeat', category: 'animation', tags: ['heart', 'pulse'],
    description: '真实心电图般的心跳动画。',
    Preview: Heartbeat, code: html(`<div style="height:100vh;background:#0a0a0a;display:grid;place-items:center;font-size:120px;color:#ff3da5;animation:hb 1.2s ease-in-out infinite">♥</div>
<style>@keyframes hb{0%,100%{transform:scale(1)}20%{transform:scale(1.2)}40%{transform:scale(.95)}60%{transform:scale(1.1)}80%{transform:scale(.98)}}</style>`),
    createdAt: '2026-05-24',
  },
  {
    slug: 'rain', name: 'Rain Animation', category: 'animation', tags: ['rain', 'weather'],
    description: '30 根青色雨滴从天而降。',
    Preview: Rain, code: html(`<div style="position:relative;height:100vh;background:#0a0a0a;overflow:hidden">${Array.from({length:30}).map((_,i)=>'<div style="position:absolute;width:2px;height:32px;background:#00e5ff;left:'+(i*37%100)+'%;top:-20%;animation:ra '+(0.5+(i%5)*0.2)+'s linear '+(i*0.05)+'s infinite"></div>').join('')}</div>
<style>@keyframes ra{to{transform:translateY(120vh)}}</style>`),
    createdAt: '2026-05-25',
  },
  {
    slug: 'strobe', name: 'Click Strobe', category: 'animation', tags: ['click', 'flash'],
    description: '点击切换全屏闪烁的警示色。',
    Preview: Strobe, code: html(`<div onclick="this.style.background=this.style.background==='rgb(240, 255, 0)'?'#0a0a0a':'#f0ff00';this.style.color=this.style.color==='rgb(10, 10, 10)'?'#f0ff00':'#0a0a0a'" style="height:100vh;background:#f0ff00;display:grid;place-items:center;font:80px serif;font-weight:900;color:#0a0a0a;cursor:pointer">CLICK</div>`),
    createdAt: '2026-05-26',
  },
  {
    slug: 'lorem-gen', name: 'Lorem 中文生成器', category: 'generator', tags: ['text', 'cn'],
    description: '使用工坊关键词生成中文段落。',
    Preview: LoremGen, code: html(`<div style="padding:16px;background:#f5f1e8;color:#0a0a0a;font-size:14px;line-height:1.8">锻造工坊 像素字形。动效玻璃。噪点网格；渐变质感。粗细倾斜、彩色对比、层次节奏、呼吸。 — 每一段都是一段历史的回声。</div>`),
    createdAt: '2026-05-27',
  },
  {
    slug: 'name-gen', name: '中文名生成器', category: 'generator', tags: ['name', 'cn'],
    description: '三段式组合生成东方风格名字。',
    Preview: NameGen, code: html(`<div style="padding:16px;background:#0a0a0a;color:#f5f1e8">${['思之焰','幻之渊','墨之海','光之风','影之沙','空之夜','镜之翼','铁之路','灰之日','苍之潮','幽之心','赤之痕'].map(n=>'<div style="font:32px/1.4 serif;font-weight:900">'+n+'</div>').join('')}</div>`),
    createdAt: '2026-05-28',
  },
  {
    slug: 'waveform', name: 'Audio Waveform', category: 'generator', tags: ['audio', 'bars'],
    description: '20 条随机高度条带，模拟音频波形。',
    Preview: Waveform, code: html(`<div style="height:100vh;background:#0a0a0a;display:flex;align-items:flex-end;gap:2px;padding:16px">${Array.from({length:20}).map((_,i)=>'<div style="flex:1;height:'+(20+Math.random()*80)+'%;background:'+(i%2?'#f0ff00':'#00e5ff')+'"></div>').join('')}</div>`),
    createdAt: '2026-05-29',
  },
  {
    slug: 'holo-card', name: 'Holographic Card', category: 'experiment', tags: ['holo', 'gradient'],
    description: '鼠标位置生成径向渐变，全息卡效果。',
    Preview: HoloCard, code: html(`<div onmousemove="this.style.background='radial-gradient(circle at '+((event.offsetX/this.offsetWidth)*100)+'% '+((event.offsetY/this.offsetHeight)*100)+'%,#ff3da5,#00e5ff 50%,#0a0a0a)'" style="height:100vh;background:radial-gradient(circle at 50% 50%,#ff3da5,#00e5ff 50%,#0a0a0a);display:grid;place-items:center;font:80px/1 serif;font-weight:900;color:#fff;mix-blend-mode:difference;cursor:crosshair">HOLO</div>`),
    createdAt: '2026-05-30',
  },
  {
    slug: 'pixel-dissolve', name: 'Pixel Dissolve', category: 'experiment', tags: ['pixel', 'dissolve'],
    description: '12×12 像素网格的随机透明度脉动。',
    Preview: PixelDissolve, code: html(`<div style="height:100vh;background:#0a0a0a;display:grid;grid-template-columns:repeat(12,1fr);gap:2px;padding:4px">${Array.from({length:144}).map((_,i)=>'<div style="background:'+['#f0ff00','#ff3da5','#00e5ff','#f5f1e8'][i%4]+';animation:di '+(1+(i%5)*0.3)+'s ease-in-out '+(i%30*0.05)+'s infinite"></div>').join('')}</div>
<style>@keyframes di{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.5)}}</style>`),
    createdAt: '2026-05-31',
  },
  {
    slug: 'lens-distort', name: 'Lens Distortion', category: 'experiment', tags: ['bulge', 'morph'],
    description: '矩形缓慢胀缩 + 旋转，模拟镜头畸变。',
    Preview: LensDistort, code: html(`<div style="height:100vh;background:linear-gradient(135deg,#0a0a0a,rgba(255,61,165,.4));display:grid;place-items:center">
  <div style="width:60%;height:60%;background:#f0ff00;animation:bu 4s ease-in-out infinite;border-radius:40% 60% 50% 50%/50% 50% 40% 60%"></div>
</div>
<style>@keyframes bu{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.3) rotate(20deg)}}</style>`),
    createdAt: '2026-06-01',
  },
];

export const findTool = (slug: string) => tools.find(t => t.slug === slug);
