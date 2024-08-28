import { Router } from 'express'
import {
  createAccount,
  getAccounts,
  getAccount,
  createAccountSettings,
  getAccountSettings,
  deleteAccountSettings,
  login,
  deleteAccount,
} from '../controllers/accountController'
import { validateRequest } from '../middlewares/validateRequest'
import {
  createAccountSettingsSchema,
  createAccountSchema,
  loginSchema,
  idSchema,
} from '../schemas/accountSchema'
import { hashPassword } from '../middlewares/hashPassword'
import { verifyToken } from '../middlewares/verifyToken'

const router = Router()

router.post(
  '/settings',
  validateRequest(createAccountSettingsSchema, 'body'),
  createAccountSettings,
)
router.put('/settings', validateRequest(createAccountSettingsSchema, 'body'), createAccountSettings)
router.get('/settings', getAccountSettings)
router.delete('/settings/:id', validateRequest(idSchema, 'params'), deleteAccountSettings)

router.post('/', validateRequest(createAccountSchema, 'body'), hashPassword, createAccount)
router.post('/verify')
router.post('/login', validateRequest(loginSchema, 'body'), login)
router.post('/logout', verifyToken, (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out successfully' })
})
router.get('/', verifyToken, getAccounts)
router.get('/:id', verifyToken, validateRequest(idSchema, 'params'), getAccount)
router.delete('/:id', verifyToken, validateRequest(idSchema, 'params'), deleteAccount)
router.put('/:id', verifyToken, validateRequest(idSchema, 'params'), createAccount)

export default router
