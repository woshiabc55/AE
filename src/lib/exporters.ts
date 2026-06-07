import type { Live2DProjectData, SvgProjectData, Project } from '@/types';
import { resolveTransform } from '@/engine/svgRenderer';
import { downloadFile } from '@/lib/utils';

export function exportSvgProject(data: SvgProjectData, projectName: string) {
  // 序列化:把每个图层的动画时间线转换为 SMIL <animate> 标签
  const { width, height, layers, tracks, duration, background } = data;
  const layerEls = layers.map((layer) => {
    const t = resolveTransform(layer, tracks, 0);
    const layerTracks = tracks.filter((tr) => tr.layerId === layer.id);
    const motionTracks = layerTracks.filter((tr) => tr.keyframes.length >= 2);

    const transformAttr = `translate(${t.x} ${t.y}) rotate(${t.rotate}) scale(${t.scaleX} ${t.scaleY})`;
    const commonStyle = `opacity:${t.opacity};fill:${layer.style.fill ?? '#7CF9FF'};`;

    let animTags = '';
    motionTracks.forEach((tr) => {
      const values = tr.keyframes.map((k) => k.value).join(';');
      const keyTimes = tr.keyframes.map((k) => (k.time / duration).toFixed(4)).join(';');
      const attrName =
        tr.property === 'x'
          ? 'transform'
          : tr.property === 'y'
            ? 'transform'
            : tr.property === 'rotate'
              ? 'transform'
              : tr.property === 'opacity'
                ? 'opacity'
                : tr.property === 'fill'
                  ? 'fill'
                  : tr.property;
      // 简化:rotate/scale 用 transform 组合
      if (tr.property === 'rotate' || tr.property === 'x' || tr.property === 'y') {
        const animValues = tr.keyframes
          .map((k) => {
            const x = tr.property === 'x' ? Number(k.value) : t.x;
            const y = tr.property === 'y' ? Number(k.value) : t.y;
            const r = tr.property === 'rotate' ? Number(k.value) : t.rotate;
            return `translate(${x} ${y}) rotate(${r}) scale(${t.scaleX} ${t.scaleY})`;
          })
          .join(';');
        animTags += `<animateTransform attributeName="transform" type="translate" values="${animValues}" keyTimes="${keyTimes}" dur="${duration}s" repeatCount="indefinite" />`;
      } else {
        animTags += `<animate attributeName="${attrName}" values="${values}" keyTimes="${keyTimes}" dur="${duration}s" repeatCount="indefinite" />`;
      }
    });

    const baseAttr = `transform="${transformAttr}" style="${commonStyle}"`;
    let shape = '';
    switch (layer.kind) {
      case 'rect': {
        const { x = 0, y = 0, width: w = 100, height: h = 100, rx = 0 } = layer.attrs as Record<string, number>;
        shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${baseAttr}>${animTags}</rect>`;
        break;
      }
      case 'circle': {
        const { cx = 0, cy = 0, r = 50 } = layer.attrs as Record<string, number>;
        shape = `<circle cx="${cx}" cy="${cy}" r="${r}" ${baseAttr}>${animTags}</circle>`;
        break;
      }
      case 'ellipse': {
        const { cx = 0, cy = 0, rx = 60, ry = 30 } = layer.attrs as Record<string, number>;
        shape = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${baseAttr}>${animTags}</ellipse>`;
        break;
      }
      case 'path':
        shape = `<path d="${layer.d || ''}" ${baseAttr}>${animTags}</path>`;
        break;
      case 'text': {
        const { x = 0, y = 0, fontSize = 32 } = layer.attrs as Record<string, number>;
        shape = `<text x="${x}" y="${y}" font-size="${fontSize}" ${baseAttr}>${layer.text ?? ''}${animTags}</text>`;
        break;
      }
      case 'polygon': {
        const { points = '' } = layer.attrs as Record<string, string>;
        shape = `<polygon points="${points}" ${baseAttr}>${animTags}</polygon>`;
        break;
      }
    }
    return shape;
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="${background}" />
  ${layerEls.join('\n  ')}
</svg>`;
  downloadFile(`${projectName}.svg`, svg, 'image/svg+xml');
}

export function exportSvgCss(data: SvgProjectData, projectName: string) {
  const { width, height, layers, tracks, duration, background } = data;
  const keyframesCss: string[] = [];
  const layerCss: string[] = [];
  layers.forEach((layer, idx) => {
    const t0 = resolveTransform(layer, tracks, 0);
    const layerTracks = tracks.filter((tr) => tr.layerId === layer.id);
    const animName = `anim-${layer.id}`;
    const transformKeyframes: string[] = [];
    const opacityKeyframes: string[] = [];

    // 在每个关键时间点收集
    const times = new Set<number>([0, duration]);
    layerTracks.forEach((tr) => tr.keyframes.forEach((k) => times.add(k.time)));
    const sortedTimes = Array.from(times).sort((a, b) => a - b);

    sortedTimes.forEach((time) => {
      const t = resolveTransform(layer, tracks, time);
      transformKeyframes.push(`${((time / duration) * 100).toFixed(2)}% { transform: translate(${t.x}px, ${t.y}px) rotate(${t.rotate}deg) scale(${t.scaleX}, ${t.scaleY}); opacity: ${t.opacity}; }`);
    });

    keyframesCss.push(`@keyframes ${animName} {\n  ${transformKeyframes.join('\n  ')}\n}`);
    const baseStyle = `position:absolute;left:0;top:0;width:auto;height:auto;`;
    const commonStyle = `fill:${layer.style.fill ?? '#7CF9FF'};`;
    layerCss.push(`#layer-${layer.id} { ${baseStyle} ${commonStyle} animation: ${animName} ${duration}s linear infinite; }`);
  });

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${projectName}</title>
<style>
  body{margin:0;display:grid;place-items:center;min-height:100vh;background:${background};}
  .stage{position:relative;width:${width}px;height:${height}px;}
  ${keyframesCss.join('\n')}
  ${layerCss.join('\n')}
</style>
</head>
<body>
  <div class="stage">
    ${layers
      .map(
        (l) =>
          `<${l.kind === 'path' ? 'path' : l.kind === 'text' ? 'text' : l.kind === 'circle' ? 'circle' : l.kind === 'ellipse' ? 'ellipse' : l.kind === 'rect' ? 'rect' : l.kind === 'polygon' ? 'polygon' : 'g'} id="layer-${l.id}" d="${l.d ?? ''}" />`,
      )
      .join('\n')}
  </div>
</body>
</html>`;
  downloadFile(`${projectName}.html`, html, 'text/html');
}

export function exportCubismJson(data: Live2DProjectData, projectName: string) {
  // 输出 Cubism 兼容结构 (简化)
  const json = {
    Version: 3,
    model: {
      canvas: data.canvas,
      parts: data.parts.map((p) => ({
        id: p.id,
        name: p.name,
        kind: p.kind,
        z: p.z,
        meshRows: p.meshRows,
        meshCols: p.meshCols,
        anchor: p.anchor,
        fill: p.fill,
        stroke: p.stroke,
        vertices: p.vertices,
        bindings: p.bindings,
      })),
    },
    parameters: data.parameters,
    motions: data.motions.map((m) => ({
      file: `${m.id}.motion.json`,
      fade_in_time: m.fadeIn,
      fade_out_time: m.fadeOut,
      loop: m.loop,
      trigger: m.trigger,
      name: m.name,
    })),
    expressions: data.expressions,
  };
  downloadFile(`${projectName}.cubism.json`, JSON.stringify(json, null, 2), 'application/json');
}

export function exportProjectJson(p: Project) {
  downloadFile(`${p.name}.aniforge.json`, JSON.stringify(p, null, 2), 'application/json');
}
