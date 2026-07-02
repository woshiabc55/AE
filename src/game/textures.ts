import * as THREE from "three";

// 程序化像素纹理：所有材质纹理用小尺寸 Canvas 绘制，NearestFilter 保留像素感

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return [cv, ctx];
}

function toTexture(cv: HTMLCanvasElement, repeat = 1): THREE.Texture {
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 伪随机（固定种子，保证稳定）
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// 墙体纹理：深色虚空石 + 青色裂纹与像素砖缝
export function makeWallTexture(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  const rand = rng(7);
  // 底色
  ctx.fillStyle = "#0a0d16";
  ctx.fillRect(0, 0, S, S);
  // 像素砖块噪点
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = rand();
      if (n < 0.18) {
        ctx.fillStyle = n < 0.06 ? "#05060a" : "#11151f";
        ctx.fillRect(x, y, 1, 1);
      } else if (n > 0.93) {
        ctx.fillStyle = "#161c2b";
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  // 砖缝
  ctx.fillStyle = "#04050a";
  for (let y = 0; y < S; y += 8) ctx.fillRect(0, y, S, 1);
  for (let y = 0; y < S; y += 8) {
    const off = (y / 8) % 2 === 0 ? 0 : 8;
    for (let x = off; x < S; x += 16) ctx.fillRect(x, y, 1, 8);
  }
  // 青色裂纹
  ctx.fillStyle = "#2a6f8a";
  const cracks = [
    [4, 2], [5, 2], [5, 3], [6, 3],
    [20, 10], [21, 10], [21, 11], [22, 11],
    [12, 20], [13, 20], [13, 21], [14, 21], [15, 21],
  ];
  for (const [x, y] of cracks) ctx.fillRect(x, y, 1, 1);
  // 高光点
  ctx.fillStyle = "#1d2740";
  ctx.fillRect(2, 6, 1, 1);
  ctx.fillRect(18, 14, 1, 1);
  ctx.fillRect(26, 24, 1, 1);
  return toTexture(cv);
}

// 地板纹理：极暗 + 网格 + 偶发青点
export function makeFloorTexture(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  const rand = rng(21);
  ctx.fillStyle = "#070910";
  ctx.fillRect(0, 0, S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = rand();
      if (n < 0.1) {
        ctx.fillStyle = "#0b0f18";
        ctx.fillRect(x, y, 1, 1);
      } else if (n > 0.985) {
        ctx.fillStyle = "#16384a";
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  // 网格线
  ctx.fillStyle = "#0d121d";
  for (let i = 0; i < S; i += 8) {
    ctx.fillRect(i, 0, 1, S);
    ctx.fillRect(0, i, S, 1);
  }
  return toTexture(cv);
}

// 天花板纹理：几乎纯黑 + 极弱噪点
export function makeCeilTexture(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  const rand = rng(99);
  ctx.fillStyle = "#03040a";
  ctx.fillRect(0, 0, S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (rand() < 0.05) {
        ctx.fillStyle = "#070912";
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return toTexture(cv);
}

// 记忆回响精灵：金色发光菱形/晶核
export function makeEchoSprite(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  // 外层柔光
  ctx.fillStyle = "rgba(255,216,107,0.18)";
  ctx.fillRect(10, 6, 12, 20);
  ctx.fillRect(6, 12, 20, 8);
  // 主体菱形（像素）
  const diamond = [
    [16, 4],
    [14, 6], [18, 6],
    [12, 8], [16, 8], [20, 8],
    [10, 10], [12, 10], [14, 10], [16, 10], [18, 10], [20, 10], [22, 10],
    [10, 12], [22, 12],
    [10, 14], [12, 14], [22, 14],
    [12, 16], [14, 16], [20, 16], [22, 16],
    [14, 18], [16, 18], [18, 18], [20, 18],
    [16, 20], [18, 20],
  ];
  ctx.fillStyle = "#ffd86b";
  for (const [x, y] of diamond) ctx.fillRect(x, y, 2, 2);
  // 内核高光
  ctx.fillStyle = "#fff3c4";
  ctx.fillRect(14, 10, 2, 2);
  ctx.fillRect(16, 12, 2, 2);
  // 边缘暗
  ctx.fillStyle = "#b8862f";
  ctx.fillRect(12, 14, 2, 2);
  ctx.fillRect(20, 14, 2, 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 暗影实体精灵：紫色幽魂，单眼
export function makeShadowSprite(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  // 柔光
  ctx.fillStyle = "rgba(122,59,255,0.15)";
  ctx.fillRect(8, 4, 16, 24);
  // 身体（像素轮廓）
  const body = [
    [10, 6], [12, 6], [14, 6], [16, 6], [18, 6], [20, 6],
    [8, 8], [10, 8], [12, 8], [14, 8], [16, 8], [18, 8], [20, 8], [22, 8],
  ];
  ctx.fillStyle = "#3a1d7a";
  for (const [x, y] of body) ctx.fillRect(x, y, 2, 2);
  // 主体填充
  ctx.fillStyle = "#6a35e0";
  ctx.fillRect(10, 8, 12, 14);
  ctx.fillRect(8, 10, 16, 10);
  // 顶部圆弧
  ctx.fillStyle = "#7a3bff";
  ctx.fillRect(12, 6, 8, 2);
  ctx.fillRect(10, 6, 2, 2);
  ctx.fillRect(20, 6, 2, 2);
  // 单眼
  ctx.fillStyle = "#ff3b5c";
  ctx.fillRect(14, 12, 4, 4);
  ctx.fillStyle = "#fff";
  ctx.fillRect(15, 13, 2, 2);
  // 底部破碎拖尾
  ctx.fillStyle = "#3a1d7a";
  ctx.fillRect(9, 22, 2, 4);
  ctx.fillRect(13, 22, 2, 6);
  ctx.fillRect(17, 22, 2, 4);
  ctx.fillRect(21, 22, 2, 6);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 传送门精灵：洋红漩涡
export function makePortalSprite(active: boolean): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const core = active ? "#ff5be3" : "#5a2245";
  const ring = active ? "#ffa6e8" : "#3a1530";
  const glow = active ? "rgba(255,91,227,0.22)" : "rgba(90,34,69,0.15)";
  // 外光晕
  ctx.fillStyle = glow;
  ctx.fillRect(6, 6, 20, 20);
  // 外环
  ctx.fillStyle = ring;
  ctx.fillRect(10, 4, 12, 2);
  ctx.fillRect(10, 26, 12, 2);
  ctx.fillRect(4, 10, 2, 12);
  ctx.fillRect(26, 10, 2, 12);
  ctx.fillRect(8, 8, 2, 2); ctx.fillRect(22, 8, 2, 2);
  ctx.fillRect(8, 22, 2, 2); ctx.fillRect(22, 22, 2, 2);
  // 漩涡核心
  ctx.fillStyle = core;
  ctx.fillRect(12, 8, 8, 16);
  ctx.fillRect(10, 10, 12, 12);
  // 漩涡纹路
  ctx.fillStyle = ring;
  ctx.fillRect(14, 10, 2, 2);
  ctx.fillRect(18, 12, 2, 2);
  ctx.fillRect(14, 16, 2, 2);
  ctx.fillRect(18, 18, 2, 2);
  // 中心亮点
  if (active) {
    ctx.fillStyle = "#fff0fb";
    ctx.fillRect(15, 15, 2, 2);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 主菜单虚空粒子背景的小亮点纹理
export function makeParticleSprite(): THREE.Texture {
  const S = 16;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "rgba(58,215,255,0.25)";
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillStyle = "#7fe8ff";
  ctx.fillRect(6, 6, 4, 4);
  ctx.fillStyle = "#fff";
  ctx.fillRect(7, 7, 2, 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 回响辉光晕轮：径向渐变金色柔光（加性混合用）
export function makeEchoHalo(): THREE.Texture {
  const S = 64;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(255,216,107,0.85)");
  grad.addColorStop(0.3, "rgba(255,216,107,0.4)");
  grad.addColorStop(1, "rgba(255,216,107,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 传送门辉光晕轮：洋红径向
export function makePortalHalo(): THREE.Texture {
  const S = 64;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(255,91,227,0.7)");
  grad.addColorStop(0.4, "rgba(255,91,227,0.25)");
  grad.addColorStop(1, "rgba(255,91,227,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 收集粒子点：纯发光方块
export function makeSpark(): THREE.Texture {
  const S = 8;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "#fff3c4";
  ctx.fillRect(1, 1, 6, 6);
  ctx.fillStyle = "#ffd86b";
  ctx.fillRect(2, 2, 4, 4);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 暗影辉光晕轮：紫色径向
export function makeShadowHalo(): THREE.Texture {
  const S = 64;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(122,59,255,0.6)");
  grad.addColorStop(0.5, "rgba(122,59,255,0.2)");
  grad.addColorStop(1, "rgba(122,59,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 武器 viewmodel：第一人称能量手枪，枪口朝左上（指向准星）
export function makeWeaponSprite(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const rect = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  // 枪管（朝左）
  rect(2, 15, 2, 4, "#0c1322"); // 枪口
  rect(4, 14, 13, 6, "#1a2238"); // 枪管主体
  rect(4, 14, 13, 1, "#3a4a6a"); // 枪管顶高光
  rect(4, 19, 13, 1, "#0a0f1c"); // 枪管底暗边
  // 机匣/主体
  rect(16, 13, 13, 12, "#1a2238");
  rect(16, 13, 13, 1, "#3a4a6a"); // 顶高光
  rect(16, 24, 13, 1, "#0a0f1c"); // 底暗边
  rect(17, 14, 1, 10, "#243150"); // 侧高光
  // 握把
  rect(21, 24, 6, 7, "#1a2238");
  rect(21, 24, 6, 1, "#3a4a6a");
  rect(26, 25, 1, 6, "#0a0f1c");
  // 能量弹匣（青色发光）
  rect(18, 16, 4, 5, "#0a2a3a");
  rect(19, 17, 2, 3, "#3ad7ff");
  rect(19, 17, 1, 1, "#bff6ff");
  // 扳机护圈
  rect(18, 24, 3, 1, "#0a0f1c");
  rect(18, 25, 1, 2, "#243150");
  // 准星/瞄具小点
  rect(8, 13, 1, 1, "#3ad7ff");
  // 散热槽
  rect(24, 16, 1, 1, "#0a0f1c");
  rect(26, 16, 1, 1, "#0a0f1c");
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 枪口火光：明亮十字星
export function makeMuzzleFlash(): THREE.Texture {
  const S = 16;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  // 外辉光
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, "rgba(255,243,196,0.9)");
  grad.addColorStop(0.4, "rgba(255,216,107,0.5)");
  grad.addColorStop(1, "rgba(255,216,107,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  // 十字星
  ctx.fillStyle = "#fff7d6";
  ctx.fillRect(7, 1, 2, 14);
  ctx.fillRect(1, 7, 14, 2);
  ctx.fillStyle = "#ffd86b";
  ctx.fillRect(7, 3, 2, 10);
  ctx.fillRect(3, 7, 10, 2);
  ctx.fillStyle = "#fff";
  ctx.fillRect(7, 7, 2, 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 符文装饰：发光几何纹样（主题色）
export function makeRuneTexture(color: string): THREE.Texture {
  const S = 16;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  // 柔光底
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, hexToRgba(color, 0.35));
  grad.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  // 三角符文外框
  ctx.fillStyle = color;
  // 三角形（像素）
  const tri = [
    [8, 2],
    [6, 4], [10, 4],
    [4, 6], [8, 6], [12, 6],
    [3, 8], [13, 8],
    [4, 10], [12, 10],
    [6, 12], [10, 12],
    [8, 14],
  ];
  for (const [x, y] of tri) ctx.fillRect(x, y, 1, 1);
  // 中心点
  ctx.fillStyle = "#fff";
  ctx.fillRect(8, 8, 1, 1);
  // 横线
  ctx.fillStyle = hexToRgba(color, 0.6);
  ctx.fillRect(2, 8, 2, 1);
  ctx.fillRect(12, 8, 2, 1);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// #rrggbb -> rgba()
function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
