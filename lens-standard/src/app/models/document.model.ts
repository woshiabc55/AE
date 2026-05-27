export interface StandardDocument {
  id: string;
  title: string;
  documentNumber: string;
  version: string;
  categoryId: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  content: DocumentContent;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentContent {
  summary: string;
  parameters: LensParameter[];
  testConditions: TestCondition[];
  notes: string;
}

export interface LensParameter {
  name: string;
  value: number | string;
  unit: string;
  category: 'optical' | 'mechanical' | 'environmental';
}

export interface TestCondition {
  name: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  documentCount: number;
}

export interface VersionHistory {
  id: string;
  documentId: string;
  version: string;
  changes: string;
  changedBy: string;
  changedAt: string;
}

export interface ListDocumentsRequest {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: string;
  search?: string;
  sortBy?: 'updatedAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ListDocumentsResponse {
  items: StandardDocument[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AIGenerateRequest {
  prompt: string;
  templateId?: string;
  conversationId?: string;
}

export interface AIGenerateResponse {
  content: DocumentContent;
  conversationId: string;
  rawMarkdown: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
