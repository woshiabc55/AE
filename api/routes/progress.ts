import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

interface ProgressRow {
  streak: number
  longest_streak: number
  last_study_date: string
  [key: string]: unknown
}

interface LessonRow {
  type: string
  [key: string]: unknown
}

interface CountRow {
  count: number
}

interface AvgRow {
  avg: number
}

const router = Router()

router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(req.user!.userId) as ProgressRow | undefined

    if (!progress) {
      res.status(404).json({ success: false, error: 'Progress not found' })
      return
    }

    res.json({ success: true, data: progress })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch progress' })
  }
})

router.post('/lesson', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { lesson_id, score, time_spent } = req.body as Record<string, string | number>

    if (!lesson_id || score === undefined || time_spent === undefined) {
      res.status(400).json({ success: false, error: 'lesson_id, score and time_spent are required' })
      return
    }

    const db = getDb()
    const userId = req.user!.userId

    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lesson_id) as LessonRow | undefined
    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' })
      return
    }

    db.prepare(`
      INSERT INTO study_records (id, user_id, lesson_id, score, time_spent)
      VALUES (?, ?, ?, ?, ?)
    `).run(uuidv4(), userId, lesson_id as string, score as number, time_spent as number)

    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(userId) as ProgressRow | undefined
    if (progress) {
      const today = new Date().toISOString().split('T')[0]
      const lastDate = progress.last_study_date
      let newStreak = progress.streak

      if (lastDate !== today) {
        if (lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
          newStreak += 1
        } else {
          newStreak = 1
        }
      }

      const newLongestStreak = Math.max(newStreak, progress.longest_streak)
      const wordsToAdd = lesson.type === 'vocabulary' ? 4 : 0

      db.prepare(`
        UPDATE user_progress
        SET total_study_time = total_study_time + ?,
            words_learned = words_learned + ?,
            streak = ?,
            longest_streak = ?,
            last_study_date = ?
        WHERE user_id = ?
      `).run(time_spent as number, wordsToAdd, newStreak, newLongestStreak, today, userId)
    }

    res.json({ success: true, data: { score, time_spent } })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to submit lesson result' })
  }
})

router.get('/calendar', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const { month } = req.query as Record<string, string>

    let sql = 'SELECT DATE(completed_at) as date, COUNT(*) as count, SUM(time_spent) as total_time FROM study_records WHERE user_id = ?'
    const params: (string | number)[] = [req.user!.userId]

    if (month && typeof month === 'string') {
      sql += ' AND strftime("%Y-%m", completed_at) = ?'
      params.push(month)
    }

    sql += ' GROUP BY DATE(completed_at) ORDER BY date'

    const records = db.prepare(sql).all(...params)
    res.json({ success: true, data: records })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch calendar data' })
  }
})

router.get('/stats', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const userId = req.user!.userId

    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(userId) as ProgressRow | undefined
    const totalLessons = db.prepare('SELECT COUNT(*) as count FROM study_records WHERE user_id = ?').get(userId) as CountRow | undefined
    const avgScore = db.prepare('SELECT AVG(score) as avg FROM study_records WHERE user_id = ?').get(userId) as AvgRow | undefined
    const recentRecords = db.prepare('SELECT sr.*, l.title as lesson_title, l.type as lesson_type FROM study_records sr JOIN lessons l ON sr.lesson_id = l.id WHERE sr.user_id = ? ORDER BY sr.completed_at DESC LIMIT 10').all(userId)

    res.json({
      success: true,
      data: {
        progress: progress || null,
        total_lessons_completed: totalLessons?.count || 0,
        average_score: Math.round(avgScore?.avg || 0),
        recent_records: recentRecords,
      },
    })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' })
  }
})

export default router
