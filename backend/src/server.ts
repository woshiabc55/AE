import express from 'express'
import cors from 'cors'
import i18n from './i18n'
import { i18nMiddleware } from './middleware/i18n'
import svgRouter from './routes/svg'
import tutorialRouter from './routes/tutorial'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(i18nMiddleware(i18n))

app.use('/api/svg', svgRouter)
app.use('/api/tutorial', tutorialRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})