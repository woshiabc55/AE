// src/data/types.ts

export interface Scene {
  startTime: number;
  endTime: number;
  location: string;
  action: string;
  dialogue: string;
  speaker?: string;
  soundEffect?: string;
  emoji?: string;
}

export interface Script {
  id: string;
  index: string; // EP.01
  title: string;
  subtitle: string;
  duration: string;
  style: string;
  coreJoke: string;
  scenes: Scene[];
  punchline: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  accent: "cyan" | "crimson" | "paper";
}

export type RelationType = "protects" | "frames" | "targets" | "observer" | "mentor";

export interface Relation {
  from: string;
  to: string;
  type: RelationType;
  label: string;
}

export interface Act {
  phase: number;
  title: string;
  summary: string;
  keyPoints: string[];
  status: "completed" | "in-progress" | "planned";
}

export interface Storyline {
  title: string;
  overview: string;
  acts: Act[];
  recurringElements: { name: string; description: string }[];
  slogans: { main: string; sub: string }[];
  extensions: { name: string; hook: string; status: "ready" | "stock" }[];
}
