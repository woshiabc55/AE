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

export interface AIAnalysis {
  id: string;
  type: 'trend' | 'category' | 'sentiment' | 'generation';
  data: Record<string, unknown>;
  createdAt: string;
}

export interface TrendData {
  totalMemes: number;
  topTags: { tag: string; count: number }[];
  avgHotScore: number;
  hotMemes: { id: string; title: string; hotScore: number }[];
}

export interface CategoryData {
  categories: { tag: string; count: number; percentage: string }[];
}

export interface SentimentData {
  overall: number;
  distribution: { positive: number; neutral: number; negative: number };
  details: { id: string; title: string; score: number }[];
}

export interface GenerationData {
  idea: { title: string; desc: string; tags: string[] };
  basedOn: string[];
  generatedAt: string;
}