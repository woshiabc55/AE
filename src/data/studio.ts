export type StudioMember = {
  name: string
  role: string
  signature: string
  accent: string
  bio: string
}

export const studio: StudioMember[] = [
  {
    name: 'Aiko Mori',
    role: 'Founding Partner / Creative Director',
    signature: 'make it sing.',
    accent: '#D7FF3A',
    bio: '前 Pentagram 资深设计师,12 年品牌与编辑设计经验。',
  },
  {
    name: 'Eliot Ren',
    role: 'Founding Partner / Motion Lead',
    signature: 'frame by frame.',
    accent: '#FF4D2E',
    bio: '独立动态设计师,作品见于 Apple 年度广告与多家国际音乐节。',
  },
  {
    name: 'Niko Hadid',
    role: 'Senior Designer',
    signature: 'less, then less.',
    accent: '#F2EFE9',
    bio: '专注意大利式编辑设计与字体文化,前 Bureau Borsche 设计师。',
  },
  {
    name: 'Mei Sato',
    role: 'Producer',
    signature: 'ship on time.',
    accent: '#D7FF3A',
    bio: '跨文化项目统筹,擅长把混乱的拍摄现场变成可执行的节奏表。',
  },
]
