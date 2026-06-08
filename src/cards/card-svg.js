/**
 * 卡牌渲染（完整 SVG 卡牌）
 * 不依赖任何图片资源，所有元素都是 SVG
 */

import { CARDS, RARITY, CARD_TYPES } from './cards.js';
import { portraits } from './portraits.js';

/**
 * 渲染一张完整的卡牌（返回 SVG 字符串）
 * @param {Object} card 来自 CARDS 的卡牌对象
 * @param {Object} opts { width, height, dimmed }
 */
export function renderCardSVG(card, opts = {}) {
  const w = opts.width || 130;
  const h = opts.height || 180;
  const isMinion = card.type === 'minion';
  const rarity = RARITY[card.rarity] || RARITY.COMMON;

  // 边框颜色按稀有度
  const frameColor = isMinion
    ? { common: '#8a7a4a', rare: '#3a8acc', epic: '#8a3acc', legendary: '#cc8a3a' }[card.rarity.toLowerCase()]
    : { common: '#8a4a4a', rare: '#3a8acc', epic: '#8a3acc', legendary: '#cc8a3a' }[card.rarity.toLowerCase()];

  // 内部渐变
  const frameGrad = isMinion
    ? `<linearGradient id="frame-${card.id}" x1="0" x2="0" y1="0" y2="1">
         <stop offset="0%" stop-color="#1a2a5a"/>
         <stop offset="50%" stop-color="#0a1a3a"/>
         <stop offset="100%" stop-color="#1a2a5a"/>
       </linearGradient>`
    : `<linearGradient id="frame-${card.id}" x1="0" x2="0" y1="0" y2="1">
         <stop offset="0%" stop-color="#5a1a1a"/>
         <stop offset="50%" stop-color="#3a0a0a"/>
         <stop offset="100%" stop-color="#5a1a1a"/>
       </linearGradient>`;

  // 宝石（稀有度）
  const gemSvg = renderGem(card.rarity);

  // 肖像区域背景
  const portraitBg = isMinion
    ? `<linearGradient id="pbg-${card.id}" x1="0" x2="0" y1="0" y2="1">
         <stop offset="0%" stop-color="#1a3a1a"/>
         <stop offset="100%" stop-color="#0a1a0a"/>
       </linearGradient>`
    : `<linearGradient id="pbg-${card.id}" x1="0" x2="0" y1="0" y2="1">
         <stop offset="0%" stop-color="#3a1a5a"/>
         <stop offset="100%" stop-color="#1a0a2a"/>
       </linearGradient>`;

  const portraitSvg = (portraits[card.portrait] || portraits.default)();

  // 边框装饰花纹
  const ornaments = renderOrnaments(card);

  // 法力水晶
  const mana = `
    <g transform="translate(0, 0)">
      <circle cx="20" cy="20" r="14" fill="#0a1a3a" stroke="#5fd1ff" stroke-width="2"/>
      <circle cx="20" cy="20" r="11" fill="url(#mana-grad-${card.id})"/>
      <text x="20" y="25" text-anchor="middle" font-family="Cinzel, serif" font-size="16" font-weight="800" fill="#fff" stroke="#1a3a5a" stroke-width="0.5">${card.cost}</text>
    </g>
    <defs>
      <radialGradient id="mana-grad-${card.id}" cx="30%" cy="30%">
        <stop offset="0%" stop-color="#8acdff"/>
        <stop offset="60%" stop-color="#3a8acc"/>
        <stop offset="100%" stop-color="#1a3a5a"/>
      </radialGradient>
    </defs>
  `;

  // 攻击水晶
  const attack = isMinion ? `
    <g transform="translate(0, ${h - 50})">
      <circle cx="20" cy="20" r="14" fill="#3a0a0a" stroke="#ffaa30" stroke-width="2"/>
      <circle cx="20" cy="20" r="11" fill="url(#atk-grad-${card.id})"/>
      <text x="20" y="25" text-anchor="middle" font-family="Cinzel, serif" font-size="16" font-weight="800" fill="#fff" stroke="#1a0a0a" stroke-width="0.5">${card.attack}</text>
    </g>
    <defs>
      <radialGradient id="atk-grad-${card.id}" cx="30%" cy="30%">
        <stop offset="0%" stop-color="#ffd76b"/>
        <stop offset="60%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#5a3a08"/>
      </radialGradient>
    </defs>
  ` : '';

  // 血量水晶
  const health = isMinion ? `
    <g transform="translate(${w - 40}, ${h - 50})">
      <circle cx="20" cy="20" r="14" fill="#0a3a0a" stroke="#a0ff60" stroke-width="2"/>
      <circle cx="20" cy="20" r="11" fill="url(#hp-grad-${card.id})"/>
      <text x="20" y="25" text-anchor="middle" font-family="Cinzel, serif" font-size="16" font-weight="800" fill="#fff" stroke="#0a1a0a" stroke-width="0.5">${card.health}</text>
    </g>
    <defs>
      <radialGradient id="hp-grad-${card.id}" cx="30%" cy="30%">
        <stop offset="0%" stop-color="#a0ff60"/>
        <stop offset="60%" stop-color="#3a8a3a"/>
        <stop offset="100%" stop-color="#0a2a0a"/>
      </radialGradient>
    </defs>
  ` : '';

  // 关键词图标（嘲讽、圣盾等）
  const keywords = (card.keywords || []).map((kw) => renderKeywordIcon(kw, card.id)).join('');

  // 标题
  const title = `
    <rect x="6" y="${h - 78}" width="${w - 12}" height="22" fill="#0a0420" opacity="0.85" stroke="${frameColor}" stroke-width="0.5"/>
    <text x="${w / 2}" y="${h - 62}" text-anchor="middle" font-family="Cinzel, serif" font-size="11" font-weight="600" fill="#ffd76b" letter-spacing="0.06em">${card.name}</text>
  `;

  // 描述
  const descLines = wrapText(card.text || (isMinion ? '' : ''), w - 18, 9);
  const descY = h - 50;
  const desc = descLines.length > 0 ? `
    <rect x="6" y="${descY}" width="${w - 12}" height="22" fill="#0a0420" opacity="0.6" stroke="${frameColor}" stroke-width="0.3"/>
    ${descLines.map((line, i) => `<text x="${w / 2}" y="${descY + 9 + i * 8}" text-anchor="middle" font-family="Crimson Text, serif" font-size="8" font-style="italic" fill="#e8d4a2">${escapeXml(line)}</text>`).join('')}
  ` : '';

  return `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" class="card-svg">
      <defs>
        ${frameGrad}
        ${portraitBg}
        <filter id="card-shadow-${card.id}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="0" dy="2"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="card-base-${card.id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${frameColor}"/>
          <stop offset="50%" stop-color="#ffd76b"/>
          <stop offset="100%" stop-color="${frameColor}"/>
        </linearGradient>
      </defs>
      <!-- 卡片底板 -->
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="6" fill="url(#card-base-${card.id})" filter="url(#card-shadow-${card.id})"/>
      <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="4" fill="#0a0420"/>
      <!-- 内部背景 -->
      <rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="3" fill="url(#frame-${card.id})"/>
      <!-- 肖像背景 -->
      <rect x="12" y="12" width="${w - 24}" height="${h - 70}" rx="2" fill="url(#pbg-${card.id})"/>
      <g transform="translate(12, 12)">
        <svg viewBox="0 0 100 100" width="${w - 24}" height="${h - 70}" preserveAspectRatio="xMidYMid slice">${portraitSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}</svg>
      </g>
      <!-- 边框装饰 -->
      ${ornaments}
      <!-- 法力水晶 -->
      ${mana}
      <!-- 攻击水晶 -->
      ${attack}
      <!-- 血量水晶 -->
      ${health}
      <!-- 关键词图标 -->
      ${keywords}
      <!-- 标题 -->
      ${title}
      <!-- 描述 -->
      ${desc}
      <!-- 稀有度宝石 -->
      ${gemSvg}
      ${opts.dimmed ? '<rect x="0" y="0" width="100%" height="100%" rx="6" fill="#000" opacity="0.55"/>' : ''}
    </svg>
  `;
}

