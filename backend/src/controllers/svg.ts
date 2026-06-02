import type { Request, Response } from 'express'

export const generateAnimation = (req: Request, res: Response) => {
  const { svg, animations } = req.body
  
  try {
    let animatedSvg = svg
    
    if (animations && animations.length > 0) {
      animations.forEach((anim: any) => {
        const { target, type, duration, values } = anim
        
        if (type === 'translate') {
          const animateElement = `<animateTransform attributeName="transform" type="translate" values="${values.join(';')}" dur="${duration}s" repeatCount="indefinite"/>`
          animatedSvg = animatedSvg.replace(`</${target}>`, `${animateElement}</${target}>`)
        } else if (type === 'scale') {
          const animateElement = `<animateTransform attributeName="transform" type="scale" values="${values.join(';')}" dur="${duration}s" repeatCount="indefinite"/>`
          animatedSvg = animatedSvg.replace(`</${target}>`, `${animateElement}</${target}>`)
        } else if (type === 'rotate') {
          const animateElement = `<animateTransform attributeName="transform" type="rotate" values="${values.join(';')}" dur="${duration}s" repeatCount="indefinite"/>`
          animatedSvg = animatedSvg.replace(`</${target}>`, `${animateElement}</${target}>`)
        } else if (type === 'opacity') {
          const animateElement = `<animate attributeName="opacity" values="${values.join(';')}" dur="${duration}s" repeatCount="indefinite"/>`
          animatedSvg = animatedSvg.replace(`</${target}>`, `${animateElement}</${target}>`)
        }
      })
    }
    
    res.json({ success: true, data: animatedSvg })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate animation' })
  }
}

export const validateSVG = (req: Request, res: Response) => {
  const { svg } = req.body
  
  try {
    const parser = new (require('xmldom').DOMParser)()
    const doc = parser.parseFromString(svg, 'image/svg+xml')
    const errors = doc.getElementsByTagName('parsererror')
    
    if (errors.length > 0) {
      res.json({ success: false, valid: false, error: 'Invalid SVG' })
    } else {
      res.json({ success: true, valid: true })
    }
  } catch (error) {
    res.json({ success: false, valid: false, error: 'Validation failed' })
  }
}

export const optimizeSVG = (req: Request, res: Response) => {
  const { svg } = req.body
  
  try {
    const SVGO = require('svgo')
    const svgo = new SVGO()
    
    svgo.optimize(svg).then((result: any) => {
      res.json({ success: true, data: result.data })
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Optimization failed' })
  }
}