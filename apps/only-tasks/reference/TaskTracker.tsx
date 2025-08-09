"use client"

import React, { useMemo, useState } from 'react'

type Status = 'To Do' | 'In Progress' | 'Done'

const statusClasses: Record<Status, { bg: string; text: string }> = {
    'To Do': { bg: 'bg-blue-50', text: 'text-blue-700' },
    'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700' },
    'Done': { bg: 'bg-green-50', text: 'text-green-700' },
}

export type Task = {
    id: number
    sprint: string
    title: string
    status: Status
}

const initialTasks: Task[] = [
    { id: 1, sprint: 'Sprint 1', title: 'Setup project', status: 'Done' },
    { id: 2, sprint: 'Sprint 1', title: 'Create components', status: 'In Progress' },
    { id: 3, sprint: 'Sprint 2', title: 'Implement API', status: 'To Do' },
]

export default function TaskTracker() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [showModal, setShowModal] = useState(false)
    const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({ sprint: '', title: '', status: 'To Do' })

    const grouped = useMemo(() => {
        return tasks.reduce<Record<string, Task[]>>((acc, t) => {
            acc[t.sprint] = acc[t.sprint] || []
            acc[t.sprint].push(t)
            return acc
        }, {})
    }, [tasks])

    const addTask = () => {
        if (!newTask.sprint.trim() || !newTask.title.trim()) return
        setTasks(prev => [...prev, { ...newTask, id: prev.length + 1 }])
        setShowModal(false)
        setNewTask({ sprint: '', title: '', status: 'To Do' })
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
                Add Task
            </button>

            {Object.keys(grouped).map((sprint) => (
                <div key={sprint} className="space-y-2">
                    <h2 className="text-lg font-semibold">{sprint}</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-slate-200 p-2 text-left">Title</th>
                                <th className="border border-slate-200 p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grouped[sprint]?.map((task) => {
                                const c = statusClasses[task.status]
                                return (
                                    <tr key={task.id} className={`${c.bg} ${c.text}`}>
                                        <td className="border border-slate-200 p-2">{task.title}</td>
                                        <td className="border border-slate-200 p-2">{task.status}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ))}

            {showModal && (
                <div className="fixed inset-0 bg-black/40 grid place-items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
                        <h2 className="text-lg font-bold mb-3">Add New Task</h2>
                        <input
                            type="text"
                            placeholder="Sprint"
                            value={newTask.sprint}
                            onChange={(e) => setNewTask({ ...newTask, sprint: e.target.value })}
                            className="border border-slate-300 p-2 w-full mb-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="border border-slate-300 p-2 w-full mb-2 rounded"
                        />
                        <select
                            value={newTask.status}
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Status })}
                            className="border border-slate-300 p-2 w-full mb-4 rounded"
                        >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button className="bg-gray-400 text-white px-3 py-2 rounded" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={addTask}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
