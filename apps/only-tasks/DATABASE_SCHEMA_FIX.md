# Database Setup Instructions

## Issue: "owner_id column does not exist"

The database schema includes the `owner_id` column in the `spaces` table (see `lib/database/schema.sql` line 30), but the error suggests the database isn't properly initialized.

## Root Cause

The application tries to connect to a Supabase database that may not be accessible or properly configured in the current environment.

## Solution

1. **Check Database Connection**: Ensure the database URL in `lib/database/client.ts` is correct and accessible
2. **Verify Database Exists**: Make sure the PostgreSQL database exists and is running
3. **Manual Schema Initialization**: If automatic initialization fails, manually run the SQL from `lib/database/schema.sql`
4. **Environment Variables**: Set up proper `DATABASE_URL` environment variable instead of using hardcoded URL

## Schema Verification

The `spaces` table in `schema.sql` correctly includes:

```sql
CREATE TABLE IF NOT EXISTS spaces (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id VARCHAR(255) REFERENCES global_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The UI improvements will work once the database connection is properly configured.
