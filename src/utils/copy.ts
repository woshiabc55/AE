/** 复制文本到剪贴板 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      document.body.removeChild(ta);
      return false;
    }
  }
}

/** 将 SVG 字符串中的 viewBox 改为指定尺寸，便于显示 */
export function resizeSvg(svg: string, size: number): string {
  return svg
    .replace(/width="24"/, `width="${size}"`)
    .replace(/height="24"/, `height="${size}"`);
}

/** 生成不同格式的代码 */
export function asReact(svg: string, name: string): string {
  // 简单把 path 改造成 JSX
  const jsx = svg
    .replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, '')
    .replace(/<path d="([^"]+)" fill="none" stroke="currentColor"([^/]+)\/>/, (_m, d, attrs) => {
      return `<path d="${d}" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />`;
    })
    .replace(/<path d="([^"]+)" fill="currentColor"\/>/, (_m, d) => `<path d="${d}" fill="currentColor" />`);

  return `export const ${pascalCase(name)} = (props) => (\n  <svg viewBox="0 0 24 24" width={24} height={24} ${jsx.includes('fill="none"') ? 'fill="none"' : ''} {...props}>${jsx}</svg>\n);`;
}

export function asVue(svg: string, name: string): string {
  return `<template>\n  ${svg
    .replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, '')
    .replace(/width="24"/, 'width="24"')
    .replace(/height="24"/, 'height="24"')}\n</template>\n\n<script setup lang="ts">\ndefineOptions({ name: '${pascalCase(name)}' });\n</script>`;
}

export function asSvg(svg: string): string {
  return svg
    .replace('width="24"', 'width="{size}"')
    .replace('height="24"', 'height="{size}"')
    .replace('aria-hidden="true"', '');
}

function pascalCase(s: string): string {
  return s
    .split(/[-_\s]+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join('');
}

/** 下载 SVG 文件 */
export function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 下载 PNG（通过 canvas） */
export function downloadPng(svg: string, filename: string, size = 256): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('no ctx'));
        return;
      }
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((png) => {
        if (!png) {
          reject(new Error('png failed'));
          return;
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(png);
        a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
