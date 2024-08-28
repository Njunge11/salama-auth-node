import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { createProblemDetails } from '../util/problemDetails'

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    req.body = { ...req.body, password: hashedPassword }
    next()
  } catch (error) {
    console.error('An error occured in hashPassword')
    return res
      .status(500)
      .json(createProblemDetails('Internal Server Error', 500, 'An unexpected error occurred.'))
  }
}

export const passwordMatches = async (passedPassword: string, passwordFromDB: string) => {
  return await bcrypt.compare(passedPassword, passwordFromDB)
}
