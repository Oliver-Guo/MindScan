import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware'
import { emotionInputSchema, lieInputSchema } from '../schemas/analyze.schema'
import { emotion, lie } from '../controllers/analyze.controller'

const router = Router()

router.post('/emotion', validate(emotionInputSchema), emotion)
router.post('/lie', validate(lieInputSchema), lie)

export default router
