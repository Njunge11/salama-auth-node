import express, { Application } from 'express'
import accountRoutes from './routes/accountRoutes'

const app: Application = express()

app.use(express.json())
app.use('/api/v1/accounts', accountRoutes)

export default app
