"use client";

import { Table, Kanban, BarChart3 } from "lucide-react";

interface ViewSelectorProps {
  currentView: "sheet" | "kanban" | "graph";
  onViewChange: (view: "sheet" | "kanban" | "graph") => void;
}

export default function ViewSelector({
  currentView,
  onViewChange,
}: ViewSelectorProps) {
  const views = [
    {
      key: "sheet" as const,
      label: "Tasks",
      icon: Table,
      title: "Table view with detailed task information",
    },
    {
      key: "kanban" as const,
      label: "Kanban",
      icon: Kanban,
      title: "Board view with drag-and-drop columns",
    },
    {
      key: "graph" as const,
      label: "Analytics",
      icon: BarChart3,
      title: "Charts and analytics dashboard",
    },
  ];

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-800">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.key;

        return (
          <button
            key={view.key}
            onClick={() => onViewChange(view.key)}
            className={`
              relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all
              first:rounded-l-lg last:rounded-r-lg
              ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }
            `}
            title={view.title}
          >
            <Icon size={16} />
            <span>{view.label}</span>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
