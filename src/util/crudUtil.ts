import { Pool } from 'pg'
import database from './db'
import { createProblemDetails } from './problemDetails'

export async function insertOne<T extends object>(tableName: string, item: T) {
  try {
    const db: Pool = await database()
    const columns = Object.keys(item).join(', ')
    const values = Object.values(item)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await db.query(sql, values)
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('Error during insertOne operation:', error)
    return {
      success: false,
      error: createProblemDetails('Internal Server Error', 500, 'An unexpected error occured'),
    }
  }
}

export async function findOne<T>(
  tableName: string,
  query: Partial<T> = {},
  columns: string[] = ['*'],
) {
  try {
    const db: Pool = await database()
    const selectClause = columns.join(', ')
    const whereClause = Object.entries(query)
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ')
    const sql = `SELECT ${selectClause} FROM ${tableName} ${whereClause ? `WHERE ${whereClause}` : ''} LIMIT 1`
    const values = Object.values(query)
    const result = await db.query(sql, values)
    if (result.rows.length === 0) {
      return {
        success: false,
        error: createProblemDetails('Not Found', 404, 'No record found to update.'),
      }
    }
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('Error during findOne operation:', error)
    return {
      success: false,
      error: createProblemDetails('Internal Server Error', 500, 'An unexpected error occured'),
    }
  }
}

export async function find<T>(
  tableName: string,
  query: Partial<T> = {},
  columns: string[] = ['*'],
) {
  try {
    const db: Pool = await database()
    const selectClause = columns.join(', ')
    const whereClause = Object.entries(query)
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ')
    const sql = `SELECT ${selectClause} FROM ${tableName} ${whereClause ? `WHERE ${whereClause}` : ''}`
    const values = Object.values(query)
    const result = await db.query(sql, values)
    if (result.rows.length === 0) {
      return {
        success: false,
        error: createProblemDetails('Not Found', 404, 'No record found to update.'),
      }
    }
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('Error during findOne operation:', error)
    return {
      success: false,
      error: createProblemDetails('Internal Server Error', 500, 'An unexpected error occured'),
    }
  }
}

export async function updateOne<T>(tableName: string, where: Partial<T>, item: Partial<T>) {
  try {
    const db: Pool = await database()
    const whereClause = Object.entries(where)
      .map(([key], index) => `${key}= $${index + 1}`)
      .join(' AND ')

    const setClause =
      Object.entries(item)
        .map(([key], index) => `${key} = $${index + 1 + Object.keys(where).length}`)
        .join(', ') + `, updated_at = NOW()`
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause} RETURNING *`
    const values = [...Object.values(where), ...Object.values(item)]
    const result = await db.query(sql, values)
    if (result.rows.length === 0) {
      return {
        success: false,
        error: createProblemDetails('Not Found', 404, 'No record found to update.'),
      }
    }
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error(`Error during updateOne operation:`, error)
    return {
      success: false,
      error: createProblemDetails('Internal Server Error', 500, 'An unexpected error occured'),
    }
  }
}

export async function deleteOne<T>(tableName: string, where: Partial<T>) {
  try {
    const db: Pool = await database()
    const whereClause = Object.entries(where)
      .map(([key], index) => `${key}= $${index + 1}`)
      .join(' AND ')
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause} RETURNING *`
    const values = [...Object.values(where)]
    const result = await db.query(sql, values)
    if (result.rows.length === 0) {
      return {
        success: false,
        error: createProblemDetails('Not Found', 404, 'No record found to delete.'),
      }
    }
    return { success: true }
  } catch (error) {
    console.error(`Error during deleteOne operation:`, error)
    return {
      success: false,
      error: createProblemDetails('Internal Server Error', 500, 'An unexpected error occured'),
    }
  }
}
