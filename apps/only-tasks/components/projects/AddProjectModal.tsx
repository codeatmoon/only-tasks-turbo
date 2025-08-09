"use client"
import { useState } from 'react'
import Modal from '../ui/Modal'

export default function AddProjectModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (name: string) => void }) {
    const [name, setName] = useState('')
    return (
        <Modal open={open} onClose={onClose} title="Add Project">
            <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="w-full border rounded px-3 py-2" />
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-2" onClick={onClose}>Cancel</button>
                    <button className="icon-btn" onClick={() => { if (name.trim()) { onCreate(name.trim()); setName(''); onClose() } }}>Create</button>
                </div>
            </div>
        </Modal>
    )
}
