// Canvas 2D 等距投影降级渲染器（无 WebGL 时使用）

import { VoxelWorld, Block, BLOCK_DEFS } from "./VoxelWorld";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export { isWebGLAvailable };

export class IsoRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scale = 24;
  offsetX = 0;
  offsetY = 0;
  rotation = 0; // 0, 1, 2, 3 对应四个等距视角
  dragging = false;
  lastMouse = { x: 0, y: 0 };
  targetBlock: { x: number; y: number; z: number } | null = null;

  constructor(public container: HTMLElement, public world: VoxelWorld) {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing";
    this.ctx = this.canvas.getContext("2d")!;
    container.appendChild(this.canvas);

    this.resize();
    window.addEventListener("resize", this.resize);
    this.bindEvents();

    // 初始视角居中
    this.offsetX = this.canvas.width / 2;
    this.offsetY = this.canvas.height / 4;
  }

  bindEvents() {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mouseleave", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  resize = () => {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  isoProject(x: number, y: number, z: number) {
    // 等距投影：绕 Y 轴旋转 45°，再向下倾斜 30°
    const r = this.rotation % 4;
    let sx = x;
    let sz = z;
    // 简单四向旋转
    for (let i = 0; i < r; i++) {
      const tmp = sx;
      sx = -sz;
      sz = tmp;
    }
    const screenX = this.offsetX + (sx - sz) * this.scale * 0.866;
    const screenY = this.offsetY + (sx + sz) * this.scale * 0.5 - y * this.scale;
    return { x: screenX, y: screenY };
  }

  render() {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    this.ctx.clearRect(0, 0, width, height);

    // 背景天空渐变
    const grad = this.ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#87ceeb");
    grad.addColorStop(1, "#e0f6ff");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);

    // 收集所有方块并按深度排序
    const blocks: Block[] = [];
    for (const b of this.world.allBlocks()) {
      blocks.push(b);
    }
    // 画家算法：从远到近绘制
    blocks.sort((a, b) => {
      const r = this.rotation % 4;
      let va = a.x + a.y * 0.1 + a.z;
      let vb = b.x + b.y * 0.1 + b.z;
      if (r === 1 || r === 3) {
        va = a.z + a.y * 0.1 + a.x;
        vb = b.z + b.y * 0.1 + b.x;
      }
      return va - vb;
    });

    for (const block of blocks) {
      this.drawCube(block.x, block.y, block.z, block.type);
    }

    // 绘制选中高亮
    if (this.targetBlock) {
      const p = this.isoProject(this.targetBlock.x, this.targetBlock.y, this.targetBlock.z);
      this.ctx.strokeStyle = "rgba(255,255,255,0.9)";
      this.ctx.lineWidth = 2;
      this.drawCubeOutline(p.x, p.y, this.scale);
    }
  }

  drawCube(x: number, y: number, z: number, type: string) {
    const def = BLOCK_DEFS[type as keyof typeof BLOCK_DEFS];
    if (!def) return;

    const p = this.isoProject(x, y, z);
    const base = this.hexToRgb(def.color);
    const w = this.scale * 0.866; // 顶面半宽
    const h = this.scale * 0.5; // 顶面半高
    const d = this.scale; // 立方体高度

    // 顶面（最亮）
    this.ctx.fillStyle = this.rgbToCss(base.r * 1.15, base.g * 1.15, base.b * 1.15);
    this.ctx.beginPath();
    this.ctx.moveTo(p.x, p.y - d);
    this.ctx.lineTo(p.x + w, p.y - h - d);
    this.ctx.lineTo(p.x, p.y - 2 * h - d);
    this.ctx.lineTo(p.x - w, p.y - h - d);
    this.ctx.closePath();
    this.ctx.fill();

    // 右侧面
    this.ctx.fillStyle = this.rgbToCss(base.r * 0.85, base.g * 0.85, base.b * 0.85);
    this.ctx.beginPath();
    this.ctx.moveTo(p.x, p.y);
    this.ctx.lineTo(p.x + w, p.y - h);
    this.ctx.lineTo(p.x + w, p.y - h - d);
    this.ctx.lineTo(p.x, p.y - d);
    this.ctx.closePath();
    this.ctx.fill();

    // 左侧面
    this.ctx.fillStyle = this.rgbToCss(base.r * 0.65, base.g * 0.65, base.b * 0.65);
    this.ctx.beginPath();
    this.ctx.moveTo(p.x, p.y);
    this.ctx.lineTo(p.x - w, p.y - h);
    this.ctx.lineTo(p.x - w, p.y - h - d);
    this.ctx.lineTo(p.x, p.y - d);
    this.ctx.closePath();
    this.ctx.fill();

    // 简单描边，增强方块感
    this.ctx.strokeStyle = "rgba(0,0,0,0.12)";
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  }

  drawCubeOutline(x: number, y: number, scale: number) {
    const w = scale * 0.866;
    const h = scale * 0.5;
    const d = scale;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + w, y - h);
    this.ctx.lineTo(x + w, y - h - d);
    this.ctx.lineTo(x, y - d);
    this.ctx.lineTo(x - w, y - h - d);
    this.ctx.lineTo(x - w, y - h);
    this.ctx.closePath();
    this.ctx.stroke();

    // 顶面
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - d);
    this.ctx.lineTo(x + w, y - h - d);
    this.ctx.lineTo(x, y - 2 * h - d);
    this.ctx.lineTo(x - w, y - h - d);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  hexToRgb(hex: number) {
    return {
      r: ((hex >> 16) & 255),
      g: ((hex >> 8) & 255),
      b: (hex & 255),
    };
  }

  rgbToCss(r: number, g: number, b: number) {
    return `rgb(${Math.min(255, Math.floor(r))}, ${Math.min(255, Math.floor(g))}, ${Math.min(255, Math.floor(b))})`;
  }

  onMouseDown = (e: MouseEvent) => {
    this.dragging = true;
    this.lastMouse = { x: e.clientX, y: e.clientY };
  };

  onMouseMove = (e: MouseEvent) => {
    if (this.dragging) {
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  onMouseUp = () => {
    this.dragging = false;
  };

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    this.scale = Math.max(8, Math.min(80, this.scale * factor));
  };

  destroy() {
    window.removeEventListener("resize", this.resize);
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("mouseleave", this.onMouseUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}
