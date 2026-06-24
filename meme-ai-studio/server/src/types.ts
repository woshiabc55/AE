export interface Meme {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  source: string;
  width: number;
  height: number;
  hotScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemeCreateInput {
  title: string;
  description: string;
  tags: string[];
  source: string;
}

export interface AIAnalysis {
  id: string;
  type: 'trend' | 'category' | 'sentiment' | 'generation';
  data: Record<string, unknown>;
  createdAt: string;
}

export interface MemeStore {
  memes: Meme[];
  analyses: AIAnalysis[];
}