function renderGem(rarity) {
  const colors = {
    COMMON: '#d4d4d4',
    RARE: '#5fd1ff',
    EPIC: '#c25fff',
    LEGENDARY: '#ffaa30',
  };
  const c = colors[rarity] || '#d4d4d4';
  return `
    <g transform="translate(0, 0)">
      <polygon points="14,3 17,6 14,9 11,6" fill="${c}" stroke="#fff" stroke-width="0.3"/>
    </g>
  `;
}

function renderOrnaments(card) {
  return `
    <g stroke="#d4af37" fill="none" stroke-width="0.6" opacity="0.85">
      <path d="M8 8 L20 8 M8 8 L8 20"/>
      <path d="M${130 - 8} 8 L${130 - 20} 8 M${130 - 8} 8 L${130 - 8} 20"/>
      <path d="M8 ${180 - 8} L20 ${180 - 8} M8 ${180 - 8} L8 ${180 - 20}"/>
      <path d="M${130 - 8} ${180 - 8} L${130 - 20} ${180 - 8} M${130 - 8} ${180 - 8} L${130 - 8} ${180 - 20}"/>
    </g>
    <g fill="#d4af37" opacity="0.7">
      <circle cx="14" cy="14" r="1.2"/>
      <circle cx="${130 - 14}" cy="14" r="1.2"/>
      <circle cx="14" cy="${180 - 14}" r="1.2"/>
      <circle cx="${130 - 14}" cy="${180 - 14}" r="1.2"/>
    </g>
  `;
}

