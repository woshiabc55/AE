import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../db.js'
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js'

interface UserRow {
  id: string
  email: string
  username: string
  avatar: string | null
  target_language: string
  level: string
  password_hash: string
  created_at: string
}

const router = Router()

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, target_language } = req.body as Record<string, string>

    if (!email || !password || !username) {
      res.status(400).json({ success: false, error: 'Email, password and username are required' })
      return
    }

    const db = getDb()
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      res.status(409).json({ success: false, error: 'Email already registered' })
      return
    }

    const userId = uuidv4()
    const passwordHash = bcrypt.hashSync(password, 10)

    db.prepare(`
      INSERT INTO users (id, email, password_hash, username, target_language, level)
      VALUES (?, ?, ?, ?, ?, 'A1')
    `).run(userId, email, passwordHash, username, target_language || 'en')

    db.prepare(`
      INSERT INTO user_progress (id, user_id, language, current_level, total_study_time, words_learned, courses_completed, streak, longest_streak)
      VALUES (?, ?, ?, 'A1', 0, 0, 0, 0, 0)
    `).run(uuidv4(), userId, target_language || 'en')

    const token = jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: userId, email, username, target_language: target_language || 'en', level: 'A1' },
      },
    })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Registration failed' })
  }
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as Record<string, string>

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' })
      return
    }

    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      res.status(401).json({ success: false, error: 'Invalid email or password' })
      return
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          target_language: user.target_language,
          level: user.level,
        },
      },
    })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const user = db.prepare('SELECT id, email, username, avatar, target_language, level, created_at FROM users WHERE id = ?').get(req.user!.userId) as UserRow | undefined

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }

    res.json({ success: true, data: user })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to get user info' })
  }
})

export default router
