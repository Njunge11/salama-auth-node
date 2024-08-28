import { Router } from 'express'
import {
  createAccount,
  createAccountSettings,
  getAccountSettings,
  deleteAccountSettings,
  login,
} from '../controllers/accountController'
import { validateRequest } from '../middlewares/validateRequest'
import {
  createAccountSettingsSchema,
  createAccountSchema,
  loginSchema,
} from '../schemas/accountSchema'
import { hashPassword } from '../middlewares/hashPassword'
import { verifyToken } from '../middlewares/verifyToken'

const router = Router()

router.post('/settings', validateRequest(createAccountSettingsSchema), createAccountSettings)
router.put('/settings', validateRequest(createAccountSettingsSchema), createAccountSettings)
router.get('/settings', getAccountSettings)
router.delete('/settings/:id', deleteAccountSettings)

router.post('/', validateRequest(createAccountSchema), hashPassword, createAccount)
router.post('/verify')
router.post('/login', validateRequest(loginSchema), login)
router.post('/logout', verifyToken, (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out successfully' })
})
router.get('/', verifyToken, createAccount)
router.delete('/', verifyToken, createAccount)
router.put('/', verifyToken, createAccount)

export default router
