import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, 'linguaverse.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
  }
  return db
}

export function initDb(): void {
  const database = getDb()

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      username TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      target_language TEXT DEFAULT 'en',
      level TEXT DEFAULT 'A1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      language TEXT NOT NULL,
      level TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      total_lessons INTEGER DEFAULT 0,
      duration INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      order_num INTEGER DEFAULT 0,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS study_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      lesson_id TEXT NOT NULL REFERENCES lessons(id),
      score INTEGER DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
      language TEXT DEFAULT 'en',
      current_level TEXT DEFAULT 'A1',
      total_study_time INTEGER DEFAULT 0,
      words_learned INTEGER DEFAULT 0,
      courses_completed INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_study_date DATE
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      language_tag TEXT,
      likes INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      category TEXT NOT NULL,
      requirement INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      achievement_id TEXT NOT NULL REFERENCES achievements(id),
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, achievement_id)
    );
  `)

  seedData(database)
}

function seedData(db: Database.Database): void {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  if (userCount.count > 0) return

  const passwordHash = bcrypt.hashSync('password123', 10)

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, username, avatar, target_language, level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const user1Id = uuidv4()
  const user2Id = uuidv4()

  insertUser.run(user1Id, 'alice@example.com', passwordHash, 'Alice', '', 'en', 'A2')
  insertUser.run(user2Id, 'bob@example.com', passwordHash, 'Bob', '', 'ja', 'A1')

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, language, level, description, cover_image, total_lessons, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const courses = [
    { id: uuidv4(), title: 'English Starter', language: 'en', level: 'A1', description: 'Begin your English journey with basic vocabulary and phrases', cover_image: '/images/en-a1.jpg', total_lessons: 4, duration: 120 },
    { id: uuidv4(), title: 'English Elementary', language: 'en', level: 'A2', description: 'Build on your English foundation with everyday conversations', cover_image: '/images/en-a2.jpg', total_lessons: 4, duration: 150 },
    { id: uuidv4(), title: 'English Intermediate', language: 'en', level: 'B1', description: 'Develop fluency with intermediate grammar and expressions', cover_image: '/images/en-b1.jpg', total_lessons: 4, duration: 180 },
    { id: uuidv4(), title: 'Japanese Beginner', language: 'ja', level: 'A1', description: 'Start learning Japanese with hiragana and basic greetings', cover_image: '/images/ja-a1.jpg', total_lessons: 4, duration: 120 },
    { id: uuidv4(), title: 'Japanese Elementary', language: 'ja', level: 'A2', description: 'Expand your Japanese with daily conversation patterns', cover_image: '/images/ja-a2.jpg', total_lessons: 4, duration: 150 },
    { id: uuidv4(), title: 'Japanese Intermediate', language: 'ja', level: 'B1', description: 'Master complex grammar and natural expressions', cover_image: '/images/ja-b1.jpg', total_lessons: 4, duration: 180 },
    { id: uuidv4(), title: 'Korean Starter', language: 'ko', level: 'A1', description: 'Learn Hangul and essential Korean phrases', cover_image: '/images/ko-a1.jpg', total_lessons: 4, duration: 120 },
    { id: uuidv4(), title: 'Korean Elementary', language: 'ko', level: 'A2', description: 'Practice everyday Korean conversations', cover_image: '/images/ko-a2.jpg', total_lessons: 4, duration: 150 },
    { id: uuidv4(), title: 'Korean Intermediate', language: 'ko', level: 'B1', description: 'Advance your Korean with complex sentences and culture', cover_image: '/images/ko-b1.jpg', total_lessons: 4, duration: 180 },
  ]

  const courseIds: Record<string, string> = {}
  for (const c of courses) {
    insertCourse.run(c.id, c.title, c.language, c.level, c.description, c.cover_image, c.total_lessons, c.duration)
    courseIds[`${c.language}-${c.level}`] = c.id
  }

  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, course_id, title, type, order_num, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const lessons = [
    {
      id: uuidv4(), courseId: courseIds['en-A1'], title: 'Greetings & Introductions', type: 'vocabulary', order_num: 1,
      content: JSON.stringify([
        { word: 'hello', translation: '你好', phonetic: '/həˈloʊ/', example: 'Hello, how are you?' },
        { word: 'goodbye', translation: '再见', phonetic: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow!' },
        { word: 'thank you', translation: '谢谢', phonetic: '/θæŋk juː/', example: 'Thank you very much!' },
        { word: 'please', translation: '请', phonetic: '/pliːz/', example: 'Please sit down.' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['en-A1'], title: 'Present Simple', type: 'grammar', order_num: 2,
      content: JSON.stringify([
        { question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'went'], answer: 1, explanation: 'Third person singular uses -es form' },
        { question: 'They ___ coffee in the morning.', options: ['drinks', 'drinking', 'drink', 'drank'], answer: 2, explanation: 'Plural subject uses base form' },
        { question: 'He ___ a book every night.', options: ['read', 'reads', 'reading', 'readed'], answer: 1, explanation: 'Third person singular adds -s' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['en-A1'], title: 'Self Introduction', type: 'speaking', order_num: 3,
      content: JSON.stringify([
        { text: 'Hello, my name is...', phonetic: '/həˈloʊ maɪ neɪm ɪz/' },
        { text: 'Nice to meet you.', phonetic: '/naɪs tuː miːt juː/' },
        { text: 'I am from...', phonetic: '/aɪ æm frɒm/' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['en-A1'], title: 'Daily Conversations', type: 'listening', order_num: 4,
      content: JSON.stringify([
        { text: 'The weather is nice today.', question: 'What is the topic?', options: ['Weather', 'Food', 'Sports', 'Music'], answer: 0 },
        { text: 'I usually have breakfast at seven.', question: 'When does the person eat breakfast?', options: ['6:00', '7:00', '8:00', '9:00'], answer: 1 }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['en-A2'], title: 'Travel Vocabulary', type: 'vocabulary', order_num: 1,
      content: JSON.stringify([
        { word: 'airport', translation: '机场', phonetic: '/ˈeərpɔːrt/', example: 'The airport is far from the city.' },
        { word: 'reservation', translation: '预订', phonetic: '/ˌrezərˈveɪʃən/', example: 'I have a reservation for two.' },
        { word: 'luggage', translation: '行李', phonetic: '/ˈlʌɡɪdʒ/', example: 'Please check your luggage.' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['en-A2'], title: 'Past Tense', type: 'grammar', order_num: 2,
      content: JSON.stringify([
        { question: 'She ___ to the store yesterday.', options: ['go', 'goes', 'went', 'going'], answer: 2, explanation: 'Past tense of go is went' },
        { question: 'They ___ a great time at the party.', options: ['have', 'has', 'had', 'having'], answer: 2, explanation: 'Past tense of have is had' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['ja-A1'], title: 'Hiragana Basics', type: 'vocabulary', order_num: 1,
      content: JSON.stringify([
        { word: 'こんにちは', translation: '你好', phonetic: '/konnichiwa/', example: 'こんにちは、元気ですか？' },
        { word: 'ありがとう', translation: '谢谢', phonetic: '/arigatou/', example: 'ありがとうございます。' },
        { word: 'すみません', translation: '对不起', phonetic: '/sumimasen/', example: 'すみません、駅はどこですか？' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['ja-A1'], title: 'Basic Particles', type: 'grammar', order_num: 2,
      content: JSON.stringify([
        { question: '私は学生___。', options: ['は', 'が', 'を', 'に'], answer: 0, explanation: 'は is the topic marker particle' },
        { question: '日本___行きます。', options: ['は', 'が', 'を', 'に'], answer: 3, explanation: 'に indicates direction/destination' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['ja-A1'], title: 'Self Introduction in Japanese', type: 'speaking', order_num: 3,
      content: JSON.stringify([
        { text: 'はじめまして、私の名前は...', phonetic: '/hajimemashite watashi no namae wa/' },
        { text: 'よろしくお願いします。', phonetic: '/yoroshiku onegaishimasu/' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['ko-A1'], title: 'Hangul Basics', type: 'vocabulary', order_num: 1,
      content: JSON.stringify([
        { word: '안녕하세요', translation: '你好', phonetic: '/annyeonghaseyo/', example: '안녕하세요, 만나서 반갑습니다.' },
        { word: '감사합니다', translation: '谢谢', phonetic: '/gamsahamnida/', example: '도와주셔서 감사합니다.' },
        { word: '죄송합니다', translation: '对不起', phonetic: '/joesonghamnida/', example: '죄송합니다, 늦었어요.' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['ko-A1'], title: 'Basic Korean Grammar', type: 'grammar', order_num: 2,
      content: JSON.stringify([
        { question: '저는 학생___.', options: ['입니다', '이에요', '해요', '아요'], answer: 0, explanation: '입니다 is the formal polite ending' },
        { question: '한국에 ___?.', options: ['갑니다', '가요', '가세요', '갈거에요'], answer: 2, explanation: '가세요 is the polite question form' }
      ])
    },
    {
      id: uuidv4(), courseId: courseIds['ko-A1'], title: 'Korean Greetings', type: 'listening', order_num: 3,
      content: JSON.stringify([
        { text: '오늘 날씨가 좋습니다.', question: 'What is being discussed?', options: ['Weather', 'Food', 'Study', 'Work'], answer: 0 },
        { text: '저는 아침에 커피를 마셔요.', question: 'What does the person drink in the morning?', options: ['Tea', 'Coffee', 'Water', 'Juice'], answer: 1 }
      ])
    },
  ]

  const lessonIds: string[] = []
  for (const l of lessons) {
    insertLesson.run(l.id, l.courseId, l.title, l.type, l.order_num, l.content)
    lessonIds.push(l.id)
  }

  const insertAchievement = db.prepare(`
    INSERT INTO achievements (id, name, description, icon, category, requirement)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const achievements = [
    { id: uuidv4(), name: 'First Step', description: 'Complete your first lesson', icon: '🎯', category: 'study', requirement: 1 },
    { id: uuidv4(), name: 'Bookworm', description: 'Complete 10 lessons', icon: '📚', category: 'study', requirement: 10 },
    { id: uuidv4(), name: 'Social Butterfly', description: 'Create your first post', icon: '🦋', category: 'social', requirement: 1 },
    { id: uuidv4(), name: 'Influencer', description: 'Get 10 likes on a post', icon: '⭐', category: 'social', requirement: 10 },
    { id: uuidv4(), name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streak', requirement: 3 },
    { id: uuidv4(), name: 'Unstoppable', description: 'Maintain a 7-day streak', icon: '💪', category: 'streak', requirement: 7 },
    { id: uuidv4(), name: 'Word Master', description: 'Learn 50 words', icon: '🧠', category: 'mastery', requirement: 50 },
    { id: uuidv4(), name: 'Polyglot', description: 'Complete courses in 2 languages', icon: '🌍', category: 'mastery', requirement: 2 },
  ]

  const achievementIds: Record<string, string> = {}
  for (const a of achievements) {
    insertAchievement.run(a.id, a.name, a.description, a.icon, a.category, a.requirement)
    achievementIds[a.name] = a.id
  }

  const insertProgress = db.prepare(`
    INSERT INTO user_progress (id, user_id, language, current_level, total_study_time, words_learned, courses_completed, streak, longest_streak, last_study_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertProgress.run(uuidv4(), user1Id, 'en', 'A2', 3600, 45, 1, 5, 7, '2026-05-30')
  insertProgress.run(uuidv4(), user2Id, 'ja', 'A1', 1200, 20, 0, 2, 3, '2026-05-29')

  const insertStudyRecord = db.prepare(`
    INSERT INTO study_records (id, user_id, lesson_id, score, time_spent, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  insertStudyRecord.run(uuidv4(), user1Id, lessonIds[0], 90, 300, '2026-05-28T10:00:00Z')
  insertStudyRecord.run(uuidv4(), user1Id, lessonIds[1], 85, 420, '2026-05-29T14:00:00Z')
  insertStudyRecord.run(uuidv4(), user1Id, lessonIds[2], 95, 360, '2026-05-30T09:00:00Z')
  insertStudyRecord.run(uuidv4(), user2Id, lessonIds[6], 80, 300, '2026-05-29T11:00:00Z')
  insertStudyRecord.run(uuidv4(), user2Id, lessonIds[7], 75, 400, '2026-05-29T15:00:00Z')

  const insertPost = db.prepare(`
    INSERT INTO posts (id, user_id, title, content, language_tag, likes, comments_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const post1Id = uuidv4()
  const post2Id = uuidv4()

  insertPost.run(post1Id, user1Id, 'My English Learning Tips', 'After 3 months of studying English, here are my top tips: 1. Practice every day 2. Watch English movies 3. Don\'t be afraid of making mistakes!', 'en', 12, 2, '2026-05-28T08:00:00Z')
  insertPost.run(post2Id, user2Id, '日本語学習の悩み', 'ひらがなは覚えたけど、カタカナがなかなか覚えられません。みんなはどうやって覚えた？', 'ja', 8, 1, '2026-05-29T12:00:00Z')

  const insertComment = db.prepare(`
    INSERT INTO comments (id, post_id, user_id, content, created_at)
    VALUES (?, ?, ?, ?, ?)
  `)

  insertComment.run(uuidv4(), post1Id, user2Id, 'Great tips! I especially agree with watching movies.', '2026-05-28T09:00:00Z')
  insertComment.run(uuidv4(), post1Id, user2Id, 'How long did it take you to feel comfortable speaking?', '2026-05-28T10:00:00Z')
  insertComment.run(uuidv4(), post2Id, user1Id, 'カタカナは単語と一緒に覚えると自然に身につくよ！', '2026-05-29T13:00:00Z')

  const insertUserAchievement = db.prepare(`
    INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at)
    VALUES (?, ?, ?, ?)
  `)

  insertUserAchievement.run(uuidv4(), user1Id, achievementIds['First Step'], '2026-05-20T10:00:00Z')
  insertUserAchievement.run(uuidv4(), user1Id, achievementIds['Bookworm'], '2026-05-28T14:00:00Z')
  insertUserAchievement.run(uuidv4(), user1Id, achievementIds['On Fire'], '2026-05-25T09:00:00Z')
  insertUserAchievement.run(uuidv4(), user1Id, achievementIds['Social Butterfly'], '2026-05-28T08:00:00Z')
  insertUserAchievement.run(uuidv4(), user2Id, achievementIds['First Step'], '2026-05-29T11:00:00Z')
}
