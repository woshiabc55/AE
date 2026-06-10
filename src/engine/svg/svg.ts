/**
 * SVG 序列化引擎：将 Shape[] 序列化为标准 SVG 字符串
 * 用于栅格化、导出、可视化预览
 */
import type { Project, Shape } from "@/types";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const shapeToPath = (shape: Shape): string => {
  switch (shape.type) {
    case "rect": {
      const { x, y, width, height } = shape.bbox;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${height.toFixed(1)}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" />`;
    }
    case "ellipse": {
      const { x, y, width, height } = shape.bbox;
      const cx = (x + width / 2).toFixed(1);
      const cy = (y + height / 2).toFixed(1);
      const rx = (width / 2).toFixed(1);
      const ry = (height / 2).toFixed(1);
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" />`;
    }
    case "path":
    case "freehand":
      return `<path d="${shape.data}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" />`;
    case "text":
      return `<text x="${shape.bbox.x.toFixed(1)}" y="${(shape.bbox.y + shape.bbox.height).toFixed(1)}" fill="${shape.fill}" opacity="${shape.opacity}">${escapeXml(shape.data)}</text>`;
  }
};

export const projectToSvg = (project: Project): string => {
  const { canvasWidth, canvasHeight, shapes, groups } = project;
  const visibleGroups = groups.filter((g) => g.visible);

  let body = "";
  // 按分组渲染，便于切分
  for (const g of visibleGroups) {
    const groupShapes = shapes.filter((s) => s.parentId === g.id && s.visible);
    if (groupShapes.length === 0) continue;
    body += `<g id="${g.id}" data-name="${escapeXml(g.name)}" data-color="${g.color}">`;
    for (const s of groupShapes) {
      body += shapeToPath(s);
    }
    body += `</g>`;
  }
  // 顶层 shape
  const topShapes = shapes.filter((s) => s.parentId === null && s.visible);
  for (const s of topShapes) {
    body += shapeToPath(s);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${canvasHeight}" width="${canvasWidth}" height="${canvasHeight}">${body}</svg>`;
};

/**
 * 把 SVG 栅格化到指定尺寸的 canvas，返回 dataURL
 */
export const rasterizeSvg = async (
  svg: string,
  width: number,
  height: number,
  scale = 2
): Promise<{ canvas: HTMLCanvasElement; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("No 2D context"));
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ canvas, dataUrl: canvas.toDataURL("image/png") });
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
};
