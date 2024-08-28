import { Request, Response } from 'express'
import { insertOne, findOne, updateOne, deleteOne, find } from '../util/crudUtil'
import { passwordMatches } from '../middlewares/hashPassword'
import { generateToken } from '../middlewares/verifyToken'

const accountsTable = 'developer_accounts'
const accountSettingsTable = 'developer_account_settings'

export const createDeveloperAccount = async (req: Request) => {
  const { developer_account_setting_id, email, password, developer_account_user_role } = req.body
  const accountSettings = await findOne(accountSettingsTable, { developer_account_setting_id })
  if (!accountSettings.success && accountSettings.error?.status == 404) {
    const updatedError = {
      ...accountSettings.error,
      status: 400,
      detail: `No developer_account_setting for developer_account_setting_id ${developer_account_setting_id}`,
    }
    return { ...accountSettings, error: updatedError }
  }

  if (accountSettings.success) {
    return await insertOne(accountsTable, {
      developer_account_setting_id,
      email,
      password,
      developer_account_user_role,
    })
  }

  return accountSettings
}

export const getDeveloperAccounts = async (req: Request) => {
  const developerAccount = await find(accountsTable)
  if (developerAccount.success) {
    const {
      password,
      locked_at,
      failed_attempts,
      current_sign_in_ip,
      last_sign_in_ip,
      signin_count,
      current_sign_in_at,
      last_sign_in_at,
      ...reductedData
    } = developerAccount.data
    return { ...developerAccount, data: reductedData }
  }
  return developerAccount
}

export const getDeveloperAccount = async (req: Request) => {
  const account_id = req.params.id
  const developerAccount = await findOne(accountsTable, { account_id })
  if (developerAccount.success) {
    const {
      password,
      locked_at,
      failed_attempts,
      current_sign_in_ip,
      last_sign_in_ip,
      signin_count,
      current_sign_in_at,
      last_sign_in_at,
      ...reductedData
    } = developerAccount.data
    return { ...developerAccount, data: reductedData }
  }
  return developerAccount
}
export const handleMatchedPassword = async (developerAccount: any, res: Response) => {
  interface DeveloperAccount {
    account_id: string
    [key: string]: any
  }
  const updateLoginDetails = await updateOne<DeveloperAccount>(
    accountsTable,
    {
      account_id: developerAccount.data.account_id,
    },
    {
      signin_count: developerAccount.data.signin_count + 1,
      last_sign_in_at: developerAccount.data.current_sign_in_at
        ? developerAccount.data.current_sign_in_at
        : new Date().toISOString(),
      current_sign_in_at: new Date().toISOString(),
      last_sign_in_ip: '',
      current_sign_in_ip: '',
    },
  )
  if (updateLoginDetails.success) {
    const {
      password,
      locked_at,
      failed_attempts,
      current_sign_in_ip,
      last_sign_in_ip,
      signin_countm,
      current_sign_in_at,
      last_sign_in_at,
      ...reductedData
    } = developerAccount.data
    const developer = {
      account_id: developerAccount.data.account_id,
      email: developerAccount.data.email,
      developer_account_user_role: developerAccount.data.developer_account_user_role,
    }
    res.cookie('token', generateToken(developer), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    })

    return { ...developerAccount, data: reductedData }
  }
  return updateLoginDetails
}

export const handleUnmatchedPassword = async () => {}

export const deleteDeveloperAccount = async (req: Request) => {
  const account_id = req.params.id
  return await deleteOne(accountsTable, { account_id })
}

export const loginAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const developerAccount = await findOne(accountsTable, { email })

  if (developerAccount.success) {
    const isMatch = await passwordMatches(password, developerAccount.data.password)
    if (isMatch) {
      return await handleMatchedPassword(developerAccount, res)
    } else {
      return await handleUnmatchedPassword()
    }
  }
  return developerAccount
}

export const createDeveloperAccountSettings = async (req: Request) => {
  const { lock_strategy, unlock_strategy, maximum_attempts, unlock_in } = req.body
  interface AccountSettings {
    settingsId: string
    [key: string]: any
  }
  const accountSettings = await findOne(accountSettingsTable)

  if (!accountSettings.success && accountSettings.error?.status != 404) return accountSettings

  if (accountSettings.success) {
    return await updateOne<AccountSettings>(
      accountSettingsTable,
      { settingsid: accountSettings.data.settingsid },
      {
        lock_strategy,
        unlock_strategy,
        maximum_attempts,
        unlock_in,
      },
    )
  }

  return await insertOne(accountSettingsTable, {
    lock_strategy,
    unlock_strategy,
    maximum_attempts,
    unlock_in,
  })
}

export const getDeveloperAccountSettings = async () => {
  return await findOne(accountSettingsTable)
}

export const deleteDeveloperAccountSettings = async (req: Request) => {
  const settingsid = req.params.id
  return await deleteOne(accountSettingsTable, { settingsid })
}
