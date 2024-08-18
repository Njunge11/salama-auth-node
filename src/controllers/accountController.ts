import { Request, Response } from 'express'
import { createDeveloperAccount, createDeveloperAccountSettings } from '../services/accountService'

export const createAccount = async (req: Request, res: Response) => {
  createDeveloperAccount()
  res.status(201).send()
}

export const createAccountSettings = async (req: Request, res: Response) => {
  const result = await createDeveloperAccountSettings(req)
  if (result.success) {
    return res.status(201).json(result.data)
  } else {
    return res.status(result.error?.status || 500).json(result.error)
  }
}
