-- Database schema for OnlyTasks
-- Flexible schema that supports spaces, projects, apps, sprints, tasks, and custom fields

-- Global users table - users that can own/access spaces
CREATE TABLE IF NOT EXISTS global_users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auth tokens table - for password reset and login tokens
CREATE TABLE IF NOT EXISTS auth_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES global_users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'login', 'password_reset'
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification table - for verifying email addresses with PIN
CREATE TABLE IF NOT EXISTS email_verifications (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  pin VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  space_data JSONB, -- Store space creation data temporarily
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spaces table - each space is a workspace
CREATE TABLE IF NOT EXISTS spaces (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id VARCHAR(255) REFERENCES global_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table - users in spaces (now references global_users)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  space_id VARCHAR(255) NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES global_users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(space_id, user_id)
);

-- Projects table - projects within spaces
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  space_id VARCHAR(255) NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apps table - applications within projects
CREATE TABLE IF NOT EXISTS apps (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sprints table - sprints within apps
CREATE TABLE IF NOT EXISTS sprints (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  app_id VARCHAR(255) NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table - tasks within sprints
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  assignee VARCHAR(255),
  priority VARCHAR(100),
  status VARCHAR(100),
  due_date DATE,
  sprint_id VARCHAR(255) NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  custom_fields JSONB, -- Flexible storage for dynamic task fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom fields table - configurable fields per space
CREATE TABLE IF NOT EXISTS custom_fields (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL, -- Key used in task object
  type VARCHAR(50) NOT NULL, -- 'Text', 'Number', 'Date', 'Link'
  space_id VARCHAR(255) NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  app_id VARCHAR(255) REFERENCES apps(id) ON DELETE CASCADE, -- NULL = space-wide, otherwise app-specific
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(space_id, key, app_id)
);

-- App options table - configurable options like status, priority, assignees
CREATE TABLE IF NOT EXISTS app_options (
  id VARCHAR(255) PRIMARY KEY,
  app_id VARCHAR(255) NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  option_type VARCHAR(50) NOT NULL, -- 'status', 'priority', 'assignees'
  values JSONB NOT NULL, -- Array of option values
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(app_id, option_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_global_users_email ON global_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_tokens(token);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_pin ON email_verifications(pin);
CREATE INDEX IF NOT EXISTS idx_spaces_owner_id ON spaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_users_space_id ON users(space_id);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_space_id ON projects(space_id);
CREATE INDEX IF NOT EXISTS idx_apps_project_id ON apps(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_app_id ON sprints(app_id);
CREATE INDEX IF NOT EXISTS idx_tasks_sprint_id ON tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_space_id ON custom_fields(space_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_app_id ON custom_fields(app_id);
CREATE INDEX IF NOT EXISTS idx_app_options_app_id ON app_options(app_id);

-- Space themes table - per-space theming preferences
CREATE TABLE IF NOT EXISTS space_themes (
  space_id VARCHAR(255) PRIMARY KEY REFERENCES spaces(id) ON DELETE CASCADE,
  theme_name VARCHAR(50) NOT NULL DEFAULT 'theme-1',
  mode VARCHAR(10) NOT NULL DEFAULT 'dark', -- 'light' | 'dark'
  brand VARCHAR(20), -- optional brand variant
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_global_users_updated_at BEFORE UPDATE ON global_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON sprints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_fields_updated_at BEFORE UPDATE ON custom_fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_space_themes_updated_at BEFORE UPDATE ON space_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();