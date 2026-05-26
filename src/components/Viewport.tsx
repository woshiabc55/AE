import { useEffect, useRef, useCallback } from 'react';
import * as pc from 'playcanvas';
import {
  useEditorStore,
  setPcApp,
  registerEntity,
  getEntity,
  type SceneObject,
  type MaterialData,
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
}

function createOrbitController(camera: pc.Entity, canvas: HTMLCanvasElement): OrbitState {
  const state: OrbitState = {
    azimuth: 30,
    elevation: 25,
    distance: 12,
    target: new pc.Vec3(0, 0, 0),
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
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

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      state.isRotating = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    } else if (e.button === 1 || e.button === 2) {
      state.isPanning = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      e.preventDefault();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
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
  });

  const onMouseUp = () => {
    state.isRotating = false;
    state.isPanning = false;
  };
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    state.distance *= e.deltaY > 0 ? 1.1 : 0.9;
    state.distance = Math.max(0.5, Math.min(500, state.distance));
    updateCamera();
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  return state;
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

export default function Viewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<pc.Application | null>(null);
  const orbitRef = useRef<OrbitState | null>(null);
  const cameraRef = useRef<pc.Entity | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gizmoRef = useRef<pc.Entity | null>(null);

  const addObject = useEditorStore((s) => s.addObject);
  const selectObject = useEditorStore((s) => s.selectObject);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const activeTool = useEditorStore((s) => s.activeTool);
  const objects = useEditorStore((s) => s.objects);
  const ambientIntensity = useEditorStore((s) => s.ambientIntensity);

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

  const loadModel = useCallback(
    (file: File) => {
      const app = appRef.current;
      if (!app) return;

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

        URL.revokeObjectURL(url);
      });

      asset.on('error', (err: string) => {
        console.error('Failed to load model:', err);
        URL.revokeObjectURL(url);
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

    const orbit = createOrbitController(camera, canvas);
    orbitRef.current = orbit;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        canvas.width = w;
        canvas.height = h;
        app.resizeCanvas(w, h);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    canvas.addEventListener('click', (e) => {
      if (orbit.isRotating || orbit.isPanning) return;
      if (e.button !== 0) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cameraComp = camera.camera!;
      const picker = new pc.Picker(app, canvas.width, canvas.height);
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

          if (foundId) {
            selectObject(foundId);
          } else {
            selectObject(null);
          }
        }
      } else {
        selectObject(null);
      }

      picker.destroy();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      app.destroy();
      appRef.current = null;
      setPcApp(null as any);
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

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
      <canvas ref={canvasRef} className="block h-full w-full" />

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

      {objects.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-dashed border-[#00d4aa]/30 bg-[#1a1a2e]/60 px-8 py-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-3xl text-[#00d4aa]/50">📦</div>
            <p className="text-sm text-white/40">拖拽 glTF/GLB 文件到此处</p>
            <p className="mt-1 text-xs text-white/25">或点击下方「导入模型」按钮</p>
          </div>
        </div>
      )}
    </div>
  );
}
