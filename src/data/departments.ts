// 部门（Department）数据 - 逆卡巴拉生命树布局

export interface Department {
  id: string;
  name: string;
  sephirah: string;     // 生命树质点
  unlockedDay: number;  // 解锁所需天数
  color: string;
  shortName: string;
  director: string;     // 部长
}

export const departments: Department[] = [
  { id: 'control',    name: '控制部',     sephirah: 'Malkuth',   unlockedDay: 1,  color: '#5a5a6a', shortName: 'CTL', director: 'Malkuth' },
  { id: 'info',       name: '情报部',     sephirah: 'Yesod',     unlockedDay: 4,  color: '#6a8aaa', shortName: 'INT', director: 'Yesod' },
  { id: 'safety',     name: '安保部',     sephirah: 'Hod',       unlockedDay: 8,  color: '#aa6a4a', shortName: 'SAF', director: 'Hod' },
  { id: 'training',   name: '培训部',     sephirah: 'Netzach',   unlockedDay: 12, color: '#6aaa6a', shortName: 'TRN', director: 'Netzach' },
  { id: 'central',    name: '中央本部',   sephirah: 'Tiphareth', unlockedDay: 16, color: '#d9c14a', shortName: 'CTR', director: 'Tiphareth' },
  { id: 'archives',   name: '档案部',     sephirah: 'Chesed',    unlockedDay: 22, color: '#4a9ad9', shortName: 'ARC', director: 'Chesed' },
  { id: 'records',    name: '记录部',     sephirah: 'Geburah',   unlockedDay: 28, color: '#d94a4a', shortName: 'REC', director: 'Geburah' },
  { id: 'extraction', name: '提取部',     sephirah: 'Binah',     unlockedDay: 35, color: '#8a4ad9', shortName: 'EXT', director: 'Binah' },
  { id: 'welfare',    name: '福利部',     sephirah: 'Chokhmah',  unlockedDay: 42, color: '#d94a8a', shortName: 'WLF', director: 'Chokhmah' },
  { id: 'command',    name: '指挥部',     sephirah: 'Kether',    unlockedDay: 50, color: '#ffe600', shortName: 'CMD', director: 'Kether' },
];
