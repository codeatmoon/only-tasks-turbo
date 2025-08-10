"use client";
import { useEffect, useState } from "react";
import type { Column, Task } from "@/lib/types";
import TaskDropdown from "./TaskDropdown";

export default function EditTaskModal({
  open,
  onClose,
  task,
  onSave,
  options,
  columns = [],
}: {
  open: boolean;
  onClose: () => void;
  task?: Task;
  onSave: (partial: Partial<Task>) => void;
  options?: { assignees?: string[]; status?: string[]; priority?: string[] };
  columns?: Column[];
}) {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [custom, setCustom] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (open && task) {
      setName(task.name ?? "");
      setAssignee(String(task.assignee ?? ""));
      setDueDate(String(task.dueDate ?? ""));
      setPriority(String(task.priority ?? ""));
      setStatus(String(task.status ?? ""));
      const dyn: Record<string, unknown> = {};
      columns.forEach((c) => {
        dyn[c.key] = task[c.key];
      });
      setCustom(dyn);
    }
  }, [open, task, columns]);

  if (!open || !task) return null;

  const handleSave = () => {
    const partial: Partial<Task> = {
      name: name.trim(),
      assignee: assignee || undefined,
      dueDate: dueDate || undefined,
      priority: priority || undefined,
      status: status || undefined,
    };
    for (const c of columns) {
      partial[c.key] = custom[c.key];
    }
    onSave(partial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit task</h3>
            <button className="icon-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Task name
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter task title"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Assignee
                </label>
                <TaskDropdown
                  value={assignee}
                  options={options?.assignees ?? []}
                  onChange={setAssignee}
                  buttonClassName="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Due date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Priority
                </label>
                <TaskDropdown
                  value={priority}
                  options={options?.priority ?? []}
                  onChange={setPriority}
                  buttonClassName="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <TaskDropdown
                  value={status}
                  options={options?.status ?? []}
                  onChange={setStatus}
                  buttonClassName="w-full"
                />
              </div>
            </div>

            {columns
              .filter((c) => c.type !== "Link")
              .map((c) => (
                <div key={c.id}>
                  <label className="block text-sm text-gray-600 mb-1">
                    {c.name}
                  </label>
                  <DynamicInput
                    column={c}
                    value={custom[c.key]}
                    onChange={(v) =>
                      setCustom((prev) => ({ ...prev, [c.key]: v }))
                    }
                  />
                </div>
              ))}

            {columns.some((c) => c.type === "Link") && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Link</label>
                <input
                  type="url"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://..."
                  value={String(
                    custom[columns.find((c) => c.type === "Link")!.key] ?? "",
                  )}
                  onChange={(e) =>
                    setCustom((prev) => ({
                      ...prev,
                      [columns.find((c) => c.type === "Link")!.key]:
                        e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button className="px-3 py-2 rounded-lg border" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-black text-white"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicInput({
  column,
  value,
  onChange,
}: {
  column: Column;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (column.type) {
    case "Text":
      return (
        <input
          className="w-full border rounded-lg px-3 py-2"
          value={String((value as string) ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "Number":
      return (
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2"
          value={String((value as number | undefined) ?? "")}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "Date":
      return (
        <input
          type="date"
          className="w-full border rounded-lg px-3 py-2"
          value={String((value as string) ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "Link":
      return null;
    default:
      return (
        <input
          className="w-full border rounded-lg px-3 py-2"
          value={String((value as string) ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
