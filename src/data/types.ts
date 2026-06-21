// 高数卷宗 - 数据类型定义

export type Difficulty = "easy" | "medium" | "hard";
export type SectionType = "choice" | "fill" | "compute" | "proof";
export type MasteryLevel = "了解" | "理解" | "掌握" | "熟练掌握";

export interface Question {
  id: string;
  number: number;
  content: string;
  score: number;
  options?: string[];
  hint?: string;
}

export interface ExamSection {
  title: string;
  type: SectionType;
  instruction: string;
  questions: Question[];
}

export interface ExamPaper {
  id: string;
  title: string;
  course: string;
  semester: string;
  year: number;
  duration: number;
  totalScore: number;
  difficulty: Difficulty;
  setter: string;
  notes: string[];
  sections: ExamSection[];
}

export interface KnowledgePoint {
  id: string;
  title: string;
  level: MasteryLevel;
  description: string;
  exampleRef?: { examId: string; questionLabel: string };
}

export interface OutlineChapter {
  id: string;
  number: string;
  numeral: string;
  title: string;
  subtitle: string;
  weight: number;
  hours: number;
  summary: string;
  points: KnowledgePoint[];
}
