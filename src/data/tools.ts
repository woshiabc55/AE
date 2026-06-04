import {
  GlassMorphism, NoiseTexture, GradientMesh, AuroraBg, HalftoneDots,
  MagneticButton, DragCard, KeyboardVisual, LiquidButton,
  ParticleField, TypeWriter, MarqueeText, MorphingBlob,
  ColorPalette, TypographyPair, ShadowGen, GradientGen,
  GlitchText, AsciiFilter, Pixelated, ChromaticText, MagneticCursor,
  CounterUp, StickerTilt, LiquidLoader, WaveText, HoverReveal,
} from '../components/preview/Previews';

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
];

export const findTool = (slug: string) => tools.find(t => t.slug === slug);
