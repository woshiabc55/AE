/**
 * 真实素材库 — 从 Fandom 公开 Wiki 收录的真实图片 URL。
 *
 * 数据来源：通过 Fandom MediaWiki API (`?action=query&prop=pageimages`) 离线获取，
 *          这些 URL 都是 `static.wikia.nocookie.net` CDN 上的真实图片资源。
 *
 * CDN 特性：`Access-Control-Allow-Origin: *`，可被 <img> 标签直接跨域加载。
 */

export interface RealAsset {
  url: string;
  source: string; // 来源 wiki 域名（仅展示用）
  type: "icon" | "render" | "splash" | "wallpaper";
  format: "png" | "jpg" | "webp" | "gif";
}

// === 王者荣耀 / Honor of Kings (圆形头像) ===
const HOK: Record<string, RealAsset> = {
  "李 白": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/c/c8/Li_Bai-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "貂蝉": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/6/6a/Diaochan-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "亚瑟": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/5/54/Arthur-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "妲己": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/2/2f/Daji-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "吕布": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/8/80/Lu_Bu-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "瑶": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/a/a0/Yao-big-circle.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "韩信": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/e/e1/Han_Xin-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "后羿": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/e/e3/Hou_Yi-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "廉颇": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/a/a3/Lian_Po-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "梦奇": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/a/a6/Meng_Ya-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
  "安琪拉": { url: "https://static.wikia.nocookie.net/honor-of-kings/images/8/8f/Angela-circle-big.png/revision/latest", source: "honor-of-kings.fandom.com", type: "icon", format: "png" },
};

// === 英雄联盟 / LoL (英雄原画 Render) ===
const LOL: Record<string, RealAsset> = {
  "ahri": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/f/f1/Ahri_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "yasuo": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/c/c9/Yasuo_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "jinx": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/c/c8/Jinx_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "lux": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/f/f4/Lux_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "thresh": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/b/bb/Thresh_Unbound_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "akali": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/e/ee/Akali_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "evelynn": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/3/34/Evelynn_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "ashe": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/4/40/Ashe_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "garen": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/b/ba/Garen_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "masteryi": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/e/e7/Master_Yi_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "sona": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/6/62/Sona_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "soraka": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/c/cd/Soraka_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "teemo": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/d/d6/Teemo_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "vayne": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/3/3b/Vayne_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "vi": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/2/2b/Vi_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "vladimir": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/6/6c/Vladimir_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
  "wukong": { url: "https://static.wikia.nocookie.net/leagueoflegends/images/d/dd/Wukong_Render.png/revision/latest", source: "leagueoflegends.fandom.com", type: "render", format: "png" },
};

// === 原神 / Genshin Impact (角色卡 Card) ===
const GENSHIN: Record<string, RealAsset> = {
  "raiden": { url: "https://static.wikia.nocookie.net/gensin-impact/images/6/60/Raiden_Shogun_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "nahida": { url: "https://static.wikia.nocookie.net/gensin-impact/images/4/4c/Nahida_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "hutao": { url: "https://static.wikia.nocookie.net/gensin-impact/images/8/88/Hu_Tao_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "furina": { url: "https://static.wikia.nocookie.net/gensin-impact/images/2/27/Furina_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "ayaka": { url: "https://static.wikia.nocookie.net/gensin-impact/images/0/01/Kamisato_Ayaka_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "zhongli": { url: "https://static.wikia.nocookie.net/gensin-impact/images/7/7b/Zhongli_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "xiao": { url: "https://static.wikia.nocookie.net/gensin-impact/images/7/7f/Xiao_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "ganyu": { url: "https://static.wikia.nocookie.net/gensin-impact/images/2/24/Ganyu_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "eula": { url: "https://static.wikia.nocookie.net/gensin-impact/images/0/0e/Eula_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "kazuha": { url: "https://static.wikia.nocookie.net/gensin-impact/images/8/81/Kaedehara_Kazuha_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
  "yelan": { url: "https://static.wikia.nocookie.net/gensin-impact/images/f/fd/Yelan_Card.png/revision/latest", source: "genshin-impact.fandom.com", type: "splash", format: "png" },
};

// === 我的世界 / Minecraft (实体图标) ===
const MINECRAFT: Record<string, RealAsset> = {
  "creeper": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5b/Creeper_JE2_BE1.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "ender-dragon": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/0a/Ender_Dragon.gif/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "gif" },
  "piglin": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6c/Piglin.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "wither": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3b/Wither_JE2_BE2.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "zombie": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/87/Zombie_JE3_BE2.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "skeleton": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/47/Skeleton_JE6_BE4.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "spider": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/1f/Spider_JE4_BE3.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "witch": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e6/Witch.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "blaze": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5a/Blaze.gif/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "gif" },
  "ghast": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d5/Ghast_JE2_BE2.gif/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "gif" },
  "slime": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/dd/Slime_JE3_BE2.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "magma-cube": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/ed/Magma_Cube.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "phantom": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/39/Phantom_JE2.gif/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "gif" },
  "guardian": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/94/Guardian.gif/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "gif" },
  "iron-golem": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/02/Iron_Golem_JE2_BE2.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
  "villager": { url: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d8/Plains_Villager_Base.png/revision/latest", source: "minecraft.fandom.com", type: "icon", format: "png" },
};

