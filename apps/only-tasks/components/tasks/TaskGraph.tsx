'use client'
import { useMemo } from 'react'
import type { App, Task } from '../../lib/types'
import { motion } from 'framer-motion'

// Stable status matchers
const statusMatchers = {
    complete: (t: Task) => String(t.status).toLowerCase() === 'complete',
    inProgress: (t: Task) => /in[- ]?progress/i.test(String(t.status)),
    reviewing: (t: Task) => /review/i.test(String(t.status)),
    notStarted: (t: Task) => /not\s*started/i.test(String(t.status)),
}

export default function TaskGraph({ app }: { app?: App }) {
    const sprints = useMemo(() => app?.sprints ?? [], [app])

    const allTasks = useMemo(() => sprints.flatMap(s => s.tasks), [sprints])

    const series = useMemo(() => {
        return sprints.map(s => ({
            id: s.id,
            name: s.name,
            counts: {
                complete: s.tasks.filter(statusMatchers.complete).length,
                inProgress: s.tasks.filter(statusMatchers.inProgress).length,
                reviewing: s.tasks.filter(statusMatchers.reviewing).length,
                notStarted: s.tasks.filter(statusMatchers.notStarted).length,
            }
        }))
    }, [sprints])

    const overall = useMemo(() => {
        const counts = {
            complete: allTasks.filter(statusMatchers.complete).length,
            inProgress: allTasks.filter(statusMatchers.inProgress).length,
            reviewing: allTasks.filter(statusMatchers.reviewing).length,
            notStarted: allTasks.filter(statusMatchers.notStarted).length,
        }
        const total = allTasks.length || 1
        const completionRate = counts.complete / total
        // overdue and due soon
        const now = new Date()
        const in7 = new Date(now)
        in7.setDate(now.getDate() + 7)
        const parse = (d?: string) => (d ? new Date(d) : undefined)
        const overdue = allTasks.filter(t => {
            const dt = parse(t.dueDate)
            return dt && dt < now && !statusMatchers.complete(t)
        }).length
        const dueSoon = allTasks.filter(t => {
            const dt = parse(t.dueDate)
            return dt && dt >= now && dt <= in7 && !statusMatchers.complete(t)
        }).length

        // priorities
        const pr = allTasks.reduce(
            (acc, t) => {
                const p = String(t.priority || '').toLowerCase()
                if (p === 'low') acc.low++
                else if (p === 'medium') acc.medium++
                else if (p === 'high') acc.high++
                else acc.other++
                return acc
            },
            { low: 0, medium: 0, high: 0, other: 0 }
        )

        // assignees
        const assigns = allTasks.reduce<Record<string, number>>((acc, t) => {
            const a = t.assignee || 'Unassigned'
            acc[a] = (acc[a] || 0) + 1
            return acc
        }, {})

        return { counts, total: allTasks.length, completionRate, overdue, dueSoon, priorities: pr, assignees: assigns }
    }, [allTasks])

    const barKeys: Array<{ key: keyof (typeof series)[number]['counts']; label: string; color: string }> = [
        { key: 'notStarted', label: 'Not started', color: '#9CA3AF' },
        { key: 'reviewing', label: 'Reviewing', color: '#60A5FA' },
        { key: 'inProgress', label: 'In-progress', color: '#EC4899' },
        { key: 'complete', label: 'Complete', color: '#10B981' },
    ]

    const maxCount = Math.max(1, ...series.map(s => Object.values(s.counts).reduce((a, b) => a + b, 0)))

    // Donut chart using conic-gradient for overall status distribution
    const donutSegments = (() => {
        const total = Math.max(1, Object.values(overall.counts).reduce((a, b) => a + b, 0))
        let acc = 0
        return barKeys.map(b => {
            const value = overall.counts[b.key] as number
            const from = (acc / total) * 360
            acc += value
            const to = (acc / total) * 360
            return { color: b.color, from, to, value, label: b.label }
        })
    })()

    const donutBg = `conic-gradient(${donutSegments
        .map(seg => `${seg.color} ${seg.from}deg ${seg.to}deg`)
        .join(', ')})`

    // Sprint trend data (completion rate by sprint)
    const trend = useMemo(() => {
        const rates = series.map(s => {
            const total = Object.values(s.counts).reduce((a, b) => a + b, 0) || 1
            return total ? (s.counts.complete / total) : 0
        })
        return rates
    }, [series])

    const topAssignees = useMemo(() => Object.entries(overall.assignees).sort((a, b) => b[1] - a[1]).slice(0, 6), [overall.assignees])

    return (
        <div className="space-y-4">
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card border-l-4 border-gray-300 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total tasks</div>
                    <div className="text-2xl font-semibold dark:text-gray-100">{overall.total}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Across {sprints.length} sprint(s)</div>
                </div>
                <div className="card border-l-4 border-emerald-400 dark:border-emerald-700/70">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                    <div className="text-2xl font-semibold dark:text-gray-100">{overall.counts.complete}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">{Math.round(overall.completionRate * 100)}% completion</div>
                </div>
                <div className="card border-l-4 border-pink-400 dark:border-pink-700/70">
                    <div className="text-xs text-gray-500 dark:text-gray-400">In-progress</div>
                    <div className="text-2xl font-semibold dark:text-gray-100">{overall.counts.inProgress}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Reviewing: {overall.counts.reviewing}</div>
                </div>
                <div className="card border-l-4 border-rose-400 dark:border-rose-700/70">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Overdue</div>
                    <div className="text-2xl font-semibold dark:text-gray-100">{overall.overdue}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Due soon (7d): {overall.dueSoon}</div>
                </div>
            </div>

            {/* Distribution + Per-sprint status */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Per-sprint grouped bars (existing) */}
                <div className="card">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold dark:text-gray-100">Status distribution by sprint</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {barKeys.map(b => (
                                <div key={b.key} className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: b.color }} />{b.label}</div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(series.length, 1)}, minmax(140px, 1fr))` }}>
                        {series.map(s => {
                            const total = Object.values(s.counts).reduce((a, b) => a + b, 0)
                            return (
                                <div key={s.id} className="p-2 border rounded-lg dark:border-gray-800">
                                    <div className="text-xs font-medium mb-2 truncate dark:text-gray-100" title={s.name}>{s.name}</div>
                                    <div className="space-y-1">
                                        {barKeys.map(b => {
                                            const value = s.counts[b.key]
                                            const widthPct = (value / maxCount) * 100
                                            return (
                                                <div key={b.key} className="w-full bg-gray-100 rounded h-4 overflow-hidden dark:bg-gray-800">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${widthPct}%` }}
                                                        transition={{ duration: 0.4 }}
                                                        className="h-4"
                                                        style={{ background: b.color }}
                                                        title={`${b.label}: ${value}`}
                                                    />
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">Total: {total}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Overall distribution donut */}
                <div className="card">
                    <div className="text-sm font-semibold mb-3 dark:text-gray-100">Overall status distribution</div>
                    <div className="flex items-center gap-6">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 rounded-full" style={{ background: donutBg }} />
                            <div className="absolute inset-3 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Completion</div>
                                    <div className="text-xl font-semibold dark:text-gray-100">{Math.round(overall.completionRate * 100)}%</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                            {barKeys.map(seg => (
                                <div key={seg.key} className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 rounded" style={{ background: seg.color }} />
                                    <span className="text-gray-700 dark:text-gray-200">{seg.label}</span>
                                    <span className="ml-auto text-gray-500 dark:text-gray-400">{overall.counts[seg.key]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                        <div className="p-2 rounded border dark:border-gray-800">
                            <div className="text-gray-500 dark:text-gray-400">Low</div>
                            <div className="font-semibold dark:text-gray-100">{overall.priorities.low}</div>
                        </div>
                        <div className="p-2 rounded border dark:border-gray-800">
                            <div className="text-gray-500 dark:text-gray-400">Medium</div>
                            <div className="font-semibold dark:text-gray-100">{overall.priorities.medium}</div>
                        </div>
                        <div className="p-2 rounded border dark:border-gray-800">
                            <div className="text-gray-500 dark:text-gray-400">High</div>
                            <div className="font-semibold dark:text-gray-100">{overall.priorities.high}</div>
                        </div>
                        <div className="p-2 rounded border dark:border-gray-800">
                            <div className="text-gray-500 dark:text-gray-400">Other</div>
                            <div className="font-semibold dark:text-gray-100">{overall.priorities.other}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignee workload + Sprint trend */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="card">
                    <div className="text-sm font-semibold mb-3 dark:text-gray-100">Assignee workload (top {topAssignees.length})</div>
                    <div className="space-y-2">
                        {topAssignees.map(([name, count]) => {
                            const pct = overall.total ? (Number(count) / overall.total) * 100 : 0
                            return (
                                <div key={name} className="">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <div className="truncate max-w-[60%] dark:text-gray-200" title={name}>{name}</div>
                                        <div className="text-gray-500 dark:text-gray-400">{count}</div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded h-2 overflow-hidden dark:bg-gray-800">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} className="h-2 bg-gray-400" />
                                    </div>
                                </div>
                            )
                        })}
                        {topAssignees.length === 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">No tasks available.</div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="text-sm font-semibold mb-3 dark:text-gray-100">Sprint completion trend</div>
                    <div className="h-36">
                        {/* Simple SVG sparkline */}
                        <Sparkline values={trend} />
                    </div>
                    <div className="flex gap-2 mt-2">
                        {series.map((s, i) => (
                            <div key={s.id} className="text-[11px] text-gray-600 dark:text-gray-300">{i + 1}. {s.name}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Sparkline({ values }: { values: number[] }) {
    const n = values.length
    const w = 400
    const h = 120
    const pad = 8
    const max = 1 // values are rates 0..1
    const min = 0
    const xs = (i: number) => pad + (n <= 1 ? (w - 2 * pad) / 2 : (i * (w - 2 * pad)) / (n - 1))
    const ys = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - 2 * pad)
    const points = values.map((v, i) => `${xs(i)},${ys(v)}`).join(' ')

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
            <defs>
                <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Baseline grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                <line key={g} x1={pad} x2={w - pad} y1={ys(g)} y2={ys(g)} stroke="#E5E7EB" strokeWidth={1} />
            ))}
            {/* Area */}
            <motion.polygon
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                fill="url(#grad)"
                points={`${pad},${h - pad} ${points} ${w - pad},${h - pad}`}
            />
            {/* Line */}
            <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
                fill="none"
                stroke="#10B981"
                strokeWidth={2}
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
