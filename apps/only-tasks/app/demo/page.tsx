"use client";
import { useCallback, useMemo } from "react";
import { projects as mockProjects } from "@/data/mockData";
import type { Project, App as AppType, Task, TaskDraft } from "@/lib/types";
import TaskTable from "@/components/tasks/TaskTable";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskGraph from "@/components/tasks/TaskGraph";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LucideSettings } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import ViewSelector from "@/components/ViewSelector";

export default function DemoPage() {
  const router = useRouter();
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "demo-projects",
    mockProjects,
  );
  const [lastSel] = useLocalStorage<{ projectId?: string; appId?: string }>(
    "demo-lastSel",
    {},
  );
  const [view, setView] = useLocalStorage<"sheet" | "kanban" | "graph">(
    "demo-viewMode",
    "sheet",
  );

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === lastSel.projectId) ?? projects[0];
  }, [projects, lastSel]);

  const currentApp: AppType | undefined = useMemo(() => {
    return (
      currentProject?.apps.find((a) => a.id === lastSel.appId) ??
      currentProject?.apps[0]
    );
  }, [currentProject, lastSel]);

  const updateCurrentApp = useCallback(
    (updater: (app: AppType) => AppType) => {
      if (!currentProject || !currentApp) return;
      const newProjects = projects.map((p) =>
        p.id === currentProject.id
          ? {
              ...p,
              apps: p.apps.map((a) =>
                a.id === currentApp.id ? updater(a) : a,
              ),
            }
          : p,
      );
      setProjects(newProjects);
    },
    [projects, currentProject, currentApp, setProjects],
  );

  const onCreateTask = useCallback(
    (sprintId: string, draft: TaskDraft) => {
      if (!currentApp || !currentProject) return;
      const id = `t-${Date.now()}`;
      const task: Task = { id, ...draft };
      updateCurrentApp((app) => ({
        ...app,
        sprints: app.sprints.map((s) =>
          s.id === sprintId ? { ...s, tasks: [...s.tasks, task] } : s,
        ),
      }));
    },
    [updateCurrentApp, currentApp, currentProject],
  );

  const onEditTask = (
    sprintId: string,
    taskId: string,
    partial: Partial<Task>,
  ) => {
    updateCurrentApp((app) => ({
      ...app,
      sprints: app.sprints.map((s) =>
        s.id === sprintId
          ? {
              ...s,
              tasks: s.tasks.map((t) =>
                t.id === taskId ? { ...t, ...partial } : t,
              ),
            }
          : s,
      ),
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div>
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold dark:text-gray-100">
              Tasks Demo
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="icon-btn"
                title="Dashboard"
              >
                <LucideSettings size={16} />
              </button>
              <ViewSelector currentView={view} onViewChange={setView} />
              <ThemeToggle />
            </div>
          </header>

          {view === "sheet" && (
            <TaskTable
              project={currentProject}
              app={currentApp}
              onEditTask={onEditTask}
              onCreateTask={onCreateTask}
            />
          )}
          {view === "kanban" && <KanbanBoard app={currentApp} />}
          {view === "graph" && <TaskGraph app={currentApp} />}
        </div>
      </div>
    </main>
  );
}
