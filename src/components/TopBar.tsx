import { useState } from 'react';
import { useStore, nodeDefinitions } from '@/store';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FolderOpen,
  Save,
  Library,
  Settings,
  Layers,
  Activity,
  Hexagon,
  Play,
  Square,
} from 'lucide-react';
import { saveFramework, startRun, subscribeRun, abortRun } from '@/api';
import type { NodeData, RunEvent } from '@/types';

export default function TopBar() {
  const wf = useStore((s) => s.workflow);
  const setWorkflow = useStore((s) => s.setWorkflow);
  const reset = useStore((s) => s.resetWorkflow);
  const addNode = useStore((s) => s.addNode);
  const setSelected = useStore((s) => s.setSelected);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const isRunning = useStore((s) => s.isRunning);
  const runId = useStore((s) => s.runId);
  const setRunning = useStore((s) => s.setRunning);
  const clearStatuses = useStore((s) => s.clearStatuses);
  const setNodeStatus = useStore((s) => s.setNodeStatus);
  const updateNodeData = useStore((s) => s.updateNodeData);
  const appendLog = useStore((s) => s.appendLog);
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleAdd = (kind: NodeData['kind']) => {
    const def = nodeDefinitions.find((d) => d.kind === kind)!;
    const id = addNode(
      {
        kind: def.kind,
        label: def.label,
        ...(def.kind === 'llm'
          ? { provider: 'mock', model: 'mock-pro', prompt: '请基于以下输入给出简洁总结:', temperature: 0.7, maxTokens: 512 }
          : {}),
        ...(def.kind === 'input' ? { value: '在此输入你的内容' } : {}),
        ...(def.kind === 'tool' ? { tool: 'http.get' } : {}),
        ...(def.kind === 'condition' ? { expression: 'success' } : {}),
      },
      { x: 220 + Math.random() * 200, y: 160 + Math.random() * 200 },
    );
    setSelected(id);
  };

  const handleSaveFramework = async () => {
    setSaving(true);
    try {
      const name = prompt('框架名称', wf.name);
      if (!name) return;
      const id = 'fw_' + Date.now().toString(36);
      await saveFramework({ ...wf, id, name });
      appendLog({ level: 'info', message: `✔ 框架「${name}」已保存 (${id})` });
    } catch (e) {
      appendLog({ level: 'error', message: '✘ 保存失败' });
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    if (isRunning || wf.nodes.length === 0) return;
    clearStatuses();
    appendLog({ level: 'info', message: `▶ 启动执行 — ${wf.nodes.length} 个节点` });
    const inputs: Record<string, string> = {};
    wf.nodes.forEach((n) => {
      if (n.data.kind === 'input' && n.data.value) inputs[n.id] = n.data.value;
    });
    try {
      const { runId: id } = await startRun(wf, inputs);
      setRunning(id);
      const unsub = subscribeRun(id, (e: RunEvent) => {
        if (e.type === 'node-start') {
          setNodeStatus(e.nodeId, 'running');
        } else if (e.type === 'token') {
          const cur = useStore.getState().workflow.nodes.find((n) => n.id === e.nodeId)?.data?.output || '';
          updateNodeData(e.nodeId, { output: cur + e.text });
        } else if (e.type === 'node-end') {
          setNodeStatus(e.nodeId, 'success');
          updateNodeData(e.nodeId, { output: e.payload?.text });
        } else if (e.type === 'error') {
          setNodeStatus(e.nodeId || '', 'error');
        } else if (e.type === 'end') {
          setRunning(null);
          unsub();
        }
      });
    } catch (err) {
      appendLog({ level: 'error', message: '✘ 启动失败:后端未就绪' });
    }
  };

  const handleAbort = async () => {
    if (!runId) return;
    await abortRun(runId);
    setRunning(null);
  };

  return (
    <div className="h-12 px-3 flex items-center gap-2 border-b border-edge bg-ink-900/80 backdrop-blur-md relative scanline">
      {/* Brand */}
      <div className="flex items-center gap-2 pr-2 mr-1 border-r border-edge">
        <div className="w-7 h-7 rounded bg-gradient-to-br from-signal-cyan/20 to-signal-magenta/20 border border-edge flex items-center justify-center">
          <Hexagon className="w-4 h-4 text-signal-cyan" />
        </div>
        <div>
          <div className="text-[13px] font-display font-semibold tracking-wide">FLOWFORGE</div>
          <div className="text-[9px] font-mono text-text-dim -mt-0.5">v0.1 · workflow forge</div>
        </div>
      </div>

      {/* File menu */}
      <Menu label="文件">
        <Item icon={<Plus className="w-3.5 h-3.5" />} label="新建" k="⌘N" onClick={() => reset()} />
        <Item icon={<FolderOpen className="w-3.5 h-3.5" />} label="打开 .ff..." k="⌘O" onClick={() => nav('/library')} />
        <Item
          icon={<Save className="w-3.5 h-3.5" />}
          label={saving ? '保存中...' : '保存为框架'}
          k="⌘S"
          onClick={handleSaveFramework}
        />
      </Menu>

      {/* Add node menu */}
      <Menu label="+ 节点">
        {nodeDefinitions.map((def) => (
          <Item
            key={def.kind}
            label={`${def.label} (${def.kind})`}
            onClick={() => handleAdd(def.kind)}
          />
        ))}
      </Menu>

      {/* Nav */}
      <div className="flex items-center gap-1 ml-2">
        <button className="btn-ghost" onClick={() => nav('/library')}>
          <Library className="w-3.5 h-3.5" /> 框架库
        </button>
        <button className="btn-ghost" onClick={() => nav('/settings')}>
          <Settings className="w-3.5 h-3.5" /> 设置
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Mode switcher */}
        <div className="panel rounded-md h-7 flex items-stretch p-0.5">
          <button
            onClick={() => setMode('design')}
            className={`px-2.5 h-6 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
              mode === 'design' ? 'bg-ink-700 text-signal-cyan' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Layers className="w-3 h-3" /> 设计
          </button>
          <button
            onClick={() => setMode('runtime')}
            className={`px-2.5 h-6 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
              mode === 'runtime' ? 'bg-ink-700 text-signal-magenta' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Activity className="w-3 h-3" /> 运行时
          </button>
        </div>

        {/* Run button */}
        {!isRunning ? (
          <button className="btn-primary" onClick={handleRun} disabled={wf.nodes.length === 0}>
            <Play className="w-3.5 h-3.5" /> 运行
          </button>
        ) : (
          <button className="btn !text-signal-red !border-signal-red/40" onClick={handleAbort}>
            <Square className="w-3.5 h-3.5" /> 停止
          </button>
        )}
      </div>
    </div>
  );
}

function Menu({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button className="btn-ghost" onClick={() => setOpen((v) => !v)} onMouseEnter={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 panel-strong rounded-md min-w-[200px] py-1 animate-fadeUp">
          {children}
        </div>
      )}
    </div>
  );
}

function Item({ icon, label, k, onClick }: { icon?: React.ReactNode; label: string; k?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2.5 py-1.5 text-[12px] font-mono flex items-center gap-2 hover:bg-ink-700/60 text-text-primary"
    >
      {icon}
      <span className="flex-1">{label}</span>
      {k && <span className="text-[10px] text-text-dim">{k}</span>}
    </button>
  );
}
