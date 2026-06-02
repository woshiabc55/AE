import type { Request, Response, NextFunction } from 'express'
import type { i18n as i18nType } from 'i18next'

export const i18nMiddleware = (i18n: i18nType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const lng = req.headers['accept-language'] || 'en'
    const supportedLngs = ['en', 'zh', 'ja', 'ko']
    const resolvedLng = supportedLngs.includes(lng.split(',')[0]) 
      ? lng.split(',')[0] 
      : 'en'
    
    i18n.changeLanguage(resolvedLng)
    ;(req as any).i18n = i18n
    next()
  }
}