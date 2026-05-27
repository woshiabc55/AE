import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, ArrowLeft, Edit, Trash2, CheckCircle, Clock, Tag, FileText, Beaker, Thermometer } from 'lucide-angular';
import { DocumentService } from '../../services/document.service';
import { StandardDocument, LensParameter, VersionHistory } from '../../models/document.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ ArrowLeft, Edit, Trash2, CheckCircle, Clock, Tag, FileText, Beaker, Thermometer }) }],
  template: `
    <div class="p-8 fade-in">
      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      } @else if (doc()) {
        <nav class="flex items-center gap-2 text-sm text-dark-400 mb-6">
          <a routerLink="/documents" class="hover:text-primary-400 transition-colors">标准文档</a>
          <span>/</span>
          <span class="text-white">{{doc()!.title}}</span>
        </nav>

        <div class="flex items-start justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-white mb-3">{{doc()!.title}}</h1>
            <div class="flex gap-3 flex-wrap">
              <span [class]="statusBadgeClass()">{{statusLabel()}}</span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                <i-lucide name="tag" class="w-3 h-3"></i-lucide>
                v{{doc()!.version}}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-dark-700 text-dark-300 border border-dark-600">
                {{categoryName()}}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-dark-700 text-dark-300 border border-dark-600">
                <i-lucide name="file-text" class="w-3 h-3"></i-lucide>
                {{doc()!.documentNumber}}
              </span>
            </div>
          </div>
          <div class="flex gap-3">
            <button (click)="goBack()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-300 hover:text-white bg-dark-800 hover:bg-dark-700 border border-dark-700/50 transition-all duration-200">
              <i-lucide name="arrow-left" class="w-4 h-4"></i-lucide>
              返回
            </button>
            <button (click)="editDocument()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-all duration-200 shadow-lg shadow-primary-500/20">
              <i-lucide name="edit" class="w-4 h-4"></i-lucide>
              编辑
            </button>
            <button (click)="changeStatus()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-accent-500 hover:bg-accent-600 transition-all duration-200 shadow-lg shadow-accent-500/20">
              <i-lucide name="check-circle" class="w-4 h-4"></i-lucide>
              变更状态
            </button>
            <button (click)="deleteDocument()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200">
              <i-lucide name="trash-2" class="w-4 h-4"></i-lucide>
              删除
            </button>
          </div>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 mb-6">
          <h2 class="text-lg font-semibold text-white mb-3">概述</h2>
          <p class="text-dark-300 leading-relaxed">{{doc()!.content.summary}}</p>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 mb-6">
          <h2 class="text-lg font-semibold text-white mb-4">性能参数</h2>
          @for (group of parameterGroups(); track group.category) {
            <div class="mb-6 last:mb-0">
              <div class="flex items-center gap-2 mb-3">
                <span [class]="groupDotClass(group.category)"></span>
                <h3 [class]="groupLabelClass(group.category)">{{group.label}}</h3>
              </div>
              <div class="overflow-hidden rounded-xl border border-dark-700/50">
                <table class="w-full">
                  <thead>
                    <tr class="bg-dark-900/50">
                      <th class="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">参数名称</th>
                      <th class="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">数值</th>
                      <th class="text-left px-4 py-3 text-xs font-medium text-dark-400 uppercase tracking-wider">单位</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (param of group.params; track param.name) {
                      <tr class="border-t border-dark-700/30 hover:bg-dark-900/30 transition-colors">
                        <td class="px-4 py-3 text-sm text-white">{{param.name}}</td>
                        <td class="px-4 py-3 text-sm text-dark-300 font-mono">{{param.value}}</td>
                        <td class="px-4 py-3 text-sm text-dark-400">{{param.unit}}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 mb-6">
          <h2 class="text-lg font-semibold text-white mb-4">测试条件</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (condition of doc()!.content.testConditions; track condition.name) {
              <div class="flex items-center gap-3 p-4 rounded-xl bg-dark-900/50 border border-dark-700/30">
                <div class="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                  <i-lucide name="beaker" class="w-5 h-5 text-accent-500"></i-lucide>
                </div>
                <div>
                  <p class="text-xs text-dark-400 mb-0.5">{{condition.name}}</p>
                  <p class="text-sm text-white font-medium">{{condition.value}}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 mb-6">
          <h2 class="text-lg font-semibold text-white mb-3">备注</h2>
          <p class="text-dark-300 leading-relaxed">{{doc()!.content.notes}}</p>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
          <h2 class="text-lg font-semibold text-white mb-4">版本历史</h2>
          @if (versions().length > 0) {
            <div class="relative">
              <div class="absolute left-5 top-0 bottom-0 w-px bg-dark-700"></div>
              @for (version of versions(); track version.id; let last = $last) {
                <div class="relative flex gap-4 pb-6 last:pb-0">
                  <div class="relative z-10 w-10 h-10 rounded-full bg-dark-900 border-2 border-primary-500/50 flex items-center justify-center flex-shrink-0">
                    <i-lucide name="clock" class="w-4 h-4 text-primary-400"></i-lucide>
                  </div>
                  <div class="flex-1 pt-1">
                    <div class="flex items-center gap-3 mb-1">
                      <span class="text-sm font-semibold text-white">v{{version.version}}</span>
                      <span class="text-xs text-dark-400">{{version.changedAt | date:'yyyy-MM-dd HH:mm'}}</span>
                    </div>
                    <p class="text-sm text-dark-300 mb-1">{{version.changes}}</p>
                    <p class="text-xs text-dark-500">by {{version.changedBy}}</p>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="text-dark-500 text-sm">暂无版本历史</p>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20">
          <i-lucide name="thermometer" class="w-12 h-12 text-dark-600 mb-4"></i-lucide>
          <p class="text-dark-400 text-lg">文档未找到</p>
          <a routerLink="/documents" class="mt-4 text-primary-400 hover:text-primary-300 text-sm transition-colors">返回文档列表</a>
        </div>
      }
    </div>
  `,
  styles: []
})
export class DocumentDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentService = inject(DocumentService);

  doc = signal<StandardDocument | null>(null);
  versions = signal<VersionHistory[]>([]);
  loading = signal(true);

  statusLabel = computed(() => {
    const status = this.doc()?.status;
    const map: Record<string, string> = {
      draft: '草稿',
      review: '审核中',
      published: '已发布',
      archived: '已归档'
    };
    return map[status ?? ''] ?? status ?? '';
  });

  statusBadgeClass = computed(() => {
    const status = this.doc()?.status;
    const map: Record<string, string> = {
      draft: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      review: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20',
      published: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20',
      archived: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-dark-600/50 text-dark-400 border border-dark-500/30'
    };
    return map[status ?? ''] ?? '';
  });

  categoryName = computed(() => {
    const catId = this.doc()?.categoryId ?? '';
    const map: Record<string, string> = {
      'cat-1': '光学镜头',
      'cat-2': '机械结构',
      'cat-3': '环境测试'
    };
    return map[catId] ?? catId;
  });

  parameterGroups = computed(() => {
    const params = this.doc()?.content.parameters ?? [];
    const categories: Array<'optical' | 'mechanical' | 'environmental'> = ['optical', 'mechanical', 'environmental'];
    const labels: Record<string, string> = { optical: '光学参数', mechanical: '机械参数', environmental: '环境参数' };
    return categories
      .filter(cat => params.some((p: LensParameter) => p.category === cat))
      .map(cat => ({
        category: cat,
        label: labels[cat],
        params: params.filter((p: LensParameter) => p.category === cat)
      }));
  });

  groupDotClass(category: string): string {
    const map: Record<string, string> = {
      optical: 'w-2 h-2 rounded-full bg-primary-400',
      mechanical: 'w-2 h-2 rounded-full bg-accent-500',
      environmental: 'w-2 h-2 rounded-full bg-green-400'
    };
    return map[category] ?? 'w-2 h-2 rounded-full bg-dark-400';
  }

  groupLabelClass(category: string): string {
    const map: Record<string, string> = {
      optical: 'text-sm font-medium text-primary-400',
      mechanical: 'text-sm font-medium text-accent-500',
      environmental: 'text-sm font-medium text-green-400'
    };
    return map[category] ?? 'text-sm font-medium text-dark-400';
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.documentService.getDocument(id).subscribe({
        next: (data) => {
          this.doc.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.doc.set(null);
          this.loading.set(false);
        }
      });
      this.documentService.getVersionHistory(id).subscribe({
        next: (data) => this.versions.set(data),
        error: () => this.versions.set([])
      });
    } else {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  editDocument(): void {
    this.router.navigate(['/documents', this.doc()!.id, 'edit']);
  }

  changeStatus(): void {
    const statusCycle: Record<string, string> = {
      draft: 'review',
      review: 'published',
      published: 'archived',
      archived: 'draft'
    };
    const current = this.doc()!.status;
    const next = statusCycle[current] as StandardDocument['status'];
    this.documentService.updateDocument(this.doc()!.id, { status: next }).subscribe({
      next: (updated) => this.doc.set(updated)
    });
  }

  deleteDocument(): void {
    if (confirm('确定要删除此文档吗？此操作不可撤销。')) {
      this.documentService.deleteDocument(this.doc()!.id).subscribe({
        next: () => this.router.navigate(['/documents'])
      });
    }
  }
}
