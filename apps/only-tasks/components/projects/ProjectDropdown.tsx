"use client";
import { useState } from "react";
import { LucideLayers } from "lucide-react";
import IconButton from "../ui/IconButton";
import type { Project } from "../../lib/types";

export default function ProjectDropdown({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value?: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <IconButton title="Switch Project" onClick={() => setOpen((o) => !o)}>
        <LucideLayers size={16} />
      </IconButton>
      {open && (
        <div className="absolute right-0 mt-2 w-64 card z-10">
          <div className="text-sm font-medium mb-2">Projects</div>
          {projects.map((p) => (
            <div
              key={p.id}
              className={
                "px-3 py-2 rounded hover:bg-gray-50 cursor-pointer " +
                (p.id === value ? "bg-gray-100" : "")
              }
              onClick={() => {
                onChange(p.id);
                setOpen(false);
              }}
            >
              {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
