"use client";
import { useCallback, useMemo, useEffect, useState } from "react";
import type { Project, App as AppType, Task, TaskDraft } from "@/lib/types";
import TaskTable from "@/components/tasks/TaskTable";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskGraph from "@/components/tasks/TaskGraph";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LucideSettings, LucideLoader } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import ViewSelector from "@/components/ViewSelector";
import { useAuth } from "@/lib/auth-context";
import { createAuthenticatedFetch } from "@/lib/auth-utils";
import LoginForm from "@/components/auth/LoginForm";

export default function SpacePage() {
  const router = useRouter();
  const params = useParams();
  const spaceid = params.spaceid as string;
  const { user, loading: authLoading } = useAuth();
  const authenticatedFetch = createAuthenticatedFetch();

  const [spaceExists, setSpaceExists] = useState<boolean | null>(null);
  const [userOwnsSpace, setUserOwnsSpace] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSel] = useLocalStorage<{ projectId?: string; appId?: string }>(
    `${spaceid}-lastSel`,
    {},
  );
  const [view, setView] = useLocalStorage<"sheet" | "kanban" | "graph">(
    `${spaceid}-viewMode`,
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
      const b = document.body;
      // remove previous theme classes
      b.classList.remove(
        "theme-1",
        "theme-2",
        "light-mode",
        "dark-mode",
        "brand-a",
        "brand-b",
      );
      // add new theme classes
      if (t.theme_name === "theme-1" || t.theme_name === "theme-2")
        b.classList.add(t.theme_name);
      b.classList.add(t.mode === "dark" ? "dark-mode" : "light-mode");
      if (t.brand === "brand-a" || t.brand === "brand-b")
        b.classList.add(t.brand);
      // sync Tailwind dark class for palette
      const root = document.documentElement;
      if (t.mode === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    },
    [],
  );

  // Check for magic link token on load
  useEffect(() => {
    const checkToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          const response = await fetch("/api/auth/login-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            // User authenticated, remove token from URL
            window.history.replaceState({}, "", `/${spaceid}`);
          }
        } catch (error) {
          console.error("Token authentication failed:", error);
        }
      }
    };

    checkToken();
  }, [spaceid]);

  // Check space access and ownership
  const checkSpaceAccess = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Check if space exists and if user owns it
      const spaceResponse = await authenticatedFetch(`/api/spaces?id=${spaceid}`);

      if (spaceResponse.ok) {
        const { space } = await spaceResponse.json();
        setSpaceExists(true);
        
        // Check if the authenticated user owns the space
        // We'll compare the Firebase UID with the space owner
        const ownershipResponse = await authenticatedFetch(`/api/spaces/${spaceid}/ownership`);
        if (ownershipResponse.ok) {
          const { owns } = await ownershipResponse.json();
          setUserOwnsSpace(owns);
          
          if (owns) {
            // Load projects if user owns the space
            const projectsResponse = await authenticatedFetch(`/api/spaces/${spaceid}/projects`);
            if (projectsResponse.ok) {
              const { projects } = await projectsResponse.json();
              setProjects(projects);
            } else {
              console.error("Failed to load projects");
              setProjects([]);
            }
          }
        } else {
          setUserOwnsSpace(false);
        }
      } else if (spaceResponse.status === 404) {
        // Space doesn't exist
        setSpaceExists(false);
        setUserOwnsSpace(false);
      } else {
        console.error("Error checking space");
        setSpaceExists(false);
        setUserOwnsSpace(false);
      }
    } catch (error) {
      console.error("Error checking space access:", error);
      setSpaceExists(false);
      setUserOwnsSpace(false);
    } finally {
      setLoading(false);
    }
  }, [spaceid, user, authenticatedFetch]);

  useEffect(() => {
    if (!authLoading) {
      checkSpaceAccess();
    }
  }, [checkSpaceAccess, authLoading]);

  // Load and apply theme
  useEffect(() => {
    const loadTheme = async () => {
      if (!user || !userOwnsSpace) return;
      
      try {
        const res = await authenticatedFetch(`/api/spaces/${spaceid}/theme`);
        if (res.ok) {
          const { theme } = await res.json();
          const defaultTheme: ThemeState = {
            theme_name: "theme-1",
            mode: "dark",
            brand: null,
          };
          const t: ThemeState = theme
            ? {
                theme_name: theme.theme_name,
                mode: theme.mode,
                brand: theme.brand ?? null,
              }
            : defaultTheme;
          setTheme(t);
          applyTheme(t);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // fall back to defaults
        const t: ThemeState = {
          theme_name: "theme-1",
          mode: "dark",
          brand: null,
        };
        setTheme(t);
        applyTheme(t);
      }
    };
    loadTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceid, user, userOwnsSpace]);

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
    async (updater: (app: AppType) => AppType) => {
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

      // Sync with database
      try {
        // Reload data to ensure consistency
        await checkSpaceAccess();
      } catch (error) {
        console.error("Failed to sync with database:", error);
        // Revert local changes on error
        checkSpaceAccess();
      }
    },
    [projects, currentProject, currentApp, setProjects, checkSpaceAccess],
  );

  const onCreateTask = useCallback(
    async (sprintId: string, draft: TaskDraft) => {
      if (!currentApp || !currentProject) return;

      try {
        // Create task in database first
        const response = await authenticatedFetch(`/api/spaces/${spaceid}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sprintId,
            task: draft,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create task");
        }

        const { task } = await response.json();

        // Update local state with the task from the database
        updateCurrentApp((app) => ({
          ...app,
          sprints: app.sprints.map((s) =>
            s.id === sprintId ? { ...s, tasks: [...s.tasks, task] } : s,
          ),
        }));
      } catch (error) {
        console.error("Failed to create task:", error);
        alert("Failed to create task. Please try again.");
      }
    },
    [updateCurrentApp, currentApp, currentProject, spaceid, authenticatedFetch],
  );

  const onEditTask = async (
    sprintId: string,
    taskId: string,
    partial: Partial<Task>,
  ) => {
    try {
      // Update task in database first
      const response = await authenticatedFetch(`/api/spaces/${spaceid}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partial),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Update local state
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
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  // Show loading state while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <LucideLoader
            size={48}
            className="animate-spin text-blue-600 mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading space...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated or doesn't own space
  if (!user || userOwnsSpace === false) {
    return (
      <LoginForm 
        spaceId={spaceid} 
        onSuccess={() => {
          // Refresh the page after successful login
          window.location.reload();
        }}
      />
    );
  }

  // Show message if space doesn't exist
  if (spaceExists === false) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Space Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The space "{spaceid}" does not exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
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
            <h1 className="text-2xl font-semibold dark:text-gray-100">
              Tasks - {spaceid}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/${spaceid}/settings`)}
                className="icon-btn"
                title="Settings"
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
