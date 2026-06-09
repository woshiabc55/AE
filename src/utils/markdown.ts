// Markdown 导出：将 8 表格渲染为 PRD 中描述的 markdown 表格格式
import type { StoryboardTable } from '../store/projectStore';

export function tablesToMarkdown(
  tables: StoryboardTable[],
  totalDuration: number,
  title: string,
): string {
  const slice = totalDuration / tables.length;
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push(`> 总时长 ${totalDuration}s · ${tables.length} 镜头 × 16 时间刻度 · 每刻度 ${(slice / 16).toFixed(3)}s`);
  lines.push('');

  tables.forEach((tb, idx) => {
    lines.push(`## 表格 ${idx + 1} / 镜头 ${idx + 1} · ${tb.title} (${tb.startSec.toFixed(2)}s – ${tb.endSec.toFixed(2)}s)`);
    lines.push('');
    lines.push('| 竖线刻度 | 时间(秒) | 画面 | 动作/运镜 | 音效 | 设计要点 |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    tb.ticks.forEach((tk) => {
      lines.push(
        `| | ${tk.sec.toFixed(3)} | ${tk.image || '—'} | ${tk.action || '—'} | ${tk.sound || '—'} | ${tk.note || '—'} |`,
      );
    });
    lines.push('');
  });

  return lines.join('\n');
}

export function downloadFile(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.body.removeChild(ta);
    return false;
  }
}
