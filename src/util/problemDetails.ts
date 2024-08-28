export const createProblemDetails = (
  title: string = 'about:blank',
  status: number,
  detail?: string,
  type: string = 'http',
  instance?: string,
  extensions?: Record<string, any>,
) => {
  return {
    type,
    title,
    status,
    detail,
    instance,
    ...extensions,
  }
}
