import { useEffect, useRef, useCallback, useState, memo } from 'react';
import * as pc from 'playcanvas';
import {
  useEditorStore,
  setPcApp,
  registerEntity,
  getEntity,
  type SceneObject,
  type MaterialData,
  type ToolType,
} from '@/store/editorStore';

let objectCounter = 0;

function generateId(): string {
  objectCounter++;
  return `obj_${Date.now()}_${objectCounter}`;
}

function getDefaultMaterial(): MaterialData {
  return {
    baseColor: '#cccccc',
    metalness: 0.0,
    roughness: 0.7,
    emissiveColor: '#000000',
    emissiveIntensity: 0,
  };
}

function createAxisCylinder(
  app: pc.Application,
  color: pc.Color,
  length: number,
  rotation: [number, number, number]
): pc.Entity {
  const entity = new pc.Entity();
  const material = new pc.StandardMaterial();
  material.diffuse = color.clone();
  material.useLighting = false;
  material.emissive = color.clone();
  material.emissiveIntensity = 0.8;
  material.update();

  entity.addComponent('render', {
    type: 'cylinder',
    material: material,
  });
  entity.setLocalScale(0.02, length, 0.02);
  entity.setLocalEulerAngles(rotation[0], rotation[1], rotation[2]);
  entity.setPosition(0, length / 2, 0);

  const tipEntity = new pc.Entity();
  const tipMat = new pc.StandardMaterial();
  tipMat.diffuse = color.clone();
  tipMat.useLighting = false;
  tipMat.emissive = color.clone();
  tipMat.emissiveIntensity = 1.0;
  tipMat.update();
  tipEntity.addComponent('render', {
    type: 'cone',
    material: tipMat,
  });
  tipEntity.setLocalScale(0.08, 0.2, 0.08);
  tipEntity.setPosition(0, length, 0);

  const parent = new pc.Entity();
  parent.addChild(entity);
  parent.addChild(tipEntity);
  return parent;
}

function createGrid(app: pc.Application): pc.Entity {
  const gridEntity = new pc.Entity('Grid');

  const gridCanvas = document.createElement('canvas');
  gridCanvas.width = 1024;
  gridCanvas.height = 1024;
  const ctx = gridCanvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 1024, 1024);

  const gridSize = 20;
  const cellSize = 1024 / gridSize;

  for (let i = 0; i <= gridSize; i++) {
    const pos = i * cellSize;
    const isCenter = i === gridSize / 2;
    ctx.strokeStyle = isCenter ? 'rgba(0, 212, 170, 0.6)' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = isCenter ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(1024, pos);
    ctx.stroke();
  }

  const texture = new pc.Texture(app.graphicsDevice, {
    width: 1024,
    height: 1024,
    format: pc.PIXELFORMAT_R8_G8_B8_A8,
  });
  texture.setSource(gridCanvas);
  texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
  texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

  const material = new pc.StandardMaterial();
  material.diffuseMap = texture;
  material.opacityMap = texture;
  material.blendType = pc.BLEND_NORMAL;
  material.useLighting = false;
  material.update();

  gridEntity.addComponent('render', {
    type: 'plane',
    material: material,
  });
  gridEntity.setLocalScale(20, 20, 20);
  gridEntity.setPosition(0, 0, 0);

  return gridEntity;
}

function createAxisHelper(app: pc.Application): pc.Entity {
  const axisEntity = new pc.Entity('AxisHelper');
  const axisLength = 3;

  const xAxis = createAxisCylinder(app, new pc.Color(1, 0.2, 0.2), axisLength, [0, 0, 90]);
  xAxis.setLocalEulerAngles(0, 0, 90);
  xAxis.setPosition(axisLength / 2, 0, 0);

  const yAxis = createAxisCylinder(app, new pc.Color(0.2, 1, 0.2), axisLength, [0, 0, 0]);
  yAxis.setPosition(0, axisLength / 2, 0);

  const zAxis = createAxisCylinder(app, new pc.Color(0.2, 0.4, 1), axisLength, [90, 0, 0]);
  zAxis.setLocalEulerAngles(90, 0, 0);
  zAxis.setPosition(0, 0, axisLength / 2);

  axisEntity.addChild(xAxis);
  axisEntity.addChild(yAxis);
  axisEntity.addChild(zAxis);

  return axisEntity;
}

