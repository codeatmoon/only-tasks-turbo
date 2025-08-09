import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { getDatabase } from './client'

export async function initializeSchema(): Promise<void> {
  const db = getDatabase()
  
  try {
    console.log('Starting database schema initialization...')
    
    // Try multiple possible locations for the schema file
    const possiblePaths = [
      join(process.cwd(), 'lib', 'database', 'schema.sql'), // Development
      join(__dirname, 'schema.sql'), // Build directory  
      join(process.cwd(), 'apps', 'only-tasks', 'lib', 'database', 'schema.sql'), // Monorepo root
      join(__dirname, '..', '..', '..', 'lib', 'database', 'schema.sql') // Navigate from build
    ]
    
    let schema: string | null = null
    let schemaPath: string | null = null
    
    for (const path of possiblePaths) {
      try {
        console.log('Trying schema path:', path)
        schema = readFileSync(path, 'utf-8')
        schemaPath = path
        console.log('Successfully loaded schema from:', path)
        break
      } catch (err) {
        console.log('Path not found:', path)
      }
    }
    
    if (!schema) {
      throw new Error('Could not find schema.sql file in any of the expected locations')
    }
    
    // Split by semicolon and execute each statement
    // Need to handle PostgreSQL functions with $$ delimiters properly
    const statements: string[] = []
    let currentStatement = ''
    let inDollarQuote = false
    let dollarTag = ''
    
    const lines = schema.split('\n')
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('--')) {
        continue
      }
      
      // Handle $$ dollar quoting for functions
      const dollarMatch = trimmedLine.match(/\$([^$]*)\$/)
      if (dollarMatch) {
        const tag = dollarMatch[1]
        if (!inDollarQuote) {
          // Starting a dollar quote
          inDollarQuote = true
          dollarTag = tag
        } else if (tag === dollarTag) {
          // Ending the dollar quote
          inDollarQuote = false
          dollarTag = ''
        }
      }
      
      currentStatement += line + '\n'
      
      // Only split on semicolon if we're not in a dollar quote
      if (!inDollarQuote && trimmedLine.endsWith(';')) {
        const stmt = currentStatement.trim()
        if (stmt) {
          statements.push(stmt)
        }
        currentStatement = ''
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim())
    }
    
    console.log(`Initializing database schema with ${statements.length} statements`)
    
    // Debug: print first few statements to see the order
    console.log('First 10 statements:')
    for (let i = 0; i < Math.min(10, statements.length); i++) {
      console.log(`${i + 1}: ${statements[i].substring(0, 80)}...`)
    }
    
    // Execute statements one by one for PostgreSQL compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postgres = db as any
    if ('pool' in postgres) {
      const client = await postgres.pool.connect()
      
      try {
        // Check what tables already exist
        const existingTables = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `)
        console.log('Existing tables:', existingTables.rows.map(r => r.table_name))
        
        // Check if users table exists and what columns it has
        if (existingTables.rows.some(r => r.table_name === 'users')) {
          const userColumns = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND table_schema = 'public'
          `)
          console.log('Users table columns:', userColumns.rows.map(r => r.column_name))
          
          // Check if the users table has the correct schema
          const hasUserId = userColumns.rows.some(r => r.column_name === 'user_id')
          const hasRole = userColumns.rows.some(r => r.column_name === 'role')
          
          if (!hasUserId || !hasRole) {
            console.log('Users table has incorrect schema, need to migrate...')
            // Drop and recreate tables that depend on the users table
            const dependentTables = ['users'] // Add other dependent tables if needed
            for (const table of dependentTables) {
              console.log(`Dropping table ${table} to recreate with correct schema`)
              await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`)
            }
          }
        }
        
        // Check space_themes table exists
        const hasSpaceThemes = existingTables.rows.some(r => r.table_name === 'space_themes')
        if (!hasSpaceThemes) {
          console.log('space_themes table missing, will be created')
        }
        
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i]
          try {
            console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 100)}...`)
            await client.query(statement)
            console.log(`✓ Executed statement ${i + 1}/${statements.length}`)
          } catch (stmtError) {
            console.error(`✗ Error executing statement ${i + 1}: ${statement.substring(0, 200)}...`)
            console.error('Full statement:', statement)
            console.error('Statement error:', stmtError)
            throw stmtError
          }
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