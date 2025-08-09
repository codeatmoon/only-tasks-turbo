"use client"
import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import type { App, Column, ColumnType } from '../../lib/types'

const TYPES: ColumnType[] = ['Text', 'Number', 'Date', 'Link']

export default function ColumnConfigModal({ open, onClose, app, onSave }: { open: boolean; onClose: () => void; app?: App; onSave: (cols: Column[], options: { status: string[]; priority: string[] }) => void }) {
    const [cols, setCols] = useState<Column[]>([])
    const [status, setStatus] = useState<string[]>([])
    const [priority, setPriority] = useState<string[]>([])

    useEffect(() => {
        setCols(app?.columns ?? [])
        setStatus(app?.options?.status ?? ['Not started', 'Reviewing', 'In-progress', 'Complete'])
        setPriority(app?.options?.priority ?? ['Low', 'Medium', 'High'])
    }, [app])

    const addCol = () => {
        const id = `col-${Date.now()}`
        setCols(prev => [...prev, { id, name: 'New Column', key: `field_${prev.length + 1}`, type: 'Text' }])
    }

    return (
        <Modal open={open} onClose={onClose} title="Configure Columns & Fields">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <section>
                    <div className="mb-2 text-sm font-medium">Columns</div>
                    <div className="space-y-3">
                        {cols.map((c) => (
                            <div className="flex items-center gap-2" key={c.id}>
                                <input className="border rounded px-2 py-1 w-40" value={c.name} onChange={(e) => setCols(prev => prev.map(pc => pc.id === c.id ? { ...pc, name: e.target.value } : pc))} />
                                <input className="border rounded px-2 py-1 w-40" value={c.key} onChange={(e) => setCols(prev => prev.map(pc => pc.id === c.id ? { ...pc, key: e.target.value } : pc))} />
                                <select className="border rounded px-2 py-1" value={c.type} onChange={(e) => setCols(prev => prev.map(pc => pc.id === c.id ? { ...pc, type: e.target.value as ColumnType } : pc))}>
                                    {TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                                <button className="text-red-600" onClick={() => setCols(prev => prev.filter(pc => pc.id !== c.id))}>Remove</button>
                            </div>
                        ))}
                        <button className="icon-btn" onClick={addCol}>Add Column</button>
                    </div>
                </section>
                <section>
                    <div className="mb-2 text-sm font-medium">Field Options</div>
                    <div className="space-y-3">
                        <TagEditor label="Status" values={status} onChange={setStatus} />
                        <TagEditor label="Priority" values={priority} onChange={setPriority} />
                    </div>
                </section>
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <button className="px-3 py-2" onClick={onClose}>Cancel</button>
                <button className="icon-btn" onClick={() => { onSave(cols, { status, priority }); onClose() }}>Save</button>
            </div>
        </Modal>
    )
}

function TagEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
    return (
        <div>
            <div className="text-xs text-gray-600 mb-1">{label}</div>
            <div className="flex flex-wrap gap-2">
                {values.map((v, i) => (
                    <div key={`${v}-${i}`} className="flex items-center gap-1">
                        <input className="border rounded px-2 py-1" value={v} onChange={(e) => onChange(values.map((ov, oi) => oi === i ? e.target.value : ov))} />
                        <button className="text-red-600" onClick={() => onChange(values.filter((_, oi) => oi !== i))}>×</button>
                    </div>
                ))}
                <button className="icon-btn" onClick={() => onChange([...values, 'New'])}>Add</button>
            </div>
        </div>
    )
}
