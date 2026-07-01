import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";
import { SealButton } from "@/components/common/SealButton";
import {
  computeAncestors,
  computeDescendants,
  computeCounterfactual,
} from "@/projection/views/causalView";
import { motion } from "framer-motion";
import { Network, Home, GitBranch, Layers } from "lucide-react";
import type { EventId } from "@/types";
import { cn } from "@/lib/utils";

/** 因果图谱界面 — 事件时间轴 + 因果链路 + 反事实推演 */
export default function Chronicle() {
  const navigate = useNavigate();
  const { ctx, causal } = useGameStore();
  const [selected, setSelected] = useState<EventId | null>(null);
  const [mode, setMode] = useState<"graph" | "timeline">("graph");

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
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-gold-500/30">
            {(["graph", "timeline"] as const).map((m) => (
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
                {m === "graph" ? "链路" : "时间轴"}
              </button>
            ))}
          </div>
          <SealButton onClick={() => navigate("/")} className="px-3 py-1.5 text-xs">
            <Home size={12} />
          </SealButton>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* 图谱 / 时间轴 */}
        <section className="chronicle-frame relative overflow-hidden p-4">
          {causal.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-serif text-sm italic text-parchment-300/40">
                历史的因果链尚未展开，先推进几个回合…
              </p>
            </div>
          ) : mode === "graph" ? (
            <CausalGraphViz
              edges={causal.edges}
              nodes={causal.nodes}
              selected={selected}
              onSelect={setSelected}
              highlight={new Set([...ancestors, ...descendants])}
            />
          ) : (
            <TimelineView nodes={causal.nodes} selected={selected} onSelect={setSelected} />
          )}
        </section>

        {/* 节点详情 / 反事实推演 */}
        <aside className="chronicle-frame flex flex-col gap-3 p-4">
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
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function CausalGraphViz({
  edges,
  nodes,
  selected,
  onSelect,
  highlight,
}: {
  edges: { from: EventId; to: EventId }[];
  nodes: { id: EventId; type: string; turn: number; narrative?: string; source: string }[];
  selected: EventId | null;
  onSelect: (id: EventId) => void;
  highlight: Set<EventId>;
}) {
  // 按回合分层布局
  const byTurn = new Map<number, typeof nodes>();
  for (const n of nodes) {
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
      {/* 边：鎏金线 */}
      {edges.map((e, i) => {
        const a = pos.get(e.from);
        const b = pos.get(e.to);
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(201,162,75,0.3)"
            strokeWidth={1}
          />
        );
      })}
      {/* 节点 */}
      {nodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        const isSel = selected === n.id;
        const isHL = highlight.has(n.id);
        return (
          <g key={n.id} onClick={() => onSelect(n.id)} className="cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r={isSel ? 9 : 6}
              fill={isSel ? "#C9A24B" : isHL ? "#8B2E1F" : "#3A2E20"}
              stroke={isSel ? "#F5E9C8" : "rgba(201,162,75,0.5)"}
              strokeWidth={isSel ? 2 : 1}
            />
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              className="font-mono"
              fontSize={9}
              fill="rgba(232,220,192,0.5)"
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
}: {
  nodes: { id: EventId; type: string; turn: number; narrative?: string }[];
  selected: EventId | null;
  onSelect: (id: EventId) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto">
      {nodes.map((n) => (
        <button
          key={n.id}
          onClick={() => onSelect(n.id)}
          className={cn(
            "chronicle-entry text-left transition-all",
            selected === n.id && "border-gold-300 bg-gold-500/10"
          )}
        >
          <span className="font-mono text-[9px] text-gold-500/60">T{n.turn} · {n.type}</span>
          {n.narrative && (
            <p className="mt-0.5 font-serif text-xs text-parchment-200/80">{n.narrative}</p>
          )}
        </button>
      ))}
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
      className="flex flex-col gap-3"
    >
      <div className="border-b border-gold-500/20 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-gold-500/60">
          {event.type} · T{event.turn} · {event.source}
        </span>
        {event.narrative && (
          <p className="mt-1 font-serif text-sm italic text-parchment-200/90">
            {event.narrative}
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
