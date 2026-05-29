export interface StoryNode {
  id: string
  title: string
  subtitle: string
  description: string
  quote?: string
  color: string
  accentColor: string
}

export interface StoryLine {
  id: 'ancient' | 'modern'
  title: string
  subtitle: string
  theme: string
  nodes: StoryNode[]
  primaryColor: string
  accentColor: string
  bgGradient: string
}

export const ancientStory: StoryLine = {
  id: 'ancient',
  title: '古线·章氏兄弟',
  subtitle: '南宋·龙泉',
  theme: '裂痕生美',
  primaryColor: '#5C3A21',
  accentColor: '#C9A84C',
  bgGradient: 'from-iron-950 via-kiln-900/30 to-iron-950',
  nodes: [
    {
      id: 'a1',
      title: '嘱托',
      subtitle: '共守窑火',
      description: '章村根临终握二子之手，嘱共守窑火。窑火不熄，章氏不灭——这是父亲最后的嘱托，也是两兄弟共同的起点。',
      quote: '窑火不熄，章氏不灭',
      color: '#D4622B',
      accentColor: '#F5F0E8',
    },
    {
      id: 'a2',
      title: '分窑',
      subtitle: '铁胎紫土',
      description: '然兄刚弟柔，性情各异，终分立窑炉——生一取铁胎紫土，生二取白胎青土。同一窑火，两种执念。',
      quote: '兄刚弟柔，终分立窑炉',
      color: '#5C3A21',
      accentColor: '#B0C4B1',
    },
    {
      id: 'a3',
      title: '投灰',
      subtitle: '暗夜潜入',
      description: '兄窑出紫口铁足，弟窑出温润粉青。兄受皇恩贡瓷，声名远播；弟心生不平，暗夜潜入兄窑，投草木灰于釉缸。',
      color: '#2C2C2C',
      accentColor: '#D4622B',
    },
    {
      id: 'a4',
      title: '开片',
      subtitle: '金丝铁线',
      description: '翌日开窑，釉面竟生冰裂纹路——大纹若铁线，细纹如金丝，"金丝铁线"自此诞生。破坏催生至美，嫉妒开出奇花。',
      quote: '大纹若铁线，细纹如金丝',
      color: '#C9A84C',
      accentColor: '#5C3A21',
    },
    {
      id: 'a5',
      title: '决裂',
      subtitle: '远走庆元',
      description: '弟之举败露，兄弟决裂。生二负疚远走庆元，另辟窑址，苦心孤诣，终烧出梅子青釉——色如初梅，翠欲滴。',
      quote: '色如初梅，翠欲滴',
      color: '#4A7C59',
      accentColor: '#C9A84C',
    },
    {
      id: 'a6',
      title: '合烧',
      subtitle: '兄弟和解',
      description: '朝廷加征万件贡瓷，一窑难承，兄弟被迫联手。合烧之日，开片与厚釉共存一器，裂纹与温润相映，兄弟相视无言，和解于窑火之中。',
      quote: '裂纹与温润相映，和解于窑火之中',
      color: '#D4622B',
      accentColor: '#4A7C59',
    },
  ],
}

export const modernStory: StoryLine = {
  id: 'modern',
  title: '今线·张氏兄弟',
  subtitle: '当代·龙泉',
  theme: '慢火传心',
  primaryColor: '#4A7C59',
  accentColor: '#B0C4B1',
  bgGradient: 'from-iron-950 via-celadon-900/20 to-iron-950',
  nodes: [
    {
      id: 'm1',
      title: '泥伴',
      subtitle: '以泥为伴',
      description: '龙泉老宅，张寄与张生元幼时以泥为伴，手印留在湿坯上，笑声融进窑烟里。泥土是他们的第一个玩伴，窑烟是他们的第一缕记忆。',
      quote: '手印留在湿坯上，笑声融进窑烟里',
      color: '#B0C4B1',
      accentColor: '#4A7C59',
    },
    {
      id: 'm2',
      title: '学艺',
      subtitle: '碎瓷不割志',
      description: '张寄拜师入青瓷厂，一窑又一窑废品堆成小山，碎瓷割手不割志。师傅终赠一枚章生一残片——开片金丝铁线，千年犹在。',
      quote: '碎瓷割手不割志',
      color: '#C9A84C',
      accentColor: '#5C3A21',
    },
    {
      id: 'm3',
      title: '支教',
      subtitle: '守的是人',
      description: '张生元考入师范，远赴宝溪乡支教。学生问"青瓷是什么"——故土之器，故土之人竟不知。他于废弃窑址溪边拾得残片，莲瓣纹犹存。',
      quote: '你守的是窑，我守的是人',
      color: '#4A7C59',
      accentColor: '#F5F0E8',
    },
    {
      id: 'm4',
      title: '碰撞',
      subtitle: '窑火同燃',
      description: '兄弟重逢却碰撞：张寄斥弟浪费才华，应回城做瓷；张生元反驳——"你守的是窑，我守的是人。"暴雨夜争吵，雷声与窑火同燃。',
      color: '#D4622B',
      accentColor: '#2C2C2C',
    },
    {
      id: 'm5',
      title: '夏令营',
      subtitle: '青瓷课',
      description: '转折起于张寄带残片到学校，为学生演示拉坯。学生烧出歪扭小碗，不完美却发光。兄弟遂合办龙窑夏令营，兄收徒，弟编写《青瓷课》。',
      quote: '不完美却发光',
      color: '#B0C4B1',
      accentColor: '#D4622B',
    },
    {
      id: 'm6',
      title: '合烧',
      subtitle: '致敬章氏',
      description: '终有一日，兄弟合烧一窑，窑门封堵，火光映照两张脸——致敬章生一·章生二。千年窑火，同一炉焰。',
      quote: '火光映照两张脸——致敬章生一·章生二',
      color: '#D4622B',
      accentColor: '#C9A84C',
    },
  ],
}

export const resonancePairs = [
  {
    ancient: ancientStory.nodes[0],
    modern: modernStory.nodes[0],
    theme: '起点',
    description: '古线以父嘱为起点，今线以泥伴为起点——皆因血脉与泥土而生。',
  },
  {
    ancient: ancientStory.nodes[2],
    modern: modernStory.nodes[3],
    theme: '裂痕',
    description: '古线以嫉妒投灰为裂痕，今线以理念碰撞为裂痕——裂痕皆因爱而生。',
  },
  {
    ancient: ancientStory.nodes[3],
    modern: modernStory.nodes[4],
    theme: '新生',
    description: '古线裂痕催生开片之美，今线碰撞催生教育之新——裂隙是新生的起点。',
  },
  {
    ancient: ancientStory.nodes[5],
    modern: modernStory.nodes[5],
    theme: '合烧',
    description: '古今合烧，同一炉火——古人以合烧和解，今人以合烧致敬。',
  },
]
