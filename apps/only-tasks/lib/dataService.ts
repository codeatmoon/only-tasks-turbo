import { getDatabase } from './database/client'
import { Project, App, Sprint, Task, AppOptions } from './types'
import { DbGlobalUser, DbAuthToken, DbSpace, DbUser, DbProject, DbApp, DbSprint, DbTask } from './database/types'

// Convert database records to application types
function dbProjectToProject(dbProject: DbProject, apps: App[]): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    apps
  }
}

function dbAppToApp(dbApp: DbApp, sprints: Sprint[], options?: AppOptions): App {
  return {
    id: dbApp.id,
    name: dbApp.name,
    sprints,
    options
  }
}

function dbSprintToSprint(dbSprint: DbSprint, tasks: Task[]): Sprint {
  return {
    id: dbSprint.id,
    name: dbSprint.name,
    tasks,
    startDate: dbSprint.start_date,
    endDate: dbSprint.end_date
  }
}

function dbTaskToTask(dbTask: DbTask): Task {
  // Merge the custom_fields JSON with the base task properties
  const customFields = dbTask.custom_fields ? JSON.parse(dbTask.custom_fields) : {}
  return {
    id: dbTask.id,
    name: dbTask.name,
    assignee: dbTask.assignee,
    priority: dbTask.priority,
    status: dbTask.status,
    dueDate: dbTask.due_date,
    ...customFields
  }
}

export class DataService {
  private get db() {
    return getDatabase()
  }

  // Authentication operations
  async getGlobalUserByEmail(email: string) {
    return await this.db.getGlobalUserByEmail(email)
  }

  async getGlobalUserById(userId: string) {
    return await this.db.getGlobalUserById(userId)
  }

  // Space theme
  async getSpaceTheme(spaceId: string) {
    return await this.db.getSpaceTheme(spaceId)
  }

  async saveSpaceTheme(spaceId: string, theme: { theme_name: string; mode: 'light' | 'dark'; brand?: 'brand-a' | 'brand-b' | null }) {
    return await this.db.upsertSpaceTheme({ space_id: spaceId, ...theme })
  }

  async createGlobalUser(user: Omit<DbGlobalUser, 'created_at' | 'updated_at'>) {
    return await this.db.createGlobalUser(user)
  }

  async updateGlobalUser(userId: string, updates: Partial<DbGlobalUser>) {
    return await this.db.updateGlobalUser(userId, updates)
  }

  async createAuthToken(token: Omit<DbAuthToken, 'created_at'>) {
    return await this.db.createAuthToken(token)
  }

  async getAuthToken(token: string) {
    return await this.db.getAuthToken(token)
  }

  async markTokenUsed(tokenId: string) {
    return await this.db.markTokenUsed(tokenId)
  }

  // Space operations
  async getSpace(spaceId: string) {
    return await this.db.getSpace(spaceId)
  }

  async createSpace(space: Omit<DbSpace, 'created_at' | 'updated_at'>) {
    return await this.db.createSpace(space)
  }

  async addUserToSpace(spaceUser: Omit<DbUser, 'created_at'>) {
    return await this.db.addUserToSpace(spaceUser)
  }

  // Get full project structure for a space
  async getProjectsWithData(spaceId: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySpace(spaceId)

    const projects: Project[] = []

    for (const dbProject of dbProjects) {
      const dbApps = await this.db.getAppsByProject(dbProject.id)
      const apps: App[] = []

      for (const dbApp of dbApps) {
        const dbSprints = await this.db.getSprintsByApp(dbApp.id)
        const sprints: Sprint[] = []

        for (const dbSprint of dbSprints) {
          const dbTasks = await this.db.getTasksBySprint(dbSprint.id)
          const tasks = dbTasks.map(dbTaskToTask)
          sprints.push(dbSprintToSprint(dbSprint, tasks))
        }

        // Get app options
        const dbAppOptions = await this.db.getAppOptions(dbApp.id)
        const options: AppOptions = {
          status: [],
          priority: [],
          assignees: []
        }

        dbAppOptions.forEach(option => {
          const values = Array.isArray(option.values) ? option.values : JSON.parse(option.values)
          options[option.option_type as keyof AppOptions] = values
        })

        apps.push(dbAppToApp(dbApp, sprints, options))
      }

      projects.push(dbProjectToProject(dbProject, apps))
    }

    return projects
  }

  // Create a default project structure for a new space
  async createDefaultProject(spaceId: string): Promise<Project> {
    // Create project
    const projectId = `proj-${Date.now()}`
    const dbProject = await this.db.createProject({
      id: projectId,
      name: 'Default Project',
      space_id: spaceId
    })

    // Create app
    const appId = `app-${Date.now()}`
    const dbApp = await this.db.createApp({
      id: appId,
      name: 'Tasks App',
      project_id: projectId
    })

    // Create default sprint
    const sprintId = `sprint-${Date.now()}`
    const dbSprint = await this.db.createSprint({
      id: sprintId,
      name: 'Sprint 1',
      app_id: appId,
      start_date: undefined,
      end_date: undefined
    })

    // Create default app options
    await this.db.createAppOptions({
      id: `opt-status-${Date.now()}`,
      app_id: appId,
      option_type: 'status',
      values: ['Not started', 'In-progress', 'Reviewing', 'Complete']
    })

    await this.db.createAppOptions({
      id: `opt-priority-${Date.now()}`,
      app_id: appId,
      option_type: 'priority',
      values: ['Low', 'Medium', 'High']
    })

    await this.db.createAppOptions({
      id: `opt-assignees-${Date.now()}`,
      app_id: appId,
      option_type: 'assignees',
      values: ['Team Member 1', 'Team Member 2']
    })

    // Return the created project structure
    return {
      id: dbProject.id,
      name: dbProject.name,
      apps: [{
        id: dbApp.id,
        name: dbApp.name,
        sprints: [{
          id: dbSprint.id,
          name: dbSprint.name,
          tasks: []
        }],
        options: {
          status: ['Not started', 'In-progress', 'Reviewing', 'Complete'],
          priority: ['Low', 'Medium', 'High'],
          assignees: ['Team Member 1', 'Team Member 2']
        }
      }]
    }
  }

  // Task operations
  async createTask(sprintId: string, task: Omit<Task, 'id'>): Promise<Task> {
    const taskId = `task-${Date.now()}`
    const dbTask = await this.db.createTask({
      id: taskId,
      name: task.name,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate,
      sprint_id: sprintId,
      custom_fields: JSON.stringify(task)
    })
    return dbTaskToTask(dbTask)
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const dbTask = await this.db.updateTask(taskId, {
      name: updates.name,
      assignee: updates.assignee,
      priority: updates.priority,
      status: updates.status,
      due_date: updates.dueDate,
      custom_fields: JSON.stringify(updates)
    })
    return dbTaskToTask(dbTask)
  }
}