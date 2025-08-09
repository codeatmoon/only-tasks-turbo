import { Pool } from 'pg'
import {
  Database,
  DbGlobalUser,
  DbAuthToken,
  DbEmailVerification,
  DbSpace,
  DbUser,
  DbProject,
  DbApp,
  DbSprint,
  DbTask,
  DbCustomField,
  DbAppOptions,
  DbSpaceTheme
} from './types'

export class PostgresDatabase implements Database {
  private pool: Pool

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false } // For hosted databases like Supabase
    })
  }

  // Authentication operations
  async getGlobalUserById(userId: string): Promise<DbGlobalUser | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM global_users WHERE id = $1',
        [userId]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async getGlobalUserByEmail(email: string): Promise<DbGlobalUser | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM global_users WHERE email = $1',
        [email]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async createGlobalUser(user: Omit<DbGlobalUser, 'created_at' | 'updated_at'>): Promise<DbGlobalUser> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO global_users (id, email, password_hash, name) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [user.id, user.email, user.password_hash, user.name]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async updateGlobalUser(userId: string, updates: Partial<DbGlobalUser>): Promise<DbGlobalUser> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `UPDATE global_users 
         SET email = COALESCE($2, email),
             password_hash = COALESCE($3, password_hash),
             name = COALESCE($4, name),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 
         RETURNING *`,
        [userId, updates.email, updates.password_hash, updates.name]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Auth token operations
  async createAuthToken(token: Omit<DbAuthToken, 'created_at'>): Promise<DbAuthToken> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO auth_tokens (id, user_id, token, type, expires_at, used) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [token.id, token.user_id, token.token, token.type, token.expires_at, token.used]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async getAuthToken(token: string): Promise<DbAuthToken | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM auth_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
        [token]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async markTokenUsed(tokenId: string): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query(
        'UPDATE auth_tokens SET used = TRUE WHERE id = $1',
        [tokenId]
      )
    } finally {
      client.release()
    }
  }

  // Email verification operations
  async createEmailVerification(verification: Omit<DbEmailVerification, 'created_at'>): Promise<DbEmailVerification> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO email_verifications (id, email, pin, expires_at, verified, space_data) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [verification.id, verification.email, verification.pin, verification.expires_at, verification.verified, verification.space_data]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async getEmailVerification(email: string, pin: string): Promise<DbEmailVerification | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM email_verifications WHERE email = $1 AND pin = $2 AND verified = FALSE AND expires_at > NOW()',
        [email, pin]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async markEmailVerified(verificationId: string): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query(
        'UPDATE email_verifications SET verified = TRUE WHERE id = $1',
        [verificationId]
      )
    } finally {
      client.release()
    }
  }

  async getEmailVerificationByEmail(email: string): Promise<DbEmailVerification | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM email_verifications WHERE email = $1 AND verified = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [email]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  // Space operations
  async getSpace(spaceId: string): Promise<DbSpace | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM spaces WHERE id = $1',
        [spaceId]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async createSpace(space: Omit<DbSpace, 'created_at' | 'updated_at'>): Promise<DbSpace> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO spaces (id, name, description, owner_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [space.id, space.name, space.description, space.owner_id]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async updateSpace(spaceId: string, updates: Partial<DbSpace>): Promise<DbSpace> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `UPDATE spaces 
         SET name = COALESCE($2, name),
             description = COALESCE($3, description),
             owner_id = COALESCE($4, owner_id),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 
         RETURNING *`,
        [spaceId, updates.name, updates.description, updates.owner_id]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Space user operations
  async addUserToSpace(spaceUser: Omit<DbUser, 'created_at'>): Promise<DbUser> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO users (id, space_id, user_id, name, role) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [spaceUser.id, spaceUser.space_id, spaceUser.user_id, spaceUser.name, spaceUser.role]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async getSpaceUsers(spaceId: string): Promise<DbUser[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE space_id = $1 ORDER BY created_at',
        [spaceId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  // Project operations
  async getProjectsBySpace(spaceId: string): Promise<DbProject[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM projects WHERE space_id = $1 ORDER BY created_at',
        [spaceId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async createProject(project: Omit<DbProject, 'created_at' | 'updated_at'>): Promise<DbProject> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO projects (id, name, space_id) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [project.id, project.name, project.space_id]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // App operations
  async getAppsByProject(projectId: string): Promise<DbApp[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM apps WHERE project_id = $1 ORDER BY created_at',
        [projectId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async createApp(app: Omit<DbApp, 'created_at' | 'updated_at'>): Promise<DbApp> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO apps (id, name, project_id) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [app.id, app.name, app.project_id]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Sprint operations
  async getSprintsByApp(appId: string): Promise<DbSprint[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM sprints WHERE app_id = $1 ORDER BY created_at',
        [appId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async createSprint(sprint: Omit<DbSprint, 'created_at' | 'updated_at'>): Promise<DbSprint> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO sprints (id, name, app_id, start_date, end_date) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [sprint.id, sprint.name, sprint.app_id, sprint.start_date, sprint.end_date]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Task operations
  async getTasksBySprint(sprintId: string): Promise<DbTask[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM tasks WHERE sprint_id = $1 ORDER BY created_at',
        [sprintId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async createTask(task: Omit<DbTask, 'created_at' | 'updated_at'>): Promise<DbTask> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO tasks (id, name, assignee, priority, status, due_date, sprint_id, custom_fields) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          task.id,
          task.name,
          task.assignee,
          task.priority,
          task.status,
          task.due_date,
          task.sprint_id,
          task.custom_fields
        ]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async updateTask(taskId: string, updates: Partial<DbTask>): Promise<DbTask> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `UPDATE tasks 
         SET name = COALESCE($2, name),
             assignee = COALESCE($3, assignee),
             priority = COALESCE($4, priority),
             status = COALESCE($5, status),
             due_date = COALESCE($6, due_date),
             custom_fields = COALESCE($7, custom_fields),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 
         RETURNING *`,
        [
          taskId,
          updates.name,
          updates.assignee,
          updates.priority,
          updates.status,
          updates.due_date,
          updates.custom_fields
        ]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Custom fields
  async getCustomFieldsBySpace(spaceId: string): Promise<DbCustomField[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM custom_fields WHERE space_id = $1 ORDER BY created_at',
        [spaceId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async createCustomField(field: Omit<DbCustomField, 'created_at' | 'updated_at'>): Promise<DbCustomField> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO custom_fields (id, name, key, type, space_id, app_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [field.id, field.name, field.key, field.type, field.space_id, field.app_id]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // App options
  async getAppOptions(appId: string): Promise<DbAppOptions[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM app_options WHERE app_id = $1',
        [appId]
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  async createAppOptions(options: Omit<DbAppOptions, 'created_at' | 'updated_at'>): Promise<DbAppOptions> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO app_options (id, app_id, option_type, values) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [options.id, options.app_id, options.option_type, JSON.stringify(options.values)]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Space theme operations
  async getSpaceTheme(spaceId: string): Promise<DbSpaceTheme | null> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM space_themes WHERE space_id = $1',
        [spaceId]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async upsertSpaceTheme(theme: Omit<DbSpaceTheme, 'updated_at'>): Promise<DbSpaceTheme> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO space_themes (space_id, theme_name, mode, brand)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (space_id)
         DO UPDATE SET theme_name = EXCLUDED.theme_name, mode = EXCLUDED.mode, brand = EXCLUDED.brand, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [theme.space_id, theme.theme_name, theme.mode, theme.brand]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}