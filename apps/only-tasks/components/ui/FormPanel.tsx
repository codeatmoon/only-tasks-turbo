"use client";

import { ReactNode } from "react";

interface FormPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  "aria-labelledby"?: string;
}

export default function FormPanel({
  title,
  subtitle,
  children,
  className = "",
  onSubmit,
  "aria-labelledby": ariaLabelledBy,
}: FormPanelProps) {
  const panelId = `panel-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <form
      className={`
        flex flex-col h-full min-h-[420px]
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20
        rounded-2xl
        p-7
        ${className}
      `}
      onSubmit={onSubmit}
      aria-labelledby={ariaLabelledBy || panelId}
    >
      <div className="mb-5">
        <h2
          id={panelId}
          className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="flex-1 flex flex-col">{children}</div>
    </form>
  );
}
