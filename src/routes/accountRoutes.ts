import { Router } from 'express'
import { createAccount, createAccountSettings } from '../controllers/accountController'
import { validateRequest } from '../middlewares/validateRequest'
import { createAccountSettingsSchema } from '../schemas/accountSchema'

const router = Router()

router.put('/settings', validateRequest(createAccountSettingsSchema), createAccountSettings)
router.post('/', createAccount)

export default router
