import { useGameStore } from "@/store/useGameStore";
import { parseMap, CELL } from "@/game/maps";

// 小地图：俯视，显示墙体、据点、队友、可见敌人
export function Minimap() {
  const enemies = useGameStore((s) => s.enemiesOnRadar);
  const allies = useGameStore((s) => s.teammatesOnRadar);
  const match = useGameStore((s) => s.match);

  const parsed = parseMap();
  const { cols, rows, capture } = parsed;
  // 小地图尺寸
  const SIZE = 132;
  const scale = SIZE / (Math.max(cols, rows) * CELL);

  // 世界 -> 小地图坐标（中心对齐）
  const w2m = (x: number, z: number) => ({
    x: SIZE / 2 + x * scale,
    y: SIZE / 2 + z * scale,
  });

  // 收集墙格矩形
  const wallRects: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (parsed.grid[r][c] === 1) {
        const wx = (c - cols / 2 + 0.5) * CELL;
        const wz = (r - rows / 2 + 0.5) * CELL;
        const p = w2m(wx, wz);
        wallRects.push(p);
      }
    }
  }
  const cap = w2m(capture.x, capture.z);

  return (
    <div
      className="relative border-2 border-tac-500/50 bg-void-950/80 shadow-glowTac"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* 墙体 */}
      {wallRects.map((p, i) => (
        <div
          key={i}
          className="absolute bg-void-600"
          style={{
            left: p.x - (CELL * scale) / 2,
            top: p.y - (CELL * scale) / 2,
            width: CELL * scale,
            height: CELL * scale,
          }}
        />
      ))}
      {/* 据点 */}
      <div
        className="absolute rounded-full border-2 border-gold-500"
        style={{
          left: cap.x - 8,
          top: cap.y - 8,
          width: 16,
          height: 16,
          background:
            match.captureOwner === "alpha"
              ? "rgba(58,140,255,0.4)"
              : match.captureOwner === "bravo"
                ? "rgba(255,59,92,0.4)"
                : "rgba(255,216,107,0.3)",
        }}
      />
      {/* 队友(蓝) */}
      {allies.map((a, i) => {
        const p = w2m(a.x, a.z);
        return (
          <div
            key={`a${i}`}
            className="absolute h-[5px] w-[5px] bg-alpha-400 shadow-glowAlpha"
            style={{ left: p.x - 2, top: p.y - 2 }}
          />
        );
      })}
      {/* 敌人(红) */}
      {enemies.map((e, i) => {
        const p = w2m(e.x, e.z);
        return (
          <div
            key={`e${i}`}
            className="absolute h-[5px] w-[5px] bg-bravo-500 shadow-glowBravo animate-flicker"
            style={{ left: p.x - 2, top: p.y - 2 }}
          />
        );
      })}
      {/* 玩家(中心三角青) */}
      <div
        className="absolute h-[6px] w-[6px] bg-tac-400 shadow-glowTac"
        style={{ left: SIZE / 2 - 3, top: SIZE / 2 - 3 }}
      />
    </div>
  );
}
