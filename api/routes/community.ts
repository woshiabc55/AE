import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

interface PostRow {
  id: string
  likes: number
  [key: string]: unknown
}

interface CountRow {
  total: number
}

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const { language_tag, page = '1', limit = '10' } = req.query as Record<string, string>

    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const offset = (pageNum - 1) * limitNum

    let sql = `SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE 1=1`
    const params: (string | number)[] = []

    if (language_tag) {
      sql += ' AND p.language_tag = ?'
      params.push(language_tag)
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limitNum, offset)

    const posts = db.prepare(sql).all(...params)

    let countSql = 'SELECT COUNT(*) as total FROM posts WHERE 1=1'
    const countParams: (string | number)[] = []
    if (language_tag) {
      countSql += ' AND language_tag = ?'
      countParams.push(language_tag)
    }
    const total = db.prepare(countSql).get(...countParams) as CountRow

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total.total,
          totalPages: Math.ceil(total.total / limitNum),
        },
      },
    })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch posts' })
  }
})

router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, language_tag } = req.body as Record<string, string>

    if (!title || !content) {
      res.status(400).json({ success: false, error: 'Title and content are required' })
      return
    }

    const db = getDb()
    const postId = uuidv4()

    db.prepare(`
      INSERT INTO posts (id, user_id, title, content, language_tag)
      VALUES (?, ?, ?, ?, ?)
    `).run(postId, req.user!.userId, title, content, language_tag || null)

    const post = db.prepare(`SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`).get(postId)
    res.status(201).json({ success: true, data: post })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to create post' })
  }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const post = db.prepare(`SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`).get(req.params.id) as PostRow | undefined

    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' })
      return
    }

    const comments = db.prepare(`
      SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at
    `).all(req.params.id)

    res.json({ success: true, data: { ...post, comments } })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to fetch post' })
  }
})

router.post('/:id/comment', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body as Record<string, string>

    if (!content) {
      res.status(400).json({ success: false, error: 'Content is required' })
      return
    }

    const db = getDb()
    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id)

    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' })
      return
    }

    const commentId = uuidv4()

    db.prepare(`
      INSERT INTO comments (id, post_id, user_id, content)
      VALUES (?, ?, ?, ?)
    `).run(commentId, req.params.id, req.user!.userId, content)

    db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').run(req.params.id)

    const comment = db.prepare(`SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?`).get(commentId)
    res.status(201).json({ success: true, data: comment })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to add comment' })
  }
})

router.post('/:id/like', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb()
    const post = db.prepare('SELECT id, likes FROM posts WHERE id = ?').get(req.params.id) as PostRow | undefined

    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' })
      return
    }

    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id)

    res.json({ success: true, data: { likes: post.likes + 1 } })
  } catch (_error) {
    res.status(500).json({ success: false, error: 'Failed to like post' })
  }
})

export default router
