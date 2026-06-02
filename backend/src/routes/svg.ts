import express from 'express'
import { generateAnimation, validateSVG, optimizeSVG } from '../controllers/svg'

const router = express.Router()

router.post('/generate', generateAnimation)
router.post('/validate', validateSVG)
router.post('/optimize', optimizeSVG)

export default router