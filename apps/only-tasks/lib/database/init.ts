import { readFileSync } from 'fs'
import { join } from 'path'
import { getDatabase } from './client'

export async function initializeSchema(): Promise<void> {
  const db = getDatabase()
  
  try {
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'lib', 'database', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    // Execute statements one by one for PostgreSQL compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postgres = db as any
    if ('pool' in postgres) {
      const client = await postgres.pool.connect()
      
      try {
        for (const statement of statements) {
          await client.query(statement)
        }
        console.log('Database schema initialized successfully')
      } finally {
        client.release()
      }
    }
  } catch (error) {
    console.error('Failed to initialize database schema:', error)
    throw error
  }
}