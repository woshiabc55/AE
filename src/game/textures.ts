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
