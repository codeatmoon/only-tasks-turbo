import { Database } from './types'
import { PostgresDatabase } from './postgres'

let dbInstance: Database | null = null

export function createDatabase(connectionString?: string): Database {
  if (!connectionString) {
    connectionString = process.env.DATABASE_URL
  }

  // Create PostgreSQL instance (easily extensible for other databases)
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  return new PostgresDatabase(connectionString)
}

export function getDatabase(): Database {
  if (!dbInstance) {
    dbInstance = createDatabase()
  }
  return dbInstance
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close()
    dbInstance = null
  }
}