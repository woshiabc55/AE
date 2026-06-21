import type {
  GiderFile,
  Project,
  HalfModule,
  SkeletonData,
  Keyframe,
  AnimationData,
} from "@/types";

// 将内存中的项目数据序列化为 .gider 文件对象
export function serializeGider(data: {
  project: Project;
  modules: HalfModule[];
  skeleton: SkeletonData;
  keyframes: Keyframe[];
  animation: AnimationData;
  author?: string;
}): GiderFile {
  const { project, modules, skeleton, keyframes, animation, author } = data;
  return {
    meta: {
      format: "gider",
      version: "1.0",
      name: project.name,
      author: author ?? "匿名创作者",
      createdAt: new Date(project.createdAt).toISOString(),
      gridSize: project.gridSize,
    },
    palette: project.palette,
    modules: modules.map((m) => ({
      id: m.id,
      side: m.side,
      label: m.label,
      beads: m.beads,
    })),
    skeleton: {
      joints: skeleton.joints,
      bones: skeleton.bones,
    },
    keyframes: keyframes
      .map((k) => ({ frame: k.frame, poses: k.poses }))
      .sort((a, b) => a.frame - b.frame),
    animation: {
      fps: animation.fps,
      loop: animation.loop,
      length: animation.length,
    },
  };
}

// 将 .gider 文件对象反序列化为内存数据（生成新 ID）
export function deserializeGider(
  file: GiderFile,
  newProjectId: string,
): {
  project: Project;
  modules: HalfModule[];
  skeleton: SkeletonData;
  keyframes: Keyframe[];
  animation: AnimationData;
} {
  const now = Date.now();
  const project: Project = {
    id: newProjectId,
    name: file.meta.name ?? "未命名作品",
    gridSize: file.meta.gridSize ?? 32,
    palette: file.palette,
    createdAt: file.meta.createdAt
      ? new Date(file.meta.createdAt).getTime()
      : now,
    updatedAt: now,
  };
  const modules: HalfModule[] = file.modules.map((m, i) => ({
    id: `mod_${newProjectId}_${i}`,
    projectId: newProjectId,
    side: m.side,
    label: m.label,
    beads: m.beads,
  }));
  const skeleton: SkeletonData = {
    id: `sk_${newProjectId}`,
    projectId: newProjectId,
    joints: file.skeleton.joints,
    bones: file.skeleton.bones,
  };
  const keyframes: Keyframe[] = file.keyframes.map((k, i) => ({
    id: `kf_${newProjectId}_${i}`,
    projectId: newProjectId,
    frame: k.frame,
    poses: k.poses,
  }));
  const animation: AnimationData = {
    id: `an_${newProjectId}`,
    projectId: newProjectId,
    fps: file.animation.fps,
    loop: file.animation.loop,
    length: file.animation.length,
  };
  return { project, modules, skeleton, keyframes, animation };
}

// 下载 .gider 文件
export function downloadGider(file: GiderFile, filename?: string) {
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename ?? file.meta.name}.gider`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 读取用户选择的 .gider 文件
export function pickGiderFile(): Promise<GiderFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".gider,application/json";
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(String(reader.result));
          if (obj?.meta?.format !== "gider") {
            resolve(null);
            return;
          }
          resolve(obj as GiderFile);
        } catch {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(f);
    };
    input.click();
  });
}
