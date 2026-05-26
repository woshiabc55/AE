export interface PixelRendererConfig {
  pixelSize: number;
  width: number;
  height: number;
}

export class PixelRenderer {
  private offscreen: HTMLCanvasElement;
  private offCtx: CanvasRenderingContext2D;
  private mainCanvas: HTMLCanvasElement;
  private mainCtx: CanvasRenderingContext2D;
  private pixelSize: number;
  private virtualWidth: number;
  private virtualHeight: number;

  constructor(canvas: HTMLCanvasElement, config: PixelRendererConfig) {
    this.mainCanvas = canvas;
    this.mainCtx = canvas.getContext('2d')!;
    this.pixelSize = config.pixelSize;
    this.virtualWidth = Math.ceil(config.width / this.pixelSize);
    this.virtualHeight = Math.ceil(config.height / this.pixelSize);

    this.offscreen = document.createElement('canvas');
    this.offscreen.width = this.virtualWidth;
    this.offscreen.height = this.virtualHeight;
    this.offCtx = this.offscreen.getContext('2d')!;
    this.offCtx.imageSmoothingEnabled = false;
    this.mainCtx.imageSmoothingEnabled = false;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.offCtx;
  }

  get virtualW(): number {
    return this.virtualWidth;
  }

  get virtualH(): number {
    return this.virtualHeight;
  }

  updatePixelSize(pixelSize: number) {
    this.pixelSize = pixelSize;
    this.virtualWidth = Math.ceil(this.mainCanvas.width / this.pixelSize);
    this.virtualHeight = Math.ceil(this.mainCanvas.height / this.pixelSize);
    this.offscreen.width = this.virtualWidth;
    this.offscreen.height = this.virtualHeight;
  }

  resize(width: number, height: number) {
    this.mainCanvas.width = width;
    this.mainCanvas.height = height;
    this.virtualWidth = Math.ceil(width / this.pixelSize);
    this.virtualHeight = Math.ceil(height / this.pixelSize);
    this.offscreen.width = this.virtualWidth;
    this.offscreen.height = this.virtualHeight;
  }

  clear(color: string = '#0A1628') {
    this.offCtx.fillStyle = color;
    this.offCtx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
  }

  drawPixel(x: number, y: number, color: string) {
    this.offCtx.fillStyle = color;
    this.offCtx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
  }

  drawRect(x: number, y: number, w: number, h: number, color: string) {
    this.offCtx.fillStyle = color;
    this.offCtx.fillRect(Math.floor(x), Math.floor(y), w, h);
  }

  drawLine(x0: number, y0: number, x1: number, y1: number, color: string) {
    this.offCtx.strokeStyle = color;
    this.offCtx.beginPath();
    this.offCtx.moveTo(Math.floor(x0), Math.floor(y0));
    this.offCtx.lineTo(Math.floor(x1), Math.floor(y1));
    this.offCtx.stroke();
  }

  render() {
    this.mainCtx.imageSmoothingEnabled = false;
    this.mainCtx.drawImage(
      this.offscreen,
      0, 0, this.virtualWidth, this.virtualHeight,
      0, 0, this.mainCanvas.width, this.mainCanvas.height
    );
  }
}
