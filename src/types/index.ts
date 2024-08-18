export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  [key: string]: any
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: ProblemDetails
}
