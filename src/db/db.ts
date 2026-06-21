import Dexie, { type Table } from "dexie";
import type {
  Project,
  HalfModule,
  SkeletonData,
  Keyframe,
  AnimationData,
} from "@/types";

class GiderDB extends Dexie {
  projects!: Table<Project, string>;
  halfModules!: Table<HalfModule, string>;
  skeletons!: Table<SkeletonData, string>;
  keyframes!: Table<Keyframe, string>;
  animations!: Table<AnimationData, string>;

  constructor() {
    super("gider-bead-studio");
    this.version(1).stores({
      projects: "id, name, updatedAt",
      halfModules: "id, projectId, side",
      skeletons: "id, projectId",
      keyframes: "id, projectId, frame",
      animations: "id, projectId",
    });
  }
}

export const db = new GiderDB();

// 工具函数：生成唯一 ID
export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

// 加载完整项目（含关联数据）
export async function loadFullProject(projectId: string) {
  const project = await db.projects.get(projectId);
  if (!project) return null;
  const [modules, skeletons, keyframes, animations] = await Promise.all([
    db.halfModules.where("projectId").equals(projectId).toArray(),
    db.skeletons.where("projectId").equals(projectId).first(),
    db.keyframes.where("projectId").equals(projectId).toArray(),
    db.animations.where("projectId").equals(projectId).first(),
  ]);
  return {
    project,
    modules,
    skeleton: skeletons ?? null,
    keyframes,
    animation: animations ?? null,
  };
}

// 保存完整项目
export async function saveFullProject(data: {
  project: Project;
  modules: HalfModule[];
  skeleton: SkeletonData;
  keyframes: Keyframe[];
  animation: AnimationData;
}) {
  await db.transaction(
    "rw",
    db.projects,
    db.halfModules,
    db.skeletons,
    db.keyframes,
    db.animations,
    async () => {
      const pid = data.project.id;
      await db.projects.put({ ...data.project, updatedAt: Date.now() });
      await db.halfModules.where("projectId").equals(pid).delete();
      await db.halfModules.bulkPut(data.modules);
      await db.skeletons.where("projectId").equals(pid).delete();
      await db.skeletons.put(data.skeleton);
      await db.keyframes.where("projectId").equals(pid).delete();
      await db.keyframes.bulkPut(data.keyframes);
      await db.animations.where("projectId").equals(pid).delete();
      await db.animations.put(data.animation);
    },
  );
}

// 列出所有项目摘要
export async function listProjects(): Promise<Project[]> {
  return db.projects.orderBy("updatedAt").reverse().toArray();
}

// 删除项目
export async function deleteProject(projectId: string) {
  await db.transaction(
    "rw",
    db.projects,
    db.halfModules,
    db.skeletons,
    db.keyframes,
    db.animations,
    async () => {
      await db.projects.delete(projectId);
      await db.halfModules.where("projectId").equals(projectId).delete();
      await db.skeletons.where("projectId").equals(projectId).delete();
      await db.keyframes.where("projectId").equals(projectId).delete();
      await db.animations.where("projectId").equals(projectId).delete();
    },
  );
}
