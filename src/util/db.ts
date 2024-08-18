import { Pool } from 'pg'

let pool: Pool | null = null

const database = async () => {
  if (!pool) {
    pool = new Pool({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
    })
  }
  try {
    await pool.connect()
    console.log('Database connection initialized successfully.')
  } catch (error) {
    console.error('Failed to initialize database connection:', error)
  }
  return pool
}

export default database
