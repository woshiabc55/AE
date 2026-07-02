import { useGameStore } from "@/store/useGameStore";
import { Minimap } from "./Minimap";
import { OPERATORS } from "@/game/operators";

const OP_LABEL: Record<string, string> = {
  assault: "突击",
  recon: "侦察",
  support: "支援",
};

export function HUD() {
  const hp = useGameStore((s) => s.hp);
  const maxHp = useGameStore((s) => s.maxHp);
  const ammo = useGameStore((s) => s.ammo);
  const magSize = useGameStore((s) => s.magSize);
  const reserveAmmo = useGameStore((s) => s.reserveAmmo);
  const reloading = useGameStore((s) => s.reloading);
  const kills = useGameStore((s) => s.kills);
  const deaths = useGameStore((s) => s.deaths);
  const alive = useGameStore((s) => s.alive);
  const respawnTimer = useGameStore((s) => s.respawnTimer);
  const teammates = useGameStore((s) => s.teammates);
  const match = useGameStore((s) => s.match);
  const damageFlash = useGameStore((s) => s.damageFlash);
  const hitMarker = useGameStore((s) => s.hitMarker);
  const killMarker = useGameStore((s) => s.killMarker);
  const aimingAtEnemy = useGameStore((s) => s.aimingAtEnemy);
  const banner = useGameStore((s) => s.banner);
  const selectedOp = useGameStore((s) => s.selectedOp);
  const ads = useGameStore((s) => s.ads);
  const weaponName = useGameStore((s) => s.weaponName);

  const hpPct = Math.max(0, (hp / maxHp) * 100);
  const hpLow = hpPct <= 30;
  const now = Date.now();
  const showHit = now - hitMarker < 180;
  const showKill = now - killMarker < 900;
  // 占领进度归一到 0..1（中心为 0.5）
  const capPct = (match.captureProgress + 100) / 200;
  const capOwnerColor =
    match.captureOwner === "alpha"
      ? "bg-alpha-500"
      : match.captureOwner === "bravo"
        ? "bg-bravo-500"
        : "bg-gold-500";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {/* 受伤红屏暗角 */}
      <div
        className="absolute inset-0"
        style={{
          opacity: damageFlash,
          background:
            "radial-gradient(ellipse at center, rgba(255,59,92,0) 30%, rgba(255,59,92,0.55) 100%)",
        }}
      />

      {/* 顶部中央：据点占领 + 双方票数 + 回合分 */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <div className="flex items-center gap-4">
          {/* 友军票数 */}
          <div className="text-right">
            <div className="font-pixel text-[9px] text-alpha-400/70">ALPHA</div>
            <div className="font-term text-2xl text-alpha-400 text-glow-alpha leading-none">
              {match.ticketsAlpha}
            </div>
          </div>
          {/* 回合分 */}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-3 w-3 border border-alpha-500 ${i < match.scoreAlpha ? "bg-alpha-500 shadow-glowAlpha" : "bg-void-800"}`}
              />
            ))}
            <span className="font-pixel text-[10px] text-tac-400/60 mx-2">VS</span>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-3 w-3 border border-bravo-500 ${i < match.scoreBravo ? "bg-bravo-500 shadow-glowBravo" : "bg-void-800"}`}
              />
            ))}
          </div>
          {/* 敌军票数 */}
          <div className="text-left">
            <div className="font-pixel text-[9px] text-bravo-400/70">BRAVO</div>
            <div className="font-term text-2xl text-bravo-400 text-glow-bravo leading-none">
              {match.ticketsBravo}
            </div>
          </div>
        </div>
        {/* 占领进度条 */}
        <div className="mt-1 relative h-3 w-72 border border-void-600 bg-void-900">
          {/* 中心刻度 */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-void-600" />
          <div
            className={`absolute top-0 h-full ${capOwnerColor} transition-all`}
            style={{
              left: match.captureProgress >= 0 ? "50%" : `${capPct * 100}%`,
              width: `${Math.abs(match.captureProgress) / 2}%`,
            }}
          />
        </div>
        <div className="mt-1 text-center font-pixel text-[8px] text-gold-400/70">
          {match.phase === "prep"
            ? `准备 ${Math.ceil(match.phaseTimer)}s`
            : match.phase === "roundOver"
              ? "回合结算"
              : "据点争夺"}
        </div>
      </div>

      {/* 左上：队友状态 */}
      <div className="absolute left-4 top-4 flex flex-col gap-1">
        <div className="font-pixel text-[8px] text-tac-400/70 mb-1">SQUAD</div>
        {/* 玩家自身 */}
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 ${alive ? "bg-tac-400" : "bg-bravo-500"}`} />
          <span className="font-term text-base text-tac-400">{OP_LABEL[selectedOp]}(你)</span>
        </div>
        {teammates.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <div className={`h-2 w-2 ${t.alive ? "bg-alpha-400" : "bg-void-600"}`} />
            <span className={`font-term text-base ${t.alive ? "text-alpha-400" : "text-void-600 line-through"}`}>
              {OP_LABEL[t.op]}
            </span>
            {t.alive && (
              <div className="h-1 w-12 bg-void-800">
                <div
                  className="h-full bg-alpha-500"
                  style={{ width: `${(t.hp / t.maxHp) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 右上：K/D */}
      <div className="absolute right-4 top-4 text-right">
        <div className="font-pixel text-[8px] text-tac-400/70">K / D</div>
        <div className="font-term text-xl text-gold-400 text-glow-gold leading-none">
          {kills} <span className="text-void-600">/</span> {deaths}
        </div>
      </div>

      {/* 中央准星 + 命中/击杀标记 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {alive ? (
          <div className="relative h-6 w-6">
            {/* ADS 瞄准时收束为细点；否则展开十字 */}
            {!ads && (
              <>
                <div className={`absolute left-1/2 top-0 h-6 w-[2px] -translate-x-1/2 ${aimingAtEnemy ? "bg-bravo-500" : "bg-tac-400/80"}`} />
                <div className={`absolute top-1/2 left-0 h-[2px] w-6 -translate-y-1/2 ${aimingAtEnemy ? "bg-bravo-500" : "bg-tac-400/80"}`} />
              </>
            )}
            <div className={`absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 ${aimingAtEnemy ? "bg-bravo-500" : "bg-tac-400"} ${ads ? "shadow-glowTac" : ""}`} />
            {/* 命中标记 */}
            {showHit && !showKill && (
              <>
                <div className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-400 shadow-glowGold" />
                <div className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gold-400 shadow-glowGold" />
              </>
            )}
          </div>
        ) : (
          <div className="font-pixel text-xs text-bravo-500 text-glow-bravo">已阵亡</div>
        )}
      </div>

      {/* 击杀提示 */}
      {showKill && (
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 animate-fade-in">
          <p className="font-pixel text-[10px] text-gold-400 text-glow-gold">击杀确认</p>
        </div>
      )}

      {/* 左下：血量 + 护甲 */}
      <div className="absolute left-4 bottom-4 w-64">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-pixel text-[9px] ${hpLow ? "text-bravo-500 animate-flicker" : "text-tac-400"}`}>
            HP
          </span>
          <span className="font-term text-base text-tac-400/70 ml-auto">{Math.round(hp)}/{maxHp}</span>
        </div>
        <div className={`h-3 w-full border border-void-600 bg-void-900 ${hpLow ? "animate-flicker" : ""}`}>
          <div
            className={`h-full ${hpLow ? "bg-bravo-500" : "bg-tac-500"}`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      </div>

      {/* 右下：弹药 + 小地图 */}
      <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
        <Minimap />
        <div className="text-right">
          <div className="font-pixel text-[8px] text-tac-400/60 mb-0.5">{weaponName}</div>
          {reloading ? (
            <span className="font-pixel text-[10px] text-warn-500 text-glow-warn animate-flicker">
              装弹中...
            </span>
          ) : (
            <div className="flex items-end justify-end gap-1">
              <span className={`font-term text-3xl leading-none ${ammo === 0 ? "text-bravo-500 animate-flicker" : "text-tac-400 text-glow-tac"}`}>
                {ammo}
              </span>
              <span className="font-term text-lg text-tac-400/40 leading-none">
                / {reserveAmmo}
              </span>
            </div>
          )}
          <div className="font-pixel text-[8px] text-tac-400/50 mt-1">{magSize} MAG · R 装弹 · 右键瞄准</div>
        </div>
      </div>

      {/* 横幅 */}
      {banner && (
        <div className="absolute left-1/2 bottom-24 -translate-x-1/2 text-center animate-fade-in">
          <p className="font-pixel text-xs text-tac-400 text-glow-tac">{banner}</p>
        </div>
      )}

      {/* 阵亡重生倒计时 */}
      {!alive && (
        <div className="absolute left-1/2 top-[62%] -translate-x-1/2 text-center">
          <p className="font-term text-xl text-bravo-400 text-glow-bravo">
            重生中 {Math.ceil(respawnTimer)}s
          </p>
        </div>
      )}

      {/* prep 阶段提示 */}
      {match.phase === "prep" && (
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 text-center">
          <p className="font-pixel text-sm text-gold-400 text-glow-gold animate-flicker">
            准备阶段
          </p>
        </div>
      )}
    </div>
  );
}
