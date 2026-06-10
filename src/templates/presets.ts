/**
 * 预置角色模板：一套完整的 SVG + 分组 + 网格节点 + 动画
 * 用户可一键加载作为起点继续编辑
 */
import type { Project, Shape, ShapeGroup } from "@/types";
import { uid } from "@/store/projectStore";

const now = Date.now();

/* ============= 兽耳少女 ============= */
export const foxGirl = (): Project => {
  const W = 600;
  const H = 800;
  const groups: ShapeGroup[] = [
    { id: "g_body", name: "身体", parentId: null, color: "#FF7AB6", visible: true },
    { id: "g_clothes", name: "衣服", parentId: "g_body", color: "#FFD66B", visible: true },
    { id: "g_head", name: "头部", parentId: "g_body", color: "#FFE3EE", visible: true },
    { id: "g_hair_back", name: "后发", parentId: "g_head", color: "#7CC0FF", visible: true },
    { id: "g_ear_L", name: "左耳", parentId: "g_head", color: "#FFC7DD", visible: true },
    { id: "g_ear_R", name: "右耳", parentId: "g_head", color: "#FFC7DD", visible: true },
    { id: "g_face", name: "脸", parentId: "g_head", color: "#FFE3EE", visible: true },
    { id: "g_eye_L", name: "左眼", parentId: "g_head", color: "#0B0F1A", visible: true },
    { id: "g_eye_R", name: "右眼", parentId: "g_head", color: "#0B0F1A", visible: true },
    { id: "g_mouth", name: "嘴", parentId: "g_head", color: "#E52D85", visible: true },
    { id: "g_hair_front", name: "前发", parentId: "g_head", color: "#7CC0FF", visible: true },
    { id: "g_arm_L", name: "左手", parentId: "g_body", color: "#FFE3EE", visible: true },
    { id: "g_arm_R", name: "右手", parentId: "g_body", color: "#FFE3EE", visible: true },
    { id: "g_tail", name: "尾巴", parentId: "g_body", color: "#FF8B5C", visible: true },
  ];
  const shapes: Shape[] = [
    // body
    { id: uid(), type: "path", name: "身体形状", data: "M220,420 C220,400 250,380 300,380 C350,380 380,400 380,420 L390,700 C390,720 370,730 350,730 L250,730 C230,730 210,720 210,700 Z", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 210, y: 380, width: 180, height: 350 }, parentId: "g_body", zIndex: 0, visible: true, locked: false },
    // 衣服
    { id: uid(), type: "path", name: "裙子", data: "M225,580 L375,580 L395,720 L205,720 Z", fill: "#FF7AB6", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 205, y: 580, width: 190, height: 140 }, parentId: "g_clothes", zIndex: 1, visible: true, locked: false },
    { id: uid(), type: "path", name: "领口", data: "M255,390 C275,420 325,420 345,390 L345,420 C325,440 275,440 255,420 Z", fill: "#FFD66B", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 255, y: 390, width: 90, height: 50 }, parentId: "g_clothes", zIndex: 2, visible: true, locked: false },
    // 头
    { id: uid(), type: "ellipse", name: "头", data: "", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 200, y: 130, width: 200, height: 220 }, parentId: "g_head", zIndex: 3, visible: true, locked: false },
    // 后发
    { id: uid(), type: "path", name: "后发", data: "M170,160 C140,200 130,330 170,400 L200,400 C175,330 175,200 200,170 Z M430,160 C460,200 470,330 430,400 L400,400 C425,330 425,200 400,170 Z", fill: "#7CC0FF", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 130, y: 160, width: 340, height: 240 }, parentId: "g_hair_back", zIndex: 4, visible: true, locked: false },
    // 左耳
    { id: uid(), type: "path", name: "左狐耳", data: "M195,140 L160,40 L240,110 Z", fill: "#FFC7DD", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 160, y: 40, width: 80, height: 100 }, parentId: "g_ear_L", zIndex: 5, visible: true, locked: false },
    { id: uid(), type: "path", name: "左耳内", data: "M200,120 L180,60 L225,105 Z", fill: "#FF7AB6", stroke: "#0B0F1A", strokeWidth: 0, opacity: 1, bbox: { x: 180, y: 60, width: 45, height: 60 }, parentId: "g_ear_L", zIndex: 6, visible: true, locked: false },
    // 右耳
    { id: uid(), type: "path", name: "右狐耳", data: "M405,140 L440,40 L360,110 Z", fill: "#FFC7DD", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 360, y: 40, width: 80, height: 100 }, parentId: "g_ear_R", zIndex: 7, visible: true, locked: false },
    { id: uid(), type: "path", name: "右耳内", data: "M400,120 L420,60 L375,105 Z", fill: "#FF7AB6", stroke: "#0B0F1A", strokeWidth: 0, opacity: 1, bbox: { x: 375, y: 60, width: 45, height: 60 }, parentId: "g_ear_R", zIndex: 8, visible: true, locked: false },
    // 脸
    { id: uid(), type: "ellipse", name: "腮红L", data: "", fill: "#FFC7DD", stroke: "none", strokeWidth: 0, opacity: 0.7, bbox: { x: 215, y: 260, width: 30, height: 18 }, parentId: "g_face", zIndex: 9, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "腮红R", data: "", fill: "#FFC7DD", stroke: "none", strokeWidth: 0, opacity: 0.7, bbox: { x: 355, y: 260, width: 30, height: 18 }, parentId: "g_face", zIndex: 10, visible: true, locked: false },
    // 眼
    { id: uid(), type: "ellipse", name: "左眼", data: "", fill: "#0B0F1A", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 240, y: 220, width: 28, height: 38 }, parentId: "g_eye_L", zIndex: 11, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左眼高光", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 248, y: 225, width: 8, height: 10 }, parentId: "g_eye_L", zIndex: 12, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右眼", data: "", fill: "#0B0F1A", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 332, y: 220, width: 28, height: 38 }, parentId: "g_eye_R", zIndex: 13, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右眼高光", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 340, y: 225, width: 8, height: 10 }, parentId: "g_eye_R", zIndex: 14, visible: true, locked: false },
    // 嘴
    { id: uid(), type: "path", name: "嘴", data: "M285,295 Q300,308 315,295", fill: "none", stroke: "#E52D85", strokeWidth: 3, opacity: 1, bbox: { x: 285, y: 295, width: 30, height: 14 }, parentId: "g_mouth", zIndex: 15, visible: true, locked: false },
    // 前发
    { id: uid(), type: "path", name: "刘海", data: "M200,140 C220,100 280,90 300,90 C320,90 380,100 400,140 C380,170 340,160 300,165 C260,160 220,170 200,140 Z", fill: "#7CC0FF", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 200, y: 90, width: 200, height: 80 }, parentId: "g_hair_front", zIndex: 16, visible: true, locked: false },
    { id: uid(), type: "path", name: "发饰", data: "M280,90 L320,90 L300,70 Z", fill: "#FF7AB6", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 280, y: 70, width: 40, height: 20 }, parentId: "g_hair_front", zIndex: 17, visible: true, locked: false },
    // 左手
    { id: uid(), type: "path", name: "左手", data: "M210,420 C190,470 175,540 180,610 L210,610 C215,540 230,480 240,440 Z", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 180, y: 420, width: 60, height: 190 }, parentId: "g_arm_L", zIndex: 18, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左手掌", data: "", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 175, y: 600, width: 40, height: 40 }, parentId: "g_arm_L", zIndex: 19, visible: true, locked: false },
    // 右手
    { id: uid(), type: "path", name: "右手", data: "M390,420 C410,470 425,540 420,610 L390,610 C385,540 370,480 360,440 Z", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 360, y: 420, width: 65, height: 190 }, parentId: "g_arm_R", zIndex: 20, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右手掌", data: "", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 385, y: 600, width: 40, height: 40 }, parentId: "g_arm_R", zIndex: 21, visible: true, locked: false },
    // 尾巴
    { id: uid(), type: "path", name: "尾巴", data: "M380,680 C440,700 480,660 470,610 C460,640 420,650 380,640 Z", fill: "#FF8B5C", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 380, y: 610, width: 90, height: 90 }, parentId: "g_tail", zIndex: 22, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "尾尖", data: "", fill: "#FFE3EE", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 455, y: 605, width: 20, height: 20 }, parentId: "g_tail", zIndex: 23, visible: true, locked: false },
  ];

  // 节点模板：用户加载后用 builder 重新生成（这里不直接生成）
  const nodes: any[] = [];
  const layers: any[] = [];
  const animations: any[] = [];

  return {
    id: uid(),
    name: "兽耳少女 · Mochi",
    canvasWidth: W,
    canvasHeight: H,
    shapes,
    groups,
    layers,
    nodes,
    animations,
    atlas: null,
    createdAt: now,
    updatedAt: now,
  };
};

