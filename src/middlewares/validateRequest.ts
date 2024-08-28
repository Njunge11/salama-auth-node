import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError, Schema } from 'zod'
import { createProblemDetails } from '../util/problemDetails'

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
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
