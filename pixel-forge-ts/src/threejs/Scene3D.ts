import * as THREE from 'three';

export class Scene3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private meshes: THREE.Mesh[] = [];
  private lines: THREE.Line[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);

    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const ambient = new THREE.AmbientLight(0x404040, 2);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 5, 5);
    this.scene.add(directional);

    const pointLight = new THREE.PointLight(0x6c5ce7, 1, 50);
    pointLight.position.set(-3, 2, 3);
    this.scene.add(pointLight);
  }

  addMesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    this.meshes.push(mesh);
    return mesh;
  }

  removeMesh(mesh: THREE.Mesh): void {
    this.scene.remove(mesh);
    const idx = this.meshes.indexOf(mesh);
    if (idx !== -1) {
      this.meshes.splice(idx, 1);
    }
    mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => m.dispose());
    } else {
      mesh.material.dispose();
    }
  }

  addLine(line: THREE.Line): void {
    this.scene.add(line);
    this.lines.push(line);
  }

  removeLine(line: THREE.Line): void {
    this.scene.remove(line);
    const idx = this.lines.indexOf(line);
    if (idx !== -1) {
      this.lines.splice(idx, 1);
    }
    line.geometry.dispose();
    if (Array.isArray(line.material)) {
      line.material.forEach(m => m.dispose());
    } else {
      (line.material as THREE.Material).dispose();
    }
  }

  setCameraPosition(spherical: { theta: number; phi: number; radius: number }): void {
    const { theta, phi, radius } = spherical;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  dispose(): void {
    for (const mesh of this.meshes) {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
    for (const line of this.lines) {
      line.geometry.dispose();
      if (Array.isArray(line.material)) {
        line.material.forEach(m => m.dispose());
      } else {
        (line.material as THREE.Material).dispose();
      }
    }
    this.meshes = [];
    this.lines = [];
    this.renderer.dispose();
  }
}
