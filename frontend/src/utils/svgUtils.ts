import type { Shape, Animation } from '../types'

export const generateShapeSVG = (shape: Shape): string => {
  const { id, type, x, y, width, height, radius, fill, stroke, strokeWidth, opacity } = shape
  
  switch (type) {
    case 'rect':
      return `<rect id="${id}" x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    
    case 'circle':
      return `<circle id="${id}" cx="${x + (width || 50) / 2}" cy="${y + (height || 50) / 2}" r="${radius || 25}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    
    case 'ellipse':
      return `<ellipse id="${id}" cx="${x + (width || 100) / 2}" cy="${y + (height || 50) / 2}" rx="${(width || 100) / 2}" ry="${(height || 50) / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    
    case 'line':
      return `<line id="${id}" x1="${x}" y1="${y}" x2="${x + (width || 100)}" y2="${y + (height || 0)}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    
    case 'polygon':
      const points = `${x},${y} ${x + (width || 50)},${y} ${x + (width || 50) / 2},${y + (height || 50)}`
      return `<polygon id="${id}" points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    
    case 'path':
      return `<path id="${id}" d="M${x} ${y} L${x + (width || 50)} ${y + (height || 50)}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    
    default:
      return ''
  }
}

export const generateAnimationSVG = (shapeSvg: string, animations: Animation[]): string => {
  let result = shapeSvg
  
  animations.forEach(anim => {
    const { type, duration, startValue, endValue } = anim
    
    if (type === 'translate') {
      const animate = `<animateTransform attributeName="transform" type="translate" values="${startValue};${endValue}" dur="${duration}s" repeatCount="indefinite"/>`
      result = result.replace('/>', `${animate}/>`)
    } else if (type === 'rotate') {
      const animate = `<animateTransform attributeName="transform" type="rotate" values="${startValue};${endValue}" dur="${duration}s" repeatCount="indefinite"/>`
      result = result.replace('/>', `${animate}/>`)
    } else if (type === 'scale') {
      const animate = `<animateTransform attributeName="transform" type="scale" values="${startValue};${endValue}" dur="${duration}s" repeatCount="indefinite"/>`
      result = result.replace('/>', `${animate}/>`)
    } else if (type === 'opacity') {
      const animate = `<animate attributeName="opacity" values="${startValue};${endValue}" dur="${duration}s" repeatCount="indefinite"/>`
      result = result.replace('/>', `${animate}/>`)
    }
  })
  
  return result
}

export const generateFullSVG = (shapes: Shape[], animations: Animation[]): string => {
  const shapesWithAnimations = shapes.map(shape => {
    const shapeSvg = generateShapeSVG(shape)
    const shapeAnimations = animations.filter(a => a.shapeId === shape.id)
    return generateAnimationSVG(shapeSvg, shapeAnimations)
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  ${shapesWithAnimations.join('\n  ')}
</svg>`
}

export const generateId = (): string => {
  return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}