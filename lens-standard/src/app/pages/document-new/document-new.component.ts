import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, Plus, Trash2, Save, X } from 'lucide-angular';
import { DocumentService } from '../../services/document.service';
import { Category, LensParameter, TestCondition } from '../../models/document.model';

@Component({
  selector: 'app-document-new',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Plus, Trash2, Save, X }) }],
  template: `
    <div class="p-8 fade-in">
      <nav class="flex items-center gap-2 text-sm text-dark-400 mb-6">
        <a routerLink="/documents" class="hover:text-primary-400">标准文档</a>
        <span>/</span>
        <span class="text-white">新建文档</span>
      </nav>

      <h1 class="text-3xl font-bold text-white mb-8">新建标准文档</h1>

      <form (ngSubmit)="save()" class="space-y-6">
        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
          <h2 class="text-lg font-semibold text-white mb-4">基本信息</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-dark-300 mb-1.5">文档标题</label>
              <input type="text"
                     [(ngModel)]="title"
                     name="title"
                     placeholder="请输入文档标题"
                     class="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">文档编号</label>
              <input type="text"
                     [(ngModel)]="documentNumber"
                     name="documentNumber"
                     placeholder="例: LENS-STD-001"
                     class="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">版本号</label>
              <input type="text"
                     [(ngModel)]="version"
                     name="version"
                     placeholder="例: 1.0.0"
                     class="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">分类</label>
              <select [(ngModel)]="categoryId"
                      name="categoryId"
                      class="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all">
                <option value="" disabled>请选择分类</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-300 mb-1.5">状态</label>
              <select [(ngModel)]="status"
                      name="status"
                      class="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all">
                <option value="draft">草稿</option>
                <option value="review">审核中</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white">性能参数</h2>
            <button type="button"
                    (click)="addParameter()"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-400 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-all">
              <i-lucide name="plus" class="w-4 h-4"></i-lucide>
              添加参数
            </button>
          </div>
          <div class="space-y-3">
            @for (param of parameters(); track $index) {
              <div class="flex items-center gap-3">
                <input type="text"
                       [(ngModel)]="param.name"
                       [name]="'paramName_' + $index"
                       placeholder="参数名称"
                       class="flex-1 bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
                <input type="text"
                       [(ngModel)]="param.value"
                       [name]="'paramValue_' + $index"
                       placeholder="参数值"
                       class="flex-1 bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
                <input type="text"
                       [(ngModel)]="param.unit"
                       [name]="'paramUnit_' + $index"
                       placeholder="单位"
                       class="w-28 bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
                <select [(ngModel)]="param.category"
                        [name]="'paramCategory_' + $index"
                        class="w-36 bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all">
                  <option value="optical">光学</option>
                  <option value="mechanical">机械</option>
                  <option value="environmental">环境</option>
                </select>
                <button type="button"
                        (click)="removeParameter($index)"
                        class="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <i-lucide name="trash-2" class="w-4 h-4"></i-lucide>
                </button>
              </div>
            }
          </div>
          @if (parameters().length === 0) {
            <p class="text-dark-500 text-sm text-center py-4">暂无参数，点击上方按钮添加</p>
          }
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white">测试条件</h2>
            <button type="button"
                    (click)="addCondition()"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-400 bg-primary-500/10 border border-primary-500/30 rounded-lg hover:bg-primary-500/20 transition-all">
              <i-lucide name="plus" class="w-4 h-4"></i-lucide>
              添加条件
            </button>
          </div>
          <div class="space-y-3">
            @for (cond of conditions(); track $index) {
              <div class="flex items-center gap-3">
                <input type="text"
                       [(ngModel)]="cond.name"
                       [name]="'condName_' + $index"
                       placeholder="条件名称"
                       class="flex-1 bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
                <input type="text"
                       [(ngModel)]="cond.value"
                       [name]="'condValue_' + $index"
                       placeholder="条件值"
                       class="flex-1 bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all" />
                <button type="button"
                        (click)="removeCondition($index)"
                        class="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <i-lucide name="trash-2" class="w-4 h-4"></i-lucide>
                </button>
              </div>
            }
          </div>
          @if (conditions().length === 0) {
            <p class="text-dark-500 text-sm text-center py-4">暂无测试条件，点击上方按钮添加</p>
          }
        </div>

        <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
          <h2 class="text-lg font-semibold text-white mb-4">备注</h2>
          <textarea [(ngModel)]="notes"
                    name="notes"
                    rows="4"
                    placeholder="请输入备注信息..."
                    class="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"></textarea>
        </div>

        <div class="flex gap-4">
          <button type="submit"
                  class="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/25">
            <i-lucide name="save" class="w-5 h-5"></i-lucide>
            保存文档
          </button>
          <button type="button"
                  (click)="cancel()"
                  class="flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white font-medium rounded-xl border border-dark-600 transition-all">
            <i-lucide name="x" class="w-5 h-5"></i-lucide>
            取消
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class DocumentNewComponent implements OnInit {
  private router = inject(Router);
  private documentService = inject(DocumentService);

  title = '';
  documentNumber = '';
  version = '';
  categoryId = '';
  status: 'draft' | 'review' | 'published' | 'archived' = 'draft';
  notes = '';

  parameters = signal<LensParameter[]>([]);
  conditions = signal<TestCondition[]>([]);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.documentService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([])
    });
  }

  addParameter(): void {
    this.parameters.update(params => [...params, { name: '', value: '', unit: '', category: 'optical' }]);
  }

  removeParameter(index: number): void {
    this.parameters.update(params => params.filter((_, i) => i !== index));
  }

  addCondition(): void {
    this.conditions.update(conds => [...conds, { name: '', value: '' }]);
  }

  removeCondition(index: number): void {
    this.conditions.update(conds => conds.filter((_, i) => i !== index));
  }

  save(): void {
    const doc: Partial<import('../../models/document.model').StandardDocument> = {
      title: this.title,
      documentNumber: this.documentNumber,
      version: this.version,
      categoryId: this.categoryId,
      status: this.status,
      content: {
        summary: '',
        parameters: this.parameters(),
        testConditions: this.conditions(),
        notes: this.notes
      }
    };

    this.documentService.createDocument(doc).subscribe({
      next: (created) => this.router.navigate(['/documents', created.id]),
      error: () => {}
    });
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }

}
