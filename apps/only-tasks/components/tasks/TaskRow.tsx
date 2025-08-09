'use client'
import { useState, useEffect } from 'react'
import type { Task, Column } from '../../lib/types'
import TaskDropdown from './TaskDropdown'
import { Link2 } from 'lucide-react'
import { Pencil } from 'lucide-react'

type VisibleFields = {
  name: boolean
  assignee: boolean
  assigneeName?: boolean
  dueDate: boolean
  priority: boolean
  status: boolean
  link: boolean
  dynamics: Record<string, boolean>
}

type Props = {
  task: Task
  index: number
  columns?: Column[]
  statusOptions?: string[]
  priorityOptions?: string[]
  assigneeOptions?: string[]
  onChange?: (partial: Partial<Task>) => void
  visibleFields?: VisibleFields
  gridTemplate?: string
  onEditClick?: () => void
  showEditIcon?: boolean
}

function priorityPillClass(v?: unknown) {
  const val = String(v ?? '')
  if (/high/i.test(val)) return 'pill-priority-high'
  if (/medium/i.test(val)) return 'pill-priority-medium'
  if (/low/i.test(val)) return 'pill-priority-low'
  return ''
}

function statusPillClass(v?: unknown) {
  const val = String(v ?? '')
  if (/complete/i.test(val)) return 'pill-status-complete'
  if (/in[- ]?progress/i.test(val)) return 'pill-status-in-progress'
  if (/review/i.test(val)) return 'pill-status-reviewing'
  return 'pill-status-not-started'
}

