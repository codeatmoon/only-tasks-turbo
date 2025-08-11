"use client";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Project, App as AppType, Task, TaskDraft } from "@/lib/types";
import TaskTable from "@/components/tasks/TaskTable";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskGraph from "@/components/tasks/TaskGraph";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LucideArrowLeft, LucideSettings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ViewSelector from "@/components/ViewSelector";
import { useAuth } from "@/lib/auth-context";
import { createAuthenticatedFetch } from "@/lib/auth-utils";
import { projects as mockProjects } from "@/data/mockData";

export default function TasksPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const authenticatedFetch = createAuthenticatedFetch();

  const projectId = params.projectId as string;
  const appId = params.appId as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Use different storage keys based on whether this is a user session or demo
  const storagePrefix = user ? "user" : "demo";
  const [view, setView] = useLocalStorage<"sheet" | "kanban" | "graph">(
    `${storagePrefix}-viewMode`,
    "sheet",
  );

  type ThemeState = {
    theme_name: "theme-1" | "theme-2";
    mode: "light" | "dark";
    brand?: "brand-a" | "brand-b" | null;
  };
  const [, setTheme] = useState<ThemeState | null>(null);

  const applyTheme = useCallback(
    (t: {
      theme_name: string;
      mode: "light" | "dark";
      brand?: string | null;
    }) => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      root.classList.remove("light-mode", "dark-mode");
      root.classList.remove("theme-1", "theme-2");
      root.classList.remove("brand-a", "brand-b");
      
      root.classList.add(`${t.mode}-mode`);
      root.classList.add(t.theme_name);
      if (t.brand) {
        root.classList.add(t.brand);
      }
      setTheme(t as ThemeState);
    },
    [],
  );

  // Load projects data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user && !apiError) {
          // Try to load from API for authenticated users
          const response = await authenticatedFetch("/api/spaces/user/projects");
          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects || []);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("Failed to load from API, using local storage", error);
        setApiError("Could not connect to server");
      }
      
      // Fallback to localStorage
      const storedProjects = localStorage.getItem(`${storagePrefix}-projects`);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(mockProjects);
        localStorage.setItem(`${storagePrefix}-projects`, JSON.stringify(mockProjects));
      }
      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading, apiError, authenticatedFetch, storagePrefix]);

  // Load theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (user && !apiError) {
          const response = await authenticatedFetch("/api/spaces/user/theme");
          if (response.ok) {
            const theme = await response.json();
            applyTheme(theme);
            return;
          }
        }
      } catch (error) {
        console.warn("Failed to load theme from API", error);
      }
      
      // Fallback to default theme
      applyTheme({ theme_name: "theme-1", mode: "dark" });
    };

    if (!authLoading) {
      loadTheme();
    }
  }, [user, authLoading, apiError, authenticatedFetch, applyTheme]);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  const currentApp: AppType | undefined = useMemo(() => {
    return currentProject?.apps.find((a) => a.id === appId);
  }, [currentProject, appId]);

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
      // Save to localStorage
      localStorage.setItem(`${storagePrefix}-projects`, JSON.stringify(newProjects));
    },
    [projects, currentProject, currentApp, storagePrefix],
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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentProject || !currentApp) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Project or App Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested project or app could not be found.
          </p>
          <button
            onClick={() => router.push(user ? "/dashboard" : "/demo")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div>
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(user ? "/dashboard" : "/demo")}
                className="icon-btn"
                title="Back to Dashboard"
              >
                <LucideArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold dark:text-gray-100">
                  {currentApp.name} Tasks
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentProject.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(user ? "/dashboard" : "/demo")}
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