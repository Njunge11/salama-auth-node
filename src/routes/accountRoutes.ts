import { Router } from 'express'
import { createAccount } from '../controllers/accountController'

const router = Router()

router.post('/', createAccount)

export default router
