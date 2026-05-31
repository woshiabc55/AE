import { Router, type Request, type Response } from 'express'
import { getDb } from '../db.js'

interface CourseRow {
  id: string
  [key: string]: unknown
}

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const { language, level } = req.query as Record<string, string>

    let sql = 'SELECT * FROM courses WHERE 1=1'
    const params: (string | number)[] = []

    if (language) {
      sql += ' AND language = ?'
      params.push(language)
    }
    if (level) {
      sql += ' AND level = ?'
      params.push(level)
    }

    sql += ' ORDER BY language, level'

    const courses = db.prepare(sql).all(...params)
    res.json({ success: true, data: courses })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch courses' })
  }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id) as CourseRow | undefined

    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' })
      return
    }

    res.json({ success: true, data: course })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch course' })
  }
})

router.get('/:id/lessons', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(req.params.id) as CourseRow | undefined

    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' })
      return
    }

    const lessons = db.prepare('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_num').all(req.params.id)
    res.json({ success: true, data: lessons })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch lessons' })
  }
})

export default router
