"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function TaskDropdown({
  value,
  options,
  onChange,
  className = "",
  buttonClassName = "",
  getOptionClass,
  prefix,
  showValue = true,
  prefixClassName,
}: {
  value?: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
  buttonClassName?: string;
  getOptionClass?: (opt: string) => string;
  prefix?: React.ReactNode;
  showValue?: boolean;
  prefixClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const compute = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const top = Math.round(r.bottom + window.scrollY + 4);
    let left = Math.round(r.left + window.scrollX);
    const minWidth = Math.max(160, Math.round(r.width));
    const vw = window.innerWidth + window.scrollX;
    const panelWidth = Math.max(minWidth, 200);
    if (left + panelWidth > vw - 8)
      left = Math.max(8 + window.scrollX, vw - 8 - panelWidth);
    setPos({ top, left, width: minWidth });
  };

  useEffect(() => {
    if (!open) return;
    compute();
    const onResizeScroll = () => compute();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`${className}`}>
      <button
        ref={btnRef}
        className={`pill ${buttonClassName}`}
        onClick={() => setOpen((o) => !o)}
      >
        {prefix ? (
          <span
            className={
              prefixClassName ??
              "inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] mr-1"
            }
          >
            {prefix}
          </span>
        ) : null}
        {showValue && <span className="truncate">{value || "Select"}</span>}
      </button>
      {open &&
        pos &&
        (createPortal(
          <>
            <div
              className="fixed inset-0 z-[500] bg-black/10 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed z-[510] card"
              style={{
                top: pos.top,
                left: pos.left,
                minWidth: Math.max(pos.width, 200),
              }}
            >
              <ul className="text-sm space-y-1 max-h-[50vh] overflow-auto text-gray-700 dark:text-gray-200">
                {options.map((opt) => (
                  <li
                    key={opt}
                    className={`px-3 py-1.5 rounded cursor-pointer border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 ${getOptionClass ? getOptionClass(opt) : ""} ${opt === value ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          </>,
          document.body,
        ) as unknown as React.ReactNode)}
    </div>
  );
}
