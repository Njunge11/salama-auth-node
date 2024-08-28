import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { createProblemDetails } from '../util/problemDetails'

type ValidTarget = 'body' | 'params' | 'query'
export const validateRequest = (schema: ZodSchema, target: ValidTarget) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate: any
      switch (target) {
        case 'body':
          dataToValidate = req.body
          break
        case 'params':
          dataToValidate = req.params
          break
        case 'query':
          dataToValidate = req.query
          break
        default:
          throw new Error('Invalid validation target')
      }
      schema.parse(dataToValidate)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const invalidParams = error.errors.map((err) => ({
          name: err.path.join('.'),
          reason: err.message,
        }))
        return res
          .status(400)
          .json(
            createProblemDetails(
              'Invalid request parameters',
              400,
              'One or more fields are invalid',
              '',
              '',
              { invalidParams: invalidParams },
            ),
          )
      }
      return res
        .status(500)
        .json(createProblemDetails('Invalid Server Error', 500, 'An unexpected error occured.'))
    }
  }
}
