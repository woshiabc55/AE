export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private _width: number;
  private _height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Failed to acquire 2D rendering context');
    }
    this.ctx = ctx;
    this._width = canvas.width;
    this._height = canvas.height;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this._width, this._height);
  }

  drawImage(
    image: HTMLImageElement | HTMLCanvasElement,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number,
  ): void {
    if (dw !== undefined && dh !== undefined) {
      this.ctx.drawImage(image, dx, dy, dw, dh);
    } else {
      this.ctx.drawImage(image, dx, dy);
    }
  }

  drawImageSlice(
    image: HTMLImageElement | HTMLCanvasElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void {
    this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  getImageData(x = 0, y = 0, w?: number, h?: number): ImageData {
    return this.ctx.getImageData(x, y, w ?? this._width, h ?? this._height);
  }

  putImageData(data: ImageData, dx = 0, dy = 0): void {
    this.ctx.putImageData(data, dx, dy);
  }

  resize(w: number, h: number): void {
    this._width = w;
    this._height = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  setSmoothing(enabled: boolean): void {
    this.ctx.imageSmoothingEnabled = enabled;
  }

  fill(color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this._width, this._height);
  }
}
