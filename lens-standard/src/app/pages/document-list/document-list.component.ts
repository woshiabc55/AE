import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, Search, Filter, ChevronLeft, ChevronRight, PlusCircle, FileText } from 'lucide-angular';
import { DocumentService } from '../../services/document.service';
import { StandardDocument, ListDocumentsRequest } from '../../models/document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [RouterLink, FormsModule, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Search, Filter, ChevronLeft, ChevronRight, PlusCircle, FileText }) }],
  template: `
    <div class="p-8 fade-in">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">标准文档</h1>
          <p class="text-dark-400">管理和浏览所有镜头标准文档</p>
        </div>
        <a routerLink="/documents/new"
           class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40">
          <i-lucide name="plus-circle" class="w-5 h-5"></i-lucide>
          新建文档
        </a>
      </div>

      <div class="bg-dark-800 rounded-xl p-4 mb-6 border border-dark-700/50 flex gap-4 items-center">
        <div class="flex items-center gap-2 text-dark-400">
          <i-lucide name="filter" class="w-4 h-4"></i-lucide>
          <span class="text-sm">筛选</span>
        </div>

        <select [ngModel]="filterCategoryId()"
                (ngModelChange)="onCategoryChange($event)"
                class="bg-dark-700 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors">
          <option value="">所有分类</option>
          <option value="cat-1">定焦镜头</option>
          <option value="cat-2">变焦镜头</option>
          <option value="cat-3">广角镜头</option>
          <option value="cat-4">长焦镜头</option>
          <option value="cat-5">微距镜头</option>
        </select>

        <select [ngModel]="filterStatus()"
                (ngModelChange)="onStatusChange($event)"
                class="bg-dark-700 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors">
          <option value="">所有状态</option>
          <option value="draft">草稿</option>
          <option value="review">审核中</option>
          <option value="published">已发布</option>
          <option value="archived">已归档</option>
        </select>

        <div class="flex-1 relative">
          <i-lucide name="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"></i-lucide>
          <input type="text"
                 [ngModel]="searchText()"
                 (ngModelChange)="onSearchChange($event)"
                 placeholder="搜索文档标题或编号..."
                 class="w-full bg-dark-700 border border-dark-600 text-dark-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors placeholder:text-dark-500" />
        </div>

        <select [ngModel]="sortBy()"
                (ngModelChange)="onSortChange($event)"
                class="bg-dark-700 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors">
          <option value="updatedAt">按更新时间</option>
          <option value="createdAt">按创建时间</option>
          <option value="title">按标题</option>
        </select>

        <button (click)="toggleSortOrder()"
                class="px-3 py-2 bg-dark-700 border border-dark-600 text-dark-200 text-sm rounded-lg hover:bg-dark-600 transition-colors">
          {{ sortOrder() === 'desc' ? '↓ 降序' : '↑ 升序' }}
        </button>
      </div>

      @if (loading()) {
        <div class="bg-dark-800 rounded-2xl border border-dark-700/50 p-16 flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            <p class="text-dark-400 text-sm">加载中...</p>
          </div>
        </div>
      } @else if (documents().length === 0) {
        <div class="bg-dark-800 rounded-2xl border border-dark-700/50 p-16 flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <i-lucide name="file-text" class="w-16 h-16 text-dark-600"></i-lucide>
            <h3 class="text-lg font-medium text-dark-300">暂无文档</h3>
            <p class="text-dark-500 text-sm">没有找到匹配的文档，请尝试调整筛选条件</p>
          </div>
        </div>
      } @else {
        <div class="bg-dark-800 rounded-2xl border border-dark-700/50 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-dark-700/50">
                <th class="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">标题</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">文档编号</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">分类</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">状态</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">更新时间</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of documents(); track doc.id) {
                <tr (click)="navigateToDetail(doc.id)"
                    class="border-b border-dark-700/30 hover:bg-dark-700/30 cursor-pointer transition-colors duration-150">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <i-lucide name="file-text" class="w-4 h-4 text-primary-400 flex-shrink-0"></i-lucide>
                      <span class="text-sm font-medium text-white">{{ doc.title }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-dark-300 font-mono">{{ doc.documentNumber }}</td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-dark-300">{{ getCategoryName(doc.categoryId) }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusBadgeClass(doc.status)"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                      {{ getStatusLabel(doc.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-dark-400">{{ formatDate(doc.updatedAt) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between mt-6">
          <p class="text-sm text-dark-400">
            共 <span class="text-white font-medium">{{ total() }}</span> 条记录，
            第 <span class="text-white font-medium">{{ currentPage() }}</span> / <span class="text-white font-medium">{{ totalPages() }}</span> 页
          </p>
          <div class="flex items-center gap-2">
            <button (click)="prevPage()"
                    [disabled]="currentPage() <= 1"
                    class="inline-flex items-center gap-1 px-3 py-2 bg-dark-800 border border-dark-700/50 text-dark-300 text-sm rounded-lg hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <i-lucide name="chevron-left" class="w-4 h-4"></i-lucide>
              上一页
            </button>
            <button (click)="nextPage()"
                    [disabled]="currentPage() >= totalPages()"
                    class="inline-flex items-center gap-1 px-3 py-2 bg-dark-800 border border-dark-700/50 text-dark-300 text-sm rounded-lg hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              下一页
              <i-lucide name="chevron-right" class="w-4 h-4"></i-lucide>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class DocumentListComponent implements OnInit {
  private router = inject(Router);
  private documentService = inject(DocumentService);

  documents = signal<StandardDocument[]>([]);
  loading = signal(false);
  total = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);

  filterCategoryId = signal('');
  filterStatus = signal('');
  searchText = signal('');
  sortBy = signal<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  private categoryMap: Record<string, string> = {
    'cat-1': '定焦镜头',
    'cat-2': '变焦镜头',
    'cat-3': '广角镜头',
    'cat-4': '长焦镜头',
    'cat-5': '微距镜头'
  };

  private statusLabelMap: Record<string, string> = {
    'draft': '草稿',
    'review': '审核中',
    'published': '已发布',
    'archived': '已归档'
  };

  private statusBadgeMap: Record<string, string> = {
    'draft': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'review': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'published': 'bg-green-500/10 text-green-400 border-green-500/20',
    'archived': 'bg-dark-500/10 text-dark-400 border-dark-500/20'
  };

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading.set(true);
    const params: ListDocumentsRequest = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    const categoryId = this.filterCategoryId();
    if (categoryId) params.categoryId = categoryId;

    const status = this.filterStatus();
    if (status) params.status = status;

    const search = this.searchText();
    if (search) params.search = search;

    this.documentService.getDocuments(params).subscribe({
      next: (response) => {
        this.documents.set(response.items);
        this.total.set(response.total);
        this.currentPage.set(response.page);
        this.loading.set(false);
      },
      error: () => {
        this.documents.set([]);
        this.total.set(0);
        this.loading.set(false);
      }
    });
  }

  onCategoryChange(value: string): void {
    this.filterCategoryId.set(value);
    this.currentPage.set(1);
    this.loadDocuments();
  }

  onStatusChange(value: string): void {
    this.filterStatus.set(value);
    this.currentPage.set(1);
    this.loadDocuments();
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadDocuments();
  }

  onSortChange(value: 'updatedAt' | 'createdAt' | 'title'): void {
    this.sortBy.set(value);
    this.currentPage.set(1);
    this.loadDocuments();
  }

  toggleSortOrder(): void {
    this.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
    this.loadDocuments();
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadDocuments();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadDocuments();
    }
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/documents', id]);
  }

  getCategoryName(categoryId: string): string {
    return this.categoryMap[categoryId] || categoryId;
  }

  getStatusLabel(status: string): string {
    return this.statusLabelMap[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    return this.statusBadgeMap[status] || '';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
