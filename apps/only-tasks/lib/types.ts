export interface Task {
  id: string;
  name: string;
  assignee?: string;
  priority?: 'Low' | 'Medium' | 'High' | string;
  status?: 'Not started' | 'Reviewing' | 'In-progress' | 'Complete' | string;
  dueDate?: string;
  // Additional dynamic fields keyed by column id/name
  [key: string]: unknown;
}

export interface TaskDraft {
  name: string;
  [key: string]: unknown;
}

export interface Sprint {
  id: string;
  name: string;
  tasks: Task[];
  startDate?: string; // ISO yyyy-MM-dd
  endDate?: string;   // ISO yyyy-MM-dd
}

export type ColumnType = 'Text' | 'Number' | 'Date' | 'Link';

export interface Column {
  id: string;
  name: string; // display name
  key: string; // key in Task object
  type: ColumnType;
}

export interface AppOptions {
  status: string[];
  priority: string[];
  assignees?: string[];
}

export interface App {
  id: string;
  name: string;
  sprints: Sprint[];
  columns?: Column[]; // additional, configurable columns
  options?: AppOptions;
}

export interface Project {
  id: string;
  name: string;
  apps: App[];
}
