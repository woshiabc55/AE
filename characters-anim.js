/* 角色动作帧扩展
   为现有角色添加 idle/walk1/walk2/attack/hurt/die/special 多状态动作帧
   通过修改 SCRIPT_DATA.characters 中的每个角色来添加 frames 字段
*/

(function() {
  // 颜色调色板
  const PALETTES = {
    zhaogy:   { Y:"#b8860b", C:"#f4d03f", R:"#fadbd8", F:"#fadbd8", B:"#5d4037", S:"#b03a2e", G:"#3e2723", D:"#8b1a1a", W:"#fff5e1", K:"#1a1a1a", P:"#3e2723" },
    shijt:    { Y:"#8b6f47", C:"#d4a373", R:"#fadbd8", S:"#8b6f47", B:"#5d4037", G:"#3e2723", F:"#fadbd8", K:"#1a1a1a", D:"#8b1a1a" },
    yelvdg:   { Y:"#3e2723", K:"#1a1a1a", C:"#3e2723", R:"#fadbd8", F:"#fadbd8", B:"#3e2723", S:"#5d4037", G:"#3e2723", D:"#8b1a1a", W:"#a89888" },
    yeluxg:   { Y:"#2c7873", K:"#1a3a3a", C:"#3a8a85", R:"#fadbd8", F:"#fadbd8", B:"#3e2723", S:"#2c7873", G:"#3e2723", D:"#8b1a1a", W:"#fff5e1", L:"#b8860b" },
    yangye:   { Y:"#d4a373", W:"#f5f5f5", C:"#f4d03f", R:"#fadbd8", F:"#fadbd8", B:"#5d4037", S:"#8b1a1a", G:"#3e2723", D:"#8b1a1a", L:"#b8860b", K:"#1a1a1a" },
    caobin:   { Y:"#1a3a5c", B:"#1a3a5c", C:"#3a5a8c", R:"#fadbd8", F:"#fadbd8", S:"#1a3a5c", G:"#3e2723", D:"#8b1a1a", L:"#b8860b" },
    panmei:   { Y:"#5d4e8c", P:"#5d4e8c", C:"#7d6e9c", R:"#fadbd8", F:"#fadbd8", B:"#3e2723", S:"#5d4e8c", G:"#3e2723", D:"#8b1a1a", L:"#b8860b" },
    han:      { Y:"#2c5f2d", H:"#2c5f2d", C:"#5d8a5d", R:"#fadbd8", F:"#fadbd8", B:"#3e2723", S:"#2c5f2d", G:"#3e2723", D:"#8b1a1a", L:"#b8860b" },
    xiaoyy:   { Y:"#8b1a1a", R:"#8b1a1a", C:"#c0392b", R2:"#fadbd8", F:"#fadbd8", B:"#3e2723", S:"#8b1a1a", G:"#3e2723", D:"#8b1a1a", L:"#b8860b", P:"#c0392b" },
    songjzy:  { Y:"#3a5a8c", B:"#3a5a8c", C:"#5a7aac", R:"#fadbd8", F:"#fadbd8", S:"#1a3a5c", G:"#3e2723", D:"#8b1a1a", L:"#b8860b" }
  };

  // 基础人物模板（仅身体部分，11 行 x 12 列）
  // 0=头, 1=身, 2=脚
  const head = (skin = "R", hair = "Y") => [
    `....${hair}${hair}${hair}${hair}....`,
    `...${hair}C${skin}${skin}${skin}${hair}...`,
    `..${hair}C${skin}${skin}${skin}${skin}${skin}${hair}..`,
    `..${hair}${skin}R${skin}${skin}${skin}R${skin}${hair}..`,
    `..${hair}${skin}F${skin}${skin}R${skin}${skin}${hair}..`,
    `..${hair}C${skin}${skin}${skin}${skin}${skin}${hair}..`,
    `...${hair}F${skin}${skin}${skin}${hair}...`
  ];
  const body = (cloth = "S", skin = "G") => [
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${skin}....${skin}${skin}..`,
    `..${skin}${skin}....${skin}${skin}..`,
    `.${cloth}${cloth}${cloth}....${cloth}${cloth}${cloth}.`
  ];
  const body2 = (cloth = "S", skin = "G") => [
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `.${skin}${skin}......${skin}${skin}.`,
    `.${skin}${skin}......${skin}${skin}.`,
    `${cloth}${cloth}${cloth}........${cloth}${cloth}${cloth}`
  ];
  const hurt = (cloth = "S", skin = "G") => [
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `.${skin}${skin}${skin}${skin}${skin}${skin}.....`,
    `${skin}${skin}${skin}${skin}${skin}${skin}.......`,
    `.${skin}${skin}${skin}${skin}${skin}${skin}.....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `.${skin}${skin}......${skin}${skin}.`,
    `${skin}${skin}........${skin}${skin}`,
    `${cloth}............${cloth}`
  ];
  const die = (cloth = "S", skin = "G") => [
    `${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}`,
    `${skin}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${skin}`,
    `${skin}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${skin}`,
    `${skin}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${skin}`,
    `${skin}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${skin}`,
    `${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}${cloth}`,
    `........................`,
    `........................`,
    `........................`,
    `........................`,
    `........................`,
    `........................`,
    `........................`,
    `........................`,
    `........................`,
    `........................`
  ];
  const special = (cloth = "S", skin = "G") => [
    `LLL${cloth}${cloth}${cloth}${cloth}LLL.`,
    `L..${cloth}${cloth}${cloth}${cloth}..L`,
    `.L.${cloth}${cloth}${cloth}${cloth}.L.`,
    `..L${cloth}${cloth}${cloth}${cloth}L..`,
    `...${skin}${skin}${skin}${skin}${skin}...`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${skin}....${skin}${skin}..`,
    `..${skin}${skin}....${skin}${skin}..`,
    `.${cloth}${cloth}${cloth}....${cloth}${cloth}${cloth}.`
  ];
  // 攻击帧 (武器在右侧)
  const attackBody = (cloth = "S", skin = "G", weapon = "L") => [
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}.${weapon}${weapon}${weapon}`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}..${weapon}${weapon}.`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}${weapon}...`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${cloth}${cloth}${cloth}${cloth}${skin}....`,
    `..${skin}${skin}....${skin}${skin}..`,
    `..${skin}${skin}....${skin}${skin}..`,
    `.${cloth}${cloth}${cloth}....${cloth}${cloth}${cloth}.`
  ];

  // 拼接头部和身体
  function makeFrame(h, b) { return h.concat(b); }

  // 为每个角色生成 frames
  const FRAMES_DATA = {
    zhaogy: {
      head: head("R", "Y"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "K")
    },
    shijt: {
      head: head("R", "Y"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "K")
    },
    yelvdg: {
      head: head("R", "K"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "W")
    },
    yeluxg: {
      head: head("R", "K"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    },
    yangye: {
      head: head("R", "W"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    },
    caobin: {
      head: head("R", "B"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    },
    panmei: {
      head: head("R", "P"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    },
    han: {
      head: head("R", "H"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    },
    xiaoyy: {
      head: head("R", "R"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    },
    songjzy: {
      head: head("R", "B"),
      body: body("S", "G"),
      body2: body2("S", "G"),
      bodyHurt: hurt("S", "G"),
      bodyDie: die("S", "G"),
      bodySpecial: special("S", "G"),
      bodyAttack: attackBody("S", "G", "L")
    }
  };

  // 等到 SCRIPT_DATA 加载完成
  function init() {
    if (!window.SCRIPT_DATA) { setTimeout(init, 50); return; }
    window.SCRIPT_DATA.characters.forEach(c => {
      if (!c.palette) c.palette = PALETTES[c.id] || PALETTES.zhaogy;
      const fd = FRAMES_DATA[c.id];
      if (!fd) return;
      c.frames = {
        idle: makeFrame(fd.head, fd.body),
        walk1: makeFrame(fd.head, fd.body),
        walk2: makeFrame(fd.head, fd.body2),
        attack: makeFrame(fd.head, fd.bodyAttack),
        hurt: fd.bodyHurt,
        die: fd.bodyDie,
        special: makeFrame(fd.head, fd.bodySpecial)
      };
    });
    window.dispatchEvent(new Event("charactersEnhanced"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
