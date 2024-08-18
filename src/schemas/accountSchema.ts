import { z } from 'zod'

export const createAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  accountUserRole: z.enum(['read', 'read_write']),
})

export const createAccountSettingsSchema = z
  .object({
    lockStrategy: z.enum(['failed_attempts', 'none']),
    unlockStrategy: z.enum(['time', 'email', 'both', 'none']).optional(),
    maximumAttempts: z.number().min(1).optional(),
    unlockIn: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.lockStrategy === 'none') {
        return data.unlockStrategy === 'none' && !data.maximumAttempts && !data.unlockIn
      }
      if (data.lockStrategy === 'failed_attempts') {
        return (
          data.unlockStrategy !== 'none' &&
          data.maximumAttempts !== undefined &&
          data.unlockIn !== undefined
        )
      }
      return true
    },
    {
      message: 'Invalid account settings configuration',
      path: ['lockStrategy'], // This will show the error under lockStrategy but you can adjust as needed
    },
  )
