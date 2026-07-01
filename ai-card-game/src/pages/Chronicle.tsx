import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";
import { SealButton } from "@/components/common/SealButton";
import {
  computeAncestors,
  computeDescendants,
  computeCounterfactual,
} from "@/projection/views/causalView";
import { getUnresolvedSuspense, getEdgeWeight } from "@/engine/CausalGraph";
import type { CausalNodeView } from "@/projection/views/causalView";
import { motion } from "framer-motion";
import { Network, Home, GitBranch, Layers, Eye, EyeOff, Sparkles } from "lucide-react";
import type { EventId, NarrativeLayer } from "@/types";
import { cn } from "@/lib/utils";

/** 叙事层级配色 — 深度色阶 */
const LAYER_COLORS: Record<NarrativeLayer, { node: string; ring: string; label: string }> = {
  surface: { node: "#8B2E1F", ring: "rgba(232,220,192,0.5)", label: "表层·可见" },
  hidden: { node: "#7B5DAB", ring: "rgba(123,93,171,0.7)", label: "暗层·伏笔" },
  deep: { node: "#C9A24B", ring: "rgba(245,233,200,0.9)", label: "深层·真相" },
};

/** 因果图谱界面 — 本质重构：因果强度边 + 悬念闪烁 + 深度色阶 + 涟漪动画 */
export default function Chronicle() {
  const navigate = useNavigate();
  const { ctx, causal } = useGameStore();
  const [selected, setSelected] = useState<EventId | null>(null);
  const [mode, setMode] = useState<"graph" | "timeline" | "suspense">("graph");
  /** 悬念过滤：是否仅显示未揭示悬念 */
  const [showOnlySuspense, setShowOnlySuspense] = useState(false);

  const ancestors = useMemo(
    () => (ctx && selected ? computeAncestors(ctx, selected) : []),
    [ctx, selected]
  );
  const descendants = useMemo(
    () => (ctx && selected ? computeDescendants(ctx, selected) : []),
    [ctx, selected]
  );
  const counterfactual = useMemo(
    () => (ctx && selected ? computeCounterfactual(ctx, selected) : []),
    [ctx, selected]
  );
  const unresolvedSuspense = useMemo(
    () => (ctx ? getUnresolvedSuspense(ctx.graph) : []),
    [ctx]
  );

  if (!ctx) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="font-serif text-lg italic text-parchment-300/60">
          尚无对局，因果图谱为空。
        </p>
        <SealButton onClick={() => navigate("/")} className="px-6 py-2">
          <Home size={14} /> 返回开始
        </SealButton>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-4">
      <header className="chronicle-frame mb-4 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-gold-300" />
          <h1 className="gilt-title font-serif text-2xl">因果图谱</h1>
          <span className="font-mono text-[10px] uppercase tracking-wider text-gold-500/60">
            Causal Graph · {causal.nodes.length} 节点 · {causal.edges.length} 边
            {unresolvedSuspense.length > 0 && (
              <span className="ml-2 text-vermillion-400">· {unresolvedSuspense.length} 悬念</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* 悬念过滤开关 */}
          <button
            onClick={() => setShowOnlySuspense(!showOnlySuspense)}
            className={cn(
              "flex items-center gap-1 border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
              showOnlySuspense
                ? "border-vermillion-400/50 bg-vermillion-500/10 text-vermillion-300"
                : "border-gold-500/30 text-parchment-300/60 hover:text-vermillion-300"
            )}
          >
            {showOnlySuspense ? <Eye size={11} /> : <EyeOff size={11} />}
            悬念
          </button>
          <div className="flex border border-gold-500/30">
            {(["graph", "timeline", "suspense"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                  mode === m
                    ? "bg-gold-500/20 text-gold-200"
                    : "text-parchment-300/60 hover:text-gold-300"
                )}
              >
                {m === "graph" ? "链路" : m === "timeline" ? "时间轴" : "悬念"}
              </button>
            ))}
          </div>
          <SealButton onClick={() => navigate("/")} className="px-3 py-1.5 text-xs">
            <Home size={12} />
          </SealButton>
        </div>
      </header>

      {/* 图例 */}
      <div className="mb-2 flex items-center gap-4 px-2 font-mono text-[9px] text-parchment-300/50">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: LAYER_COLORS.surface.node }} />
          {LAYER_COLORS.surface.label}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: LAYER_COLORS.hidden.node }} />
          {LAYER_COLORS.hidden.label}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: LAYER_COLORS.deep.node }} />
          {LAYER_COLORS.deep.label}
        </span>
        <span className="ml-auto">边粗细 = 因果强度</span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* 图谱 / 时间轴 / 悬念视图 */}
        <section className="chronicle-frame scroll-cap relative max-h-[calc(100vh-200px)] overflow-hidden p-4">
          {causal.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-serif text-sm italic text-parchment-300/40">
                历史的因果链尚未展开，先推进几个回合…
              </p>
            </div>
          ) : mode === "graph" ? (
            <CausalGraphViz
              graph={ctx.graph}
              edges={causal.edges}
              nodes={causal.nodes}
              selected={selected}
              onSelect={setSelected}
              highlight={new Set([...ancestors, ...descendants])}
              showOnlySuspense={showOnlySuspense}
            />
          ) : mode === "timeline" ? (
            <TimelineView
              nodes={causal.nodes}
              selected={selected}
              onSelect={setSelected}
              showOnlySuspense={showOnlySuspense}
            />
          ) : (
            <SuspenseView
              suspenseEvents={unresolvedSuspense}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </section>

        {/* 节点详情 / 反事实推演 */}
        <aside className="chronicle-frame scroll-cap flex max-h-[calc(100vh-200px)] flex-col p-4">
          {selected ? (
            <NodeDetail
              ctx={ctx}
              selected={selected}
              ancestors={ancestors}
              descendants={descendants}
              counterfactual={counterfactual}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <GitBranch size={24} className="text-gold-500/40" />
              <p className="font-serif text-xs italic text-parchment-300/50">
                点击节点查看因果链
                <br />
                与反事实推演
              </p>
              {unresolvedSuspense.length > 0 && (
                <p className="mt-2 font-serif text-[11px] text-vermillion-400/70">
                  {unresolvedSuspense.length} 个悬念待解
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function CausalGraphViz({
  graph,
  edges,
  nodes,
  selected,
  onSelect,
  highlight,
  showOnlySuspense,
}: {
  graph: import("@/types").CausalGraph;
  edges: { from: EventId; to: EventId }[];
  nodes: CausalNodeView[];
  selected: EventId | null;
  onSelect: (id: EventId) => void;
  highlight: Set<EventId>;
  showOnlySuspense: boolean;
}) {
  // 过滤：仅显示悬念
  const visibleNodes = showOnlySuspense
    ? nodes.filter((n) => n.suspense && !n.suspense.revealed)
    : nodes;
  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  // 按回合分层布局
  const byTurn = new Map<number, CausalNodeView[]>();
  for (const n of visibleNodes) {
    const arr = byTurn.get(n.turn) ?? [];
    arr.push(n);
    byTurn.set(n.turn, arr);
  }
  const turns = Array.from(byTurn.keys()).sort((a, b) => a - b);
  const W = 900;
  const H = Math.max(300, turns.length * 90);
  const pos = new Map<EventId, { x: number; y: number }>();
  turns.forEach((t, ti) => {
    const arr = byTurn.get(t)!;
    arr.forEach((n, ni) => {
      pos.set(n.id, {
        x: 60 + ti * ((W - 120) / Math.max(1, turns.length - 1)),
        y: H / 2 + (ni - (arr.length - 1) / 2) * 70,
      });
    });
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      {/* 边：粗细=因果强度，颜色=层级 */}
      {edges.map((e, i) => {
        if (!visibleIds.has(e.from) && !visibleIds.has(e.to)) return null;
        const a = pos.get(e.from);
        const b = pos.get(e.to);
        if (!a || !b) return null;
        const weight = getEdgeWeight(graph, e.from, e.to);
        const child = graph.nodes.get(e.to);
        const layer = child?.narrativeLayer ?? "surface";
        const color = LAYER_COLORS[layer];
        const strokeWidth = 0.5 + weight * 3;
        const opacity = 0.2 + weight * 0.5;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={color.node}
            strokeWidth={strokeWidth}
            strokeOpacity={opacity}
          />
        );
      })}
      {/* 节点 */}
      {visibleNodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        const isSel = selected === n.id;
        const isHL = highlight.has(n.id);
        const layer = n.narrativeLayer ?? "surface";
        const color = LAYER_COLORS[layer];
        const hasSuspense = n.suspense && !n.suspense.revealed;
        const radius = isSel ? 10 : hasSuspense ? 8 : 6;
        return (
          <g key={n.id} onClick={() => onSelect(n.id)} className="cursor-pointer">
            {/* 悬念闪烁光环 */}
            {hasSuspense && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={radius + 4}
                fill="none"
                stroke={color.ring}
                strokeWidth={1.5}
                animate={{ r: [radius + 2, radius + 6, radius + 2], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {/* 涟漪动画（选中时） */}
            {isSel && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={radius}
                fill="none"
                stroke={color.ring}
                strokeWidth={2}
                animate={{ r: [radius, radius + 12], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={radius}
              fill={isSel ? color.ring : color.node}
              stroke={isSel ? "#F5E9C8" : isHL ? color.ring : "rgba(201,162,75,0.4)"}
              strokeWidth={isSel ? 2 : 1}
            />
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              className="font-mono"
              fontSize={9}
              fill={hasSuspense ? "rgba(232,180,100,0.9)" : "rgba(232,220,192,0.5)"}
            >
              T{n.turn}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TimelineView({
  nodes,
  selected,
  onSelect,
  showOnlySuspense,
}: {
  nodes: CausalNodeView[];
  selected: EventId | null;
  onSelect: (id: EventId) => void;
  showOnlySuspense: boolean;
}) {
  const visible = showOnlySuspense
    ? nodes.filter((n) => n.suspense && !n.suspense.revealed)
    : nodes;
  return (
    <div className="scroll-gilt flex h-full flex-col gap-1 overflow-y-auto pr-2">
      {visible.map((n) => {
        const layer = n.narrativeLayer ?? "surface";
        const color = LAYER_COLORS[layer];
        const hasSuspense = n.suspense && !n.suspense.revealed;
        return (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className={cn(
              "chronicle-entry text-left transition-all",
              selected === n.id && "border-gold-300 bg-gold-500/10"
            )}
            style={{ borderLeftColor: hasSuspense ? color.node : undefined }}
          >
            <span className="font-mono text-[9px] text-gold-500/60">
              T{n.turn} · {n.type}
              {layer !== "surface" && (
                <span style={{ color: color.node }}> · {color.label}</span>
              )}
              {hasSuspense && " · ❓"}
            </span>
            {n.narrative && (
              <p className="mt-0.5 font-serif text-xs text-parchment-200/80">{n.narrative}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** 悬念视图 — 专门展示未解之谜 */
function SuspenseView({
  suspenseEvents,
  selected,
  onSelect,
}: {
  suspenseEvents: import("@/types").GameEvent[];
  selected: EventId | null;
  onSelect: (id: EventId) => void;
}) {
  if (suspenseEvents.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Sparkles size={24} className="text-gold-500/40" />
        <p className="font-serif text-sm italic text-parchment-300/50">
          无未解悬念
          <br />
          历史的真相皆已显现
        </p>
      </div>
    );
  }
  return (
    <div className="scroll-gilt flex h-full flex-col gap-2 overflow-y-auto pr-2">
      {suspenseEvents.map((e) => {
        const isSel = selected === e.id;
        return (
          <motion.button
            key={e.id}
            onClick={() => onSelect(e.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "border border-vermillion-500/30 bg-ink-900/60 p-3 text-left transition-all",
              isSel && "border-gold-300 bg-gold-500/10"
            )}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-vermillion-400"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="font-mono text-[9px] uppercase tracking-wider text-vermillion-400">
                T{e.turn} · 悬念
              </span>
            </div>
            {e.suspense && (
              <p className="mt-1 font-serif text-sm italic text-parchment-200/90">
                {e.suspense.question}
              </p>
            )}
            {e.narrative && (
              <p className="mt-1 font-serif text-[11px] text-parchment-300/60">
                {e.narrative}
              </p>
            )}
            {e.suspense?.revealByTurn && (
              <p className="mt-1 font-mono text-[9px] text-gold-500/50">
                预计 T{e.suspense.revealByTurn} 揭示
              </p>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function NodeDetail({
  ctx,
  selected,
  ancestors,
  descendants,
  counterfactual,
}: {
  ctx: NonNullable<ReturnType<typeof useGameStore.getState>["ctx"]>;
  selected: EventId;
  ancestors: EventId[];
  descendants: EventId[];
  counterfactual: EventId[];
}) {
  const event = ctx.graph.nodes.get(selected);
  if (!event) return null;
  return (
    <motion.div
      key={selected}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="scroll-gilt flex flex-1 flex-col gap-3 overflow-y-auto pr-2"
    >
      <div className="border-b border-gold-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-gold-500/60">
            {event.type} · T{event.turn} · {event.source}
          </span>
          {event.narrativeLayer && event.narrativeLayer !== "surface" && (
            <span
              className="border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
              style={{
                borderColor: LAYER_COLORS[event.narrativeLayer].node,
                color: LAYER_COLORS[event.narrativeLayer].node,
              }}
            >
              {LAYER_COLORS[event.narrativeLayer].label}
            </span>
          )}
          {event.causalWeight !== undefined && (
            <span className="ml-auto font-mono text-[9px] text-gold-500/50">
              因果强度 {(event.causalWeight * 100).toFixed(0)}%
            </span>
          )}
        </div>
        {event.narrative && (
          <p className="mt-1 font-serif text-sm italic text-parchment-200/90">
            {event.narrative}
          </p>
        )}
        {/* 悬念信息 */}
        {event.suspense && (
          <div className="mt-2 border border-vermillion-500/30 bg-vermillion-500/5 p-2">
            <p className="font-serif text-xs italic text-vermillion-300">
              ❓ {event.suspense.question}
            </p>
            {event.suspense.revealByTurn && (
              <p className="mt-1 font-mono text-[9px] text-gold-500/50">
                预计 T{event.suspense.revealByTurn} 揭示 · {event.suspense.revealed ? "已揭示" : "未揭示"}
              </p>
            )}
          </div>
        )}
        {/* 伏笔/揭示链 */}
        {event.foreshadows && event.foreshadows.length > 0 && (
          <p className="mt-1 font-mono text-[9px] text-purple-400/60">
            埋伏笔 → {event.foreshadows.length} 个后续揭示
          </p>
        )}
        {event.reveals && event.reveals.length > 0 && (
          <p className="mt-1 font-mono text-[9px] text-gold-400/60">
            揭示 ← {event.reveals.length} 个前置伏笔
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="gilt-title font-serif text-xs uppercase tracking-widest">祖先链</h4>
        {ancestors.length === 0 ? (
          <p className="font-mono text-[10px] text-parchment-300/40">无（根事件）</p>
        ) : (
          ancestors.map((id) => <MiniNode key={id} id={id} ctx={ctx} />)
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="gilt-title font-serif text-xs uppercase tracking-widest">后续影响</h4>
        {descendants.length === 0 ? (
          <p className="font-mono text-[10px] text-parchment-300/40">无（叶节点）</p>
        ) : (
          descendants.map((id) => <MiniNode key={id} id={id} ctx={ctx} />)
        )}
      </div>

      <div className="border-t border-vermillion-500/30 pt-2">
        <h4 className="flex items-center gap-1 font-serif text-xs uppercase tracking-widest text-vermillion-400">
          <Layers size={12} /> 反事实推演
        </h4>
        <p className="mt-1 font-serif text-[11px] italic text-parchment-300/60">
          若此事件未曾发生，其下 {counterfactual.length} 个事件将受影响。
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {counterfactual.slice(0, 8).map((id) => (
            <span
              key={id}
              className="border border-vermillion-500/30 px-1.5 py-0.5 font-mono text-[9px] text-vermillion-400/70"
            >
              {id.slice(-6)}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MiniNode({ id, ctx }: { id: EventId; ctx: NonNullable<ReturnType<typeof useGameStore.getState>["ctx"]> }) {
  const e = ctx.graph.nodes.get(id);
  return (
    <div className="border-l border-gold-500/30 bg-ink-900/40 px-2 py-1">
      <span className="font-mono text-[9px] text-gold-500/60">T{e?.turn} · {e?.type}</span>
      {e?.narrative && (
        <p className="font-serif text-[11px] text-parchment-300/70">{e.narrative.slice(0, 40)}…</p>
      )}
    </div>
  );
}
