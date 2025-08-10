"use client";
import { useMemo, useState } from "react";
import type { App, Task } from "../../lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function KanbanBoard({ app }: { app?: App }) {
  const sprints = useMemo(() => app?.sprints ?? [], [app]);
  const options = useMemo(() => app?.options, [app]);

  const getDefaultSprintId = () =>
    sprints.find((s) => /current/i.test(s.name))?.id ?? sprints[0]?.id;
  const [sprintId, setSprintId] = useState<string | undefined>(
    getDefaultSprintId(),
  );
  const [groupBy, setGroupBy] = useState<"status" | "priority">("status");
  const [includeBacklog, setIncludeBacklog] = useState(true);

  const sprint = useMemo(
    () => sprints.find((s) => s.id === sprintId) ?? sprints[0],
    [sprints, sprintId],
  );
  const isCurrent = /current/i.test(sprint?.name || "");

  const tasks = useMemo<Task[]>(() => sprint?.tasks ?? [], [sprint]);

  const allOtherTasks = useMemo<Task[]>(
    () => sprints.filter((s) => s.id !== sprintId).flatMap((s) => s.tasks),
    [sprints, sprintId],
  );

  const categories = useMemo<string[]>(() => {
    const fromOptions =
      groupBy === "status" ? options?.status : options?.priority;
    if (fromOptions && fromOptions.length) return [...fromOptions];
    const vals = new Set<string>();
    tasks.forEach((t) => {
      const v = String(t[groupBy] ?? "");
      if (v) vals.add(v);
    });
    return [...vals];
  }, [options?.priority, options?.status, groupBy, tasks]);

  const columns = useMemo(() => {
    const cols: { key: string; title: string; items: Task[] }[] = [];
    for (const cat of categories) {
      cols.push({
        key: cat || "uncategorized",
        title: cat || "Uncategorized",
        items: tasks.filter((t) => String(t[groupBy] ?? "") === cat),
      });
    }
    if (isCurrent && includeBacklog) {
      const backlogItems = allOtherTasks;
      cols.push({ key: "backlog", title: "Backlog", items: backlogItems });
    }
    return cols;
  }, [categories, tasks, groupBy, isCurrent, includeBacklog, allOtherTasks]);

  const priorityPillClass = (v?: unknown) => {
    const val = String(v ?? "");
    if (/high/i.test(val)) return "pill-priority-high";
    if (/medium/i.test(val)) return "pill-priority-medium";
    if (/low/i.test(val)) return "pill-priority-low";
    return "";
  };
  const statusPillClass = (v?: unknown) => {
    const val = String(v ?? "");
    if (/complete/i.test(val)) return "pill-status-complete";
    if (/in[- ]?progress/i.test(val)) return "pill-status-in-progress";
    if (/review/i.test(val)) return "pill-status-reviewing";
    return "pill-status-not-started";
  };

  if (sprints.length === 0) return <div className="card">Select an app</div>;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Sprint
          </label>
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200"
            value={sprint?.id}
            onChange={(e) => setSprintId(e.target.value)}
          >
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border overflow-hidden dark:border-gray-800">
            <button
              className={`px-3 py-1 text-sm ${groupBy === "status" ? "bg-black text-white" : "bg-white dark:bg-gray-900 dark:text-gray-200"}`}
              onClick={() => setGroupBy("status")}
            >
              Status
            </button>
            <button
              className={`px-3 py-1 text-sm ${groupBy === "priority" ? "bg-black text-white" : "bg-white dark:bg-gray-900 dark:text-gray-200"}`}
              onClick={() => setGroupBy("priority")}
            >
              Priority
            </button>
          </div>
          <label
            className={`flex items-center gap-2 text-sm ${isCurrent ? "" : "opacity-50"} dark:text-gray-300`}
          >
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={isCurrent && includeBacklog}
              onChange={(e) => setIncludeBacklog(e.target.checked)}
              disabled={!isCurrent}
            />
            <span>Include backlog</span>
          </label>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(220px, 1fr))`,
        }}
      >
        <AnimatePresence initial={false}>
          {columns.map((col) => (
            <motion.div
              key={col.key}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="card"
            >
              <div className="text-sm font-medium mb-2 dark:text-gray-200">
                {col.title}{" "}
                <span className="text-xs text-gray-400">
                  ({col.items.length})
                </span>
              </div>
              <div className="space-y-2 min-h-[20px]">
                <AnimatePresence initial={false}>
                  {col.items.map((t) => {
                    const colorClass =
                      groupBy === "priority"
                        ? priorityPillClass(t.priority)
                        : statusPillClass(t.status);
                    return (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className={`p-3 rounded border ${colorClass}`}
                      >
                        <div className="font-medium text-sm dark:text-gray-100">
                          {t.name}
                        </div>
                        <div className="text-xs mt-1 opacity-80 dark:text-gray-300">
                          Assignee: {String(t.assignee ?? "-")}
                          {t.dueDate
                            ? ` • Due ${new Date(t.dueDate).toLocaleDateString()}`
                            : ""}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {col.items.length === 0 && (
                  <div className="text-xs text-gray-400">No tasks</div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
