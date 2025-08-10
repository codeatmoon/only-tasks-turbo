// Database types that extend our existing types for persistence
import { Project, App, Sprint, Task, Column } from "../types";

export interface DbGlobalUser {
  id: string;
  email: string;
  password_hash?: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbAuthToken {
  id: string;
  user_id: string;
  token: string;
  type: "login" | "password_reset";
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

export interface DbEmailVerification {
  id: string;
  email: string;
  pin: string;
  expires_at: Date;
  verified: boolean;
  space_data?: string; // JSON string containing space creation data
  created_at: Date;
}

export interface DbSpace {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbUser {
  id: string;
  space_id: string;
  user_id: string;
  name: string;
  role: "owner" | "admin" | "member";
  created_at: Date;
}

export interface DbProject extends Omit<Project, "apps"> {
  space_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbApp extends Omit<App, "sprints" | "columns"> {
  project_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbSprint extends Omit<Sprint, "tasks"> {
  app_id: string;
  start_date?: string;
  end_date?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbTask extends Task {
  sprint_id: string;
  due_date?: string;
  custom_fields?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbCustomField extends Column {
  space_id: string;
  app_id?: string; // nullable - can be space-wide or app-specific
  created_at: Date;
  updated_at: Date;
}

export interface DbAppOptions {
  id: string;
  app_id: string;
  option_type: "status" | "priority" | "assignees";
  values: string[]; // JSON array
  created_at: Date;
  updated_at: Date;
}

export interface DbSpaceTheme {
  space_id: string;
  theme_name: string; // e.g., 'theme-1' | 'theme-2'
  mode: "light" | "dark";
  brand?: "brand-a" | "brand-b" | null;
  updated_at: Date;
}

// Database interface for abstraction
export interface Database {
  // Authentication operations
  getGlobalUserByEmail(email: string): Promise<DbGlobalUser | null>;
  getGlobalUserById(userId: string): Promise<DbGlobalUser | null>;
  createGlobalUser(
    user: Omit<DbGlobalUser, "created_at" | "updated_at">,
  ): Promise<DbGlobalUser>;
  updateGlobalUser(
    userId: string,
    updates: Partial<DbGlobalUser>,
  ): Promise<DbGlobalUser>;

  // Auth token operations
  createAuthToken(token: Omit<DbAuthToken, "created_at">): Promise<DbAuthToken>;
  getAuthToken(token: string): Promise<DbAuthToken | null>;
  markTokenUsed(tokenId: string): Promise<void>;

  // Email verification operations
  createEmailVerification(
    verification: Omit<DbEmailVerification, "created_at">,
  ): Promise<DbEmailVerification>;
  getEmailVerification(
    email: string,
    pin: string,
  ): Promise<DbEmailVerification | null>;
  markEmailVerified(verificationId: string): Promise<void>;
  getEmailVerificationByEmail(
    email: string,
  ): Promise<DbEmailVerification | null>;

  // Space operations
  getSpace(spaceId: string): Promise<DbSpace | null>;
  createSpace(
    space: Omit<DbSpace, "created_at" | "updated_at">,
  ): Promise<DbSpace>;
  updateSpace(spaceId: string, updates: Partial<DbSpace>): Promise<DbSpace>;

  // Space user operations
  addUserToSpace(spaceUser: Omit<DbUser, "created_at">): Promise<DbUser>;
  getSpaceUsers(spaceId: string): Promise<DbUser[]>;

  // Project operations
  getProjectsBySpace(spaceId: string): Promise<DbProject[]>;
  createProject(
    project: Omit<DbProject, "created_at" | "updated_at">,
  ): Promise<DbProject>;

  // App operations
  getAppsByProject(projectId: string): Promise<DbApp[]>;
  createApp(app: Omit<DbApp, "created_at" | "updated_at">): Promise<DbApp>;

  // Sprint operations
  getSprintsByApp(appId: string): Promise<DbSprint[]>;
  createSprint(
    sprint: Omit<DbSprint, "created_at" | "updated_at">,
  ): Promise<DbSprint>;

  // Task operations
  getTasksBySprint(sprintId: string): Promise<DbTask[]>;
  createTask(task: Omit<DbTask, "created_at" | "updated_at">): Promise<DbTask>;
  updateTask(taskId: string, updates: Partial<DbTask>): Promise<DbTask>;

  // Custom fields
  getCustomFieldsBySpace(spaceId: string): Promise<DbCustomField[]>;
  createCustomField(
    field: Omit<DbCustomField, "created_at" | "updated_at">,
  ): Promise<DbCustomField>;

  // App options
  getAppOptions(appId: string): Promise<DbAppOptions[]>;
  createAppOptions(
    options: Omit<DbAppOptions, "created_at" | "updated_at">,
  ): Promise<DbAppOptions>;

  // Space theme
  getSpaceTheme(spaceId: string): Promise<DbSpaceTheme | null>;
  upsertSpaceTheme(
    theme: Omit<DbSpaceTheme, "updated_at">,
  ): Promise<DbSpaceTheme>;

  // Utility
  close(): Promise<void>;
}