export default function TaskRow({ task, index, columns = [], statusOptions = ['Not started', 'Reviewing', 'In-progress', 'Complete'], priorityOptions = ['Low', 'Medium', 'High'], assigneeOptions, onChange, visibleFields, gridTemplate, onEditClick, showEditIcon }: Props) {
  const [local, setLocal] = useState<Task>(task)

  useEffect(() => {
    setLocal(task)
  }, [task])

  const initials = (name?: string) => {
    const n = String(name ?? '').trim()
    if (!n) return '👤'
    const parts = n.split(/\s+/)
    const i = (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
    return i.toUpperCase() || '👤'
  }

  const setField = (key: string, value: unknown) => {
    setLocal(prev => ({ ...prev, [key]: value }))
    onChange?.({ [key]: value })
  }

  const getPriorityClass = (opt: string) => priorityPillClass(opt)
  const getStatusClass = (opt: string) => statusPillClass(opt)

  const sanitize = (k: string) => k.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const linkColumn = columns.find(c => c.type === 'Link')
  const linkValue = linkColumn ? String(local[linkColumn.key] ?? '') : ''
  const openLink = () => {
    if (!linkValue) return
    const href = /^https?:\/\//i.test(linkValue) ? linkValue : `https://${linkValue}`
    window.open(href, '_blank')
  }

  const defaultVF: VisibleFields = {
    name: true,
    assignee: true,
    assigneeName: true,
    dueDate: true,
    priority: true,
    status: true,
    link: true,
    dynamics: Object.fromEntries(columns.map(c => [c.key, true])) as Record<string, boolean>
  }
  const vf: VisibleFields = visibleFields ?? defaultVF

  const fmtDate = (iso?: string) => {
    if (!iso) return '-'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString()
  }

  const showAssigneeText = vf.assigneeName !== false

  return (
    <div className="group grid items-center gap-2 px-6 py-[3px] bg-white dark:bg-gray-900" style={{ gridTemplateColumns: gridTemplate ?? `28px minmax(280px,1fr) var(--w-assignee,160px) var(--w-due-date,160px) var(--w-priority,120px) var(--w-status,132px) ${columns.filter(c => c.type !== 'Link').map(c => `var(--w-dyn-${sanitize(c.key)}, 100px)`).join(' ')} 44px` }}>
      <div className="w-8 text-gray-600 dark:text-gray-300 relative">
        {showEditIcon && (
          <button type="button" className="absolute -left-4 top-1/2 -translate-y-1/2 icon-btn w-7 h-7" title="Edit" onClick={onEditClick}>
            <Pencil size={12} />
          </button>
        )}
        {index}.
      </div>

      {vf.name && (
        <div className="min-w-0">
          <div className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">{String(local.name || '-')}</div>
        </div>
      )}

      {vf.assignee && (
        <div data-col="assignee" className={showAssigneeText ? 'w-full' : 'w-fit'}>
          <TaskDropdown
            value={String(local.assignee ?? '')}
            options={assigneeOptions ?? []}
            onChange={(v) => setField('assignee', v)}
            buttonClassName={`px-0 py-0 bg-transparent border-0 shadow-none ${showAssigneeText ? 'w-full' : 'w-fit'} flex items-center gap-1 justify-start whitespace-normal dark:text-gray-200`}
            className="w-full"
            prefix={initials(String(local.assignee ?? ''))}
            showValue={showAssigneeText}
          />
        </div>
      )}

      {vf.dueDate && (
        <div data-col="due-date" className="w-full flex items-center justify-start self-center">
          <span className="text-sm text-gray-500 leading-none dark:text-gray-400">{fmtDate(String(local.dueDate ?? ''))}</span>
        </div>
      )}

      {vf.priority && (
        <div data-col="priority" className="w-full">
          <TaskDropdown
            value={String(local.priority ?? '')}
            options={priorityOptions}
            onChange={(v) => setField('priority', v)}
            buttonClassName={`px-3 py-1 rounded-md text-sm font-semibold ${priorityPillClass(local.priority)} w-full text-center`}
            getOptionClass={getPriorityClass}
          />
        </div>
      )}

      {vf.status && (
        <div data-col="status" className="w-full">
          <TaskDropdown
            value={String(local.status ?? '')}
            options={statusOptions}
            onChange={(v) => setField('status', v)}
            buttonClassName={`px-3 py-1 rounded-md text-sm font-semibold ${statusPillClass(local.status)} w-full text-center`}
            getOptionClass={getStatusClass}
          />
        </div>
      )}

      {columns.filter(c => c.type !== 'Link').map((c) => (
        vf.dynamics[c.key] !== false ? (
          <div key={c.id} className="w-full" data-col={`dyn-${sanitize(c.key)}`}>
            <DynamicCell column={c} value={local[c.key]} />
          </div>
        ) : null
      ))}

      {vf.link && (
        <div className="w-full flex justify-center">
          <button
            type="button"
            className={`${linkValue ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'} h-8 w-8 rounded-full border flex items-center justify-center`}
            title={linkValue || 'Link'}
            onClick={openLink}
            disabled={!linkValue}
          >
            <Link2 size={14} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  )
}

function DynamicCell({ column, value }: { column: Column; value: unknown }) {
  const base = 'w-full text-sm text-gray-700 break-words break-all whitespace-normal dark:text-gray-200'
  switch (column.type) {
    case 'Text': {
      const text = String((value as string) ?? '') || '-'
      return <span className={base}>{text}</span>
    }
    case 'Number': {
      const num = (value as number | undefined)
      return <span className={base}>{num ?? '-'}</span>
    }
    case 'Date': {
      const iso = String((value as string) ?? '')
      const d = iso ? new Date(iso) : undefined
      const out = d && !isNaN(d.getTime()) ? d.toLocaleDateString() : (iso || '-')
      return <span className={base + ' text-left block leading-none'}>{out}</span>
    }
    case 'Link': {
      // Not rendered; Link handled by compact cell
      const url = String((value as string) ?? '')
      const open = () => {
        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`
        if (url) window.open(href, '_blank')
      }
      return (
        <button type="button" className="pill bg-white dark:bg-gray-900 w-full flex items-center justify-center" onClick={open} title={url || 'https://'}>
          <Link2 size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      )
    }
    default:
      return <span className={base}>-</span>
  }
}
