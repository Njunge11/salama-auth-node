import { z } from 'zod'

export const createAccountSchema = z.object({
  developer_account_setting_id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  developer_account_user_role: z.enum(['read', 'read_write', 'admin']),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const idSchema = z.object({
  id: z.string().uuid(),
})

export const createAccountSettingsSchema = z
  .object({
    lock_strategy: z.enum(['failed_attempts', 'none']),
    unlock_strategy: z.enum(['time', 'email', 'both', 'none']).optional(),
    maximum_attempts: z.number().min(1).optional(),
    unlock_in: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.lock_strategy === 'none') {
        return data.unlock_strategy === 'none' && !data.maximum_attempts && !data.unlock_in
      }
      if (data.lock_strategy === 'failed_attempts') {
        return (
          data.unlock_strategy !== 'none' &&
          data.maximum_attempts !== undefined &&
          data.unlock_in !== undefined
        )
      }
      return true
    },
    {
      message: 'Invalid account settings configuration',
      path: ['lockStrategy'], // This will show the error under lockStrategy but you can adjust as needed
    },
  )
