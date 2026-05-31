import { Router, type Request, type Response } from 'express'
import { getDb } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

interface AchievementRow {
  id: string
  [key: string]: unknown
}

interface UserAchievementRow {
  achievement_id: string
}

const router = Router()

router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const { category } = req.query

    let sql = 'SELECT * FROM achievements WHERE 1=1'
    const params: (string | number)[] = []

    if (category) {
      sql += ' AND category = ?'
      params.push(category as string)
    }

    sql += ' ORDER BY category, requirement'

    const achievements = db.prepare(sql).all(...params)

    const userAchievements = db.prepare(`
      SELECT achievement_id FROM user_achievements WHERE user_id = ?
    `).all(req.user!.userId) as UserAchievementRow[]

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id))

    const result = achievements.map((a: AchievementRow) => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
    }))

    res.json({ success: true, data: result })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch achievements' })
  }
})

router.get('/leaderboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const { type = 'streak', limit = '10' } = req.query as Record<string, string>

    const limitNum = parseInt(limit, 10)

    let leaderboard: Record<string, unknown>[] = []

    if (type === 'streak') {
      leaderboard = db.prepare(`
        SELECT u.id, u.username, u.avatar, up.streak, up.longest_streak
        FROM users u JOIN user_progress up ON u.id = up.user_id
        ORDER BY up.streak DESC LIMIT ?
      `).all(limitNum) as Record<string, unknown>[]
    } else if (type === 'words') {
      leaderboard = db.prepare(`
        SELECT u.id, u.username, u.avatar, up.words_learned
        FROM users u JOIN user_progress up ON u.id = up.user_id
        ORDER BY up.words_learned DESC LIMIT ?
      `).all(limitNum) as Record<string, unknown>[]
    } else if (type === 'time') {
      leaderboard = db.prepare(`
        SELECT u.id, u.username, u.avatar, up.total_study_time
        FROM users u JOIN user_progress up ON u.id = up.user_id
        ORDER BY up.total_study_time DESC LIMIT ?
      `).all(limitNum) as Record<string, unknown>[]
    } else {
      leaderboard = db.prepare(`
        SELECT u.id, u.username, u.avatar, COUNT(ua.id) as achievement_count
        FROM users u LEFT JOIN user_achievements ua ON u.id = ua.user_id
        GROUP BY u.id ORDER BY achievement_count DESC LIMIT ?
      `).all(limitNum) as Record<string, unknown>[]
    }

    res.json({ success: true, data: leaderboard })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' })
  }
})

export default router
