import * as THREE from "three";

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return [cv, ctx];
}

// 地面：墨绿网格战术地坪
export function makeGroundTexture(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.fillStyle = "#10160f";
  ctx.fillRect(0, 0, S, S);
  // 暗块斑驳
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * S);
    const y = Math.floor(Math.random() * S);
    ctx.fillStyle = Math.random() > 0.5 ? "#161d12" : "#0c1109";
    ctx.fillRect(x, y, 1, 1);
  }
  // 网格线
  ctx.fillStyle = "#1d2a18";
  for (let i = 0; i < S; i += 8) {
    ctx.fillRect(i, 0, 1, S);
    ctx.fillRect(0, i, S, 1);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(8, 8);
  return tex;
}

// 墙/建筑：混凝土 + 弹痕
export function makeWallTexture(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.fillStyle = "#2a2f24";
  ctx.fillRect(0, 0, S, S);
  // 砖纹分块
  ctx.fillStyle = "#22271d";
  for (let y = 0; y < S; y += 8) {
    ctx.fillRect(0, y, S, 1);
    const off = (y / 8) % 2 === 0 ? 0 : 8;
    for (let x = off; x < S; x += 16) ctx.fillRect(x, y, 1, 8);
  }
  // 高光顶/暗边
  ctx.fillStyle = "#333928";
  ctx.fillRect(0, 0, S, 1);
  ctx.fillStyle = "#161a12";
  ctx.fillRect(0, S - 1, S, 1);
  // 弹痕/斑驳
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "#3a4130" : "#1c2017";
    ctx.fillRect(Math.floor(Math.random() * S), Math.floor(Math.random() * S), 1, 1);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 士兵 billboard：朝相机的像素士兵（按阵营染色）
// uniform 主色 / 护甲 / 头盔 / 枪
export function makeSoldierSprite(team: "alpha" | "bravo", cls: string): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const uniform = team === "alpha" ? "#2a4a8a" : "#8a2a3a"; // 友蓝/敌红
  const accent = team === "alpha" ? "#3a8cff" : "#ff3b5c";
  const armor = "#3a3f30";
  const skin = "#caa57a";
  const gun = "#15191a";
  const rect = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  // 头盔
  rect(13, 4, 6, 3, armor);
  rect(12, 6, 8, 2, armor);
  rect(12, 8, 2, 1, "#0c0f0a");
  // 脸
  rect(14, 8, 4, 3, skin);
  rect(15, 9, 1, 1, "#0c0f0a"); // 眼
  // 护肩/胸甲
  rect(11, 11, 10, 2, armor);
  // 躯干(制服)
  rect(12, 13, 8, 7, uniform);
  rect(12, 13, 8, 1, accent); // 阵营识别带
  rect(15, 14, 2, 5, "#0c0f0a"); // 战术背心
  // 手臂
  rect(9, 13, 2, 6, uniform);
  rect(21, 13, 2, 6, uniform);
  rect(9, 19, 2, 1, skin); // 手
  rect(21, 19, 2, 1, skin);
  // 枪(双手持)
  rect(20, 15, 8, 2, gun);
  rect(26, 15, 2, 3, gun); // 弹匣
  rect(19, 14, 2, 1, gun);
  // 腿
  rect(13, 20, 3, 7, "#1a1f18");
  rect(16, 20, 3, 7, "#1a1f18");
  rect(13, 27, 3, 1, "#0c0f0a");
  rect(16, 27, 3, 1, "#0c0f0a");
  // 职业标记(胸口小点)
  const clsColor = cls === "recon" ? "#3a8cff" : cls === "support" ? "#ff8a3d" : "#4fd6c2";
  rect(14, 16, 1, 1, clsColor);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 据点光柱 sprite（金/青呼吸）
export function makeCaptureBeacon(): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,216,107,0.8)");
  grad.addColorStop(0.5, "rgba(255,216,107,0.25)");
  grad.addColorStop(1, "rgba(255,216,107,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#fff3c4";
  ctx.fillRect(15, 6, 2, 20);
  ctx.fillStyle = "#ffd86b";
  ctx.fillRect(14, 8, 4, 16);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 枪口火光
export function makeMuzzleFlash(): THREE.Texture {
  const S = 16;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, "rgba(255,243,196,0.9)");
  grad.addColorStop(0.4, "rgba(255,216,107,0.5)");
  grad.addColorStop(1, "rgba(255,216,107,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#fff7d6";
  ctx.fillRect(7, 1, 2, 14);
  ctx.fillRect(1, 7, 14, 2);
  ctx.fillStyle = "#fff";
  ctx.fillRect(7, 7, 2, 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 武器 viewmodel：突击步枪(像素)
export function makeWeaponSprite(type: "ar" | "dmr" | "lmg"): THREE.Texture {
  const S = 32;
  const [cv, ctx] = makeCanvas(S);
  ctx.clearRect(0, 0, S, S);
  const rect = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  // 公共色板
  const METAL_D = "#0c0f12";
  const METAL = "#1c2228";
  const METAL_H = "#36404a";
  const METAL_L = "#262e36";
  const SHADE = "#080a0c";

  if (type === "ar") {
    // VK-12 突击步枪 —— 紧凑、战术青弹匣
    // 枪管
    rect(1, 15, 3, 4, METAL_D);
    rect(3, 14, 13, 6, METAL);
    rect(3, 14, 13, 1, METAL_H);
    rect(3, 19, 13, 1, SHADE);
    // 机匣
    rect(16, 13, 14, 11, METAL);
    rect(16, 13, 14, 1, METAL_H);
    rect(16, 23, 14, 1, SHADE);
    rect(17, 14, 1, 9, METAL_L);
    // 弹匣(战术青)
    rect(18, 16, 4, 6, "#0a2622");
    rect(19, 17, 2, 4, "#4fd6c2");
    rect(19, 17, 1, 1, "#bff7ee");
    // 握把
    rect(22, 23, 6, 7, METAL);
    rect(22, 23, 6, 1, METAL_H);
    // 准星
    rect(9, 13, 1, 1, "#4fd6c2");
    // 散热槽
    rect(25, 16, 1, 1, SHADE);
    rect(27, 16, 1, 1, SHADE);
  } else if (type === "dmr") {
    // SR-7 战术步枪 —— 长枪管 + 顶部瞄准镜、蓝色调
    // 长枪管
    rect(0, 15, 2, 3, METAL_D);
    rect(2, 14, 12, 5, METAL);
    rect(2, 14, 12, 1, METAL_H);
    rect(2, 18, 12, 1, SHADE);
    // 枪口制退器
    rect(0, 14, 1, 5, "#2a3340");
    // 机匣(更长)
    rect(14, 13, 17, 10, METAL);
    rect(14, 13, 17, 1, METAL_H);
    rect(14, 22, 17, 1, SHADE);
    rect(15, 14, 1, 8, METAL_L);
    // 顶部瞄准镜(蓝色镜片)
    rect(20, 10, 7, 4, "#0a1626");
    rect(21, 11, 5, 2, "#1a3358");
    rect(22, 11, 3, 1, "#3a8cff");
    rect(23, 11, 1, 1, "#9fc2ff");
    // 镜架
    rect(20, 13, 7, 1, METAL_H);
    rect(20, 10, 1, 3, METAL_H);
    rect(26, 10, 1, 3, METAL_H);
    // 弹匣(窄、蓝)
    rect(18, 17, 3, 5, "#0a1426");
    rect(19, 18, 1, 3, "#3a8cff");
    // 握把
    rect(24, 22, 6, 8, METAL);
    rect(24, 22, 6, 1, METAL_H);
    // 扳机护圈
    rect(22, 22, 2, 2, METAL_D);
    // 准星
    rect(6, 13, 1, 1, "#3a8cff");
  } else {
    // MG-X 轻机枪 —— 大弹鼓、粗壮、橙色调
    // 粗枪管
    rect(0, 14, 4, 5, METAL_D);
    rect(4, 13, 12, 7, METAL);
    rect(4, 13, 12, 1, METAL_H);
    rect(4, 19, 12, 1, SHADE);
    // 散热孔
    rect(6, 16, 1, 1, SHADE);
    rect(8, 16, 1, 1, SHADE);
    rect(10, 16, 1, 1, SHADE);
    rect(12, 16, 1, 1, SHADE);
    // 机匣(厚重)
    rect(16, 12, 15, 12, METAL);
    rect(16, 12, 15, 1, METAL_H);
    rect(16, 23, 15, 1, SHADE);
    rect(17, 13, 1, 10, METAL_L);
    // 大弹鼓(圆形、橙)
    rect(20, 18, 8, 8, "#2a1408");
    rect(21, 19, 6, 6, "#ff8a3d");
    rect(22, 20, 4, 4, "#5a2a0a");
    rect(23, 21, 2, 2, "#ffb87a");
    // 握把
    rect(25, 23, 5, 7, METAL);
    rect(25, 23, 5, 1, METAL_H);
    // 两脚架(收拢)
    rect(2, 19, 1, 4, METAL_H);
    rect(4, 19, 1, 4, METAL_H);
    // 提把
    rect(18, 10, 6, 2, METAL);
    rect(18, 10, 6, 1, METAL_H);
    // 准星
    rect(2, 13, 1, 1, "#ff8a3d");
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 命中粒子点
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

// 天空盒：墨绿暮色渐变（程序化 canvas 贴大球内壁）
export function makeSkyTexture(): THREE.Texture {
  const W = 64;
  const H = 128;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#0a1410");
  grad.addColorStop(0.5, "#101a14");
  grad.addColorStop(1, "#1a261a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  // 远山剪影
  ctx.fillStyle = "#0c120c";
  for (let x = 0; x < W; x++) {
    const h = 8 + Math.sin(x * 0.3) * 4 + Math.sin(x * 0.7) * 3;
    ctx.fillRect(x, H - h, 1, h);
  }
  // 星点
  ctx.fillStyle = "#3a4a3a";
  for (let i = 0; i < 18; i++) {
    ctx.fillRect(Math.floor(Math.random() * W), Math.floor(Math.random() * H * 0.5), 1, 1);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
