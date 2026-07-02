import { useGameStore } from "@/store/useGameStore";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function HUD() {
  const resonance = useGameStore((s) => s.stats.resonance);
  const echoesCollected = useGameStore((s) => s.stats.echoesCollected);
  const echoesTotal = useGameStore((s) => s.stats.echoesTotal);
  const level = useGameStore((s) => s.stats.level);
  const levelName = useGameStore((s) => s.stats.levelName);
  const elapsed = useGameStore((s) => s.stats.elapsedSec);
  const banner = useGameStore((s) => s.banner);
  const fragment = useGameStore((s) => s.fragment);
  const damageFlash = useGameStore((s) => s.damageFlash);
  const collectFlash = useGameStore((s) => s.collectFlash);
  const heartbeat = useGameStore((s) => s.heartbeat);
  const sprinting = useGameStore((s) => s.sprinting);
  const levelCount = useGameStore((s) => s.levelCount);
  const ammo = useGameStore((s) => s.stats.ammo);
  const maxAmmo = useGameStore((s) => s.stats.maxAmmo);
  const kills = useGameStore((s) => s.stats.kills);
  const hitMarker = useGameStore((s) => s.hitMarker);
  const aimingAtEnemy = useGameStore((s) => s.aimingAtEnemy);

  const low = resonance <= 30;
  const segs = 10;
  const filled = Math.round((resonance / 100) * segs);
  const now = Date.now();
  const showHit = now - hitMarker < 160;

  // 准星颜色优先级：瞄准敌对 > 残响低 > 冲刺 > 默认
  const crossColor = aimingAtEnemy
    ? "bg-warn-500"
    : low
      ? "bg-warn-500"
      : sprinting
        ? "bg-echo-400"
        : "bg-resonance-400/80";
  const crossCenter = aimingAtEnemy || low ? "bg-warn-500" : sprinting ? "bg-echo-400" : "bg-resonance-400";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {/* 受伤红屏（脉冲式暗角） */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: damageFlash,
          background:
            "radial-gradient(ellipse at center, rgba(255,59,92,0) 30%, rgba(255,59,92,0.55) 100%)",
        }}
      />

      {/* 收集金光闪烁 */}
      <div
        className="absolute inset-0"
        style={{
          opacity: collectFlash * 0.35,
          background:
            "radial-gradient(ellipse at center, rgba(255,216,107,0.4) 0%, rgba(255,216,107,0) 60%)",
        }}
      />

      {/* 心跳：暗影接近时的红色脉冲暗角 */}
      {heartbeat > 0.05 && (
        <div
          className="absolute inset-0 animate-heartbeat"
          style={{
            opacity: heartbeat * 0.5,
            background:
              "radial-gradient(ellipse at center, rgba(255,59,92,0) 45%, rgba(120,10,30,0.6) 100%)",
          }}
        />
      )}

      {/* 左上：关卡 + 计时 + 进度 */}
      <div className="absolute left-5 top-5">
        <p className="font-pixel text-[10px] text-resonance-400/70">
          LV {level.toString().padStart(2, "0")} / {levelCount.toString().padStart(2, "0")}
        </p>
        <p className="font-term text-2xl text-resonance-400 text-glow-reso leading-tight">
          {levelName}
        </p>
        <p className="font-term text-xl text-resonance-400/60">{formatTime(elapsed)}</p>
      </div>

      {/* 右上：回响进度 */}
      <div className="absolute right-5 top-5 text-right">
        <p className="font-pixel text-[10px] text-echo-400/70 mb-1">ECHO</p>
        <p className="font-term text-3xl text-echo-400 text-glow-echo leading-none">
          {echoesCollected}
          <span className="text-echo-400/50 text-2xl"> / {echoesTotal}</span>
        </p>
        <div className="mt-1 flex justify-end gap-[3px]">
          {Array.from({ length: echoesTotal }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 ${
                i < echoesCollected ? "bg-echo-500 shadow-glowEcho" : "bg-echo-500/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 中央十字准星 + 命中标记 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-5 w-5">
          <div className={`absolute left-1/2 top-0 h-5 w-[2px] -translate-x-1/2 ${crossColor}`} />
          <div className={`absolute top-1/2 left-0 h-[2px] w-5 -translate-y-1/2 ${crossColor}`} />
          <div
            className={`absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 ${crossCenter}`}
          />
          {/* 命中标记：四条斜线 X */}
          {showHit && (
            <>
              <div className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-echo-400 shadow-glowEcho" />
              <div className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-echo-400 shadow-glowEcho" />
            </>
          )}
        </div>
      </div>

      {/* 左下：残响值条 + 冲刺指示 */}
      <div className="absolute left-5 bottom-5 w-60">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`font-pixel text-[10px] ${
              low ? "text-warn-500 text-glow-warn animate-flicker" : "text-resonance-400"
            }`}
          >
            RESONANCE
          </span>
          {sprinting && (
            <span className="font-pixel text-[9px] text-echo-400 text-glow-echo ml-auto animate-flicker">
              SPRINT
            </span>
          )}
        </div>
        <div className={`flex gap-[3px] ${low ? "animate-flicker" : ""}`}>
          {Array.from({ length: segs }).map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 ${
                i < filled
                  ? low
                    ? "bg-warn-500 shadow-glowEcho"
                    : "bg-resonance-500"
                  : "bg-void-700 border border-void-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 右下：心跳预警 */}
      {heartbeat > 0.15 && (
        <div className="absolute right-5 bottom-5 flex items-center gap-2 animate-flicker">
          <span className="font-pixel text-[9px] text-warn-500 text-glow-warn">
            {!low ? "NEAR" : "DANGER"}
          </span>
          <div className="relative h-4 w-4">
            <div className="absolute inset-0 bg-warn-500 animate-heartbeat-pulse" />
          </div>
        </div>
      )}

      {/* 底部横幅 */}
      {banner && (
        <div className="absolute left-1/2 bottom-16 -translate-x-1/2 text-center animate-fade-in">
          <p className="font-pixel text-xs text-rift-500 text-glow-rift">{banner}</p>
        </div>
      )}

      {/* 记忆碎片文字（收集回响时） */}
      {fragment && (
        <div className="absolute left-1/2 top-[62%] -translate-x-1/2 max-w-[80vw] text-center animate-fade-in">
          <p className="font-term text-xl text-echo-400 text-glow-echo italic leading-relaxed">
            {fragment}
          </p>
        </div>
      )}
    </div>
  );
}
