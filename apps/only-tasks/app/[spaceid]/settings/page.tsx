"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const THEMES = [
  { id: "theme-1", label: "Theme 1" },
  { id: "theme-2", label: "Theme 2" },
] as const;

const BRANDS = [
  { id: null, label: "Default" },
  { id: "brand-a", label: "Brand A" },
  { id: "brand-b", label: "Brand B" },
] as const;

type Mode = "light" | "dark";

type ThemeState = {
  theme_name: "theme-1" | "theme-2";
  mode: Mode;
  brand: "brand-a" | "brand-b" | null;
};

export default function SpaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.spaceid as string;

  const [state, setState] = useState<ThemeState>({
    theme_name: "theme-1",
    mode: "dark",
    brand: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/spaces/${spaceId}/theme`);
        if (res.ok) {
          const { theme } = await res.json();
          if (theme)
            setState({
              theme_name: theme.theme_name,
              mode: theme.mode,
              brand: theme.brand ?? null,
            });
        }
      } catch {}
    };
    load();
  }, [spaceId]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/spaces/${spaceId}/theme`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (res.ok) {
        router.push(`/${spaceId}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold dark:text-gray-100">
            Space Settings
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <div className="card space-y-6">
          <div>
            <h2 className="text-sm font-semibold mb-2">Theme</h2>
            <div className="flex gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`pill ${state.theme_name === t.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setState((s) => ({ ...s, theme_name: t.id }))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">Mode</h2>
            <div className="flex gap-3">
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  className={`pill ${state.mode === m ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setState((s) => ({ ...s, mode: m }))}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">Brand Variant</h2>
            <div className="flex gap-3 flex-wrap">
              {BRANDS.map((b) => (
                <button
                  key={b.id ?? "default"}
                  className={`pill ${state.brand === b.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setState((s) => ({ ...s, brand: b.id }))}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="icon-btn px-4 h-10"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
