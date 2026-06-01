export interface Frame {
  frame: number;
  description: string;
  content: string;
  effect: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  duration: number;
  color: string;
  frames: Frame[];
}

export const scenesData: Scene[] = [
  {
    id: 'scene1',
    name: '混沌空间战斗',
    description: '战士在混沌空间中进行激烈战斗，特效和镜头快速切换',
    startTime: 0,
    endTime: 30,
    duration: 1,
    color: '#00d4ff',
    frames: [
      { frame: 0, description: '特写-呼吸', content: '模糊碎片逐渐清晰，战士轮廓显现', effect: 'Gaussian Blur从10→0' },
      { frame: 5, description: '全局摇晃', content: '镜头剧烈抖动，混沌空间扭曲', effect: 'Shake Amount 20→0' },
      { frame: 10, description: '动作合集', content: '战士闪现、拳击、打击空爆', effect: '运动模糊、冲击光效' },
      { frame: 15, description: '马赫运动', content: '角色高速移动，残象叠加', effect: '运动模糊聚集' },
      { frame: 20, description: '超广角', content: '凸显角色微小与空间崩坏', effect: '超广角镜头效果' },
      { frame: 25, description: '收尾', content: '战斗结束，空间恢复平静', effect: '淡出效果' },
    ],
  },
  {
    id: 'scene2',
    name: '神人好声音',
    description: '导师入场，舞台效果和戏剧性转场',
    startTime: 30,
    endTime: 90,
    duration: 2,
    color: '#ff0080',
    frames: [
      { frame: 30, description: '黑场转场', content: '万花筒效果渐显', effect: '黑场Opacity 100→0' },
      { frame: 35, description: '导师入场', content: '角色1从左侧入场（戴面具持棒）', effect: 'Kaleidoscope 6面' },
      { frame: 45, description: '传送特效', content: '角色瞬间传送到4号座位', effect: '闪光+位移动画' },
      { frame: 55, description: '第一视角', content: '镜头切换为导师视角', effect: '光源混合效果' },
      { frame: 75, description: '光线交织', content: '角色回头谢幕，光线转移', effect: '全局配音入场' },
    ],
  },
  {
    id: 'scene3',
    name: '巨兽撞击',
    description: '巨兽撞击与角色反击的震撼场景',
    startTime: 90,
    endTime: 180,
    duration: 3,
    color: '#ffd700',
    frames: [
      { frame: 90, description: '巨兽登场', content: '巨兽从右侧进入画面', effect: '位移动画' },
      { frame: 110, description: '撞击冲击', content: '巨兽撞击房屋，画面震动', effect: 'Shake Amount 30' },
      { frame: 125, description: '角色反应', content: '主角抓住小包，站在巨兽背部', effect: '轨迹运镜' },
      { frame: 140, description: '反击时刻', content: '角色拳打巨兽，冲击特效', effect: '冲击波效果' },
      { frame: 160, description: '收尾特写', content: '手部动作特写，镜头回转', effect: '推拉镜头跟随' },
    ],
  },
];
