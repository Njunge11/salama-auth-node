import express, { Application } from 'express'
import accountRoutes from './routes/accountRoutes'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(express.json())
app.use(helmet())
app.use(cookieParser())
app.disable('x-powered-by')
app.use((req, res, next) => {
  const allowedMethods = ['OPTIONS', 'HEAD', 'CONNECT', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send(`${req.method} not allowed.`)
  }
  next()
})
app.use('/api/v1/accounts', accountRoutes)

export default app