interface OrbitState {
  azimuth: number;
  elevation: number;
  distance: number;
  target: pc.Vec3;
  isRotating: boolean;
  isPanning: boolean;
  lastX: number;
  lastY: number;
  hasDragged: boolean;
}

function createOrbitController(camera: pc.Entity, canvas: HTMLCanvasElement): { state: OrbitState; cleanup: () => void } {
  const state: OrbitState = {
    azimuth: 30,
    elevation: 25,
    distance: 12,
    target: new pc.Vec3(0, 0, 0),
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    hasDragged: false,
  };

  function updateCamera() {
    const az = (state.azimuth * Math.PI) / 180;
    const el = (state.elevation * Math.PI) / 180;
    const x = state.target.x + state.distance * Math.cos(el) * Math.sin(az);
    const y = state.target.y + state.distance * Math.sin(el);
    const z = state.target.z + state.distance * Math.cos(el) * Math.cos(az);
    camera.setPosition(x, y, z);
    camera.lookAt(state.target);
  }

  updateCamera();

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      state.isRotating = true;
      state.hasDragged = false;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    } else if (e.button === 1 || e.button === 2) {
      state.isPanning = true;
      state.hasDragged = false;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      e.preventDefault();
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      state.hasDragged = true;
    }

    state.lastX = e.clientX;
    state.lastY = e.clientY;

    if (state.isRotating) {
      state.azimuth -= dx * 0.3;
      state.elevation += dy * 0.3;
      state.elevation = Math.max(-89, Math.min(89, state.elevation));
      updateCamera();
    }

    if (state.isPanning) {
      const panSpeed = state.distance * 0.002;
      const az = (state.azimuth * Math.PI) / 180;
      const right = new pc.Vec3(Math.cos(az), 0, -Math.sin(az));
      const up = new pc.Vec3(0, 1, 0);
      state.target.add(right.mulScalar(-dx * panSpeed));
      state.target.add(up.mulScalar(dy * panSpeed));
      updateCamera();
    }
  };

  const onMouseUp = () => {
    state.isRotating = false;
    state.isPanning = false;
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    state.distance *= e.deltaY > 0 ? 1.1 : 0.9;
    state.distance = Math.max(0.5, Math.min(500, state.distance));
    updateCamera();
  };

  const onContextMenu = (e: Event) => e.preventDefault();

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('contextmenu', onContextMenu);

  return {
    state,
    cleanup: () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
    },
  };
}

function fitCameraToEntity(camera: pc.Entity, orbit: OrbitState, entity: pc.Entity) {
  const renderComp = entity.findComponent('render');
  if (!renderComp) {
    for (const child of entity.children) {
      if (child instanceof pc.Entity && child.findComponent('render')) {
        fitCameraToEntity(camera, orbit, child);
        return;
      }
    }
    return;
  }

  const aabb = (renderComp as any).aabb as pc.BoundingBox | undefined;
  if (aabb) {
    const center = aabb.center;
    orbit.target.copy(center);
    const size = aabb.halfExtents.length();
    orbit.distance = size * 3;
    const az = (orbit.azimuth * Math.PI) / 180;
    const el = (orbit.elevation * Math.PI) / 180;
    const x = orbit.target.x + orbit.distance * Math.cos(el) * Math.sin(az);
    const y = orbit.target.y + orbit.distance * Math.sin(el);
    const z = orbit.target.z + orbit.distance * Math.cos(el) * Math.cos(az);
    camera.setPosition(x, y, z);
    camera.lookAt(orbit.target);
  }
}

// 键盘快捷键映射
const KEY_TOOL_MAP: Record<string, ToolType> = {
  q: 'select',
  w: 'translate',
  e: 'rotate',
  r: 'scale',
};

function Viewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<pc.Application | null>(null);
  const orbitRef = useRef<OrbitState | null>(null);
  const cameraRef = useRef<pc.Entity | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gizmoRef = useRef<pc.Entity | null>(null);
  const pickerRef = useRef<pc.Picker | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fps, setFps] = useState(0);
  const [webglError, setWebglError] = useState<string | null>(null);
  const fpsFramesRef = useRef(0);
  const fpsTimeRef = useRef(performance.now());

  const addObject = useEditorStore((s) => s.addObject);
  const selectObject = useEditorStore((s) => s.selectObject);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const objects = useEditorStore((s) => s.objects);
  const ambientIntensity = useEditorStore((s) => s.ambientIntensity);

  // Gizmo 更新
  const updateGizmo = useCallback(() => {
    const app = appRef.current;
    if (!app || !gizmoRef.current) return;

    const gizmo = gizmoRef.current;
    if (!selectedObjectId) {
      gizmo.enabled = false;
      return;
    }

    const entity = getEntity(selectedObjectId);
    if (!entity) {
      gizmo.enabled = false;
      return;
    }

    gizmo.enabled = true;
    const pos = entity.getPosition();
    gizmo.setPosition(pos.x, pos.y, pos.z);
  }, [selectedObjectId]);

  useEffect(() => {
    updateGizmo();
  }, [selectedObjectId, updateGizmo]);

  useEffect(() => {
    if (!gizmoRef.current || !selectedObjectId) return;
    const entity = getEntity(selectedObjectId);
    if (!entity) return;
    gizmoRef.current.setLocalScale(1, 1, 1);
  }, [activeTool, selectedObjectId]);

  // 键盘快捷键
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      // Ctrl+Z / Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          useEditorStore.getState().redo();
        } else {
          useEditorStore.getState().undo();
        }
        return;
      }

      const tool = KEY_TOOL_MAP[e.key.toLowerCase()];
      if (tool) {
        setActiveTool(tool);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedId = useEditorStore.getState().selectedObjectId;
        if (selectedId) {
          useEditorStore.getState().removeObject(selectedId);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setActiveTool]);

  const loadModel = useCallback(
    (file: File) => {
      const app = appRef.current;
      if (!app) return;

      setIsLoading(true);
      const url = URL.createObjectURL(file);
      const asset = new pc.Asset(file.name, 'container', {
        url: url,
        filename: file.name,
      });

      app.assets.add(asset);
      app.assets.load(asset);

      asset.on('load', () => {
        const entity = (asset.resource as any).instantiateModelEntity({
          castShadows: true,
          receiveShadows: true,
        });

        app.root.addChild(entity);

        const id = generateId();
        const name = file.name.replace(/\.(glb|gltf)$/i, '');
        registerEntity(id, entity);

        const pos = entity.getPosition();
        const rot = entity.getEulerAngles();
        const scl = entity.getLocalScale();

        const sceneObj: SceneObject = {
          id,
          name,
          visible: true,
          type: 'model',
          transform: {
            position: [pos.x, pos.y, pos.z],
            rotation: [rot.x, rot.y, rot.z],
            scale: [scl.x, scl.y, scl.z],
          },
          material: getDefaultMaterial(),
          children: [],
          parent: null,
        };

        addObject(sceneObj);
        selectObject(id);

        if (cameraRef.current && orbitRef.current) {
          fitCameraToEntity(cameraRef.current, orbitRef.current, entity);
        }

        // 加载完成后销毁旧 Picker，下次点击时重建
        if (pickerRef.current) {
          pickerRef.current.destroy();
          pickerRef.current = null;
        }

        URL.revokeObjectURL(url);
        setIsLoading(false);
      });

      asset.on('error', (err: string) => {
        console.error('Failed to load model:', err);
        URL.revokeObjectURL(url);
        setIsLoading(false);
      });
    },
    [addObject, selectObject]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach(loadModel);
      }
      e.target.value = '';
    },
    [loadModel]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 检测 WebGL 支持
    const testGl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!testGl) {
      setWebglError('当前浏览器不支持 WebGL，无法启动 3D 渲染器。请使用支持 WebGL 的现代浏览器。');
      return;
    }

    try {
    const app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
      keyboard: new pc.Keyboard(window),
    });

    app.scene.ambientLight = new pc.Color(ambientIntensity, ambientIntensity, ambientIntensity);

    const bgColor = new pc.Color(0.1, 0.1, 0.12);

    const camera = new pc.Entity('Camera');
    camera.addComponent('camera', {
      fov: 60,
      nearClip: 0.1,
      farClip: 1000,
      clearColor: bgColor,
    });
    app.root.addChild(camera);
    cameraRef.current = camera;

    const dirLight = new pc.Entity('DirectionalLight');
    dirLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 1, 1),
      intensity: 1.0,
      castShadows: true,
      shadowBias: 0.2,
      shadowDistance: 50,
      shadowResolution: 2048,
    });
    dirLight.setEulerAngles(45, 30, 0);
    app.root.addChild(dirLight);
    registerEntity('__directionalLight__', dirLight);

    const grid = createGrid(app);
    app.root.addChild(grid);

    const axisHelper = createAxisHelper(app);
    app.root.addChild(axisHelper);

    const gizmoEntity = new pc.Entity('Gizmo');
    gizmoEntity.enabled = false;

    const gizmoLength = 1.5;
    const gizmoX = createAxisCylinder(app, new pc.Color(1, 0.3, 0.3), gizmoLength, [0, 0, 90]);
    gizmoX.setLocalEulerAngles(0, 0, 90);
    gizmoX.setPosition(gizmoLength / 2, 0, 0);

    const gizmoY = createAxisCylinder(app, new pc.Color(0.3, 1, 0.3), gizmoLength, [0, 0, 0]);
    gizmoY.setPosition(0, gizmoLength / 2, 0);

    const gizmoZ = createAxisCylinder(app, new pc.Color(0.3, 0.5, 1), gizmoLength, [90, 0, 0]);
    gizmoZ.setLocalEulerAngles(90, 0, 0);
    gizmoZ.setPosition(0, 0, gizmoLength / 2);

    gizmoEntity.addChild(gizmoX);
    gizmoEntity.addChild(gizmoY);
    gizmoEntity.addChild(gizmoZ);

    app.root.addChild(gizmoEntity);
    gizmoRef.current = gizmoEntity;

    app.start();
    appRef.current = app;
    setPcApp(app);

    const { state: orbit, cleanup: orbitCleanup } = createOrbitController(camera, canvas);
    orbitRef.current = orbit;

    // 使用 ResizeObserver 替代 window resize 事件
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);
          app.resizeCanvas(Math.floor(width), Math.floor(height));

          // Picker 尺寸变更时销毁旧实例
          if (pickerRef.current) {
            pickerRef.current.destroy();
            pickerRef.current = null;
          }
        }
      }
    });
    const parentEl = canvas.parentElement;
    if (parentEl) {
      resizeObserver.observe(parentEl);
    }

    // 点击选取（复用 Picker）
    const onClick = (e: MouseEvent) => {
      if (orbit.hasDragged) return;
      if (e.button !== 0) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cameraComp = camera.camera!;

      // 惰性创建/重建 Picker
      if (!pickerRef.current) {
        pickerRef.current = new pc.Picker(app, canvas.width, canvas.height);
      }
      const picker = pickerRef.current;
      picker.prepare(cameraComp, app.scene);
      const results = picker.getSelection(x, y);

      if (results.length > 0) {
        const hit = results[0];
        let hitNode: pc.GraphNode | null = null;

        if (hit instanceof pc.MeshInstance) {
          hitNode = hit.node;
        }

        if (hitNode) {
          let foundId: string | null = null;
          const currentObjects = useEditorStore.getState().objects;

          for (const obj of currentObjects) {
            const objEntity = getEntity(obj.id);
            if (!objEntity) continue;

            if (objEntity === hitNode || (hitNode instanceof pc.Entity && objEntity === hitNode)) {
              foundId = obj.id;
              break;
            }

            let parent: pc.GraphNode | null = hitNode;
            while (parent) {
              if (parent === objEntity) {
                foundId = obj.id;
                break;
              }
              parent = parent.parent;
            }
            if (foundId) break;
          }

          selectObject(foundId);
        } else {
          selectObject(null);
        }
      } else {
        selectObject(null);
      }
    };

    canvas.addEventListener('click', onClick);

    // FPS 计数器
    const fpsInterval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - fpsTimeRef.current;
      if (elapsed > 0) {
        setFps(Math.round((fpsFramesRef.current * 1000) / elapsed));
      }
      fpsFramesRef.current = 0;
      fpsTimeRef.current = now;
    }, 1000);

    // 在 PlayCanvas 更新循环中计数帧
    const onFrame = () => {
      fpsFramesRef.current++;
    };
    app.on('update', onFrame);

    return () => {
      clearInterval(fpsInterval);
      app.off('update', onFrame);
      canvas.removeEventListener('click', onClick);
      resizeObserver.disconnect();
      orbitCleanup();
      if (pickerRef.current) {
        pickerRef.current.destroy();
        pickerRef.current = null;
      }
      app.destroy();
      appRef.current = null;
      setPcApp(null as any);
    };
    } catch (err) {
      console.error('PlayCanvas initialization failed:', err);
      setWebglError('3D 渲染器初始化失败。请确认您的浏览器支持 WebGL 并已启用硬件加速。');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      Array.from(files).forEach((file) => {
        if (file.name.match(/\.(glb|gltf)$/i)) {
          loadModel(file);
        }
      });
    },
    [loadModel]
  );

  const handleExportScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div
      className="relative flex-1 overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {webglError ? (
        <div className="flex h-full w-full items-center justify-center bg-[#1a1a2e] p-8">
          <div className="max-w-md rounded-xl border border-red-500/30 bg-[#16213e]/80 p-6 text-center">
            <div className="mb-3 text-3xl">⚠️</div>
            <h3 className="mb-2 text-sm font-medium text-white/80">渲染器初始化失败</h3>
            <p className="text-xs leading-relaxed text-white/50">{webglError}</p>
          </div>
        </div>
      ) : (
        <>
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* 拖拽覆盖层 */}
      {isDragOver && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-[#00d4aa]/60 bg-[#00d4aa]/5">
          <div className="rounded-xl bg-[#1a1a2e]/90 px-6 py-4 text-center backdrop-blur-md">
            <div className="text-2xl text-[#00d4aa]">📥</div>
            <p className="mt-1 text-sm text-[#00d4aa]">释放以导入模型</p>
          </div>
        </div>
      )}

      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg bg-[#1a1a2e]/90 px-5 py-3 shadow-lg">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#00d4aa] border-t-transparent" />
            <span className="text-sm text-white/80">加载模型中...</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md bg-[#0f3460]/80 px-3 py-1.5 text-xs text-[#00d4aa] backdrop-blur-sm transition-colors hover:bg-[#0f3460]"
        >
          导入模型
        </button>
        <button
          onClick={handleExportScreenshot}
          className="rounded-md bg-[#0f3460]/80 px-3 py-1.5 text-xs text-[#00d4aa] backdrop-blur-sm transition-colors hover:bg-[#0f3460]"
        >
          导出截图
        </button>
      </div>

      {/* FPS 计数器 */}
      <div className="absolute right-3 top-3 rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white/40">
        {fps} FPS
      </div>

      {objects.length === 0 && !isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-dashed border-[#00d4aa]/30 bg-[#1a1a2e]/60 px-8 py-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-3xl text-[#00d4aa]/50">📦</div>
            <p className="text-sm text-white/40">拖拽 glTF/GLB 文件到此处</p>
            <p className="mt-1 text-xs text-white/25">或点击下方「导入模型」按钮</p>
            <p className="mt-3 text-[10px] text-white/15">快捷键：Q 选择 · W 移动 · E 旋转 · R 缩放 · Delete 删除</p>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default memo(Viewport);
