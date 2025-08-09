'use client'
import { useMemo, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Project, App as AppType, Sprint } from '@/lib/types'
import { LucidePlus, LucideTrash2, LucideCalendar, LucideEdit2, LucideSave } from 'lucide-react'

export default function SettingsPage() {
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', [])
    const [sel, setSel] = useState<{ projectId?: string; appId?: string }>({})

    const currentProject = useMemo(() => projects.find(p => p.id === sel.projectId) ?? projects[0], [projects, sel])
    const currentApp: AppType | undefined = useMemo(() => currentProject?.apps.find(a => a.id === sel.appId) ?? currentProject?.apps[0], [currentProject, sel])

    const updateProjects = (updater: (ps: Project[]) => Project[]) => {
        setProjects(updater(projects || []))
    }

    const addProject = (name: string) => {
        const id = `proj-${Date.now()}`
        const proj: Project = { id, name, apps: [] }
        updateProjects(ps => [...ps, proj])
        setSel({ projectId: id, appId: undefined })
    }

    const renameProject = (id: string, name: string) => {
        updateProjects(ps => ps.map(p => p.id === id ? { ...p, name } : p))
    }

    const removeProject = (id: string) => {
        updateProjects(ps => ps.filter(p => p.id !== id))
        setSel({})
    }

    const addApp = (name: string) => {
        if (!currentProject) return
        const id = `app-${Date.now()}`
        const app: AppType = { id, name, sprints: [], columns: [], options: { status: ['Not started', 'Reviewing', 'In-progress', 'Complete'], priority: ['Low', 'Medium', 'High'] } }
        updateProjects(ps => ps.map(p => p.id === currentProject.id ? { ...p, apps: [...p.apps, app] } : p))
        setSel({ projectId: currentProject.id, appId: id })
    }

    const renameApp = (id: string, name: string) => {
        if (!currentProject) return
        updateProjects(ps => ps.map(p => p.id === currentProject.id ? { ...p, apps: p.apps.map(a => a.id === id ? { ...a, name } : a) } : p))
    }

    const removeApp = (id: string) => {
        if (!currentProject) return
        updateProjects(ps => ps.map(p => p.id === currentProject.id ? { ...p, apps: p.apps.filter(a => a.id !== id) } : p))
        setSel({ projectId: currentProject.id, appId: undefined })
    }

    const addSprint = (name: string, startDate?: string, endDate?: string) => {
        if (!currentProject || !currentApp) return
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert('Start date must be before end date')
            return
        }
        if (startDate && endDate) {
            const overlap = (currentApp.sprints || []).some(s => s.startDate && s.endDate && rangesOverlap(startDate, endDate, s.startDate, s.endDate))
            if (overlap) {
                alert('Sprint dates overlap with an existing sprint')
                return
            }
        }
        const id = `s-${Date.now()}`
        const sprint: Sprint = { id, name, tasks: [], startDate, endDate }
        updateProjects(ps => ps.map(p => p.id === currentProject.id ? {
            ...p,
            apps: p.apps.map(a => a.id === currentApp.id ? { ...a, sprints: [...a.sprints, sprint] } : a)
        } : p))
    }

    const renameSprint = (id: string, name: string) => {
        if (!currentProject || !currentApp) return
        updateProjects(ps => ps.map(p => p.id === currentProject.id ? {
            ...p,
            apps: p.apps.map(a => a.id === currentApp.id ? { ...a, sprints: a.sprints.map(s => s.id === id ? { ...s, name } : s) } : a)
        } : p))
    }

    const removeSprint = (id: string) => {
        if (!currentProject || !currentApp) return
        updateProjects(ps => ps.map(p => p.id === currentProject.id ? {
            ...p,
            apps: p.apps.map(a => a.id === currentApp.id ? { ...a, sprints: a.sprints.filter(s => s.id !== id) } : a)
        } : p))
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Settings</h1>
            </header>

            {/* Projects */}
            <section className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold">Projects</h2>
                    <AddInline onAdd={(n) => addProject(n)} placeholder="New project name" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(projects || []).map(p => (
                        <div key={p.id} className="p-3 border rounded-lg bg-white">
                            <InlineEditable value={p.name} onSave={(n) => renameProject(p.id, n)} />
                            <div className="flex items-center gap-2 mt-2">
                                <button className={`px-2 py-1 rounded text-xs ${sel.projectId === p.id ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setSel({ projectId: p.id, appId: undefined })}>Select</button>
                                <button className="ml-auto icon-btn w-8 h-8" title="Remove project" onClick={() => removeProject(p.id)}>
                                    <LucideTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {!projects?.length && <div className="text-sm text-gray-500">No projects yet.</div>}
                </div>
            </section>

            {/* Apps and Sprints */}
            <section className="grid gap-4 lg:grid-cols-2">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold">Apps</h2>
                        <AddInline onAdd={(n) => addApp(n)} placeholder="New app name" disabled={!currentProject} />
                    </div>
                    <div className="space-y-3">
                        {(currentProject?.apps || []).map(a => (
                            <div key={a.id} className="p-3 border rounded-lg">
                                <InlineEditable value={a.name} onSave={(n) => renameApp(a.id, n)} />
                                <div className="flex items-center gap-2 mt-2">
                                    <button className={`px-2 py-1 rounded text-xs ${sel.appId === a.id ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setSel({ projectId: currentProject?.id, appId: a.id })}>Select</button>
                                    <button className="ml-auto icon-btn w-8 h-8" title="Remove app" onClick={() => removeApp(a.id)}>
                                        <LucideTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {!currentProject && <div className="text-sm text-gray-500">Select or create a project.</div>}
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold">Sprints</h2>
                        <SprintAdd onAdd={addSprint} disabled={!currentApp} />
                    </div>
                    <div className="space-y-3">
                        {(currentApp?.sprints || []).map(s => (
                            <div key={s.id} className="p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <InlineEditable value={s.name} onSave={(n) => renameSprint(s.id, n)} />
                                    {(s.startDate || s.endDate) && (
                                        <div className="ml-auto text-xs text-gray-600 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1"><LucideCalendar size={12} /> {s.startDate || '—'}</span>
                                            <span>→</span>
                                            <span className="inline-flex items-center gap-1"><LucideCalendar size={12} /> {s.endDate || '—'}</span>
                                        </div>
                                    )}
                                </div>
                                {!s.startDate && !s.endDate && (
                                    <div className="text-[11px] text-gray-500 mt-1">Tip: Add a start/end date to help prevent overlap.</div>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <button className="ml-auto icon-btn w-8 h-8" title="Remove sprint" onClick={() => removeSprint(s.id)}>
                                        <LucideTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {!currentApp && <div className="text-sm text-gray-500">Select or create an app.</div>}
                    </div>
                </div>
            </section>
        </div>
    )
}

function AddInline({ onAdd, placeholder, disabled }: { onAdd: (name: string) => void; placeholder: string; disabled?: boolean }) {
    const [v, setV] = useState('')
    return (
        <div className="flex items-center gap-2">
            <input
                disabled={disabled}
                value={v}
                onChange={e => setV(e.target.value)}
                placeholder={placeholder}
                className="px-2 py-1 border rounded text-sm"
            />
            <button
                disabled={!v || disabled}
                onClick={() => { onAdd(v.trim()); setV('') }}
                className="icon-btn w-8 h-8"
                title="Add"
            >
                <LucidePlus size={14} />
            </button>
        </div>
    )
}

function SprintAdd({ onAdd, disabled }: { onAdd: (name: string, start?: string, end?: string) => void; disabled?: boolean }) {
    const [name, setName] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    const submit = () => {
        if (!name) return
        if (start && end && new Date(start) > new Date(end)) return
        onAdd(name.trim(), start || undefined, end || undefined)
        setName(''); setStart(''); setEnd('')
    }

    return (
        <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1">Sprint name</label>
                <input disabled={disabled} value={name} onChange={e => setName(e.target.value)} placeholder="Sprint name" className="px-2 py-1 border rounded text-sm min-w-[160px]" />
            </div>
            <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1">Start date</label>
                <input disabled={disabled} type="date" value={start} onChange={e => setStart(e.target.value)} className="px-2 py-1 border rounded text-sm" />
            </div>
            <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1">End date</label>
                <input disabled={disabled} type="date" value={end} onChange={e => setEnd(e.target.value)} min={start || undefined} className="px-2 py-1 border rounded text-sm" />
            </div>
            <button disabled={disabled || !name} onClick={submit} className="icon-btn w-8 h-8" title="Add sprint">
                <LucidePlus size={14} />
            </button>
        </div>
    )
}

function InlineEditable({ value, onSave }: { value: string; onSave: (v: string) => void }) {
    const [editing, setEditing] = useState(false)
    const [v, setV] = useState(value)

    const save = () => { if (!v.trim()) return; onSave(v.trim()); setEditing(false) }

    return (
        <div className="flex items-center gap-2">
            {editing ? (
                <>
                    <input value={v} onChange={e => setV(e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <button className="icon-btn w-8 h-8" title="Save" onClick={save}><LucideSave size={14} /></button>
                </>
            ) : (
                <>
                    <div className="font-medium">{value}</div>
                    <button className="icon-btn w-8 h-8" title="Rename" onClick={() => { setV(value); setEditing(true) }}><LucideEdit2 size={14} /></button>
                </>
            )}
        </div>
    )
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
    const aS = new Date(aStart).getTime()
    const aE = new Date(aEnd).getTime()
    const bS = new Date(bStart).getTime()
    const bE = new Date(bEnd).getTime()
    return aS <= bE && bS <= aE
}
