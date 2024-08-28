import { Request, Response, NextFunction } from 'express'
import { createProblemDetails } from '../util/problemDetails'

export const extractIP = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.error('An error occured in extractIP ', error)
    return res
      .status(500)
      .json(createProblemDetails('Internal Server Error', 500, 'An unexpected error occurred.'))
  }
}
