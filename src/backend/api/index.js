import { Router } from 'express'

import users from './routes/users.js'

const router = Router()

router.use('/users', users)

export default router