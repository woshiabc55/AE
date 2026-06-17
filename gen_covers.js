const fs = require('fs');
const path = require('path');

// 读取 games_meta.js 并提取 GAMES_META 数组
const code = fs.readFileSync('/workspace/games_meta.js', 'utf8');
// 在 Node 中 eval 这个文件
const wrapper = '(function(){' + code + '; return GAMES_META;})()';
const games = eval(wrapper);
console.log('解析到', games.length, '款游戏');

const CATEGORY_THEMES = {
  moba:     [['#1a3a6e', '#0a1830', '#3a78d0'], ['#5a1a1a', '#0a0303', '#c83232']],
  rpg:      [['#2a1a4a', '#0a0518', '#8a4ad0'], ['#1a4a3a', '#031008', '#3ac88a'], ['#4a1a3a', '#0a0510', '#d04a8a']],
  fps:      [['#1a1a1a', '#000000', '#5a5a5a'], ['#2a2a3a', '#050510', '#7a7a9a']],
  action:   [['#3a1a1a', '#0a0505', '#d05a4a']],
  horror:   [['#0a0a1a', '#000000', '#3a2a4a']],
  adventure:[['#1a3a4a', '#03101a', '#5ac8d0']],
  party:    [['#3a1a4a', '#0a0510', '#d0a04a']],
  strategy: [['#1a2a3a', '#03080a', '#5a8ab0']],
  card:     [['#3a2a1a', '#0a0805', '#c8a04a']],
  fighting: [['#2a1a0a', '#0a0500', '#c84a2a']],
  mmo:      [['#2a3a4a', '#050a10', '#5a9ad0']],
  racing:   [['#3a1a1a', '#0a0505', '#d03030']],
};

function makeCover(g, idx) {
  const cat = g.category;
  const themes = CATEGORY_THEMES[cat] || CATEGORY_THEMES.rpg;
  const [c1, c2, accent] = themes[idx % themes.length];
  const name = g.name;
  const en = g.en_name;
  const initial = name[0];
  const style = idx % 6;
  
  let deco = '';
  if (style === 0) {
    deco = `
      <rect x="200" y="60" width="160" height="160" rx="6" fill="none" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <text x="280" y="170" font-family="serif" font-size="80" fill="${accent}" text-anchor="middle" font-weight="900" opacity="0.6">${initial}</text>
      <line x1="210" y1="180" x2="350" y2="180" stroke="${accent}" stroke-width="1" opacity="0.3"/>`;
  } else if (style === 1) {
    deco = `
      <circle cx="280" cy="140" r="80" fill="none" stroke="${accent}" stroke-width="2" opacity="0.3"/>
      <circle cx="280" cy="140" r="65" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2"/>
      <text x="280" y="170" font-family="serif" font-size="60" fill="${accent}" text-anchor="middle" font-weight="900" opacity="0.7">${initial}</text>`;
  } else if (style === 2) {
    deco = `
      <line x1="220" y1="100" x2="340" y2="100" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <line x1="220" y1="120" x2="340" y2="120" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <line x1="220" y1="140" x2="280" y2="140" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <line x1="295" y1="140" x2="340" y2="140" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <line x1="220" y1="160" x2="340" y2="160" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <line x1="220" y1="180" x2="280" y2="180" stroke="${accent}" stroke-width="3" opacity="0.4"/>
      <line x1="295" y1="180" x2="340" y2="180" stroke="${accent}" stroke-width="3" opacity="0.4"/>`;
  } else if (style === 3) {
    deco = `
      <circle cx="280" cy="140" r="90" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2"/>
      <circle cx="280" cy="140" r="70" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <circle cx="280" cy="140" r="50" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
      <text x="280" y="160" font-family="serif" font-size="48" fill="${accent}" text-anchor="middle" font-weight="900" opacity="0.8">${initial}</text>`;
  } else if (style === 4) {
    deco = `
      <line x1="180" y1="80" x2="380" y2="80" stroke="${accent}" stroke-width="1" opacity="0.4"/>
      <line x1="180" y1="200" x2="380" y2="200" stroke="${accent}" stroke-width="1" opacity="0.4"/>
      <line x1="200" y1="140" x2="240" y2="140" stroke="${accent}" stroke-width="2" opacity="0.5"/>
      <line x1="320" y1="140" x2="360" y2="140" stroke="${accent}" stroke-width="2" opacity="0.5"/>
      <text x="280" y="170" font-family="serif" font-size="64" fill="${accent}" text-anchor="middle" font-weight="900" opacity="0.7">${initial}</text>`;
  } else {
    deco = `
      <line x1="160" y1="220" x2="220" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <line x1="200" y1="220" x2="260" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <line x1="240" y1="220" x2="300" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <line x1="280" y1="220" x2="340" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <line x1="320" y1="220" x2="380" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <text x="280" y="170" font-family="serif" font-size="64" fill="${accent}" text-anchor="middle" font-weight="900" opacity="0.6">${initial}</text>`;
  }
  
  const nameSize = name.length <= 4 ? 28 : 22;
  const enSize = en.length <= 14 ? 12 : 10;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="bg${idx}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="60%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#050302"/>
    </radialGradient>
    <linearGradient id="text${idx}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5e1a4"/>
      <stop offset="100%" stop-color="#8b6a2b"/>
    </linearGradient>
  </defs>
  <rect width="560" height="240" fill="url(#bg${idx})"/>
  ${deco}
  <rect x="0" y="200" width="560" height="40" fill="rgba(0,0,0,0.5)"/>
  <text x="20" y="226" font-family="serif" font-size="${nameSize}" fill="url(#text${idx})" font-weight="900" letter-spacing="0.1em">${name}</text>
  <text x="540" y="226" font-family="serif" font-size="${enSize}" fill="#a78a5a" text-anchor="end" letter-spacing="0.1em">${en.slice(0,18)}</text>
</svg>`;
}

const dir = '/workspace/covers';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const outMeta = {};
for (let i = 0; i < games.length; i++) {
  const g = games[i];
  const svg = makeCover(g, i);
  const fname = `cover_${g.id}.svg`;
  fs.writeFileSync(path.join(dir, fname), svg);
  outMeta[g.id] = fname;
}
console.log('生成', Object.keys(outMeta).length, '个 SVG');
fs.writeFileSync('/workspace/cover_index.json', JSON.stringify(outMeta, null, 2));
