
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
  url: string;
  tags: string[];
  addedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
