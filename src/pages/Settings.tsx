import { useState } from 'react';
import { Save, Trash2, Download, Upload, Sparkles, Keyboard, Palette, Bell } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import { exportProjectJson, exportCubismJson } from '@/lib/exporters';
import { downloadFile } from '@/lib/utils';

export default function Settings() {
  const projects = useProjectStore((s) => s.projects);
  const removeProject = useProjectStore((s) => s.removeProject);
  const pushToast = useUIStore((s) => s.pushToast);
  const [confirmWipe, setConfirmWipe] = useState(false);

  const onExportAll = () => {
    const data = JSON.stringify(projects, null, 2);
    downloadFile(`aniforge-projects-${Date.now()}.json`, data, 'application/json');
    pushToast('success', `已导出 ${projects.length} 个项目`);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const list = JSON.parse(String(reader.result));
        if (!Array.isArray(list)) throw new Error('invalid format');
        const { saveProject } = await import('@/lib/storage');
        for (const p of list) {
          if (p.id) await saveProject(p);
        }
        await useProjectStore.getState().init();
        pushToast('success', `已导入 ${list.length} 个项目`);
      } catch (err) {
        pushToast('error', '文件格式不正确');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="relative">
      <div className="grid-bg absolute inset-0 opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-2 text-[11px] font-mono text-neon-cyan mb-3">
          <Sparkles className="w-3.5 h-3.5" /> 设置
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">偏好与数据</h1>
        <p className="mt-3 text-fog">所有数据存储在你的浏览器,导入/导出即「云端等价」能力。</p>

        <div className="mt-10 space-y-6">
          <Section icon={Palette} title="外观">
            <SettingRow label="主题" hint="本期为深色主题(将推出 Light Mode)">
              <select className="bg-ink-700 border border-white/10 rounded px-2 py-1 text-[12px] outline-none" defaultValue="dark">
                <option value="dark">Dark · 墨黑</option>
                <option value="light" disabled>Light · 即将推出</option>
              </select>
            </SettingRow>
            <SettingRow label="主色强调" hint="用于关键帧/播放头/选中态">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-ember" />
                <span className="text-[12px] font-mono">#FF6A3D</span>
              </div>
            </SettingRow>
            <SettingRow label="网格" hint="编辑器默认显示网格">
              <ToggleSwitch defaultChecked />
            </SettingRow>
          </Section>

          <Section icon={Keyboard} title="快捷键">
            <SettingRow label="撤销 / 重做" hint="Ctrl/Cmd + Z · Shift + Ctrl/Cmd + Z">
              <span className="text-[11px] font-mono text-fog-dim">默认开启</span>
            </SettingRow>
            <SettingRow label="播放 / 暂停" hint="Space">
              <ToggleSwitch defaultChecked />
            </SettingRow>
            <SettingRow label="保存项目" hint="Ctrl/Cmd + S">
              <ToggleSwitch defaultChecked />
            </SettingRow>
          </Section>

          <Section icon={Save} title="项目数据">
            <SettingRow label="本地项目" hint="存储于浏览器 IndexedDB">
              <span className="text-[12px] font-mono text-fog-dim">{projects.length} 个</span>
            </SettingRow>
            <SettingRow label="导出全部" hint="下载 aniforge-projects-*.json">
              <button onClick={onExportAll} className="btn-press h-8 px-3 rounded-md bg-white/5 hover:bg-white/10 text-[12px] flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> 导出
              </button>
            </SettingRow>
            <SettingRow label="导入" hint="从 aniforge-projects-*.json 恢复">
              <label className="btn-press h-8 px-3 rounded-md bg-white/5 hover:bg-white/10 text-[12px] flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> 选择文件
                <input type="file" accept="application/json" onChange={onImport} className="hidden" />
              </label>
            </SettingRow>
            <SettingRow label="清空" hint="不可恢复,请先导出">
              {!confirmWipe ? (
                <button onClick={() => setConfirmWipe(true)} className="btn-press h-8 px-3 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[12px] flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> 清空全部
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-rose-300">确认清空?</span>
                  <button
                    onClick={async () => {
                      for (const p of projects) await removeProject(p.id);
                      setConfirmWipe(false);
                      pushToast('info', '已清空');
                    }}
                    className="h-7 px-2.5 rounded bg-rose-500 text-white text-[11px]"
                  >
                    确认
                  </button>
                  <button onClick={() => setConfirmWipe(false)} className="h-7 px-2.5 rounded bg-white/10 text-[11px]">取消</button>
                </div>
              )}
            </SettingRow>
          </Section>

          <Section icon={Bell} title="关于">
            <div className="p-4 rounded-xl bg-ink-700/40 border border-white/[0.05] text-[13px] text-fog leading-relaxed">
              AniForge v0.1 · 全部数据存储在你的浏览器,不上传任何内容。
              <br /> 引擎:React 18 + Vite 5 + Tailwind 3 + Zustand 5 + 自研 SVG / Live2D 内核。
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="h-11 px-4 flex items-center gap-2 border-b border-white/5">
        <Icon className="w-4 h-4 text-neon-cyan" />
        <span className="font-display text-[15px] font-semibold">{title}</span>
      </div>
      <div className="divide-y divide-white/[0.04]">{children}</div>
    </section>
  );
}

function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex-1">
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="text-[11px] text-fog-dim mt-0.5">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative w-10 h-5 rounded-full transition ${on ? 'bg-neon-cyan/40' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full transition ${on ? 'left-5 bg-neon-cyan' : 'left-0.5 bg-fog'}`}
      />
    </button>
  );
}