// === 合并：按 hero id 索引 ===
const REAL_BY_HERO: Record<string, RealAsset> = {
  // KOG
  "li-bai": HOK["李 白"],
  "diao-chan": HOK["貂蝉"],
  "arthur": HOK["亚瑟"],
  "daji": HOK["妲己"],
  "lu-bu": HOK["吕布"],
  "yao": HOK["瑶"],
  "han-xin": HOK["韩信"],
  "hou-yi": HOK["后羿"],
  "lian-po": HOK["廉颇"],
  // LOL
  "ahri": LOL["ahri"],
  "yasuo": LOL["yasuo"],
  "jinx": LOL["jinx"],
  "lux": LOL["lux"],
  "thresh": LOL["thresh"],
  // Genshin
  "raiden": GENSHIN["raiden"],
  "nahida": GENSHIN["nahida"],
  "hutao": GENSHIN["hutao"],
  "furina": GENSHIN["furina"],
  "ayaka": GENSHIN["ayaka"],
  "zhongli": GENSHIN["zhongli"],
  "xiao": GENSHIN["xiao"],
  "ganyu": GENSHIN["ganyu"],
  "eula": GENSHIN["eula"],
  "kazuha": GENSHIN["kazuha"],
  "yelan": GENSHIN["yelan"],
  // MC
  "creeper": MINECRAFT["creeper"],
  "ender-dragon": MINECRAFT["ender-dragon"],
};

// 全部 key 列表
export const REAL_ASSETS: Record<string, RealAsset> = {
  ...Object.fromEntries(
    Object.entries(HOK).map(([k, v]) => [`hok:${k}`, v]),
  ),
  ...Object.fromEntries(
    Object.entries(LOL).map(([k, v]) => [`lol:${k}`, v]),
  ),
  ...Object.fromEntries(
    Object.entries(GENSHIN).map(([k, v]) => [`gs:${k}`, v]),
  ),
  ...Object.fromEntries(
    Object.entries(MINECRAFT).map(([k, v]) => [`mc:${k}`, v]),
  ),
};

/** 通过英雄 id 获取真实素材 */
export function getRealAssetForHero(heroId: string): RealAsset | undefined {
  return REAL_BY_HERO[heroId];
}

/** 通过 category-key 获取真实素材（key 格式：'hok:李 白' 等） */
export function getRealAsset(key: string): RealAsset | undefined {
  return REAL_ASSETS[key];
}

/** 真实素材总数 */
export function realAssetCount(): number {
  return Object.keys(REAL_ASSETS).length;
}

/** 列出所有真实素材 */
export function allRealAssets(): { key: string; asset: RealAsset }[] {
  return Object.entries(REAL_ASSETS).map(([key, asset]) => ({ key, asset }));
}
