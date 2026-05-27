import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DocumentService } from '../../services/document.service';
import { LensParameter, StandardDocument } from '../../models/document.model';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterLink],
  template: `
    <div class="p-8 fade-in">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">参数可视化</h1>
          <p class="text-dark-400">镜头性能参数图表化展示</p>
        </div>
        <a [routerLink]="['/documents', documentId()]"
           class="flex items-center gap-2 px-4 py-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800 border border-dark-700/50 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
          </svg>
          <span class="text-sm">返回详情</span>
        </a>
      </div>

      <div class="flex gap-2 mb-6">
        <button *ngFor="let tab of tabs"
                [class]="tab === activeTab() ? 'bg-primary-500/10 text-primary-400 border-primary-500/30' : 'bg-dark-800 text-dark-400 border-dark-700/50'"
                class="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                (click)="activeTab.set(tab)">
          {{tab}}
        </button>
      </div>

      <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50 mb-6">
        <div class="h-[400px]">
          <canvas baseChart
                  [data]="chartData()"
                  [options]="chartOptions()"
                  [type]="chartType()">
          </canvas>
        </div>
      </div>

      <div class="bg-dark-800 rounded-2xl p-6 border border-dark-700/50">
        <h2 class="text-lg font-semibold text-white mb-4">原始数据</h2>
        <table class="w-full">
          <thead>
            <tr class="text-left text-dark-400 text-sm border-b border-dark-700/50">
              <th class="pb-3">参数名称</th>
              <th class="pb-3">数值</th>
              <th class="pb-3">单位</th>
              <th class="pb-3">类别</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let param of parameters()" class="border-b border-dark-700/30">
              <td class="py-3 text-white">{{param.name}}</td>
              <td class="py-3 font-mono text-primary-400">{{param.value}}</td>
              <td class="py-3 text-dark-300">{{param.unit}}</td>
              <td class="py-3">
                <span [class]="categoryBadgeClass(param.category)"
                      class="px-2 py-1 rounded-lg text-xs font-medium">
                  {{categoryLabel(param.category)}}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class VisualizationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentService = inject(DocumentService);

  tabs = ['MTF曲线', '参数对比', '分辨率分布'];
  activeTab = signal('MTF曲线');
  documentId = signal('');
  document = signal<StandardDocument | null>(null);
  parameters = computed(() => this.document()?.content?.parameters ?? []);

  categoryLabel(category: string): string {
    const map: Record<string, string> = { optical: '光学', mechanical: '机械', environmental: '环境' };
    return map[category] ?? category;
  }

  categoryBadgeClass(category: string): string {
    const map: Record<string, string> = {
      optical: 'bg-primary-500/10 text-primary-400',
      mechanical: 'bg-accent-500/10 text-accent-400',
      environmental: 'bg-green-500/10 text-green-400'
    };
    return map[category] ?? 'bg-dark-700 text-dark-300';
  }

  chartType = computed<ChartType>(() => {
    switch (this.activeTab()) {
      case 'MTF曲线': return 'bar';
      case '参数对比': return 'radar';
      case '分辨率分布': return 'line';
      default: return 'bar';
    }
  });

  chartData = computed<ChartConfiguration['data']>(() => {
    const params = this.parameters();
    if (!params.length) {
      return { labels: [], datasets: [] };
    }

    switch (this.activeTab()) {
      case 'MTF曲线': {
        const mtfParams = params.filter(p =>
          p.name.toLowerCase().includes('mtf') || p.name.toLowerCase().includes('分辨率')
        );
        const centerParams = mtfParams.filter(p => p.name.includes('中心'));
        const edgeParams = mtfParams.filter(p => p.name.includes('边缘'));
        const labels = centerParams.length || edgeParams.length
          ? centerParams.length > edgeParams.length
            ? centerParams.map(p => p.name.replace('中心', '').trim())
            : edgeParams.map(p => p.name.replace('边缘', '').trim())
          : mtfParams.map(p => p.name);
        return {
          labels,
          datasets: [
            {
              label: '中心',
              data: centerParams.map(p => Number(p.value) || 0),
              backgroundColor: 'rgba(6, 182, 212, 0.6)',
              borderColor: '#06b6d4',
              borderWidth: 1,
              borderRadius: 6
            },
            {
              label: '边缘',
              data: edgeParams.map(p => Number(p.value) || 0),
              backgroundColor: 'rgba(249, 115, 22, 0.6)',
              borderColor: '#f97316',
              borderWidth: 1,
              borderRadius: 6
            }
          ]
        };
      }
      case '参数对比': {
        const numericParams = params.filter(p => typeof p.value === 'number' || !isNaN(Number(p.value)));
        const values = numericParams.map(p => {
          const num = Number(p.value);
          return num > 1 ? num / 100 : num;
        });
        return {
          labels: numericParams.map(p => p.name),
          datasets: [{
            label: '参数归一化',
            data: values,
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            borderColor: '#06b6d4',
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#06b6d4',
            borderWidth: 2
          }]
        };
      }
      case '分辨率分布': {
        const resolutionParams = params.filter(p =>
          p.name.toLowerCase().includes('分辨率') || p.name.toLowerCase().includes('mtf')
        );
        const dataPoints = resolutionParams.length
          ? resolutionParams.map(p => Number(p.value) || 0)
          : params.map(p => Number(p.value) || 0);
        const labels = resolutionParams.length
          ? resolutionParams.map(p => p.name)
          : params.map(p => p.name);
        return {
          labels,
          datasets: [{
            label: '分辨率',
            data: dataPoints,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#06b6d4',
            borderWidth: 2
          }]
        };
      }
      default:
        return { labels: [], datasets: [] };
    }
  });

  chartOptions = computed<ChartConfiguration['options']>(() => {
    const baseOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#94a3b8',
            font: { size: 12 },
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(51, 65, 85, 0.5)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8
        }
      }
    };

    if (this.activeTab() === 'MTF曲线' || this.activeTab() === '分辨率分布') {
      baseOptions.scales = {
        x: {
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          border: { color: 'rgba(51, 65, 85, 0.5)' }
        },
        y: {
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          border: { color: 'rgba(51, 65, 85, 0.5)' },
          beginAtZero: true
        }
      };
    }

    if (this.activeTab() === '参数对比') {
      baseOptions.scales = {
        r: {
          angleLines: { color: 'rgba(51, 65, 85, 0.3)' },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          pointLabels: { color: '#94a3b8', font: { size: 11 } },
          ticks: {
            color: '#94a3b8',
            backdropColor: 'transparent',
            font: { size: 10 }
          },
          beginAtZero: true
        }
      };
    }

    return baseOptions;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.documentId.set(id);
      this.documentService.getDocument(id).subscribe({
        next: (doc) => this.document.set(doc),
        error: () => this.router.navigate(['/documents'])
      });
    } else {
      this.router.navigate(['/documents']);
    }
  }
}
