import { Request, Response } from 'express'
import { createDeveloperAccount } from '../services/accountService'

export const createAccount = async (req: Request, res: Response) => {
  createDeveloperAccount()
  res.status(201).send()
}
