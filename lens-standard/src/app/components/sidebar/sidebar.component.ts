import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, Aperture, LayoutDashboard, FileText, PlusCircle, Sparkles, BarChart3, Settings } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Aperture, LayoutDashboard, FileText, PlusCircle, Sparkles, BarChart3, Settings }) }],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-64 bg-dark-950 border-r border-dark-700/50 flex flex-col z-50">
      <div class="p-6 border-b border-dark-700/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <i-lucide name="aperture" class="w-5 h-5 text-white"></i-lucide>
          </div>
          <div>
            <h1 class="text-base font-bold text-white tracking-tight">镜头标准</h1>
            <p class="text-xs text-dark-400">文档整理工具</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <a routerLink="/dashboard"
           routerLinkActive="bg-primary-500/10 text-primary-400 border-primary-500/30"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 transition-all duration-200 border border-transparent">
          <i-lucide name="layout-dashboard" class="w-5 h-5"></i-lucide>
          <span class="text-sm font-medium">仪表盘</span>
        </a>

        <a routerLink="/documents"
           routerLinkActive="bg-primary-500/10 text-primary-400 border-primary-500/30"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 transition-all duration-200 border border-transparent">
          <i-lucide name="file-text" class="w-5 h-5"></i-lucide>
          <span class="text-sm font-medium">标准文档</span>
        </a>

        <a routerLink="/documents/new"
           routerLinkActive="bg-primary-500/10 text-primary-400 border-primary-500/30"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 transition-all duration-200 border border-transparent">
          <i-lucide name="plus-circle" class="w-5 h-5"></i-lucide>
          <span class="text-sm font-medium">新建文档</span>
        </a>

        <a routerLink="/ai-generator"
           routerLinkActive="bg-primary-500/10 text-primary-400 border-primary-500/30"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 transition-all duration-200 border border-transparent ai-glow">
          <i-lucide name="sparkles" class="w-5 h-5"></i-lucide>
          <span class="text-sm font-medium">AI 生成</span>
        </a>

        <a routerLink="/visualization/doc-1"
           routerLinkActive="bg-primary-500/10 text-primary-400 border-primary-500/30"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 transition-all duration-200 border border-transparent">
          <i-lucide name="bar-chart-3" class="w-5 h-5"></i-lucide>
          <span class="text-sm font-medium">参数可视化</span>
        </a>
      </nav>

      <div class="p-4 border-t border-dark-700/50">
        <a routerLink="/settings"
           routerLinkActive="bg-primary-500/10 text-primary-400"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-all duration-200">
          <i-lucide name="settings" class="w-5 h-5"></i-lucide>
          <span class="text-sm">系统设置</span>
        </a>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {}
