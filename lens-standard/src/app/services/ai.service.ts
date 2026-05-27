import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AIGenerateRequest, AIGenerateResponse, ChatMessage } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = '/api/ai';

  constructor(private http: HttpClient) {}

  generateContent(request: AIGenerateRequest): Observable<AIGenerateResponse> {
    return this.http.post<AIGenerateResponse>(`${this.apiUrl}/generate`, request);
  }

  getTemplates(): Observable<{ id: string; name: string; description: string }[]> {
    return this.http.get<{ id: string; name: string; description: string }[]>(`${this.apiUrl}/templates`);
  }

  getModels(): Observable<{ modelId: string; displayName: string }[]> {
    return this.http.get<{ modelId: string; displayName: string }[]>(`${this.apiUrl}/models`);
  }
}
