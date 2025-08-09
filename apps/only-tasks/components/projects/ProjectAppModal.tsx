"use client"
import { useMemo, useState } from 'react'
import Modal from '../ui/Modal'
import type { Project } from '../../lib/types'

export default function ProjectAppModal({ projects, open, onClose, onPick }: { projects: Project[]; open: boolean; onClose: () => void; onPick: (projectId: string, appId: string) => void }) {
    const [sel, setSel] = useState<{ projectId?: string; appId?: string }>({})
    const active = useMemo(() => projects.find(p => p.id === sel.projectId) ?? projects[0], [projects, sel])

    return (
        <Modal open={open} onClose={onClose} title="Apps by Project">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <aside className="space-y-1">
                    {projects.map(p => (
                        <button key={p.id} className={`w-full text-left px-3 py-2 rounded border ${p.id === active.id ? 'bg-gray-50' : 'bg-white'}`} onClick={() => setSel({ projectId: p.id })}>
                            {p.name}
                        </button>
                    ))}
                </aside>
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                    {active.apps.map(a => (
                        <button key={a.id} className="card" onClick={() => { onPick(active.id, a.id); onClose() }}>
                            <div className="text-sm font-medium">{a.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{a.sprints.length} sprints</div>
                        </button>
                    ))}
                </div>
            </div>
        </Modal>
    )
}
