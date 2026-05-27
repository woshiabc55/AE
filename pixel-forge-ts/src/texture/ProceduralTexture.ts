export type TextureType = 'pixel' | 'rings' | 'bands' | 'spiral' | 'checker' | 'gradient';

export interface TextureConfig {
  type: TextureType;
  ringCount: number;
  ringWidth: number;
  pixelSize: number;
  bandDensity: number;
  spiralTurns: number;
  color1: string;
  color2: string;
}

const DEFAULT_CONFIG: TextureConfig = {
  type: 'rings',
  ringCount: 8,
  ringWidth: 3,
  pixelSize: 4,
  bandDensity: 10,
  spiralTurns: 5,
  color1: '#6c5ce7',
  color2: '#00cec9',
};

function hexToRGB(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

export class ProceduralTexture {
  generate(config: TextureConfig, width: number, height: number): HTMLCanvasElement {
    const fullConfig = { ...DEFAULT_CONFIG, ...config };
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    switch (fullConfig.type) {
      case 'pixel':
        this.generatePixel(fullConfig, width, height, data);
        break;
      case 'rings':
        this.generateRings(fullConfig, width, height, data);
        break;
      case 'bands':
        this.generateBands(fullConfig, width, height, data);
        break;
      case 'spiral':
        this.generateSpiral(fullConfig, width, height, data);
        break;
      case 'checker':
        this.generateChecker(fullConfig, width, height, data);
        break;
      case 'gradient':
        this.generateGradient(fullConfig, width, height, data);
        break;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  private setPixel(data: Uint8ClampedArray, w: number, x: number, y: number, r: number, g: number, b: number, a: number): void {
    const idx = (y * w + x) * 4;
    data[idx] = r;
    data[idx + 1] = g;
    data[idx + 2] = b;
    data[idx + 3] = a;
  }

  private generatePixel(config: TextureConfig, w: number, h: number, data: Uint8ClampedArray): void {
    const c1 = hexToRGB(config.color1);
    const c2 = hexToRGB(config.color2);
    const ps = Math.max(1, config.pixelSize);

    for (let by = 0; by < h; by += ps) {
      for (let bx = 0; bx < w; bx += ps) {
        const t = ((bx * 7 + by * 13) % 17) / 17;
        const [r, g, b] = lerpColor(c1, c2, t);
        for (let dy = 0; dy < ps && by + dy < h; dy++) {
          for (let dx = 0; dx < ps && bx + dx < w; dx++) {
            this.setPixel(data, w, bx + dx, by + dy, r, g, b, 255);
          }
        }
      }
    }
  }

  private generateRings(config: TextureConfig, w: number, h: number, data: Uint8ClampedArray): void {
    const c1 = hexToRGB(config.color1);
    const c2 = hexToRGB(config.color2);
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    const ringSpacing = maxR / Math.max(1, config.ringCount);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ringIndex = Math.floor(dist / ringSpacing);
        const inRing = (dist % ringSpacing) < config.ringWidth;
        const t = (ringIndex % 2 === 0) ? 0 : 1;
        const [r, g, b] = inRing ? lerpColor(c1, c2, t) : [10, 10, 20];
        this.setPixel(data, w, x, y, r, g, b, 255);
      }
    }
  }

  private generateBands(config: TextureConfig, w: number, h: number, data: Uint8ClampedArray): void {
    const c1 = hexToRGB(config.color1);
    const c2 = hexToRGB(config.color2);
    const bandWidth = Math.max(1, Math.floor(h / config.bandDensity));

    for (let y = 0; y < h; y++) {
      const bandIndex = Math.floor(y / bandWidth);
      const t = (bandIndex % 2 === 0) ? 0 : 1;
      const [r, g, b] = lerpColor(c1, c2, t);
      for (let x = 0; x < w; x++) {
        this.setPixel(data, w, x, y, r, g, b, 255);
      }
    }
  }

  private generateSpiral(config: TextureConfig, w: number, h: number, data: Uint8ClampedArray): void {
    const c1 = hexToRGB(config.color1);
    const c2 = hexToRGB(config.color2);
    const cx = w / 2;
    const cy = h / 2;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const spiralVal = (angle + Math.PI + dist * 0.05 * config.spiralTurns) % (2 * Math.PI);
        const t = spiralVal / (2 * Math.PI);
        const [r, g, b] = lerpColor(c1, c2, t);
        this.setPixel(data, w, x, y, r, g, b, 255);
      }
    }
  }

  private generateChecker(config: TextureConfig, w: number, h: number, data: Uint8ClampedArray): void {
    const c1 = hexToRGB(config.color1);
    const c2 = hexToRGB(config.color2);
    const size = Math.max(1, config.pixelSize * 4);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cx = Math.floor(x / size);
        const cy = Math.floor(y / size);
        const checker = (cx + cy) % 2;
        const [r, g, b] = checker === 0 ? c1 : c2;
        this.setPixel(data, w, x, y, r, g, b, 255);
      }
    }
  }

  private generateGradient(config: TextureConfig, w: number, h: number, data: Uint8ClampedArray): void {
    const c1 = hexToRGB(config.color1);
    const c2 = hexToRGB(config.color2);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const t = (x + y) / (w + h);
        const [r, g, b] = lerpColor(c1, c2, t);
        this.setPixel(data, w, x, y, r, g, b, 255);
      }
    }
  }
}
