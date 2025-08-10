"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "blue" | "slate" | "rose" | "amber" | "green";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "slate",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  size = "md",
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    border rounded-full font-semibold
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    blue: `
      text-blue-700 dark:text-blue-300
      bg-blue-50 dark:bg-blue-900/20
      border-blue-200 dark:border-blue-800
      hover:bg-blue-100 dark:hover:bg-blue-900/30
      focus:ring-blue-500
    `,
    slate: `
      text-slate-700 dark:text-slate-300
      bg-slate-50 dark:bg-slate-800/50
      border-slate-200 dark:border-slate-700
      hover:bg-slate-100 dark:hover:bg-slate-800
      focus:ring-slate-500
    `,
    rose: `
      text-rose-700 dark:text-rose-300
      bg-rose-50 dark:bg-rose-900/20
      border-rose-200 dark:border-rose-800
      hover:bg-rose-100 dark:hover:bg-rose-900/30
      focus:ring-rose-500
    `,
    amber: `
      text-amber-700 dark:text-amber-300
      bg-amber-50 dark:bg-amber-900/20
      border-amber-200 dark:border-amber-800
      hover:bg-amber-100 dark:hover:bg-amber-900/30
      focus:ring-amber-500
    `,
    green: `
      text-green-700 dark:text-green-300
      bg-green-50 dark:bg-green-900/20
      border-green-200 dark:border-green-800
      hover:bg-green-100 dark:hover:bg-green-900/30
      focus:ring-green-500
    `,
  };

  const combinedClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}
