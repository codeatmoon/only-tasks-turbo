'use client'
import SprintSection from './SprintSection'
import { splitCurrentAndBacklog } from '../../lib/utils'
import type { Project, App, Task, TaskDraft } from '../../lib/types'

interface Props {
  project: Project | undefined
  app: App | undefined
  onEditTask?: (sprintId: string, taskId: string, partial: Partial<Task>) => void
  onCreateTask?: (sprintId: string, draft: TaskDraft) => void
}

export default function TaskTable({ project, app, onEditTask, onCreateTask }: Props) {
  if (!project || !app) return <div className="card">No project or app found</div>

  const { current, backlog } = splitCurrentAndBacklog(app)

  return (
    <div className="space-y-4">
      {current && (
        <SprintSection
          sprint={current}
          columns={app.columns}
          app={app}
          onEditTask={(taskId, partial) => onEditTask?.(current.id, taskId, partial)}
          onCreateTask={(draft) => onCreateTask?.(current.id, draft)}
        />
      )}
      {backlog.map((g) => (
        <SprintSection
          key={g.label}
          sprint={{ id: g.label, name: g.label, tasks: g.tasks }}
          columns={app.columns}
          app={app}
          onEditTask={(taskId, partial) => onEditTask?.(g.sprintId, taskId, partial)}
          onCreateTask={(draft) => onCreateTask?.(g.sprintId, draft)}
        />
      ))}
    </div>
  )
}
