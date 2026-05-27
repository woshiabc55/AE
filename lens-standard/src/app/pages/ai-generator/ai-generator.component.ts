import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, Sparkles, Send, FileText, Save, Bot, User } from 'lucide-angular';
import { AiService } from '../../services/ai.service';
import { DocumentService } from '../../services/document.service';
import { ChatMessage, AIGenerateRequest, AIGenerateResponse } from '../../models/document.model';

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-ai-generator',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Sparkles, Send, FileText, Save, Bot, User }) }],
  template: `
    <div class="p-8 fade-in h-full flex flex-col">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white mb-2">AI 页面生成器</h1>
        <p class="text-dark-400">通过 AI 对话智能生成标准文档页面</p>
      </div>

      <div class="mb-6">
        <h2 class="text-sm font-medium text-dark-300 mb-3">选择文档模板</h2>
        <div class="grid grid-cols-5 gap-3">
          @for (tpl of templates; track tpl.id) {
            <button
              (click)="selectedTemplateId.set(tpl.id)"
              [class]="selectedTemplateId() === tpl.id
                ? 'relative rounded-xl p-4 border-2 border-primary-500 bg-primary-500/10 cursor-pointer transition-all duration-200 hover:bg-primary-500/15'
                : 'rounded-xl p-4 border border-dark-700/50 bg-dark-800 cursor-pointer transition-all duration-200 hover:bg-dark-700 hover:border-dark-600'">
              @if (selectedTemplateId() === tpl.id) {
                <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-700/10 pointer-events-none"></div>
              }
              <div class="relative">
                <div [class]="selectedTemplateId() === tpl.id
                  ? 'w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-2'
                  : 'w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center mb-2'">
                  <i-lucide name="file-text" [class]="selectedTemplateId() === tpl.id ? 'w-4 h-4 text-primary-400' : 'w-4 h-4 text-dark-400'"></i-lucide>
                </div>
                <p [class]="selectedTemplateId() === tpl.id ? 'text-sm font-medium text-primary-300 mb-1' : 'text-sm font-medium text-dark-200 mb-1'">{{ tpl.name }}</p>
                <p class="text-xs text-dark-400 leading-relaxed">{{ tpl.description }}</p>
              </div>
            </button>
          }
        </div>
      </div>

      <div class="flex-1 flex gap-6 min-h-0">
        <div class="flex-1 flex flex-col bg-dark-800 rounded-2xl border border-dark-700/50 overflow-hidden">
          <div class="flex-1 overflow-y-auto p-6 space-y-4" #scrollContainer>
            @for (msg of messages(); track msg.id) {
              @if (msg.role === 'assistant') {
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <i-lucide name="bot" class="w-4 h-4 text-primary-400"></i-lucide>
                  </div>
                  <div class="bg-dark-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p class="text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                  </div>
                </div>
              } @else {
                <div class="flex gap-3 justify-end">
                  <div class="bg-primary-500/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p class="text-sm text-primary-100 leading-relaxed">{{ msg.content }}</p>
                  </div>
                  <div class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <i-lucide name="user" class="w-4 h-4 text-accent-400"></i-lucide>
                  </div>
                </div>
              }
            }
            @if (isLoading()) {
              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <i-lucide name="bot" class="w-4 h-4 text-primary-400"></i-lucide>
                </div>
                <div class="bg-dark-700 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style="animation-delay: 300ms"></span>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="p-4 border-t border-dark-700/50">
            <div class="flex gap-3">
              <input
                type="text"
                [(ngModel)]="inputText"
                (keydown.enter)="sendMessage()"
                [disabled]="isLoading()"
                class="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all duration-200 disabled:opacity-50"
                placeholder="描述您需要的标准文档..." />
              <button
                (click)="sendMessage()"
                [disabled]="isLoading() || !inputText().trim()"
                class="px-5 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200">
                <i-lucide name="send" class="w-4 h-4"></i-lucide>
                发送
              </button>
            </div>
          </div>
        </div>

        <div class="w-[480px] bg-dark-800 rounded-2xl border border-dark-700/50 overflow-hidden flex flex-col">
          <div class="p-4 border-b border-dark-700/50 flex items-center justify-between">
            <h3 class="text-sm font-medium text-dark-300">预览</h3>
            @if (generatedContent()) {
              <button
                (click)="saveAsDocument()"
                [disabled]="isSaving()"
                class="px-3 py-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-dark-600 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200">
                <i-lucide name="save" class="w-3.5 h-3.5"></i-lucide>
                保存为文档
              </button>
            }
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            @if (generatedContent()) {
              <div class="space-y-5">
                <div>
                  <h4 class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">摘要</h4>
                  <p class="text-sm text-dark-200 leading-relaxed bg-dark-700/50 rounded-lg p-3">{{ generatedContent()!.content.summary }}</p>
                </div>

                @if (generatedContent()!.content.parameters.length > 0) {
                  <div>
                    <h4 class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">参数</h4>
                    <div class="space-y-2">
                      @for (param of generatedContent()!.content.parameters; track param.name) {
                        <div class="flex items-center justify-between bg-dark-700/50 rounded-lg px-3 py-2">
                          <span class="text-sm text-dark-200">{{ param.name }}</span>
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-mono text-primary-400">{{ param.value }}</span>
                            <span class="text-xs text-dark-400">{{ param.unit }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (generatedContent()!.content.testConditions.length > 0) {
                  <div>
                    <h4 class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">测试条件</h4>
                    <div class="space-y-2">
                      @for (cond of generatedContent()!.content.testConditions; track cond.name) {
                        <div class="flex items-center justify-between bg-dark-700/50 rounded-lg px-3 py-2">
                          <span class="text-sm text-dark-200">{{ cond.name }}</span>
                          <span class="text-sm text-dark-300">{{ cond.value }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (generatedContent()!.content.notes) {
                  <div>
                    <h4 class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">备注</h4>
                    <p class="text-sm text-dark-300 leading-relaxed bg-dark-700/50 rounded-lg p-3">{{ generatedContent()!.content.notes }}</p>
                  </div>
                }
              </div>
            } @else {
              <div class="h-full flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
                  <i-lucide name="sparkles" class="w-8 h-8 text-dark-500"></i-lucide>
                </div>
                <p class="text-sm text-dark-400 mb-1">暂无预览内容</p>
                <p class="text-xs text-dark-500">在左侧输入描述，AI 将为您生成文档内容</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AiGeneratorComponent {
  private aiService = inject(AiService);
  private documentService = inject(DocumentService);
  private router = inject(Router);

  templates: TemplateItem[] = [
    { id: 'optical-design', name: '光学设计规范', description: '镜头光学参数与设计标准', icon: 'file-text' },
    { id: 'mechanical-spec', name: '机械规格文档', description: '机械结构与尺寸规格', icon: 'file-text' },
    { id: 'test-report', name: '测试报告模板', description: '标准测试流程与报告', icon: 'file-text' },
    { id: 'env-compliance', name: '环境合规文档', description: '环境测试与合规标准', icon: 'file-text' },
    { id: 'quality-standard', name: '质量标准文档', description: '质量控制与检验标准', icon: 'file-text' }
  ];

  selectedTemplateId = signal<string>('optical-design');
  messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是 AI 文档生成助手。请选择一个文档模板，然后描述您需要的标准文档内容，我将为您智能生成。\n\n例如：请生成一份关于 50mm f/1.4 镜头的光学设计规范文档。',
      timestamp: new Date().toISOString()
    }
  ]);
  inputText = signal('');
  isLoading = signal(false);
  isSaving = signal(false);
  generatedContent = signal<AIGenerateResponse | null>(null);
  conversationId = signal<string | undefined>(undefined);

  constructor() {
    effect(() => {
      this.messages();
      setTimeout(() => {
        const container = document.querySelector('[class*="overflow-y-auto"]');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0);
    });
  }

  sendMessage(): void {
    const text = this.inputText().trim();
    if (!text || this.isLoading()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.inputText.set('');
    this.isLoading.set(true);

    const request: AIGenerateRequest = {
      prompt: text,
      templateId: this.selectedTemplateId(),
      conversationId: this.conversationId()
    };

    this.aiService.generateContent(request).subscribe({
      next: (response: AIGenerateResponse) => {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: '已根据您的要求生成文档内容，请在右侧预览面板查看。如需修改，请继续描述您的需求。',
          timestamp: new Date().toISOString()
        };
        this.messages.update(msgs => [...msgs, aiMsg]);
        this.generatedContent.set(response);
        this.conversationId.set(response.conversationId);
        this.isLoading.set(false);
      },
      error: () => {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '抱歉，生成过程中出现错误，请稍后重试。',
          timestamp: new Date().toISOString()
        };
        this.messages.update(msgs => [...msgs, errorMsg]);
        this.isLoading.set(false);
      }
    });
  }

  saveAsDocument(): void {
    const content = this.generatedContent();
    if (!content) return;

    this.isSaving.set(true);

    this.documentService.createDocument({
      title: `AI 生成文档 - ${new Date().toLocaleDateString('zh-CN')}`,
      documentNumber: `AI-${Date.now()}`,
      version: '1.0',
      categoryId: this.selectedTemplateId(),
      status: 'draft',
      content: content.content,
      createdBy: 'AI Generator'
    }).subscribe({
      next: (doc) => {
        this.isSaving.set(false);
        this.router.navigate(['/documents', doc.id]);
      },
      error: () => {
        this.isSaving.set(false);
      }
    });
  }
}
