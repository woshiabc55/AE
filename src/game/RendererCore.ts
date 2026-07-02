import * as THREE from "three";

// 2 渲 3 渲染核心：
// WebGLRenderer 以低分辨率绘制（drawing buffer = 屏幕尺寸 / pixelScale），
// canvas 的 CSS 尺寸铺满容器并启用 image-rendering: pixelated，
// 浏览器最近邻放大形成粗像素，再叠加 CRT 扫描线/暗角（由 React 层提供）。

export class RendererCore {
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  private container: HTMLElement;
  private pixelScale: number;

  constructor(container: HTMLElement, pixelScale: number) {
    this.container = container;
    this.pixelScale = pixelScale;
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvas = this.renderer.domElement;
    this.canvas.classList.add("canvas-pixel");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    this.canvas.style.cursor = "none";
    container.appendChild(this.canvas);
    this.resize();
  }

  setPixelScale(n: number) {
    this.pixelScale = Math.max(1, n);
    this.resize();
  }

  resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    const bw = Math.max(1, Math.floor(w / this.pixelScale));
    const bh = Math.max(1, Math.floor(h / this.pixelScale));
    this.renderer.setSize(bw, bh, false);
  }

  getDrawingSize() {
    return {
      w: this.renderer.domElement.width,
      h: this.renderer.domElement.height,
    };
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
  }

  dispose() {
    this.renderer.dispose();
    if (this.canvas.parentElement === this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}
