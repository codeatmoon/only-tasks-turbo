# Environment Configuration

## Database Setup

The application uses PostgreSQL with a flexible database abstraction layer that can easily be switched to other databases.

### Environment Variables

Create a `.env.local` file in the root directory with:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Default Connection

If no `DATABASE_URL` is provided, the application will use the default connection string:
```
postgresql://postgres:JtBLT51UWPYTHjpp@db.sbccoooiaanzamgqglhd.supabase.co:5432/postgres
```

### Database Schema

The database schema is automatically initialized on first API call. See `lib/database/schema.sql` for the complete schema definition.

### Switching Databases

To switch to a different database provider:

1. Implement the `Database` interface in `lib/database/types.ts`
2. Update the `createDatabase` function in `lib/database/client.ts`
3. Add the new database driver to dependencies

Example for MySQL:
```typescript
// lib/database/mysql.ts
import { Database } from './types'
import mysql from 'mysql2/promise'

export class MySQLDatabase implements Database {
  // Implement all Database methods
}
```

### Testing without Database

The application gracefully handles database connection failures and will show the space creation form when a space doesn't exist, even if the database is unavailable.