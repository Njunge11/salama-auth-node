import { Pool } from 'pg'
import database from './db'
import { createPromblemDetails } from './problemDetails'

async function crudUtil<T extends object>(tableName: string) {
  const db: Pool = await database()
  return {
    async create(item: T) {
      const columns = Object.keys(item).join(', ')
      const values = Object.values(item)
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`
      console.log(query)
      console.log(placeholders)
      console.log(values)
      try {
        const result = await db.query(query, values)
        return { success: true, data: result.rows[0] }
      } catch (error) {
        console.error('Error creating record:', error)
        return {
          success: false,
          error: createPromblemDetails('Invalid Server Error', 500, 'An unexpected error occured.'),
        }
      }
    },
  }
}

export default crudUtil
