import express from 'express'
import { getTutorials, getTutorial } from '../controllers/tutorial'

const router = express.Router()

router.get('/', getTutorials)
router.get('/:id', getTutorial)

export default router