/* ============= Q 版机甲 ============= */
export const mechKid = (): Project => {
  const W = 600;
  const H = 800;
  const groups: ShapeGroup[] = [
    { id: "g_body", name: "身体", parentId: null, color: "#7CC0FF", visible: true },
    { id: "g_armor", name: "盔甲", parentId: "g_body", color: "#FFD66B", visible: true },
    { id: "g_head", name: "头部", parentId: "g_body", color: "#1A2236", visible: true },
    { id: "g_visor", name: "面罩", parentId: "g_head", color: "#7CE3B5", visible: true },
    { id: "g_antenna_L", name: "左天线", parentId: "g_head", color: "#FFD66B", visible: true },
    { id: "g_antenna_R", name: "右天线", parentId: "g_head", color: "#FFD66B", visible: true },
    { id: "g_arm_L", name: "左手", parentId: "g_body", color: "#7CC0FF", visible: true },
    { id: "g_arm_R", name: "右手", parentId: "g_body", color: "#7CC0FF", visible: true },
    { id: "g_leg_L", name: "左脚", parentId: "g_body", color: "#1A2236", visible: true },
    { id: "g_leg_R", name: "右脚", parentId: "g_body", color: "#1A2236", visible: true },
    { id: "g_jetpack", name: "喷射包", parentId: "g_body", color: "#FF8B5C", visible: true },
  ];
  const shapes: Shape[] = [
    { id: uid(), type: "rect", name: "躯干", data: "", fill: "#7CC0FF", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 230, y: 360, width: 140, height: 200 }, parentId: "g_body", zIndex: 0, visible: true, locked: false },
    { id: uid(), type: "path", name: "胸前装甲", data: "M250,380 L350,380 L340,460 L260,460 Z", fill: "#FFD66B", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 250, y: 380, width: 100, height: 80 }, parentId: "g_armor", zIndex: 1, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "反应堆", data: "", fill: "#7CE3B5", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 285, y: 405, width: 30, height: 30 }, parentId: "g_armor", zIndex: 2, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "头", data: "", fill: "#1A2236", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 220, y: 200, width: 160, height: 150 }, parentId: "g_head", zIndex: 3, visible: true, locked: false },
    { id: uid(), type: "rect", name: "面罩", data: "", fill: "#7CE3B5", stroke: "#0B0F1A", strokeWidth: 2, opacity: 0.9, bbox: { x: 240, y: 240, width: 120, height: 35 }, parentId: "g_visor", zIndex: 4, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左眼灯", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 270, y: 250, width: 20, height: 15 }, parentId: "g_visor", zIndex: 5, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右眼灯", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 310, y: 250, width: 20, height: 15 }, parentId: "g_visor", zIndex: 6, visible: true, locked: false },
    { id: uid(), type: "path", name: "左天线", data: "M250,200 L230,140 L245,140 L260,200 Z", fill: "#FFD66B", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 230, y: 140, width: 30, height: 60 }, parentId: "g_antenna_L", zIndex: 7, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左天线尖", data: "", fill: "#FF7AB6", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 222, y: 130, width: 16, height: 16 }, parentId: "g_antenna_L", zIndex: 8, visible: true, locked: false },
    { id: uid(), type: "path", name: "右天线", data: "M350,200 L370,140 L355,140 L340,200 Z", fill: "#FFD66B", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 340, y: 140, width: 30, height: 60 }, parentId: "g_antenna_R", zIndex: 9, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右天线尖", data: "", fill: "#FF7AB6", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 362, y: 130, width: 16, height: 16 }, parentId: "g_antenna_R", zIndex: 10, visible: true, locked: false },
    { id: uid(), type: "rect", name: "左手", data: "", fill: "#7CC0FF", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 170, y: 380, width: 60, height: 180 }, parentId: "g_arm_L", zIndex: 11, visible: true, locked: false },
    { id: uid(), type: "rect", name: "右手", data: "", fill: "#7CC0FF", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 370, y: 380, width: 60, height: 180 }, parentId: "g_arm_R", zIndex: 12, visible: true, locked: false },
    { id: uid(), type: "rect", name: "左脚", data: "", fill: "#1A2236", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 240, y: 560, width: 60, height: 160 }, parentId: "g_leg_L", zIndex: 13, visible: true, locked: false },
    { id: uid(), type: "rect", name: "右脚", data: "", fill: "#1A2236", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 300, y: 560, width: 60, height: 160 }, parentId: "g_leg_R", zIndex: 14, visible: true, locked: false },
    { id: uid(), type: "path", name: "喷射包", data: "M280,560 L320,560 L335,640 L265,640 Z", fill: "#FF8B5C", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 265, y: 560, width: 70, height: 80 }, parentId: "g_jetpack", zIndex: 15, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "尾焰", data: "", fill: "#FFD66B", stroke: "none", strokeWidth: 0, opacity: 0.8, bbox: { x: 280, y: 630, width: 40, height: 50 }, parentId: "g_jetpack", zIndex: 16, visible: true, locked: false },
  ];
  return {
    id: uid(),
    name: "Q版机甲 · Bolt",
    canvasWidth: W,
    canvasHeight: H,
    shapes,
    groups,
    layers: [],
    nodes: [],
    animations: [],
    atlas: null,
    createdAt: now,
    updatedAt: now,
  };
};

