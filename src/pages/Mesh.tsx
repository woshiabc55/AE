import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Plus, Trash2, RefreshCw, GitBranch, Link as LinkIcon, Unlink } from "lucide-react";
import { useProjectStore, uid } from "@/store/projectStore";
import { buildMeshFromLayers } from "@/engine/mesh/builder";
import type { MeshNode } from "@/types";
import { cn } from "@/lib/utils";

export default function Mesh() {
  const project = useProjectStore((s) => s.project);
  const layers = project.layers;
  const nodes = project.nodes;
  const setNodes = useProjectStore((s) => s.setNodes);
  const updateNode = useProjectStore((s) => s.updateNode);
  const bindNodeToLayer = useProjectStore((s) => s.bindNodeToLayer);
  const navigate = useNavigate();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nodes.length === 0 && layers.length > 0) {
      setNodes(buildMeshFromLayers(project));
    }
  }, [project.id]);

  const handleRebuild = () => {
    setNodes(buildMeshFromLayers(project));
  };

  const handleAddRoot = () => {
    setNodes([
      ...nodes,
      {
        id: uid(),
        name: "new_root",
        parentId: null,
        x: 0.5,
        y: 0.5,
        rotation: 0,
        scale: 1,
        boundLayerId: null,
        influence: 0.25,
        color: "#FF7AB6",
      },
    ]);
  };

  const handleAddChild = (parentId: string) => {
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;
    setNodes([
      ...nodes,
      {
        id: uid(),
        name: "child",
        parentId,
        x: parent.x + 0.05,
        y: parent.y + 0.05,
        rotation: 0,
        scale: 1,
        boundLayerId: null,
        influence: 0.2,
        color: "#7CC0FF",
      },
    ]);
  };

  const tree = useMemo(() => {
    const map = new Map<string, MeshNode & { children: MeshNode[] }>();
    nodes.forEach((n) => map.set(n.id, { ...n, children: [] }));
    const roots: (MeshNode & { children: MeshNode[] })[] = [];
    map.forEach((n) => {
      if (n.parentId && map.has(n.parentId)) {
        map.get(n.parentId)!.children.push(n);
      } else {
        roots.push(n);
      }
    });
    return roots;
  }, [nodes]);

  // 拖拽节点
  const onCanvasPointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNode(nodeId);
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (!draggingNode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    updateNode(draggingNode, { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  const onCanvasPointerUp = () => {
    setDraggingNode(null);
  };

  // 节点在画布上的像素位置
  const W = project.canvasWidth;
  const H = project.canvasHeight;
  const nodePx = (n: MeshNode) => ({ x: n.x * W, y: n.y * H });

  // 绘制树连接线
  const drawConnections = () => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
    nodes.forEach((n) => {
      if (n.parentId) {
        const p = nodes.find((x) => x.id === n.parentId);
        if (p) {
          const a = nodePx(p);
          const b = nodePx(n);
          lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, key: `${p.id}-${n.id}` });
        }
      }
    });
    return lines;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">03 · MESH</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">树形骨骼 · 自动绑定</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/layers")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> 上一步
          </button>
          <button onClick={handleRebuild} className="btn-butter">
            <RefreshCw className="w-4 h-4" /> 重新生成
          </button>
          <button
            onClick={() => navigate("/atlas")}
            disabled={nodes.length === 0}
            className="btn-primary"
          >
            下一步：像素展开 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[20rem_1fr_18rem] gap-3">
        {/* Tree */}
        <div className="panel p-3 flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-leaf" />
              <span className="text-display text-mist-50">节点树</span>
            </div>
            <button onClick={handleAddRoot} className="btn-ghost py-1 px-2 text-xs">
              <Plus className="w-3.5 h-3.5" /> 根
            </button>
          </div>
          <div className="flex-1 overflow-y-auto -mx-1 px-1">
            {tree.length === 0 && <div className="text-center text-mist-300 text-xs py-8 px-3">没有节点。先去分层页切分图层。</div>}
            {tree.map((r) => (
              <TreeNode
                key={r.id}
                node={r}
                depth={0}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
                onAddChild={handleAddChild}
                onDelete={(id) => setNodes(nodes.filter((n) => n.id !== id))}
                onReparent={(childId, parentId) => {
                  setNodes(nodes.map((n) => (n.id === childId ? { ...n, parentId } : n)));
                }}
                nodes={nodes}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          onPointerMove={onCanvasPointerMove}
          onPointerUp={onCanvasPointerUp}
          onPointerLeave={onCanvasPointerUp}
          className="panel relative overflow-hidden bg-ink-900"
          style={{
            backgroundImage:
              "linear-gradient(rgba(154,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(154,163,184,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div
              className="relative bg-ink-50 rounded-xl shadow-2xl"
              style={{ width: W, height: H, maxWidth: "100%", maxHeight: "100%", aspectRatio: `${W}/${H}` }}
            >
              {/* 图层预览（简化版，按节点绑定位置） */}
              {nodes.map((n) => {
                if (!n.boundLayerId) return null;
                const layer = layers.find((l) => l.id === n.boundLayerId);
                if (!layer || !layer.visible) return null;
                const px = nodePx(n);
                return (
                  <div
                    key={n.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: px.x - layer.width / 2,
                      top: px.y - layer.height / 2,
                      width: layer.width,
                      height: layer.height,
                      transform: `translate(${n.x * 0}px, ${n.y * 0}px)`,
                    }}
                  >
                    <img src={layer.pngDataUrl} className="w-full h-full" alt="" />
                  </div>
                );
              })}

              {/* 连接线 */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
              >
                {drawConnections().map((l) => (
                  <line
                    key={l.key}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke="#FFD66B"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    opacity={0.6}
                  />
                ))}
              </svg>

              {/* 节点 */}
              {nodes.map((n) => {
                const px = nodePx(n);
                const selected = selectedNodeId === n.id;
                return (
                  <button
                    key={n.id}
                    onPointerDown={(e) => onCanvasPointerDown(e, n.id)}
                    style={{ left: px.x - 8, top: px.y - 8 }}
                    className={cn(
                      "absolute w-4 h-4 rounded-full border-2 transition-transform cursor-move",
                      selected ? "scale-150 z-10" : "hover:scale-125"
                    )}
                  >
                    <span
                      className="block w-full h-full rounded-full"
                      style={{ background: n.color, borderColor: n.color === "#FFD66B" ? "#0B0F1A" : "#fff" }}
                    />
                    {selected && (
                      <span
                        className="absolute top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap bg-ink-700 text-mist-50"
                      >
                        {n.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="panel p-3 flex flex-col gap-3 min-h-0">
          <div className="text-display text-mist-50">节点属性</div>
          {selectedNodeId ? (
            <NodeProperties
              node={nodes.find((n) => n.id === selectedNodeId)!}
              layers={layers}
              allNodes={nodes}
              onUpdate={(p) => updateNode(selectedNodeId, p)}
              onBind={(layerId) => bindNodeToLayer(selectedNodeId, layerId)}
              onDelete={() => {
                setNodes(nodes.filter((n) => n.id !== selectedNodeId));
                setSelectedNodeId(null);
              }}
            />
          ) : (
            <div className="text-mist-300 text-xs py-4">点击画布上的节点查看属性</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
  onAddChild,
  onDelete,
  onReparent,
  nodes,
}: {
  node: MeshNode & { children: MeshNode[] };
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  onReparent: (childId: string, parentId: string | null) => void;
  nodes: MeshNode[];
}) {
  const [expanded, setExpanded] = useState(true);
  const selected = selectedId === node.id;
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer",
          selected ? "bg-sakura-400/15 ring-1 ring-sakura-400/40" : "hover:bg-ink-600/30"
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-4 h-4 text-mist-300 flex items-center justify-center text-xs"
        >
          {node.children.length > 0 ? (expanded ? "▾" : "▸") : "·"}
        </button>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: node.color }}
        />
        <span className="flex-1 text-xs font-mono text-mist-100 truncate" onClick={() => onSelect(node.id)}>
          {node.name}
        </span>
        <button
          onClick={() => onAddChild(node.id)}
          className="w-4 h-4 text-mist-300 hover:text-sakura-300 flex items-center justify-center"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(node.id)}
          className="w-4 h-4 text-mist-300 hover:text-flame flex items-center justify-center"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {expanded &&
        node.children.map((c) => (
          <TreeNode
            key={c.id}
            node={{ ...nodes.find((n) => n.id === c.id)!, children: [] } as any}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            onAddChild={onAddChild}
            onDelete={onDelete}
            onReparent={onReparent}
            nodes={nodes}
          />
        ))}
    </div>
  );
}

function NodeProperties({
  node,
  layers,
  allNodes,
  onUpdate,
  onBind,
  onDelete,
}: {
  node: MeshNode;
  layers: { id: string; name: string }[];
  allNodes: MeshNode[];
  onUpdate: (p: Partial<MeshNode>) => void;
  onBind: (layerId: string | null) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 text-xs font-mono text-mist-100">
      <div className="flex flex-col gap-1">
        <span className="label-cap">name</span>
        <input
          value={node.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="input"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="label-cap">x</span>
          <input
            type="number"
            step={0.01}
            min={0}
            max={1}
            value={node.x.toFixed(3)}
            onChange={(e) => onUpdate({ x: parseFloat(e.target.value) })}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="label-cap">y</span>
          <input
            type="number"
            step={0.01}
            min={0}
            max={1}
            value={node.y.toFixed(3)}
            onChange={(e) => onUpdate({ y: parseFloat(e.target.value) })}
            className="input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="label-cap">rotation</span>
          <input
            type="number"
            value={node.rotation}
            onChange={(e) => onUpdate({ rotation: parseFloat(e.target.value) })}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="label-cap">scale</span>
          <input
            type="number"
            step={0.05}
            value={node.scale.toFixed(2)}
            onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
            className="input"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="label-cap">parent</span>
        <select
          value={node.parentId ?? ""}
          onChange={(e) => onUpdate({ parentId: e.target.value || null })}
          className="input"
        >
          <option value="">— root —</option>
          {allNodes.filter((n) => n.id !== node.id).map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <span className="label-cap">bound layer</span>
        <div className="flex gap-1">
          <select
            value={node.boundLayerId ?? ""}
            onChange={(e) => onBind(e.target.value || null)}
            className="input flex-1"
          >
            <option value="">— none —</option>
            {layers.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <button onClick={() => onBind(null)} className="btn-ghost py-2 px-2" title="解绑">
            <Unlink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="label-cap">color</span>
        <input
          type="color"
          value={node.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="h-8 rounded-xl cursor-pointer bg-transparent border border-mist-100/10"
        />
      </div>
      <button onClick={onDelete} className="btn-ghost text-flame justify-center mt-2">
        <Trash2 className="w-3.5 h-3.5" /> 删除节点
      </button>
    </div>
  );
}
