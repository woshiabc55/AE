// 章节文案
export const chapters = [
  { id: 1, title: '卷一·孤烟直', subtitle: 'LONELY · 远景长焦', seal: '壹', kind: 'lonely', bgCaption: ['大漠孤烟直', '长河落日圆', '一卷一江湖'], palette: ['#0E0B08', '#3D5A5A', '#C9A14A', '#A22B1F'] },
  { id: 2, title: '卷二·烟尘起', subtitle: 'DUST · 战马踏破', seal: '贰', kind: 'dust', bgCaption: ['黄尘扑面刀光冷', '铁链拖地声如雷', '踢碎牌匾踏歌行'], palette: ['#1B1A18', '#7A5A22', '#A22B1F', '#C9A14A'] },
  { id: 3, title: '卷三·刀光乱', subtitle: 'BLADE · 残像厮杀', seal: '叁', kind: 'blade', bgCaption: ['扑刀一斩风雷动', '黑色液体刹那飞', '左劈右砍人仰翻'], palette: ['#0E0B08', '#1B2A3A', '#A22B1F', '#C9A14A'] },
  { id: 4, title: '卷四·万马奔腾', subtitle: 'THUNDER · 大远景冲击', seal: '肆', kind: 'thunder', bgCaption: ['唢呐一声破云起', '铁蹄轰鸣地如鼓', '千里疆场一卷收'], palette: ['#0E0B08', '#26221C', '#A22B1F', '#C9A14A'] },
] as const

export type Chapter = (typeof chapters)[number]
