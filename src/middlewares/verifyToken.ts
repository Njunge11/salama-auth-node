import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createProblemDetails } from '../util/problemDetails'

interface CustomRequest extends Request {
  developer?: jwt.JwtPayload | string
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).send()
  }
  try {
    const secretKey = process.env.JWT_SECRET || ''
    const decoded = jwt.verify(token, secretKey)
    req.developer = decoded
    next()
  } catch (error) {
    console.error(`An error occured in verifyToken:${error}`)
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(createProblemDetails('Token expired', 401, 'Token expired'))
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(createProblemDetails('Invalid token', 401, 'Invalid token'))
    } else {
      res
        .status(500)
        .json(createProblemDetails('Invalid Server Error', 500, 'An unexpected error occured.'))
    }
  }
}

export const generateToken = (payload: any, options = {}) => {
  const secretKey = process.env.JWT_SECRET || ''
  const token = jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
    expiresIn: '1h',
    ...options,
  })
  return token
}
