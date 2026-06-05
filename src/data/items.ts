export interface Item {
  id: string
  category: 'ink' | 'paper' | 'brush' | 'inkstone' | 'tea' | 'incense' | 'curio'
  name: string
  seal: string
  price: number
  story: string
  swatch: string
  weight: '轻' | '中' | '重'
  origin: string
}

export const items: Item[] = [
  { id: 'i01', category: 'ink', name: '青鸾墨锭', seal: '墨', price: 8800, story: '取千年松烟，配麝香、冰片、珍珠粉，研之无声，入纸如漆。', swatch: '#1B1A18', weight: '中', origin: '徽州·胡氏' },
  { id: 'i02', category: 'paper', name: '澄心堂纸', seal: '纸', price: 16800, story: '肤卵如雪，五十尺一刀。南唐后主曾以万金收之。', swatch: '#F2E9D8', weight: '轻', origin: '南唐·李氏' },
  { id: 'i03', category: 'brush', name: '狼毫擒锋', seal: '笔', price: 5600, story: '取辽东黄鼠狼尾尖一寸，束以鹿角，蘸墨可书蝇头小楷万字。', swatch: '#7A5A22', weight: '轻', origin: '湖州·善琏' },
  { id: 'i04', category: 'inkstone', name: '端砚·鱼脑冻', seal: '砚', price: 36800, story: '石出斧柯，色青如雨，呵之出水。研墨无声，贮水不耗。', swatch: '#1B2A3A', weight: '重', origin: '肇庆·斧柯山' },
  { id: 'i05', category: 'tea', name: '顾渚紫笋', seal: '茶', price: 4200, story: '茶生阳崖阴林，紫者上，绿者次。野者上，园者次。', swatch: '#3D5A5A', weight: '轻', origin: '湖州·长兴' },
  { id: 'i06', category: 'incense', name: '沉香·蓬莱', seal: '香', price: 9800, story: '沉之奇楠，生百年而脂凝，香气十步可夺人神魄。', swatch: '#A22B1F', weight: '中', origin: '海南·黎母山' },
  { id: 'i07', category: 'curio', name: '青铜博山炉', seal: '玩', price: 24800, story: '炉铸群山，云气缭绕，袖手焚之，香烟与山色不分。', swatch: '#C9A14A', weight: '重', origin: '汉·中山' },
  { id: 'i08', category: 'ink', name: '朱砂印泥', seal: '印', price: 1200, story: '取辰州丹砂，揉以艾绒、蓖麻油，钤于纸，百年不褪。', swatch: '#A22B1F', weight: '轻', origin: '辰州' },
]

export const categoryMap: Record<Item['category'], { label: string; seal: string; desc: string }> = {
  ink: { label: '墨', seal: '墨', desc: '松烟万杵，入纸三百年。' },
  paper: { label: '纸', seal: '纸', desc: '肤卵如雪，一纸千金。' },
  brush: { label: '笔', seal: '笔', desc: '狼毫一寸，写尽江湖。' },
  inkstone: { label: '砚', seal: '砚', desc: '端石无声，墨韵天成。' },
  tea: { label: '茶', seal: '茶', desc: '紫笋顾渚，山泉为骨。' },
  incense: { label: '香', seal: '香', desc: '沉香一寸，驱十年尘。' },
  curio: { label: '玩', seal: '玩', desc: '博山一炉，烟云为友。' },
}
