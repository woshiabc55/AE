import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import type { Project } from "@/types";
import BeadThumbnail from "./BeadThumbnail";
import { Trash2 } from "lucide-react";

interface Props {
  project: Project;
  onOpen: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export default function ProjectCard({ project, onOpen, onDelete }: Props) {
  const modules = useLiveQuery(
    () => db.halfModules.where("projectId").equals(project.id).toArray(),
    [project.id],
  );
  const allBeads = (modules ?? []).flatMap((m) => m.beads);

  return (
    <div className="group panel relative overflow-hidden p-3 transition-all hover:border-mint/60 hover:shadow-glow">
      <button onClick={() => onOpen(project.id)} className="block w-full">
        <div className="flex items-center justify-center rounded-bead bg-ink-900 p-2">
          <BeadThumbnail
            beads={allBeads}
            gridSize={project.gridSize}
            size={140}
            palette={project.palette}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="truncate font-mono text-xs text-cream">
            {project.name}
          </span>
          <span className="chip">{project.gridSize}²</span>
        </div>
        <div className="mt-1 font-mono text-[10px] text-ink-500">
          {new Date(project.updatedAt).toLocaleString("zh-CN")}
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(project.id, project.name);
        }}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-bead bg-ink-900/80 text-ink-400 opacity-0 transition-all hover:bg-coral hover:text-ink-900 group-hover:opacity-100"
        title="删除"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
