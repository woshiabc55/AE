import type { EventBus } from '../core/EventBus';
import type { Effect } from '../effects/Effect';
import type { Compositor, Layer } from '../compositor/Compositor';

export class UIManager {
  private bus: EventBus;
  private container: HTMLElement;
  private sidebar: HTMLElement | null = null;
  private canvasArea: HTMLElement | null = null;
  private listeners: Array<() => void> = [];

  constructor(bus: EventBus, container: HTMLElement) {
    this.bus = bus;
    this.container = container;
  }

  init(): void {
    this.canvasArea = this.container.querySelector('#canvas-area');
    this.sidebar = this.container.querySelector('#sidebar');
    if (!this.sidebar) {
      this.sidebar = document.createElement('div');
      this.sidebar.id = 'sidebar';
      this.container.appendChild(this.sidebar);
    }
  }

  getCanvasArea(): HTMLElement | null {
    return this.canvasArea;
  }

  getSidebar(): HTMLElement | null {
    return this.sidebar;
  }

  createEffectPanel(effects: Effect[]): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('h3');
    title.textContent = 'Effects';
    panel.appendChild(title);

    for (const effect of effects) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = effect.name;
      btn.style.marginRight = '4px';
      btn.style.marginBottom = '4px';
      btn.addEventListener('click', () => {
        this.bus.emit('effect:add', effect.id);
      });
      panel.appendChild(btn);
    }

    return panel;
  }

  createLayerPanel(compositor: Compositor): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('h3');
    title.textContent = 'Layers';
    panel.appendChild(title);

    const layerList = document.createElement('div');
    panel.appendChild(layerList);

    const renderLayers = () => {
      layerList.innerHTML = '';
      const layers = compositor.getLayers();
      for (const layer of layers) {
        const item = this.createLayerItem(layer, compositor);
        layerList.appendChild(item);
      }
    };

    renderLayers();

    const unsub = this.bus.on('compositor:changed', () => {
      renderLayers();
    });
    this.listeners.push(unsub);

    return panel;
  }

  private createLayerItem(layer: Layer, _compositor: Compositor): HTMLElement {
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
    name.className = 'layer-name';
    name.textContent = layer.effect.name;
    item.appendChild(name);

    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.className = 'layer-opacity';
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
    removeBtn.className = 'btn btn-danger';
    removeBtn.textContent = '✕';
    removeBtn.style.padding = '2px 6px';
    removeBtn.style.fontSize = '10px';
    removeBtn.addEventListener('click', () => {
      this.bus.emit('layer:remove', layer.id);
    });
    item.appendChild(removeBtn);

    return item;
  }

  createParamControls(effect: Effect): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const title = document.createElement('h3');
    title.textContent = `${effect.name} Parameters`;
    panel.appendChild(title);

    for (const param of effect.params) {
      const row = document.createElement('div');
      row.className = 'param-row';

      const label = document.createElement('label');
      label.textContent = param.label;
      row.appendChild(label);

      if (param.type === 'range') {
        const input = document.createElement('input');
        input.type = 'range';
        input.min = String(param.min ?? 0);
        input.max = String(param.max ?? 100);
        input.step = String(param.step ?? 1);
        input.value = String(effect.getParam(param.name));

        const valueSpan = document.createElement('span');
        valueSpan.className = 'value';
        valueSpan.textContent = input.value;

        input.addEventListener('input', () => {
          const val = parseFloat(input.value);
          effect.setParam(param.name, val);
          valueSpan.textContent = input.value;
          this.bus.emit('param:change', { effectId: effect.id, param: param.name, value: val });
        });

        row.appendChild(input);
        row.appendChild(valueSpan);
      } else if (param.type === 'boolean') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = Boolean(effect.getParam(param.name));
        input.addEventListener('change', () => {
          effect.setParam(param.name, input.checked);
          this.bus.emit('param:change', { effectId: effect.id, param: param.name, value: input.checked });
        });
        row.appendChild(input);
      } else if (param.type === 'select' && param.options) {
        const select = document.createElement('select');
        for (const opt of param.options) {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (String(effect.getParam(param.name)) === opt.value) {
            option.selected = true;
          }
          select.appendChild(option);
        }
        select.addEventListener('change', () => {
          effect.setParam(param.name, select.value);
          this.bus.emit('param:change', { effectId: effect.id, param: param.name, value: select.value });
        });
        row.appendChild(select);
      }

      panel.appendChild(row);
    }

    return panel;
  }

  createUploadZone(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';

    const zone = document.createElement('div');
    zone.className = 'upload-zone';

    const p = document.createElement('p');
    p.textContent = 'Drop image here or click to upload';
    zone.appendChild(p);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#6c5ce7';
    });
    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '#444';
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#444';
      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith('image/')) {
        this.bus.emit('image:upload', file);
      }
    });

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) {
        this.bus.emit('image:upload', file);
      }
      input.value = '';
    });

    panel.appendChild(zone);
    panel.appendChild(input);

    return panel;
  }

  createModeSwitch(): HTMLElement {
    const switcher = document.createElement('div');
    switcher.className = 'mode-switch';

    const textureBtn = document.createElement('button');
    textureBtn.className = 'btn btn-secondary active';
    textureBtn.textContent = 'Texture Mode';
    textureBtn.addEventListener('click', () => {
      this.bus.emit('mode:switch', 'texture');
      textureBtn.classList.add('active');
      entityBtn.classList.remove('active');
    });

    const entityBtn = document.createElement('button');
    entityBtn.className = 'btn btn-secondary';
    entityBtn.textContent = 'Entity Mode';
    entityBtn.addEventListener('click', () => {
      this.bus.emit('mode:switch', 'entity');
      entityBtn.classList.add('active');
      textureBtn.classList.remove('active');
    });

    switcher.appendChild(textureBtn);
    switcher.appendChild(entityBtn);
    return switcher;
  }

  dispose(): void {
    for (const unsub of this.listeners) {
      unsub();
    }
    this.listeners = [];
  }
}
