import type { EventBus } from '../core/EventBus';
import type { Effect } from '../effects/Effect';
import type { Compositor, Layer } from '../compositor/Compositor';

export class UIManager {
  private bus: EventBus;
  private container: HTMLElement;
  private sidebar: HTMLElement | null = null;
  private canvasArea: HTMLElement | null = null;
  private listeners: Array<() => void> = [];
  private consoleBody: HTMLElement | null = null;
  private consoleInput: HTMLInputElement | null = null;
  private logCount = 0;
  private maxLogs = 50;

  constructor(bus: EventBus, container: HTMLElement) {
    this.bus = bus;
    this.container = container;
  }

  init(): void {
    this.canvasArea = this.container.querySelector('#canvas-main');
    this.sidebar = this.container.querySelector('#sbBody');
    this.consoleBody = this.container.querySelector('#consoleBody');
    this.consoleInput = this.container.querySelector('#consoleInput') as HTMLInputElement | null;

    this.setupConsole();
    this.setupStaging();
    this.log('system', 'UIManager initialized');
  }

  getCanvasArea(): HTMLElement | null {
    return this.canvasArea;
  }

  getSidebar(): HTMLElement | null {
    return this.sidebar;
  }

  private setupConsole(): void {
    const sendBtn = this.container.querySelector('#consoleSend');
    const input = this.consoleInput;
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => this.executeCommand(input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.executeCommand(input.value);
      });
    }

    const clearBtn = this.container.querySelector('#btnClearConsole');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.consoleBody) this.consoleBody.innerHTML = '';
        this.logCount = 0;
      });
    }

    const toggleBtn = this.container.querySelector('#btnToggleConsole');
    const consolePanel = this.container.querySelector('#consolePanel') as HTMLElement | null;
    if (toggleBtn && consolePanel) {
      let collapsed = false;
      toggleBtn.addEventListener('click', () => {
        collapsed = !collapsed;
        consolePanel.style.height = collapsed ? '24px' : '140px';
        toggleBtn.textContent = collapsed ? '▲' : '▼';
      });
    }
  }

  private setupStaging(): void {
    const stages = this.container.querySelectorAll('.stage');
    stages.forEach((stage) => {
      stage.addEventListener('click', () => {
        const stageName = (stage as HTMLElement).dataset.stage;
        if (stageName) {
          this.setStage(stageName);
          this.bus.emit('stage:change', stageName);
        }
      });
    });
  }

  setStage(name: string): void {
    const stages = this.container.querySelectorAll('.stage');
    stages.forEach((s) => {
      s.classList.toggle('active', (s as HTMLElement).dataset.stage === name);
    });
    const info = this.container.querySelector('#stageInfo');
    if (info) info.textContent = `STAGE: ${name.toUpperCase()}`;
    this.log('stage', `→ ${name.toUpperCase()}`);
  }

  log(event: string, data: string): void {
    if (!this.consoleBody) return;
    const now = new Date();
    const time = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `<span class="log-time">${time}</span><span class="log-event">${event}</span><span class="log-data">${data}</span>`;
    this.consoleBody.appendChild(line);
    this.logCount++;
    if (this.logCount > this.maxLogs && this.consoleBody.firstChild) {
      this.consoleBody.removeChild(this.consoleBody.firstChild);
    }
    this.consoleBody.scrollTop = this.consoleBody.scrollHeight;
  }

  private executeCommand(cmd: string): void {
    if (!cmd.trim() || !this.consoleInput) return;
    this.log('cmd', `> ${cmd}`);
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const value = parts[1];

    switch (command) {
      case 'bands':
      case 'band':
      case 'banddensity': {
        const v = parseInt(value || '10', 10);
        if (!isNaN(v)) {
          this.bus.emit('texture:param', { param: 'bandDensity', value: v });
          this.log('result', `bandDensity → ${v}`);
        }
        break;
      }
      case 'rings':
      case 'ringcount': {
        const v = parseInt(value || '8', 10);
        if (!isNaN(v)) {
          this.bus.emit('texture:param', { param: 'ringCount', value: v });
          this.log('result', `ringCount → ${v}`);
        }
        break;
      }
      case 'spiral':
      case 'spiralturns': {
        const v = parseInt(value || '5', 10);
        if (!isNaN(v)) {
          this.bus.emit('texture:param', { param: 'spiralTurns', value: v });
          this.log('result', `spiralTurns → ${v}`);
        }
        break;
      }
      case 'pixel':
      case 'pixelsize': {
        const v = parseInt(value || '8', 10);
        if (!isNaN(v)) {
          this.bus.emit('texture:param', { param: 'pixelSize', value: v });
          this.log('result', `pixelSize → ${v}`);
        }
        break;
      }
      case 'color1': {
        if (value) {
          this.bus.emit('texture:param', { param: 'color1', value });
          this.log('result', `color1 → ${value}`);
        }
        break;
      }
      case 'color2': {
        if (value) {
          this.bus.emit('texture:param', { param: 'color2', value });
          this.log('result', `color2 → ${value}`);
        }
        break;
      }
      case 'type': {
        if (value) {
          this.bus.emit('texture:param', { param: 'type', value });
          this.log('result', `textureType → ${value}`);
        }
        break;
      }
      case 'force':
      case 'physics': {
        if (value) {
          this.bus.emit('physics:force', value);
          this.log('result', `physicsForce → ${value}`);
        }
        break;
      }
      case 'play': {
        this.bus.emit('animation:play', undefined);
        this.log('result', 'animation playing');
        break;
      }
      case 'stop': {
        this.bus.emit('animation:stop', undefined);
        this.log('result', 'animation stopped');
        break;
      }
      case 'reset': {
        this.bus.emit('physics:reset', undefined);
        this.log('result', 'physics reset');
        break;
      }
      case 'help': {
        this.log('help', 'bands <n> | rings <n> | spiral <n> | pixel <n> | color1 <hex> | color2 <hex> | type <name> | force <name> | play | stop | reset');
        break;
      }
      default:
        this.log('error', `unknown command: ${command}`);
    }

    this.consoleInput.value = '';
  }

  createEffectPanel(effects: Effect[]): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = '效果选择';
    panel.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'effect-grid';
    for (const effect of effects) {
      const btn = document.createElement('button');
      btn.className = 'effect-btn';
      btn.textContent = effect.name;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.effect-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.bus.emit('effect:add', effect.id);
        this.log('effect', `+ ${effect.name}`);
      });
      grid.appendChild(btn);
    }
    panel.appendChild(grid);
    return panel;
  }

  createLayerPanel(compositor: Compositor): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = '图层合成';
    panel.appendChild(title);

    const layerList = document.createElement('div');
    panel.appendChild(layerList);

    const renderLayers = () => {
      layerList.innerHTML = '';
      const layers = compositor.getLayers();
      for (const layer of layers) {
        const item = this.createLayerItem(layer);
        layerList.appendChild(item);
      }
    };

    renderLayers();
    const unsub = this.bus.on('compositor:changed', () => renderLayers());
    this.listeners.push(unsub);
    return panel;
  }

  private createLayerItem(layer: Layer): HTMLElement {
    const item = document.createElement('div');
    item.className = 'layer-item';

    const vis = document.createElement('input');
    vis.type = 'checkbox';
    vis.checked = layer.visible;
    vis.addEventListener('change', () => {
      layer.visible = vis.checked;
      this.bus.emit('layer:visibility', { id: layer.id, visible: vis.checked });
    });
    item.appendChild(vis);

    const name = document.createElement('span');
    name.className = 'ln';
    name.textContent = layer.effect.name;
    item.appendChild(name);

    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.min = '0';
    opacityInput.max = '1';
    opacityInput.step = '0.01';
    opacityInput.value = String(layer.opacity);
    opacityInput.addEventListener('input', () => {
      layer.opacity = parseFloat(opacityInput.value);
      this.bus.emit('layer:opacity', { id: layer.id, opacity: layer.opacity });
    });
    item.appendChild(opacityInput);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'rm';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      this.bus.emit('layer:remove', layer.id);
      this.log('layer', `- ${layer.effect.name}`);
    });
    item.appendChild(removeBtn);

    return item;
  }

  createParamControls(effect: Effect): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = `${effect.name} 参数`;
    panel.appendChild(title);

    const ctrls = document.createElement('div');
    ctrls.className = 'ctrls';

    for (const param of effect.params) {
      const cg = document.createElement('div');
      cg.className = 'cg';

      if (param.type === 'range') {
        const label = document.createElement('label');
        label.textContent = param.label;
        const valSpan = document.createElement('span');
        valSpan.className = 'v';
        valSpan.textContent = String(effect.getParam(param.name));
        label.appendChild(valSpan);
        cg.appendChild(label);

        const input = document.createElement('input');
        input.type = 'range';
        input.min = String(param.min ?? 0);
        input.max = String(param.max ?? 100);
        input.step = String(param.step ?? 1);
        input.value = String(effect.getParam(param.name));
        input.addEventListener('input', () => {
          const val = parseFloat(input.value);
          effect.setParam(param.name, val);
          valSpan.textContent = input.value;
          this.bus.emit('param:change', { effectId: effect.id, param: param.name, value: val });
        });
        cg.appendChild(input);
      } else if (param.type === 'boolean') {
        const label = document.createElement('label');
        label.textContent = param.label;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = Boolean(effect.getParam(param.name));
        input.addEventListener('change', () => {
          effect.setParam(param.name, input.checked);
          this.bus.emit('param:change', { effectId: effect.id, param: param.name, value: input.checked });
        });
        label.appendChild(input);
        cg.appendChild(label);
      } else if (param.type === 'select' && param.options) {
        const label = document.createElement('label');
        label.textContent = param.label;
        cg.appendChild(label);
        const select = document.createElement('select');
        for (const opt of param.options) {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (String(effect.getParam(param.name)) === opt.value) option.selected = true;
          select.appendChild(option);
        }
        select.addEventListener('change', () => {
          effect.setParam(param.name, select.value);
          this.bus.emit('param:change', { effectId: effect.id, param: param.name, value: select.value });
        });
        cg.appendChild(select);
      }

      ctrls.appendChild(cg);
    }

    panel.appendChild(ctrls);
    return panel;
  }

  createUploadZone(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = '图像源';
    panel.appendChild(title);

    const zone = document.createElement('div');
    zone.className = 'upload-zone';
    zone.textContent = '📂 点击上传图像';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#00ff88';
    });
    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '';
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.borderColor = '';
      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith('image/')) {
        this.bus.emit('image:upload', file);
        this.log('upload', file.name);
      }
    });

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) {
        this.bus.emit('image:upload', file);
        this.log('upload', file.name);
      }
      input.value = '';
    });

    panel.appendChild(zone);
    panel.appendChild(input);
    return panel;
  }

  createModeSwitch(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = '模式';
    panel.appendChild(title);

    const tabs = document.createElement('div');
    tabs.className = 'mode-tabs';

    const textureBtn = document.createElement('button');
    textureBtn.className = 'mode-tab active';
    textureBtn.textContent = '纹理面';
    textureBtn.addEventListener('click', () => {
      this.bus.emit('mode:switch', 'texture');
      textureBtn.classList.add('active');
      entityBtn.classList.remove('active');
      this.log('mode', '→ texture');
    });

    const entityBtn = document.createElement('button');
    entityBtn.className = 'mode-tab';
    entityBtn.textContent = '软件实体';
    entityBtn.addEventListener('click', () => {
      this.bus.emit('mode:switch', 'entity');
      entityBtn.classList.add('active');
      textureBtn.classList.remove('active');
      this.log('mode', '→ entity');
    });

    tabs.appendChild(textureBtn);
    tabs.appendChild(entityBtn);
    panel.appendChild(tabs);
    return panel;
  }

  updateFps(fps: number): void {
    const el = this.container.querySelector('#fnFps');
    if (el) el.textContent = `${fps} FPS`;
  }

  updateStatus(status: string): void {
    const el = this.container.querySelector('#fnStatus');
    if (el) el.textContent = status;
  }

  dispose(): void {
    for (const unsub of this.listeners) unsub();
    this.listeners = [];
  }
}
