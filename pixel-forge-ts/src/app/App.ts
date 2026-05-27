import { EventBus } from '../core/EventBus';
import { Renderer } from '../core/Renderer';
import { AnimationLoop } from '../core/AnimationLoop';
import { ImageLoader, type ImageSource } from '../core/ImageLoader';
import { Compositor } from '../compositor/Compositor';
import { PhysicsEngine, type PhysicsForce } from '../physics/PhysicsEngine';
import { ProceduralTexture, type TextureConfig, type TextureType } from '../texture/ProceduralTexture';
import { UIManager } from '../ui/UIManager';
import { Scene3D } from '../threejs/Scene3D';
import { EntityModelBuilder, type SoftwareEntity } from '../threejs/EntityModelBuilder';
import type { Effect } from '../effects/Effect';
import { PixelateEffect } from '../effects/PixelateEffect';
import { IonizeEffect } from '../effects/IonizeEffect';
import { WaveEffect } from '../effects/WaveEffect';
import { GlitchEffect } from '../effects/GlitchEffect';
import { ChromaticEffect } from '../effects/ChromaticEffect';

export class PixelForgeApp {
  private bus: EventBus;
  private renderer: Renderer;
  private animLoop: AnimationLoop;
  private compositor: Compositor;
  private ui: UIManager;
  private scene3d: Scene3D | null = null;
  private physics: PhysicsEngine;
  private textureGen: ProceduralTexture;
  private entityBuilder: EntityModelBuilder;
  private currentMode: 'texture' | 'entity' = 'texture';
  private effects: Effect[] = [];
  private imageSource: ImageSource | null = null;
  private canvas: HTMLCanvasElement;
  private canvas3d: HTMLCanvasElement | null = null;
  private currentTextureConfig: TextureConfig = {
    type: 'rings',
    ringCount: 8,
    ringWidth: 3,
    pixelSize: 4,
    bandDensity: 10,
    spiralTurns: 5,
    color1: '#6c5ce7',
    color2: '#00cec9',
  };

  constructor(container: HTMLElement) {
    this.bus = new EventBus();
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;

    this.renderer = new Renderer(this.canvas);
    this.compositor = new Compositor(this.canvas);
    this.animLoop = new AnimationLoop(this.onFrame.bind(this));
    this.physics = new PhysicsEngine();
    this.textureGen = new ProceduralTexture();
    this.entityBuilder = new EntityModelBuilder();
    this.ui = new UIManager(this.bus, container);
  }

  init(): void {
    this.ui.init();

    const canvasArea = this.ui.getCanvasArea();
    if (canvasArea) {
      canvasArea.appendChild(this.canvas);
    }

    this.effects = [
      new PixelateEffect(),
      new IonizeEffect(),
      new WaveEffect(),
      new GlitchEffect(),
      new ChromaticEffect(),
    ];

    for (const effect of this.effects) {
      effect.init(this.bus);
    }

    this.imageSource = ImageLoader.createFallback(512, 512);

    this.buildUI();
    this.setupEventHandlers();
    this.addDefaultLayer();

    this.animLoop.start();
  }

  private buildUI(): void {
    const sidebar = this.ui.getSidebar();
    if (!sidebar) return;

    sidebar.innerHTML = '';

    sidebar.appendChild(this.ui.createModeSwitch());
    sidebar.appendChild(this.ui.createUploadZone());
    sidebar.appendChild(this.ui.createEffectPanel(this.effects));
    sidebar.appendChild(this.ui.createLayerPanel(this.compositor));
    sidebar.appendChild(this.ui.createParamControls(this.effects[0]!));
    sidebar.appendChild(this.createTexturePanel());
    sidebar.appendChild(this.createPhysicsPanel());
  }

  private createTexturePanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('h3');
    title.textContent = 'Texture Generator';
    panel.appendChild(title);

