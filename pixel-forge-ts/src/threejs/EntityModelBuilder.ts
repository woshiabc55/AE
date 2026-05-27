import * as THREE from 'three';
import type { Scene3D } from './Scene3D';

export interface SoftwareEntity {
  id: string;
  name: string;
  type: 'core' | 'effect' | 'architecture';
  color: string;
  shape: 'octahedron' | 'box' | 'sphere' | 'torus' | 'cylinder';
  position: [number, number, number];
  size: number;
  description: string;
}

interface BuiltEntity {
  entity: SoftwareEntity;
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
}

export class EntityModelBuilder {
  private entities: SoftwareEntity[] = [];
  private links: [string, string][] = [];
  private builtEntities: BuiltEntity[] = [];
  private builtLines: THREE.Line[] = [];

  setEntities(entities: SoftwareEntity[]): void {
    this.entities = entities;
  }

  setLinks(links: [string, string][]): void {
    this.links = links;
  }

  build(scene: Scene3D): { meshes: THREE.Mesh[]; lines: THREE.Line[] } {
    this.disposeFromScene(scene);

    const meshes: THREE.Mesh[] = [];
    const lines: THREE.Line[] = [];

    for (const entity of this.entities) {
      const geometry = this.createGeometry(entity.shape, entity.size);
      const color = new THREE.Color(entity.color);
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color.clone().multiplyScalar(0.2),
        shininess: 80,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = scene.addMesh(geometry, material);
      mesh.position.set(...entity.position);
      meshes.push(mesh);

      this.builtEntities.push({
        entity,
        mesh,
        originalPosition: new THREE.Vector3(...entity.position),
      });
    }

    const entityMap = new Map(this.builtEntities.map(be => [be.entity.id, be]));

    for (const [fromId, toId] of this.links) {
      const from = entityMap.get(fromId);
      const to = entityMap.get(toId);
      if (from && to) {
        const points = [from.mesh.position.clone(), to.mesh.position.clone()];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x444466,
          transparent: true,
          opacity: 0.5,
        });
        const line = new THREE.Line(lineGeom, lineMat);
        scene.addLine(line);
        lines.push(line);
        this.builtLines.push(line);
      }
    }

    return { meshes, lines };
  }

  update(time: number): void {
    for (const built of this.builtEntities) {
      const { mesh, originalPosition, entity } = built;

      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.005;

      const floatOffset = Math.sin(time * 1.5 + originalPosition.x * 0.5) * 0.08;
      mesh.position.y = originalPosition.y + floatOffset;

      const pulseScale = 1 + Math.sin(time * 2 + originalPosition.z) * 0.03;
      mesh.scale.setScalar(pulseScale * entity.size);

      if (entity.type === 'core') {
        const emissiveIntensity = 0.2 + Math.sin(time * 3) * 0.1;
        const mat = mesh.material as THREE.MeshPhongMaterial;
        mat.emissiveIntensity = emissiveIntensity;
      }
    }

    for (const line of this.builtLines) {
      const positions = line.geometry.attributes.position as THREE.BufferAttribute;
      if (positions.count >= 2) {
        const fromEntity = this.builtEntities.find(
          be => be.mesh.position.equals(new THREE.Vector3(positions.getX(0), positions.getY(0), positions.getZ(0)))
        );
        if (fromEntity) {
          positions.setXYZ(0, fromEntity.mesh.position.x, fromEntity.mesh.position.y, fromEntity.mesh.position.z);
        }
      }
      positions.needsUpdate = true;
    }
  }

  private createGeometry(shape: SoftwareEntity['shape'], size: number): THREE.BufferGeometry {
    const s = Math.max(0.1, size);
    switch (shape) {
      case 'octahedron':
        return new THREE.OctahedronGeometry(s, 0);
      case 'box':
        return new THREE.BoxGeometry(s * 1.4, s * 1.4, s * 1.4);
      case 'sphere':
        return new THREE.SphereGeometry(s, 16, 12);
      case 'torus':
        return new THREE.TorusGeometry(s, s * 0.3, 8, 24);
      case 'cylinder':
        return new THREE.CylinderGeometry(s * 0.5, s * 0.5, s * 2, 12);
      default:
        return new THREE.OctahedronGeometry(s, 0);
    }
  }

  private disposeFromScene(scene: Scene3D): void {
    for (const built of this.builtEntities) {
      scene.removeMesh(built.mesh);
    }
    for (const line of this.builtLines) {
      scene.removeLine(line);
    }
    this.builtEntities = [];
    this.builtLines = [];
  }

  dispose(): void {
    this.entities = [];
    this.links = [];
    this.builtEntities = [];
    this.builtLines = [];
  }
}
