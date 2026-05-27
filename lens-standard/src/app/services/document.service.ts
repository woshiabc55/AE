import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StandardDocument, ListDocumentsRequest, ListDocumentsResponse, Category, VersionHistory } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = '/api/documents';
  private categoryUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  getDocuments(params?: ListDocumentsRequest): Observable<ListDocumentsResponse> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return this.http.get<ListDocumentsResponse>(this.apiUrl, { params: httpParams });
  }

  getDocument(id: string): Observable<StandardDocument> {
    return this.http.get<StandardDocument>(`${this.apiUrl}/${id}`);
  }

  createDocument(doc: Partial<StandardDocument>): Observable<StandardDocument> {
    return this.http.post<StandardDocument>(this.apiUrl, doc);
  }

  updateDocument(id: string, doc: Partial<StandardDocument>): Observable<StandardDocument> {
    return this.http.put<StandardDocument>(`${this.apiUrl}/${id}`, doc);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  getVersionHistory(documentId: string): Observable<VersionHistory[]> {
    return this.http.get<VersionHistory[]>(`${this.apiUrl}/${documentId}/versions`);
  }
}
