// ai-decompose.js · 脚本→镜头的拆解器
// 规则化切片：按段落（场景标记 / 句号 / 换行）切分，并对每段启发式分配景别/运镜/时长。

const SCENE_HINTS = ["清晨", "黄昏", "夜晚", "上午", "下午", "室外", "室内", "街道", "咖啡馆", "办公室", "家", "客厅", "卧室", "车", "车内", "外景", "内景", "远景", "特写", "中景", "全景"];
const SHOT_SIZE_BY_HINT = [
  { re: /特写|拉花|杯子|脸|侧脸|手|眼神|嘴唇/, size: "ECU" },
  { re: /特写|表情|低头|抬头|笑|哭|递出/, size: "CU" },
  { re: /中景|柜台|过肩|对话|对白|说话/, size: "MS" },
  { re: /全景|推门|走|街道|街道|窗户|远/, size: "WS" },
  { re: /远景|拉远|车流|城市|天空|街道全景/, size: "EWS" }
];
const MOVEMENT_BY_HINT = [
  { re: /拉远|摇臂|上升|下降|升起/, mv: "crane" },
  { re: /推|拉|推近|拉远/, mv: "dolly" },
  { re: /横移|平行|行走跟拍/, mv: "track" },
  { re: /横摇|扫|环视/, mv: "pan" },
  { re: /手持|晃动|抖动|呼吸/, mv: "handheld" }
];
const ANGLE_BY_HINT = [
  { re: /俯拍|俯视|拉花|杯子/, ang: "俯拍" },
  { re: /仰拍|天空|高楼/, ang: "仰拍" }
];
const SFX_BY_HINT = [
  { re: /门铃|推门/, sfx: "门铃叮咚" },
  { re: /咖啡|蒸汽|拉花/, sfx: "蒸汽嘶嘶" },
  { re: /车流|街道/, sfx: "车流远景" },
  { re: /音乐|爵士/, sfx: "轻爵士" }
];

function detectOne(arr, text) {
  for (const it of arr) if (it.re.test(text)) return it;
  return null;
}

function pickSize(text) { return (detectOne(SHOT_SIZE_BY_HINT, text) || {}).size || null; }
function pickMv(text)   { return (detectOne(MOVEMENT_BY_HINT, text) || {}).mv   || null; }
function pickAng(text)  { return (detectOne(ANGLE_BY_HINT, text) || {}).ang    || "平视"; }
function pickSfx(text)  { return (detectOne(SFX_BY_HINT, text) || {}).sfx     || ""; }

function splitScriptToParagraphs(script) {
  // 优先按 "场景：" 或 数字编号 "1." 切分；否则按行
  const lines = script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const merged = [];
  for (const ln of lines) {
    // 显式场景标记
    if (/^场景[::]|^[一二三四五六七八九十0-9]+[.、]/.test(ln)) {
      merged.push(ln);
    } else if (merged.length) {
      merged[merged.length - 1] += " " + ln;
    } else {
      merged.push(ln);
    }
  }
  // 进一步：含句末标点且长度>30 也作为独立段
  const out = [];
  for (const m of merged) {
    const parts = m.split(/(?<=[。！？!?\.])\s*/);
    for (const p of parts) {
      const t = p.trim();
      if (t) out.push(t);
    }
  }
  return out;
}

function pickDuration(text) {
  // 简单启发：含"特写/表情"→ 2s；含"全景/远景/街道"→ 4s；中景对话 → 2.5s
  if (/特写|表情|眼神|拉花/.test(text)) return 2;
  if (/全景|远景|拉远|街道|城市|天空/.test(text)) return 4;
  if (/对话|说|问|答/.test(text)) return 2.5;
  return 3;
}

function extractDialogue(text) {
  // 匹配 "..." 或 “...” 之间的内容
  const m = text.match(/["“]([^"”]+)["”]/);
  if (m) return m[1];
  // 末尾"xxx？/xxx!" 视为对白
  const m2 = text.match(/[，,]\s*([^\s。！？!?]{2,30}[？?！!])$/);
  if (m2) return m2[1];
  return "";
}

function extractScene(text) {
  for (const h of SCENE_HINTS) {
    const idx = text.indexOf(h);
    if (idx >= 0) return h;
  }
  // 截取 "场景：" 后内容
  const m = text.match(/场景[::]?\s*([^，,。！？!?\s]{1,12})/);
  if (m) return m[1];
  return "";
}

function makeId() {
  return "s" + Math.random().toString(36).slice(2, 8);
}

export function decompose(script) {
  if (!script || !script.trim()) return [];
  const paragraphs = splitScriptToParagraphs(script);
  const shots = [];
  paragraphs.forEach((p, i) => {
    const size = pickSize(p) || ["EWS", "WS", "MS", "CU", "ECU"][Math.min(4, Math.floor(i / 2))];
    const movement = pickMv(p) || (i === 0 ? "dolly" : "static");
    const angle = pickAng(p);
    const sfx = pickSfx(p);
    const duration = pickDuration(p);
    const dialogue = extractDialogue(p);
    const scene = extractScene(p) || `场景 ${i + 1}`;
    shots.push({
      id: makeId(),
      seq: i + 1,
      scene,
      shotSize: size,
      movement,
      composition: p.replace(/["“][^"”]+["”]/g, "").trim().slice(0, 36) || p.slice(0, 24),
      dialogue,
      sfx,
      duration,
      cameraAngle: angle,
      aiNote: ""
    });
  });
  return shots;
}

export const SAMPLE_SCRIPT = `清晨。主角推门走进一家老式咖啡馆，门铃轻轻响了一声。
柜台后咖啡师抬头微笑，递出温热的马克杯："老样子？"
特写：杯中拉花缓缓散开，蒸汽在逆光里升起。
主角抿一口，望向窗外，街角有只橘猫在阳光下打盹。
镜头拉远，街道车流模糊成光斑，画面收在主角的侧脸上。`;