/* ============= 简笔小怪物 ============= */
export const blob = (): Project => {
  const W = 600;
  const H = 800;
  const groups: ShapeGroup[] = [
    { id: "g_body", name: "身体", parentId: null, color: "#7CE3B5", visible: true },
    { id: "g_eye_L", name: "左眼", parentId: "g_body", color: "#0B0F1A", visible: true },
    { id: "g_eye_R", name: "右眼", parentId: "g_body", color: "#0B0F1A", visible: true },
    { id: "g_mouth", name: "嘴", parentId: "g_body", color: "#E52D85", visible: true },
    { id: "g_arm_L", name: "左手", parentId: "g_body", color: "#7CE3B5", visible: true },
    { id: "g_arm_R", name: "右手", parentId: "g_body", color: "#7CE3B5", visible: true },
    { id: "g_antenna_L", name: "左触角", parentId: "g_body", color: "#FFD66B", visible: true },
    { id: "g_antenna_R", name: "右触角", parentId: "g_body", color: "#FFD66B", visible: true },
  ];
  const shapes: Shape[] = [
    { id: uid(), type: "ellipse", name: "果冻身体", data: "", fill: "#7CE3B5", stroke: "#0B0F1A", strokeWidth: 3, opacity: 1, bbox: { x: 180, y: 240, width: 240, height: 320 }, parentId: "g_body", zIndex: 0, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "高光", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 0.6, bbox: { x: 220, y: 280, width: 60, height: 40 }, parentId: "g_body", zIndex: 1, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左眼", data: "", fill: "#0B0F1A", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 240, y: 330, width: 32, height: 40 }, parentId: "g_eye_L", zIndex: 2, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左眼高光", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 250, y: 338, width: 10, height: 12 }, parentId: "g_eye_L", zIndex: 3, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右眼", data: "", fill: "#0B0F1A", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 328, y: 330, width: 32, height: 40 }, parentId: "g_eye_R", zIndex: 4, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右眼高光", data: "", fill: "#FFFFFF", stroke: "none", strokeWidth: 0, opacity: 1, bbox: { x: 338, y: 338, width: 10, height: 12 }, parentId: "g_eye_R", zIndex: 5, visible: true, locked: false },
    { id: uid(), type: "path", name: "嘴", data: "M270,440 Q300,470 330,440", fill: "#E52D85", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 270, y: 440, width: 60, height: 30 }, parentId: "g_mouth", zIndex: 6, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左手", data: "", fill: "#7CE3B5", stroke: "#0B0F1A", strokeWidth: 3, opacity: 1, bbox: { x: 130, y: 380, width: 60, height: 80 }, parentId: "g_arm_L", zIndex: 7, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右手", data: "", fill: "#7CE3B5", stroke: "#0B0F1A", strokeWidth: 3, opacity: 1, bbox: { x: 410, y: 380, width: 60, height: 80 }, parentId: "g_arm_R", zIndex: 8, visible: true, locked: false },
    { id: uid(), type: "path", name: "左触角", data: "M230,240 Q220,180 240,140", fill: "none", stroke: "#0B0F1A", strokeWidth: 3, opacity: 1, bbox: { x: 220, y: 140, width: 25, height: 100 }, parentId: "g_antenna_L", zIndex: 9, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "左触角球", data: "", fill: "#FFD66B", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 230, y: 130, width: 22, height: 22 }, parentId: "g_antenna_L", zIndex: 10, visible: true, locked: false },
    { id: uid(), type: "path", name: "右触角", data: "M370,240 Q380,180 360,140", fill: "none", stroke: "#0B0F1A", strokeWidth: 3, opacity: 1, bbox: { x: 355, y: 140, width: 25, height: 100 }, parentId: "g_antenna_R", zIndex: 11, visible: true, locked: false },
    { id: uid(), type: "ellipse", name: "右触角球", data: "", fill: "#FFD66B", stroke: "#0B0F1A", strokeWidth: 2, opacity: 1, bbox: { x: 348, y: 130, width: 22, height: 22 }, parentId: "g_antenna_R", zIndex: 12, visible: true, locked: false },
  ];
  return {
    id: uid(),
    name: "果冻怪 · Blob",
    canvasWidth: W,
    canvasHeight: H,
    shapes,
    groups,
    layers: [],
    nodes: [],
    animations: [],
    atlas: null,
    createdAt: now,
    updatedAt: now,
  };
};

export const PRESET_TEMPLATES = [
  {
    id: "fox",
    name: "兽耳少女",
    desc: "经典日系兽耳娘，含耳、尾、表情、衣服分层",
    emoji: "🦊",
    palette: ["#FFE3EE", "#FF7AB6", "#7CC0FF", "#FFD66B", "#FF8B5C"],
    build: foxGirl,
  },
  {
    id: "mech",
    name: "Q版机甲",
    desc: "机甲小子，含面罩灯、喷射包、双天线",
    emoji: "🤖",
    palette: ["#7CC0FF", "#FFD66B", "#1A2236", "#7CE3B5", "#FF8B5C"],
    build: mechKid,
  },
  {
    id: "blob",
    name: "果冻怪",
    desc: "圆润可爱小怪物，双眼大眼、双触角",
    emoji: "🫧",
    palette: ["#7CE3B5", "#FFD66B", "#E52D85", "#0B0F1A"],
    build: blob,
  },
];
