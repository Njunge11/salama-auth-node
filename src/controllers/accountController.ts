import { Request, Response } from 'express'
import {
  createDeveloperAccount,
  createDeveloperAccountSettings,
  getDeveloperAccountSettings,
  deleteDeveloperAccountSettings,
  loginAccount,
} from '../services/accountService'

export const createAccount = async (req: Request, res: Response) => {
  const result = await createDeveloperAccount(req)
  if (result.success) {
    return res.status(201).json(result.data)
  }
  return res.status(result.error?.status || 500).json(result.error)
}

export const login = async (req: Request, res: Response) => {
  const result = await loginAccount(req)
  return res.status(200).send('oposh buda1')
}

export const getAccounts = async (req: Request, res: Response) => {}

export const updateAccount = async (req: Request, res: Response) => {}

export const deleteAccount = async (req: Request, res: Response) => {}

export const createAccountSettings = async (req: Request, res: Response) => {
  const result = await createDeveloperAccountSettings(req)
  if (result.success) {
    return res.status(201).json(result.data)
  }
  return res.status(result.error?.status || 500).json(result.error)
}

export const getAccountSettings = async (req: Request, res: Response) => {
  const result = await getDeveloperAccountSettings()
  if (result.success) {
    return res.status(200).json(result.data)
  }
  return res.status(result.error?.status || 500).json(result.error)
}

export const deleteAccountSettings = async (req: Request, res: Response) => {
  const result = await deleteDeveloperAccountSettings(req)
  if (result.success) {
    return res.status(204).send()
  } else {
    return res.status(result.error?.status || 500).json(result.error)
  }
}
