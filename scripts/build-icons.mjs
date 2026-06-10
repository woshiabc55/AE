// 纯 Node PNG 生成器：为 PWA 生成多尺寸像素图 L 字母图标
// 像素图足够清晰，避免 SVG→PNG 转换的依赖问题
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, crc32 } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

// CRC32 已在 Node 22+ 内置；旧版本使用这里的手动实现
function makeCrc32() {
  if (typeof crc32 === "function") return crc32;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
}
const crcFn = makeCrc32();

// 像素数据：RGBA，每行前缀 0x00
function makePixelData(size) {
  // 颜色：背景 #0a0a0a，琥珀 #f4c870，边框 #1a1410
  const BG = [10, 10, 10, 255];
  const AMBER = [244, 200, 112, 255];
  const DARK = [26, 20, 16, 255];
  const ROWS = [];
  // 中心区域
  const margin = Math.max(2, Math.floor(size * 0.12));
  const inner = size - margin * 2;
  // 在 inner×inner 画布上画 L
  // L 由：上竖条 + 下横条
  const Lthick = Math.max(2, Math.floor(inner * 0.18));
  const Lwidth = Math.max(2, Math.floor(inner * 0.6));
  const Lleft = margin + Math.floor((inner - Lwidth) / 2);
  const Ltop = margin + Math.floor(inner * 0.15);
  const Lbottom = margin + Math.floor(inner * 0.85);

  for (let y = 0; y < size; y++) {
    const row = [0x00]; // filter
    for (let x = 0; x < size; x++) {
      let c = BG;
      // 边框
      if (x === 0 || y === 0 || x === size - 1 || y === size - 1) c = DARK;
      // L 竖条
      if (
        x >= Lleft &&
        x < Lleft + Lthick &&
        y >= Ltop &&
        y < Lbottom
      )
        c = AMBER;
      // L 横条
      if (
        y >= Lbottom - Lthick &&
        y < Lbottom &&
        x >= Lleft &&
        x < Lleft + Lwidth
      )
        c = AMBER;
      row.push(c[0], c[1], c[2], c[3]);
    }
    ROWS.push(Buffer.from(row));
  }
  return Buffer.concat(ROWS);
}

// 编码为 PNG
function encodePNG(size) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk("IHDR", ihdrData);
  // IDAT
  const pixelData = makePixelData(size);
  const idat = makeChunk("IDAT", deflateSync(pixelData));
  // IEND
  const iend = makeChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crcFn(crcInput) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

const sizes = [
  { size: 16, name: "favicon-16.png" },
  { size: 32, name: "favicon-32.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 512, name: "icon-maskable.png" },
];

for (const { size, name } of sizes) {
  const buf = encodePNG(size);
  writeFileSync(join(outDir, name), buf);
  console.log(`✓ ${name} (${size}x${size}, ${buf.length}B)`);
}

// favicon.svg 副本
import { readFileSync, copyFileSync } from "node:fs";
copyFileSync(join(outDir, "icon.svg"), join(__dirname, "..", "public", "favicon.svg"));
console.log("✓ favicon.svg");

console.log("\n🎬 PWA 图标生成完毕");
