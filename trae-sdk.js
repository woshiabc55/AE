// trae-sdk.js · TRAE SDK 适配层
// 当 window.TRAE 存在时调用真实 SDK；否则使用内置 mock 校验器。

const MOVEMENT_GLYPH = {
  static: "○", pan: "↔", tilt: "↕", dolly: "⤓",
  track: "⇄", crane: "⟳", handheld: "✺"
};

const SIZE_SCORE = { EWS: 1, WS: 2, MS: 3, CU: 4, ECU: 5 };
const SIZE_LABEL = { EWS: "远景", WS: "全景", MS: "中景", CU: "特写", ECU: "大特写" };

function fmtTime(seconds) {
  // SMPTE-like: HH:MM:SS:FF (假设 24fps)
  const total = Math.max(0, +seconds || 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const f = Math.round((total - Math.floor(total)) * 24);
  return [h, m, s, f].map(n => String(n).padStart(2, "0")).join(":");
}

function validateLocal(prev, cur, next) {
  const issues = [];
  const suggestions = [];

  if (!cur.shotSize) issues.push({ level: "error", field: "shotSize", msg: "缺少景别" });
  if (!cur.movement) issues.push({ level: "error", field: "movement", msg: "缺少运镜" });
  if (!cur.composition) issues.push({ level: "warn", field: "composition", msg: "建议补全构图描述" });
  if (cur.duration == null || isNaN(cur.duration)) {
    issues.push({ level: "error", field: "duration", msg: "缺少时长" });
  } else if (cur.duration < 0.5) {
    issues.push({ level: "warn", field: "duration", msg: `时长 ${cur.duration}s 过短，可能形成跳切` });
  } else if (cur.duration > 15) {
    issues.push({ level: "warn", field: "duration", msg: `时长 ${cur.duration}s 偏长，建议拆镜` });
  }

  // 景别多样性：连续三镜同景别提示
  if (prev && next && prev.shotSize === cur.shotSize && cur.shotSize === next.shotSize) {
    issues.push({ level: "warn", field: "shotSize", msg: `连续三镜同景别(${cur.shotSize})，节奏单调` });
  }
  // 景别跳变：相邻景别跨度过大
  if (prev && SIZE_SCORE[prev.shotSize] && SIZE_SCORE[cur.shotSize]) {
    const gap = Math.abs(SIZE_SCORE[prev.shotSize] - SIZE_SCORE[cur.shotSize]);
    if (gap >= 3) {
      issues.push({ level: "info", field: "shotSize", msg: `景别跳变 ${prev.shotSize}→${cur.shotSize}，注意视觉衔接` });
    }
  }

  // 轴线一致性
  if (prev && cur.cameraAngle && prev.cameraAngle && cur.cameraAngle !== prev.cameraAngle) {
    if (cur.cameraAngle === "荷兰角" || prev.cameraAngle === "荷兰角") {
      issues.push({ level: "info", field: "cameraAngle", msg: "引入荷兰角，叙事节奏将明显变化" });
    }
  }

  // 对白
  if (cur.dialogue && cur.dialogue.length > 60) {
    issues.push({ level: "info", field: "dialogue", msg: "对白偏长，需确认时长是否够" });
  }

  // 评分
  let score = 100;
  for (const it of issues) {
    if (it.level === "error") score -= 18;
    else if (it.level === "warn") score -= 8;
    else score -= 2;
  }
  score = Math.max(0, Math.min(100, score));

  // 建议
  if (score >= 90) suggestions.push("镜头节奏良好，可进入下一镜设计。");
  if (!cur.sfx) suggestions.push("未配置音效，建议在导出前补全环境音。");
  if (cur.movement === "static" && cur.duration > 5) suggestions.push("固定镜头超过 5s，可考虑缓慢 dolly 增加动感。");
  if (!cur.composition) suggestions.push("补全构图（如三分法/居中/对角线）有助于摄影师布光。");

  return { ok: issues.filter(i => i.level === "error").length === 0, score, issues, suggestions };
}

async function suggestLocal(partial) {
  // 启发式补全：仅在字段缺失时填充
  const p = { ...partial };
  if (!p.shotSize) p.shotSize = "MS";
  if (!p.movement) p.movement = "static";
  if (!p.cameraAngle) p.cameraAngle = "平视";
  if (!p.duration) p.duration = 3;
  if (!p.composition) p.composition = "主体居中，留白 30%";
  return p;
}

// 公开适配：window.TRAE
const TRAE_MOCK = {
  name: "TRAE-SDK-MOCK",
  version: "0.1.0",
  async validateShot(prev, cur, next) {
    // 模拟网络延迟
    await new Promise(r => setTimeout(r, 120));
    return validateLocal(prev, cur, next);
  },
  async suggestShot(partial) {
    await new Promise(r => setTimeout(r, 80));
    return suggestLocal(partial);
  },
  fmtTime
};

// 优先级：真实 SDK > Mock
export function getTRAE() {
  if (typeof window !== "undefined" && window.TRAE && typeof window.TRAE.validateShot === "function") {
    return Object.assign({}, TRAE_MOCK, window.TRAE, { name: window.TRAE.name || "TRAE-SDK-REAL" });
  }
  return TRAE_MOCK;
}

export const SHOT_HELPERS = { MOVEMENT_GLYPH, SIZE_LABEL, SIZE_SCORE, fmtTime };
