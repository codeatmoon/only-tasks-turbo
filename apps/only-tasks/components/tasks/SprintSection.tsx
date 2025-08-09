'use client'
import TaskRow from './TaskRow'
import type { Sprint, Column, App, Task, TaskDraft } from '../../lib/types'
import { Plus, Columns as ColumnsIcon } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import AddTaskModal from './AddTaskModal'
import EditTaskModal from './EditTaskModal'
import { Pencil } from 'lucide-react'

export default function SprintSection({ sprint, columns = [], app, onEditTask, onCreateTask }: { sprint: Sprint; columns?: Column[]; app?: App; onEditTask?: (taskId: string, partial: Partial<Task>) => void; onCreateTask?: (draft: TaskDraft) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // Visibility state for columns in this section
  const [showMenu, setShowMenu] = useState(false)
  const [visible, setVisible] = useState(() => ({
    name: true,
    assignee: true,
    assigneeName: true,
    dueDate: true,
    priority: true,
    status: true,
    link: true,
    dynamics: Object.fromEntries((columns || []).map(c => [c.key, true])) as Record<string, boolean>
  }))

  const [addOpen, setAddOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  const sanitize = (k: string) => k.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  // Compute a grid template to align header and rows
  const gridTemplate = useMemo(() => {
    const parts: string[] = []
    parts.push('28px') // index
    parts.push('minmax(280px,1fr)') // name is always visible
    parts.push('var(--w-assignee,160px)') // assignee always visible
    if (visible.dueDate) parts.push('var(--w-due-date,160px)')
    if (visible.priority) parts.push('var(--w-priority,120px)')
    parts.push('var(--w-status,132px)') // status always visible
    for (const c of columns) {
      if (c.type === 'Link') continue
      if (visible.dynamics[c.key] !== false) parts.push(`var(--w-dyn-${sanitize(c.key)}, 100px)`)
    }
    if (visible.link) parts.push('44px')
    return parts.join(' ')
  }, [columns, visible])

  useLayoutEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const baseKeys = ['assignee', 'due-date', 'priority', 'status']

    const measure = (key: string) => {
      const els = node.querySelectorAll<HTMLElement>(`[data-col="${key}"]`)
      let max = 0
      els.forEach(el => { max = Math.max(max, el.offsetWidth) })
      if (max > 0) node.style.setProperty(`--w-${key}`, `${Math.ceil(max)}px`)
    }

    baseKeys.forEach(measure)
    columns.forEach(c => { if (c.type !== 'Link') measure(`dyn-${sanitize(c.key)}`) })

    const onResize = () => {
      baseKeys.forEach(measure)
      columns.forEach(c => { if (c.type !== 'Link') measure(`dyn-${sanitize(c.key)}`) })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sprint.tasks, columns, visible])

  // Menu positioning (portal)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null)
  useEffect(() => {
    if (!showMenu) return
    const compute = () => {
      const btn = menuBtnRef.current
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const vw = window.innerWidth + window.scrollX
      const minWidth = Math.max(288, Math.round(r.width))
      const panelWidth = Math.max(minWidth, 288)
      let left = Math.round(r.left + window.scrollX + r.width - panelWidth)
      if (left + panelWidth > vw - 8) left = Math.max(8 + window.scrollX, vw - 8 - panelWidth)
      if (left < 8 + window.scrollX) left = 8 + window.scrollX
      const top = Math.round(r.bottom + window.scrollY + 8)
      setMenuPos({ top, left, width: minWidth })
    }
    compute()
    const onResizeScroll = () => compute()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMenu(false) }
    window.addEventListener('resize', onResizeScroll)
    window.addEventListener('scroll', onResizeScroll, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResizeScroll)
      window.removeEventListener('scroll', onResizeScroll, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [showMenu])

  return (
    <section ref={sectionRef} className={`card overflow-x-auto relative ${showMenu ? 'z-[200]' : ''}`}>
      <div className="mb-3 flex items-center justify-between relative z-10">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-800 dark:text-gray-200">{sprint.name}</span>
        <div className="flex items-center gap-2">
          <button className={`icon-btn ${editMode ? 'ring-2 ring-indigo-200 dark:ring-indigo-800' : ''}`} title="Toggle edit mode" onClick={() => setEditMode(v => !v)}>
            <Pencil size={16} />
          </button>
          <button ref={menuBtnRef} className="icon-btn" title="Choose fields" onClick={() => setShowMenu(true)}>
            <ColumnsIcon size={16} />
          </button>
          <button className="icon-btn" title="Add Task" onClick={() => setAddOpen(true)}>
            <Plus size={16} />
          </button>
        </div>

        {showMenu && (createPortal(
          <>
            {/* Blur overlay */}
            <div className="fixed inset-0 z-[210] bg-black/10 backdrop-blur-[2px]" onClick={() => setShowMenu(false)} />
            {/* Dropdown panel */}
            <div className="fixed z-[220] card p-3" style={{ top: menuPos?.top ?? 0, left: menuPos?.left ?? 0, minWidth: Math.max(menuPos?.width ?? 288, 288), maxHeight: '70vh', overflow: 'auto' }}>
              <button type="button" aria-label="Close" className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowMenu(false)}>✕</button>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Core fields</div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                {/* Name, Assignee, Status are always on; Name/Status not toggleable */}
                <label className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                  <input type="checkbox" className="h-4 w-4" checked readOnly />
                  <span>Task</span>
                </label>
                <label className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                  <input type="checkbox" className="h-4 w-4" checked readOnly />
                  <span>Assignee</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={visible.assigneeName} onChange={(e) => setVisible(prev => ({ ...prev, assigneeName: e.target.checked }))} />
                  <span>Assignee name</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={visible.dueDate} onChange={(e) => setVisible(prev => ({ ...prev, dueDate: e.target.checked }))} />
                  <span>Due date</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={visible.priority} onChange={(e) => setVisible(prev => ({ ...prev, priority: e.target.checked }))} />
                  <span>Priority</span>
                </label>
                <label className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                  <input type="checkbox" className="h-4 w-4" checked readOnly />
                  <span>Status</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" checked={visible.link} onChange={(e) => setVisible(prev => ({ ...prev, link: e.target.checked }))} />
                  <span>Link</span>
                </label>
              </div>

              {columns.filter(c => c.type !== 'Link').length > 0 && (
                <>
                  <div className="text-xs text-gray-500 mb-1">Custom fields</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {columns.filter(c => c.type !== 'Link').map(c => (
                      <label key={c.id} className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4" checked={visible.dynamics[c.key] !== false} onChange={(e) => setVisible(prev => ({ ...prev, dynamics: { ...prev.dynamics, [c.key]: e.target.checked } }))} />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {/* Removed bottom Close button */}
            </div>
          </>,
          document.body
        ) as unknown as React.ReactNode)}
      </div>

      {/* Header row */}
      <div className="text-xs text-gray-500 font-medium mb-2 px-6" style={{ display: 'grid', gridTemplateColumns: gridTemplate, columnGap: '0.5rem' }}>
        <div>#</div>
        <div>Task</div>
        <div data-col="assignee">Assignee</div>
        {visible.dueDate && <div data-col="due-date">Due date</div>}
        {visible.priority && <div data-col="priority">Priority</div>}
        <div data-col="status">Status</div>
        {columns.filter(c => c.type !== 'Link').map(c => (
          (visible.dynamics[c.key] !== false) ? <div key={c.id} data-col={`dyn-${sanitize(c.key)}`}>{c.name}</div> : null
        ))}
        {visible.link && <div className="text-center">Link</div>}
      </div>

      <ol className="divide-y dark:divide-gray-800">
        {sprint.tasks.map((t, idx) => (
          <li key={t.id} className="py-0 relative">
            <TaskRow
              task={t}
              index={idx + 1}
              columns={columns}
              statusOptions={app?.options?.status}
              priorityOptions={app?.options?.priority}
              assigneeOptions={app?.options?.assignees}
              onChange={(partial: Partial<Task>) => onEditTask?.(t.id, partial)}
              visibleFields={visible}
              gridTemplate={gridTemplate}
              showEditIcon={editMode}
              onEditClick={() => { setSelectedTask(t); setEditOpen(true) }}
            />
          </li>
        ))}
      </ol>

      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={selectedTask}
        onSave={(partial) => selectedTask && onEditTask?.(selectedTask.id, partial)}
        options={{ assignees: app?.options?.assignees, status: app?.options?.status, priority: app?.options?.priority }}
        columns={columns}
      />

      <AddTaskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        options={{ assignees: app?.options?.assignees, status: app?.options?.status, priority: app?.options?.priority }}
        columns={columns}
        onCreate={(draft) => onCreateTask?.(draft)}
      />
    </section>
  )
}
