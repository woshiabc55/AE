import type { Effect } from '../effects/Effect';

let layerIdCounter = 0;

export interface Layer {
  id: string;
  effect: Effect;
  opacity: number;
  blendMode: GlobalCompositeOperation;
  visible: boolean;
  canvas: HTMLCanvasElement;
}

export class Compositor {
  private layers: Layer[] = [];
  private outputCanvas: HTMLCanvasElement;
  private outputCtx: CanvasRenderingContext2D;

  constructor(outputCanvas: HTMLCanvasElement) {
    this.outputCanvas = outputCanvas;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to acquire 2D context for compositor output canvas');
    }
    this.outputCtx = ctx;
  }

  addLayer(effect: Effect): Layer {
    const canvas = document.createElement('canvas');
    canvas.width = this.outputCanvas.width;
    canvas.height = this.outputCanvas.height;
    const id = `layer-${++layerIdCounter}`;
    const layer: Layer = {
      id,
      effect,
      opacity: 1,
      blendMode: 'source-over',
      visible: true,
      canvas,
    };
    this.layers.push(layer);
    return layer;
  }

  removeLayer(id: string): void {
    const idx = this.layers.findIndex(l => l.id === id);
    if (idx !== -1) {
      const layer = this.layers[idx]!;
      layer.effect.dispose();
      this.layers.splice(idx, 1);
    }
  }

  reorderLayers(order: string[]): void {
    const map = new Map(this.layers.map(l => [l.id, l]));
    const reordered: Layer[] = [];
    for (const id of order) {
      const layer = map.get(id);
      if (layer) {
        reordered.push(layer);
      }
    }
    for (const layer of this.layers) {
      if (!order.includes(layer.id)) {
        reordered.push(layer);
      }
    }
    this.layers = reordered;
  }

  composite(sourceData: ImageData, time: number): ImageData {
    const w = this.outputCanvas.width;
    const h = this.outputCanvas.height;

    this.outputCtx.clearRect(0, 0, w, h);

    for (const layer of this.layers) {
      if (!layer.visible) continue;

      if (layer.canvas.width !== w || layer.canvas.height !== h) {
        layer.canvas.width = w;
        layer.canvas.height = h;
      }

      const layerCtx = layer.canvas.getContext('2d')!;
      layerCtx.clearRect(0, 0, w, h);
      layer.effect.render(layerCtx, sourceData, time);

      this.outputCtx.globalAlpha = layer.opacity;
      this.outputCtx.globalCompositeOperation = layer.blendMode;
      this.outputCtx.drawImage(layer.canvas, 0, 0);
    }

    this.outputCtx.globalAlpha = 1;
    this.outputCtx.globalCompositeOperation = 'source-over';

    return this.outputCtx.getImageData(0, 0, w, h);
  }

  getLayers(): ReadonlyArray<Layer> {
    return this.layers;
  }

  resize(w: number, h: number): void {
    this.outputCanvas.width = w;
    this.outputCanvas.height = h;
    for (const layer of this.layers) {
      layer.canvas.width = w;
      layer.canvas.height = h;
    }
  }

  dispose(): void {
    for (const layer of this.layers) {
      layer.effect.dispose();
    }
    this.layers = [];
  }
}