function renderKeywordIcon(keyword, id) {
  if (keyword === 'taunt') {
    return `
      <g transform="translate(50, ${180 - 50})">
        <path d="M0 -10 L-12 -2 L-12 8 L0 12 L12 8 L12 -2 Z" fill="#8a6d1f" stroke="#ffd76b" stroke-width="1.5"/>
        <path d="M-5 -2 L-2 1 L5 -4" stroke="#ffd76b" stroke-width="1.5" fill="none"/>
      </g>
    `;
  }
  if (keyword === 'divine_shield') {
    return `
      <g transform="translate(50, ${180 - 50})">
        <circle cx="0" cy="0" r="9" fill="none" stroke="#ffd76b" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="5" fill="#ffd76b" opacity="0.4"/>
      </g>
    `;
  }
  return '';
}

function wrapText(text, maxWidth, fontSize) {
  if (!text) return [];
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
  const lines = [];
  let line = '';
  for (const ch of text) {
    line += ch;
    if (line.length >= charsPerLine) {
      lines.push(line);
      line = '';
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[c]);
}

/**
 * 渲染卡背
 */
export function renderCardBackSVG(opts = {}) {
  const w = opts.width || 70;
  const h = opts.height || 100;
  return `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="cb-base" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#5a3a08"/>
          <stop offset="50%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#5a3a08"/>
        </linearGradient>
        <radialGradient id="cb-center" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#8a3a08"/>
          <stop offset="100%" stop-color="#1a0a08"/>
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="4" fill="url(#cb-base)"/>
      <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="3" fill="url(#cb-center)"/>
      <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 4}" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.7"/>
      <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 5}" fill="none" stroke="#d4af37" stroke-width="0.6" opacity="0.5"/>
      <path d="M${w / 2} ${h / 2 - 12} L${w / 2 + 8} ${h / 2} L${w / 2} ${h / 2 + 12} L${w / 2 - 8} ${h / 2} Z" fill="#d4af37" opacity="0.8"/>
      <circle cx="${w / 2}" cy="${h / 2}" r="3" fill="#ffd76b"/>
    </svg>
  `;
}
