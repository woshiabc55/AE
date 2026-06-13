// 像素生灵 sprite
// 编码：'.'=透明, '#'=墨色, 'r'=朱砂, 'g'=古松绿, 's'=纸面浅色, 'k'=深墨
export type Sprite = { name: string; grid: string[]; palette: Record<string, string> };

export const SPRITES: Record<string, Sprite> = {
  crane: {
    name: '飞鹤',
    palette: { '#': '#1B1612', 'r': '#A8341E', '.': 'transparent', 's': '#EFE4CC', 'k': '#3A2E22' },
    grid: [
      '....##......',
      '...####.....',
      '..##ss##....',
      '.##sss##rr..',
      '##sss##rr...',
      '##sss##r....',
      '.##ss##.....',
      '..####r.....',
      '...##.......',
      '..####......',
      '.#sss#......',
      '.#sss#......',
      '..##........',
      '...##.......',
      '....##......',
    ],
  },
  deer: {
    name: '走鹿',
    palette: { '#': '#1B1612', 'r': '#A8341E', '.': 'transparent', 's': '#D9C28A', 'k': '#6B4A2B' },
    grid: [
      '..#....#..',
      '.###..###.',
      '####.####.',
      '.######..#',
      '..####r..#',
      '...####..#',
      '..######.#',
      '.########.',
      '##.####.##',
      '##.####.##',
      '##......##',
    ],
  },
  fish: {
    name: '游鱼',
    palette: { '#': '#1B1612', 'r': '#A8341E', '.': 'transparent', 's': '#EFE4CC', 'k': '#3A2E22' },
    grid: [
      '........##',
      '.....####.',
      '..########',
      '##ssr##s##',
      '##ssr##s##',
      '..########',
      '.....####.',
      '........##',
    ],
  },
  sparrow: {
    name: '栖雀',
    palette: { '#': '#1B1612', 'r': '#A8341E', '.': 'transparent', 's': '#D9C28A', 'k': '#6B4A2B' },
    grid: [
      '..##.....',
      '.####....',
      '######r..',
      '..####r..',
      '..####r..',
      '.######..',
      '..##.##..',
      '.##..##..',
    ],
  },
  frog: {
    name: '蹲蛙',
    palette: { '#': '#1B1612', 'r': '#A8341E', '.': 'transparent', 's': '#6B4A2B', 'k': '#3A2E22' },
    grid: [
      '..####..',
      '.##ss##.',
      '##sss##.',
      '##k##k##',
      '########',
      '########',
      '.#s##s#.',
      '..#..#..',
    ],
  },
};

// 描出 sprite 的 SVG 路径
export function spriteToPath(grid: string[], palette: Record<string, string>, x: number, y: number, scale: number) {
  const rects: { fill: string; x: number; y: number; w: number; h: number }[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const ch = grid[row][col];
      if (ch === '.') continue;
      const fill = palette[ch];
      if (!fill || fill === 'transparent') continue;
      rects.push({ fill, x: x + col * scale, y: y + row * scale, w: scale, h: scale });
    }
  }
  return rects;
}
