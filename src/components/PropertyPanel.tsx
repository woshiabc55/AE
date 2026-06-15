import { Trash2, Copy } from 'lucide-react';
import { useStore } from '@/store';

export default function PropertyPanel() {
  const selectedId = useStore((s) => s.selectedNodeId);
  const node = useStore((s) => s.workflow.nodes.find((n) => n.id === selectedId) || null);
  const update = useStore((s) => s.updateNodeData);
  const remove = useStore((s) => s.removeNode);
  const providers = useStore((s) => s.providers);

  if (!node) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2.5 border-b border-edge">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">// PROPERTIES</div>
          <div className="text-[12px] text-text-secondary mt-0.5">未选择节点</div>
        </div>
        <div className="p-3 text-[11px] font-mono text-text-dim leading-relaxed">
          <p>在画布上点击节点以查看和编辑其属性。</p>
          <p className="mt-2 text-text-secondary">支持编辑项:</p>
          <ul className="mt-1 space-y-0.5">
            <li>· 节点标签</li>
            <li>· 模型 / Provider</li>
            <li>· Prompt / 温度 / Token 上限</li>
            <li>· 工具 / 表达式 / 静态值</li>
          </ul>
        </div>
      </div>
    );
  }

  const d = node.data;

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2.5 border-b border-edge flex items-center">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">// PROPERTIES</div>
          <div className="text-[13px] mt-0.5">{d.label}</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button className="btn-ghost" title="复制">
            <Copy className="w-3 h-3" />
          </button>
          <button className="btn-ghost !text-signal-red" onClick={() => remove(node.id)} title="删除">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-fade px-3 py-3 space-y-4">
        <Section title="基础">
          <Field label="标签">
            <input
              value={d.label || ''}
              onChange={(e) => update(node.id, { label: e.target.value })}
              className="ff-input"
            />
          </Field>
        </Section>

        {d.kind === 'llm' && (
          <>
            <Section title="模型">
              <Field label="Provider">
                <select
                  value={d.provider || 'mock'}
                  onChange={(e) => update(node.id, { provider: e.target.value })}
                  className="ff-input"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Model">
                <select
                  value={d.model || providers.find((p) => p.id === d.provider)?.models[0] || ''}
                  onChange={(e) => update(node.id, { model: e.target.value })}
                  className="ff-input"
                >
                  {(providers.find((p) => p.id === d.provider)?.models || []).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>
            <Section title="提示词">
              <Field label="System">
                <textarea
                  rows={2}
                  placeholder="系统提示词(可选)"
                  value={d.system || ''}
                  onChange={(e) => update(node.id, { system: e.target.value })}
                  className="ff-input font-mono"
                />
              </Field>
              <Field label="Prompt">
                <textarea
                  rows={4}
                  placeholder="用户提示词,可用 {{input}} 引用上游"
                  value={d.prompt || ''}
                  onChange={(e) => update(node.id, { prompt: e.target.value })}
                  className="ff-input font-mono"
                />
              </Field>
            </Section>
            <Section title="高级">
              <Field label="Temperature">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.05}
                    value={d.temperature ?? 0.7}
                    onChange={(e) => update(node.id, { temperature: Number(e.target.value) })}
                    className="flex-1 accent-signal-cyan"
                  />
                  <span className="font-mono text-[11px] text-text-secondary w-10 text-right">
                    {(d.temperature ?? 0.7).toFixed(2)}
                  </span>
                </div>
              </Field>
              <Field label="Max Tokens">
                <input
                  type="number"
                  value={d.maxTokens ?? 512}
                  onChange={(e) => update(node.id, { maxTokens: Number(e.target.value) })}
                  className="ff-input"
                />
              </Field>
            </Section>
          </>
        )}

        {d.kind === 'input' && (
          <Section title="内容">
            <Field label="静态值">
              <textarea
                rows={5}
                placeholder="填入文本,后续节点可引用"
                value={d.value || ''}
                onChange={(e) => update(node.id, { value: e.target.value })}
                className="ff-input font-mono"
              />
            </Field>
          </Section>
        )}

        {d.kind === 'tool' && (
          <Section title="工具">
            <Field label="工具名">
              <input
                value={d.tool || ''}
                onChange={(e) => update(node.id, { tool: e.target.value })}
                placeholder="如 http.get / search.web"
                className="ff-input"
              />
            </Field>
            <Field label="参数(JSON)">
              <textarea
                rows={4}
                placeholder='{"url": "https://..."}'
                className="ff-input font-mono"
                defaultValue=""
              />
            </Field>
          </Section>
        )}

        {d.kind === 'condition' && (
          <Section title="条件">
            <Field label="表达式(子串匹配)">
              <input
                value={d.expression || ''}
                onChange={(e) => update(node.id, { expression: e.target.value })}
                placeholder="上游包含该字符串则走 true 分支"
                className="ff-input"
              />
            </Field>
          </Section>
        )}

        {d.kind === 'output' && (
          <Section title="输出">
            <div className="text-[10.5px] font-mono text-text-dim">
              落点节点 — 接收上游文本,作为工作流的最终值。
            </div>
          </Section>
        )}

        <Section title="调试">
          <Field label="ID">
            <code className="text-[10.5px] font-mono text-text-secondary break-all">{node.id}</code>
          </Field>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label mb-1.5">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono text-text-dim">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
