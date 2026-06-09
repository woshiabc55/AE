// 剧本片段库 - 编辑器左侧可拖入
import type { ScriptFragment } from '../types';

export const SCRIPT_FRAGMENTS: ScriptFragment[] = [
  // 开场
  { id: 'f_open_1', label: '反差开场', category: 'opening', body: '你以为……其实……', tags: ['钩子'] },
  { id: 'f_open_2', label: '悬念开场', category: 'opening', body: '那天，我不该打开那扇门。', tags: ['悬疑'] },
  { id: 'f_open_3', label: '数字开场', category: 'opening', body: '我做这件事 {{n}} 年了，今天想跟你说点真话。', tags: ['真实'] },
  { id: 'f_open_4', label: '场景开场', category: 'opening', body: '凌晨 {{time}}，{{location}} 还亮着灯。', tags: ['氛围'] },

  // 角色
  { id: 'f_char_1', label: '角色三要素', category: 'character', body: '一个 {{age}} 岁的 {{profession}}，{{flaw}} 是他最大的标签。', tags: ['设定'] },
  { id: 'f_char_2', label: '执念动机', category: 'character', body: '他做这一切，只是为了证明 {{belief}}。', tags: ['动机'] },
  { id: 'f_char_3', label: '口头禅', category: 'character', body: '他总挂在嘴边："{{catchphrase}}"。', tags: ['细节'] },

  // 场景
  { id: 'f_scene_1', label: '环境氛围', category: 'scene', body: '{{weather}} 的 {{location}}，空气里弥漫着 {{smell}}。', tags: ['五感'] },
  { id: 'f_scene_2', label: '时间标记', category: 'scene', body: '【 {{day}} | {{time}} | {{location}} 】', tags: ['场记'] },
  { id: 'f_scene_3', label: '转场', category: 'scene', body: '画面淡入 ——', tags: ['分镜'] },

  // 冲突
  { id: 'f_conflict_1', label: '矛盾前置', category: 'conflict', body: '问题是，{{protagonist}} 没想到 {{twist}}。', tags: ['反转'] },
  { id: 'f_conflict_2', label: '内心独白', category: 'conflict', body: '"如果我当时说出口，是不是一切都会不同。"', tags: ['抒情'] },
  { id: 'f_conflict_3', label: '对话冲突', category: 'conflict', body: 'A：你答应过我的。\nB：我没有。', tags: ['对话'] },

  // 反转
  { id: 'f_twist_1', label: '认知反转', category: 'twist', body: '直到 {{revelation}} 那一刻，他才明白 {{truth}}。', tags: ['揭秘'] },
  { id: 'f_twist_2', label: '双关反转', category: 'twist', body: '她说的"{{word_a}}"，其实指的是 {{word_b}}。', tags: ['机巧'] },

  // 收尾
  { id: 'f_close_1', label: '戛然而止', category: 'closing', body: '电话那头，是长久的沉默。', tags: ['留白'] },
  { id: 'f_close_2', label: '行动呼吁', category: 'closing', body: '如果这个视频让你有一点点共鸣，请把它转发给 {{target}}。', tags: ['互动'] },
  { id: 'f_close_3', label: '钩子结尾', category: 'closing', body: '下一期，我想聊 {{next_topic}}，点赞过 {{n}} 我就开讲。', tags: ['留存'] },
];

export const FRAGMENT_CATEGORIES = [
  { key: 'opening', label: '开场', sub: '前 5 秒' },
  { key: 'character', label: '角色', sub: '人物设定' },
  { key: 'scene', label: '场景', sub: '环境与场记' },
  { key: 'conflict', label: '冲突', sub: '矛盾与张力' },
  { key: 'twist', label: '反转', sub: '认知重塑' },
  { key: 'closing', label: '收尾', sub: '留存与呼吁' },
] as const;
