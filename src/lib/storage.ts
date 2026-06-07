import { get, set, del, keys } from 'idb-keyval';
import type { Project } from '@/types';

const PREFIX = 'aniforge:project:';

export async function saveProject(project: Project) {
  await set(PREFIX + project.id, project);
}

export async function loadProject(id: string): Promise<Project | undefined> {
  return get<Project>(PREFIX + id);
}

export async function deleteProject(id: string) {
  await del(PREFIX + id);
}

export async function listProjects(): Promise<Project[]> {
  const ks = await keys();
  const projectKeys = ks.filter((k): k is string => typeof k === 'string' && k.startsWith(PREFIX));
  const projects: Project[] = [];
  for (const k of projectKeys) {
    const p = await get<Project>(k);
    if (p) projects.push(p);
  }
  projects.sort((a, b) => b.updatedAt - a.updatedAt);
  return projects;
}
