import { Database } from "./types";
import { PostgresDatabase } from "./postgres";

let dbInstance: Database | null = null;

export function createDatabase(connectionString?: string): Database {
  if (!connectionString) {
    connectionString =
      process.env.DATABASE_URL ||
      "postgresql://postgres.sbccoooiaanzamgqglhd:JtBLT51UWPYTHjpp@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";
  }

  // Create PostgreSQL instance (easily extensible for other databases)
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new PostgresDatabase(connectionString);
}

export function getDatabase(): Database {
  if (!dbInstance) {
    dbInstance = createDatabase();
  }
  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}
