export interface WaveConfig {
  amplitude: number;
  frequency: number;
  phase: number;
  layers: number;
  speed: number;
}

export interface WaveLayer {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  color1: string;
  color2: string;
  yOffset: number;
}

export class WaveSystem {
  private layers: WaveLayer[] = [];
  private time: number = 0;

  constructor(config: WaveConfig) {
    this.rebuildLayers(config);
  }

  rebuildLayers(config: WaveConfig) {
    this.layers = [];
    const colors: [string, string][] = [
      ['#003F87', '#0055BB'],
      ['#0055BB', '#0077DD'],
      ['#0077DD', '#0099FF'],
      ['#0099FF', '#00BBFF'],
      ['#00BBFF', '#00D4AA'],
    ];

    for (let i = 0; i < config.layers; i++) {
      const t = i / Math.max(config.layers - 1, 1);
      const colorPair = colors[i % colors.length];
      this.layers.push({
        amplitude: config.amplitude * (1 - t * 0.3),
        frequency: config.frequency * (1 + t * 0.5),
        phase: config.phase + i * 1.2,
        speed: config.speed * (1 + t * 0.2),
        color1: colorPair[0],
        color2: colorPair[1],
        yOffset: 0.5 + t * 0.12,
      });
    }
  }

  update(dt: number) {
    this.time += dt;
  }

  getWaveY(x: number, layerIndex: number): number {
    const layer = this.layers[layerIndex];
    if (!layer) return 0;
    return Math.sin(x * layer.frequency + this.time * layer.speed + layer.phase) * layer.amplitude
      + Math.sin(x * layer.frequency * 0.5 + this.time * layer.speed * 0.7 + layer.phase * 1.3) * layer.amplitude * 0.3;
  }

  getSurfaceY(x: number, virtualHeight: number): number {
    if (this.layers.length === 0) return virtualHeight * 0.6;
    const layer = this.layers[0];
    const waveVal = Math.sin(x * layer.frequency + this.time * layer.speed + layer.phase) * layer.amplitude
      + Math.sin(x * layer.frequency * 0.5 + this.time * layer.speed * 0.7 + layer.phase * 1.3) * layer.amplitude * 0.3;
    return virtualHeight * layer.yOffset + waveVal;
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    for (let li = this.layers.length - 1; li >= 0; li--) {
      const layer = this.layers[li];
      const baseY = height * layer.yOffset;

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x++) {
        const waveY = this.getWaveY(x, li);
        const y = baseY + waveY;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, baseY - layer.amplitude, 0, height);
      gradient.addColorStop(0, layer.color1);
      gradient.addColorStop(0.5, layer.color2);
      gradient.addColorStop(1, '#001133');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
}
