import { Request } from 'express'
import crudUtil from '../util/crudUtil'

const database = crudUtil('account_settings')

export const createDeveloperAccount = async () => {
  return 'Account Created'
}

export const createDeveloperAccountSettings = async (req: Request) => {
  const { lockStrategy, unlockStrategy, maximumAttempts, unlockIn } = req.body
  return (await database).create({
    lockStrategy,
    unlockStrategy,
    maximumAttempts,
    unlockIn,
  })
}
