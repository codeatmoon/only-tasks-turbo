"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, Plus, Folder, AppWindow, Calendar, Edit3, Play } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { projects as mockProjects } from "@/data/mockData";
import type { Project, App as AppType } from "@/lib/types";

export default function DemoDashboard() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [projects, setProjects] = useLocalStorage<Project[]>("demo-projects", mockProjects);

  // Modal state (very small simple modals inline for demo)
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddApp, setShowAddApp] = useState(false);
  const [showAddSprint, setShowAddSprint] = useState(false);

  // Temp form states
  const [newProjectName, setNewProjectName] = useState("");
  const [newAppName, setNewAppName] = useState("");
  const [newSprintName, setNewSprintName] = useState("");
  const [newSprintStart, setNewSprintStart] = useState("");
  const [newSprintEnd, setNewSprintEnd] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const createProject = useCallback(() => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: newProjectName.trim(),
      description: "",
      apps: [],
    };
    setProjects([newProject, ...projects]);
    setNewProjectName("");
    setShowCreateProject(false);
  }, [newProjectName, setProjects, projects]);

  const addApp = useCallback(() => {
    if (!newAppName.trim() || activeProjectId == null) return;
    const newProjects = projects.map((proj: Project) => {
      if (proj.id !== activeProjectId) return proj;
      const newApp: AppType = { 
        id: `a-${Date.now()}`, 
        name: newAppName.trim(), 
        sprints: [] 
      };
      return { ...proj, apps: [...proj.apps, newApp] };
    });
    setProjects(newProjects);
    setNewAppName("");
    setShowAddApp(false);
  }, [newAppName, activeProjectId, setProjects, projects]);

  const addSprint = useCallback(() => {
    if (!newSprintName.trim() || activeProjectId == null || activeAppId == null) return;
    
    // Validate dates
    if (newSprintStart && newSprintEnd && new Date(newSprintStart) >= new Date(newSprintEnd)) {
      alert("End date must be after start date");
      return;
    }

    // Check for overlapping sprints
    const currentApp = projects
      .find(p => p.id === activeProjectId)
      ?.apps.find(a => a.id === activeAppId);
    
    if (currentApp && newSprintStart && newSprintEnd) {
      const hasOverlap = currentApp.sprints.some(sprint => {
        if (!sprint.startDate || !sprint.endDate) return false;
        const sprintStart = new Date(sprint.startDate);
        const sprintEnd = new Date(sprint.endDate);
        const newStart = new Date(newSprintStart);
        const newEnd = new Date(newSprintEnd);
        
        return (newStart <= sprintEnd && newEnd >= sprintStart);
      });
      
      if (hasOverlap) {
        alert("Sprint dates overlap with existing sprint");
        return;
      }
    }

    const newProjects = projects.map((proj: Project) => {
      if (proj.id !== activeProjectId) return proj;
      return {
        ...proj,
        apps: proj.apps.map((a: AppType) => {
          if (a.id !== activeAppId) return a;
          const newSprint = { 
            id: `s-${Date.now()}`, 
            name: newSprintName.trim(), 
            startDate: newSprintStart || undefined,
            endDate: newSprintEnd || undefined,
            tasks: []
          };
          return { ...a, sprints: [...a.sprints, newSprint] };
        }),
      };
    });
    setProjects(newProjects);
    setNewSprintName("");
    setNewSprintStart("");
    setNewSprintEnd("");
    setShowAddSprint(false);
  }, [newSprintName, newSprintStart, newSprintEnd, activeProjectId, activeAppId, projects, setProjects]);

  const openTasks = useCallback((projectId: string, appId: string) => {
    router.push(`/projects/${projectId}/apps/${appId}/tasks`);
  }, [router]);

  // UI helpers (badges / pill styles similar to tasks screen)
  const pill = "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium shadow-inner";

  return (
    <div className={dark ? "bg-[#071126] text-slate-100 min-h-screen p-8" : "bg-gray-50 text-slate-900 min-h-screen p-8"}>
      {/* Top header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Demo Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Organize work by Project → App → Sprint → Tasks</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateProject(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl shadow">
            <Plus size={16} /> Create project
          </button>

          <button
            onClick={() => setDark((d) => !d)}
            className={
              "w-11 h-11 rounded-full flex items-center justify-center border " +
              (dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white")
            }>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Projects list */}
      <main className="space-y-6">
        {projects.map((proj) => (
          <section key={proj.id} className={"rounded-2xl p-5 " + (dark ? "bg-slate-800/60 border border-slate-700" : "bg-white border border-gray-200")}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={"rounded-full p-2 " + (dark ? "bg-slate-700/40" : "bg-gray-100") }>
                  <Folder size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{proj.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{proj.description || "No description"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    setShowAddApp(true);
                  }}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg">
                  <Plus size={14} /> Add app
                </button>
                <button className={"w-11 h-11 rounded-full flex items-center justify-center border " + (dark ? "border-slate-700" : "border-slate-200") }>
                  <Edit3 size={16} />
                </button>
              </div>
            </div>

            {/* Apps grid (one column like tasks) */}
            <div className="mt-6 space-y-4">
              {proj.apps.length === 0 && (
                <div className={"rounded-lg py-6 px-5 text-center border-dashed " + (dark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500") }>
                  No apps yet — add an app to get started
                </div>
              )}

              {proj.apps.map((app) => (
                <div key={app.id} className={"rounded-lg p-4 " + (dark ? "bg-slate-700/30 border border-slate-700" : "bg-white border border-gray-100")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={"rounded-full p-2 " + (dark ? "bg-slate-600" : "bg-gray-100") }>
                        <AppWindow size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium">{app.name}</h3>
                        <p className="text-xs text-slate-400">{app.sprints.length} sprints</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.sprints.length > 0 && (
                        <button
                          onClick={() => openTasks(proj.id, app.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white">
                          <Play size={14} /> Open Tasks
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveProjectId(proj.id);
                          setActiveAppId(app.id);
                          setShowAddSprint(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white">
                        <Plus size={14} /> Add sprint
                      </button>
                      <button className={"w-10 h-10 rounded-full flex items-center justify-center border " + (dark ? "border-slate-700" : "border-gray-200") }>
                        <Calendar size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Sprints table (mimic your tasks table style) */}
                  {app.sprints.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className={dark ? "text-slate-300 text-left" : "text-slate-600 text-left"}>
                            <th className="pb-3">#</th>
                            <th className="pb-3">Sprint</th>
                            <th className="pb-3">Start</th>
                            <th className="pb-3">End</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {app.sprints.map((s, idx) => (
                            <tr key={s.id} className={(dark ? "border-t border-slate-700" : "border-t border-gray-100") }>
                              <td className="py-3 w-8 text-slate-300">{idx + 1}.</td>
                              <td className="py-3 font-medium">{s.name}</td>
                              <td className="py-3 text-sm text-slate-400">{s.startDate || "-"}</td>
                              <td className="py-3 text-sm text-slate-400">{s.endDate || "-"}</td>
                              <td className="py-3">
                                {/* sample pill badges to match tasks look */}
                                <span className={pill + (dark ? " bg-amber-900/30 text-amber-200 border border-amber-600" : " bg-amber-50 text-amber-800 border border-amber-200") }>
                                  Active
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button 
                                  onClick={() => openTasks(proj.id, app.id)}
                                  className={"p-2 rounded-full border " + (dark ? "border-slate-700 hover:bg-slate-700" : "border-gray-200 hover:bg-gray-50") }
                                  title="Open Tasks"
                                >
                                  <Play size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Create Project Modal (simple center modal) */}
      {showCreateProject && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateProject(false)} />
          <div className={"relative w-full max-w-md rounded-2xl p-6 " + (dark ? "bg-slate-800" : "bg-white") }>
            <h3 className="text-lg font-semibold mb-3">Create project</h3>
            <input
              className={"w-full px-4 py-2 rounded-lg border " + (dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200")}
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCreateProject(false)} className={"px-4 py-2 rounded-lg border " + (dark ? "border-slate-600" : "border-gray-200")}>Cancel</button>
              <button onClick={createProject} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Add App Modal */}
      {showAddApp && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddApp(false)} />
          <div className={"relative w-full max-w-md rounded-2xl p-6 " + (dark ? "bg-slate-800" : "bg-white") }>
            <h3 className="text-lg font-semibold mb-3">Add app to project</h3>
            <div className="text-sm text-slate-400 mb-3">Project: {projects.find((p) => p.id === activeProjectId)?.name}</div>
            <input
              className={"w-full px-4 py-2 rounded-lg border " + (dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200")}
              placeholder="App name"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowAddApp(false)} className={"px-4 py-2 rounded-lg border " + (dark ? "border-slate-600" : "border-gray-200")}>Cancel</button>
              <button onClick={addApp} className="px-4 py-2 rounded-lg bg-emerald-500 text-white">Add App</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sprint Modal */}
      {showAddSprint && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddSprint(false)} />
          <div className={"relative w-full max-w-md rounded-2xl p-6 " + (dark ? "bg-slate-800" : "bg-white") }>
            <h3 className="text-lg font-semibold mb-3">Add sprint</h3>
            <div className="text-sm text-slate-400 mb-3">
              Project: {projects.find((p) => p.id === activeProjectId)?.name} • 
              App: {projects.find((p) => p.id === activeProjectId)?.apps.find((a) => a.id === activeAppId)?.name}
            </div>
            <div className="space-y-3">
              <input
                className={"w-full px-4 py-2 rounded-lg border " + (dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200")}
                placeholder="Sprint name (example: Sprint 4 - Current)"
                value={newSprintName}
                onChange={(e) => setNewSprintName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    className={"w-full px-3 py-2 rounded-lg border text-sm " + (dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200")}
                    value={newSprintStart}
                    onChange={(e) => setNewSprintStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    className={"w-full px-3 py-2 rounded-lg border text-sm " + (dark ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-200")}
                    value={newSprintEnd}
                    onChange={(e) => setNewSprintEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowAddSprint(false)} className={"px-4 py-2 rounded-lg border " + (dark ? "border-slate-600" : "border-gray-200")}>Cancel</button>
              <button onClick={addSprint} className="px-4 py-2 rounded-lg bg-violet-600 text-white">Add Sprint</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}