    const types: TextureType[] = ['pixel', 'rings', 'bands', 'spiral', 'checker', 'gradient'];
    const row = document.createElement('div');
    row.className = 'param-row';
    const label = document.createElement('label');
    label.textContent = 'Type';
    const select = document.createElement('select');
    for (const t of types) {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      if (this.currentTextureConfig.type === t) opt.selected = true;
      select.appendChild(opt);
    }
    select.addEventListener('change', () => {
      this.currentTextureConfig.type = select.value as TextureType;
      this.regenerateTexture();
    });
    row.appendChild(label);
    row.appendChild(select);
    panel.appendChild(row);

    const genBtn = document.createElement('button');
    genBtn.className = 'btn btn-primary';
    genBtn.textContent = 'Generate Texture';
    genBtn.style.width = '100%';
    genBtn.style.marginTop = '8px';
    genBtn.addEventListener('click', () => this.regenerateTexture());
    panel.appendChild(genBtn);

    return panel;
  }

  private createPhysicsPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('h3');
    title.textContent = 'Physics Force';
    panel.appendChild(title);

    const forces: PhysicsForce[] = ['none', 'gravity', 'wind', 'explode', 'wave3d', 'spring'];
    const row = document.createElement('div');
    row.className = 'param-row';
    const label = document.createElement('label');
    label.textContent = 'Force';
    const select = document.createElement('select');
    for (const f of forces) {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
      select.appendChild(opt);
    }
    select.addEventListener('change', () => {
      this.physics.setForce(select.value as PhysicsForce);
    });
    row.appendChild(label);
    row.appendChild(select);
    panel.appendChild(row);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-secondary';
    resetBtn.textContent = 'Reset Physics';
    resetBtn.style.width = '100%';
    resetBtn.style.marginTop = '8px';
    resetBtn.addEventListener('click', () => {
      this.physics.reset();
    });
    panel.appendChild(resetBtn);

    return panel;
  }

  private setupEventHandlers(): void {
    this.bus.on<string>('effect:add', (effectId) => {
      const effect = this.effects.find(e => e.id === effectId);
      if (effect) {
        this.compositor.addLayer(effect);
        this.bus.emit('compositor:changed', undefined);
      }
    });

    this.bus.on<string>('layer:remove', (layerId) => {
      this.compositor.removeLayer(layerId);
      this.bus.emit('compositor:changed', undefined);
    });

    this.bus.on<File>('image:upload', async (file) => {
      await this.loadImage(file);
    });

    this.bus.on<'texture' | 'entity'>('mode:switch', (mode) => {
      this.switchMode(mode);
    });
  }

  private addDefaultLayer(): void {
    if (this.effects.length > 0) {
      this.compositor.addLayer(this.effects[0]!);
      this.bus.emit('compositor:changed', undefined);
    }
  }

  private regenerateTexture(): void {
    const textureCanvas = this.textureGen.generate(this.currentTextureConfig, 512, 512);
    const ctx = textureCanvas.getContext('2d')!;
    const data = ctx.getImageData(0, 0, 512, 512);

    const img = new Image();
    img.src = textureCanvas.toDataURL();
    this.imageSource = {
      element: img,
      data,
      width: 512,
      height: 512,
    };
  }

  switchMode(mode: 'texture' | 'entity'): void {
    if (mode === this.currentMode) return;
    this.currentMode = mode;

    if (mode === 'entity') {
      this.canvas.style.display = 'none';
      if (!this.canvas3d) {
        this.canvas3d = document.createElement('canvas');
        this.canvas3d.width = 512;
        this.canvas3d.height = 512;
        this.canvas3d.style.imageRendering = 'auto';
        const canvasArea = this.ui.getCanvasArea();
        if (canvasArea) {
          canvasArea.appendChild(this.canvas3d);
        }
        this.scene3d = new Scene3D(this.canvas3d);
        this.setupDefaultEntities();
      }
      this.canvas3d.style.display = 'block';
    } else {
      if (this.canvas3d) {
        this.canvas3d.style.display = 'none';
      }
      this.canvas.style.display = 'block';
    }
  }

  private setupDefaultEntities(): void {
    const entities: SoftwareEntity[] = [
      { id: 'core', name: 'PixelForge Core', type: 'core', color: '#6c5ce7', shape: 'octahedron', position: [0, 0, 0], size: 0.6, description: 'Main application core' },
      { id: 'renderer', name: 'Renderer', type: 'architecture', color: '#00cec9', shape: 'box', position: [-2, 1, 0], size: 0.4, description: 'Canvas/WebGL renderer' },
      { id: 'compositor', name: 'Compositor', type: 'architecture', color: '#fd79a8', shape: 'sphere', position: [2, 1, 0], size: 0.4, description: 'Layer compositor' },
      { id: 'pixelate', name: 'Pixelate', type: 'effect', color: '#ffeaa7', shape: 'octahedron', position: [-1.5, -1, 1], size: 0.3, description: 'Pixelation effect' },
      { id: 'ionize', name: 'Ionize', type: 'effect', color: '#74b9ff', shape: 'torus', position: [0, -1.5, 1], size: 0.3, description: 'Ionize effect' },
      { id: 'wave', name: 'Wave', type: 'effect', color: '#55efc4', shape: 'cylinder', position: [1.5, -1, 1], size: 0.3, description: 'Wave distortion' },
      { id: 'glitch', name: 'Glitch', type: 'effect', color: '#ff7675', shape: 'box', position: [-1, -1, -1], size: 0.3, description: 'Glitch effect' },
      { id: 'chromatic', name: 'Chromatic', type: 'effect', color: '#a29bfe', shape: 'sphere', position: [1, -1, -1], size: 0.3, description: 'Chromatic aberration' },
    ];

    const links: [string, string][] = [
      ['core', 'renderer'],
      ['core', 'compositor'],
      ['compositor', 'pixelate'],
      ['compositor', 'ionize'],
      ['compositor', 'wave'],
      ['compositor', 'glitch'],
      ['compositor', 'chromatic'],
    ];

    this.entityBuilder.setEntities(entities);
    this.entityBuilder.setLinks(links);

    if (this.scene3d) {
      this.entityBuilder.build(this.scene3d);
    }
  }

  async loadImage(source: File | string): Promise<void> {
    try {
      if (source instanceof File) {
        this.imageSource = await ImageLoader.fromFile(source);
      } else {
        this.imageSource = await ImageLoader.fromURL(source);
      }

      const { width, height } = this.imageSource;
      this.canvas.width = width;
      this.canvas.height = height;
      this.renderer.resize(width, height);
      this.compositor.resize(width, height);
    } catch (err) {
      console.error('Failed to load image:', err);
    }
  }

  private onFrame(dt: number, elapsed: number): void {
    if (this.currentMode === 'texture') {
      this.renderTextureMode(elapsed);
    } else {
      this.renderEntityMode(dt, elapsed);
    }
  }

  private renderTextureMode(time: number): void {
    if (!this.imageSource) return;

    const result = this.compositor.composite(this.imageSource.data, time);
    this.renderer.clear();
    this.renderer.putImageData(result);
  }

  private renderEntityMode(dt: number, elapsed: number): void {
    if (!this.scene3d) return;

    this.physics.step(dt);
    this.entityBuilder.update(elapsed);

    const theta = elapsed * 0.3;
    const phi = Math.PI / 3;
    this.scene3d.setCameraPosition({ theta, phi, radius: 6 });
    this.scene3d.render();
  }

  dispose(): void {
    this.animLoop.stop();
    this.compositor.dispose();
    this.ui.dispose();
    if (this.scene3d) {
      this.entityBuilder.dispose();
      this.scene3d.dispose();
    }
    for (const effect of this.effects) {
      effect.dispose();
    }
    this.bus.clear();
  }
}
