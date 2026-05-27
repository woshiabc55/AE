import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, FileText, TrendingUp, Clock, Sparkles, PlusCircle, Upload, ArrowRight } from 'lucide-angular';
import { DocumentService } from '../../services/document.service';
import { Category } from '../../models/document.model';
import { StandardDocument } from '../../models/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ FileText, TrendingUp, Clock, Sparkles, PlusCircle, Upload, ArrowRight }) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 fade-in">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">仪表盘</h1>
        <p class="text-dark-400">镜头标准文档管理概览</p>
      </div>

      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 card-glow gradient-border">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <i-lucide name="file-text" class="w-6 h-6 text-primary-400"></i-lucide>
            </div>
            <div>
              <div class="text-3xl font-bold text-white font-mono">{{ totalDocs() }}</div>
              <div class="text-sm text-dark-400 mt-1">文档总数</div>
            </div>
          </div>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 card-glow gradient-border">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <i-lucide name="trending-up" class="w-6 h-6 text-accent-400"></i-lucide>
            </div>
            <div>
              <div class="text-3xl font-bold text-white font-mono">{{ monthNew() }}</div>
              <div class="text-sm text-dark-400 mt-1">本月新增</div>
            </div>
          </div>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 card-glow gradient-border">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <i-lucide name="clock" class="w-6 h-6 text-blue-400"></i-lucide>
            </div>
            <div>
              <div class="text-3xl font-bold text-white font-mono">{{ pendingReview() }}</div>
              <div class="text-sm text-dark-400 mt-1">待审核</div>
            </div>
          </div>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 card-glow gradient-border">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <i-lucide name="sparkles" class="w-6 h-6 text-primary-400"></i-lucide>
            </div>
            <div>
              <div class="text-3xl font-bold text-white font-mono">{{ aiGenerated() }}</div>
              <div class="text-sm text-dark-400 mt-1">AI 生成</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="flex gap-4">
          <a routerLink="/documents/new"
             class="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25">
            <i-lucide name="plus-circle" class="w-5 h-5"></i-lucide>
            新建文档
          </a>
          <a routerLink="/ai-generator"
             class="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-accent-500/25">
            <i-lucide name="sparkles" class="w-5 h-5"></i-lucide>
            AI 生成
          </a>
          <button (click)="onImport()"
                  class="flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-200 rounded-xl font-medium border border-dark-700/50 transition-all duration-200">
            <i-lucide name="upload" class="w-5 h-5"></i-lucide>
            导入文档
          </button>
        </div>
      </div>

      <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">最近更新</h2>
          <a routerLink="/documents"
             class="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            查看全部
            <i-lucide name="arrow-right" class="w-4 h-4"></i-lucide>
          </a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-dark-700/50">
                <th class="text-left text-sm font-medium text-dark-400 pb-3 pr-4">文档编号</th>
                <th class="text-left text-sm font-medium text-dark-400 pb-3 pr-4">标题</th>
                <th class="text-left text-sm font-medium text-dark-400 pb-3 pr-4">版本</th>
                <th class="text-left text-sm font-medium text-dark-400 pb-3 pr-4">状态</th>
                <th class="text-left text-sm font-medium text-dark-400 pb-3">更新时间</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of recentDocs(); track doc.id) {
                <tr class="border-b border-dark-700/30 hover:bg-dark-700/20 transition-colors">
                  <td class="py-3 pr-4">
                    <span class="text-sm font-mono text-primary-400">{{ doc.documentNumber }}</span>
                  </td>
                  <td class="py-3 pr-4">
                    <a [routerLink]="['/documents', doc.id]"
                       class="text-sm text-white hover:text-primary-400 transition-colors">
                      {{ doc.title }}
                    </a>
                  </td>
                  <td class="py-3 pr-4">
                    <span class="text-sm text-dark-300 font-mono">v{{ doc.version }}</span>
                  </td>
                  <td class="py-3 pr-4">
                    <span [class]="getStatusClasses(doc.status)"
                          class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getStatusLabel(doc.status) }}
                    </span>
                  </td>
                  <td class="py-3">
                    <span class="text-sm text-dark-400">{{ formatDate(doc.updatedAt) }}</span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-8 text-center text-dark-400">暂无文档数据</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  private documentService = inject(DocumentService);

  private documents = signal<StandardDocument[]>([]);
  private categories = signal<Category[]>([]);

  totalDocs = computed(() => this.documents().length);
  monthNew = computed(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.documents().filter(d => new Date(d.createdAt) >= startOfMonth).length;
  });
  pendingReview = computed(() => this.documents().filter(d => d.status === 'review').length);
  aiGenerated = computed(() => {
    return this.documents().filter(d => d.content?.notes?.toLowerCase().includes('ai-generated') || d.createdBy?.toLowerCase().includes('ai')).length;
  });
  recentDocs = computed(() =>
    [...this.documents()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8)
  );

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.documentService.getDocuments({ pageSize: 100, sortBy: 'updatedAt', sortOrder: 'desc' }).subscribe({
      next: (res) => this.documents.set(res.items),
      error: () => this.documents.set(this.getFallbackData())
    });

    this.documentService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([])
    });
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      draft: 'bg-yellow-500/10 text-yellow-400',
      review: 'bg-blue-500/10 text-blue-400',
      published: 'bg-green-500/10 text-green-400',
      archived: 'bg-dark-500/10 text-dark-400'
    };
    return map[status] || 'bg-dark-500/10 text-dark-400';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: '草稿',
      review: '审核中',
      published: '已发布',
      archived: '已归档'
    };
    return map[status] || status;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  }

  onImport(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.md,.txt';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          try {
            const parsed = JSON.parse(fileContent);
            this.documentService.createDocument(parsed).subscribe({
              next: () => this.loadData(),
              error: () => {}
            });
          } catch {
            this.documentService.createDocument({
              title: file.name.replace(/\.[^.]+$/, ''),
              content: { summary: fileContent, parameters: [], testConditions: [], notes: 'Imported' }
            }).subscribe({
              next: () => this.loadData(),
              error: () => {}
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  private getFallbackData(): StandardDocument[] {
    const now = new Date();
    const day = (offset: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - offset);
      return d.toISOString();
    };
    return [
      {
        id: '1', title: '光学镜头通用技术条件', documentNumber: 'LS-2024-001', version: '2.1',
        categoryId: '1', status: 'published',
        content: { summary: '光学镜头通用技术条件标准', parameters: [], testConditions: [], notes: '' },
        createdBy: 'admin', createdAt: day(30), updatedAt: day(1)
      },
      {
        id: '2', title: '镜头分辨率测试规范', documentNumber: 'LS-2024-002', version: '1.3',
        categoryId: '2', status: 'review',
        content: { summary: '镜头分辨率测试规范', parameters: [], testConditions: [], notes: '' },
        createdBy: 'admin', createdAt: day(20), updatedAt: day(2)
      },
      {
        id: '3', title: '镀膜质量检验标准', documentNumber: 'LS-2024-003', version: '1.0',
        categoryId: '3', status: 'draft',
        content: { summary: '镀膜质量检验标准', parameters: [], testConditions: [], notes: 'ai-generated' },
        createdBy: 'ai', createdAt: day(5), updatedAt: day(3)
      },
      {
        id: '4', title: '环境可靠性试验方法', documentNumber: 'LS-2024-004', version: '3.0',
        categoryId: '4', status: 'published',
        content: { summary: '环境可靠性试验方法', parameters: [], testConditions: [], notes: '' },
        createdBy: 'admin', createdAt: day(60), updatedAt: day(5)
      },
      {
        id: '5', title: '镜头畸变测量规程', documentNumber: 'LS-2024-005', version: '1.2',
        categoryId: '2', status: 'review',
        content: { summary: '镜头畸变测量规程', parameters: [], testConditions: [], notes: '' },
        createdBy: 'admin', createdAt: day(10), updatedAt: day(1)
      },
      {
        id: '6', title: '玻璃材料折射率标准', documentNumber: 'LS-2024-006', version: '2.0',
        categoryId: '1', status: 'archived',
        content: { summary: '玻璃材料折射率标准', parameters: [], testConditions: [], notes: 'ai-generated' },
        createdBy: 'ai', createdAt: day(90), updatedAt: day(15)
      },
      {
        id: '7', title: '镜头MTF测试方法', documentNumber: 'LS-2024-007', version: '1.5',
        categoryId: '2', status: 'published',
        content: { summary: '镜头MTF测试方法', parameters: [], testConditions: [], notes: '' },
        createdBy: 'admin', createdAt: day(45), updatedAt: day(7)
      },
      {
        id: '8', title: '镜头外观缺陷判定标准', documentNumber: 'LS-2024-008', version: '1.1',
        categoryId: '3', status: 'draft',
        content: { summary: '镜头外观缺陷判定标准', parameters: [], testConditions: [], notes: 'ai-generated' },
        createdBy: 'ai', createdAt: day(3), updatedAt: day(0)
      }
    ];
  }
}
