"use client";
import { useRouter } from "next/navigation";
import {
  LucidePlayCircle,
  LucideGrid3X3,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();

  const navigateToDemo = () => {
    router.push("/demo");
  };

  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Main Hero Content */}
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:px-8 lg:pt-32">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
            <LucideGrid3X3 className="mr-2 h-4 w-4" />
            Sprint-based Task Management
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Task Management{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-lg leading-7 text-slate-600 dark:text-slate-300 sm:text-xl max-w-2xl mx-auto">
            Beautiful sprint-based task management with table, kanban, and graph views.
            Focus on what matters most.
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <button
              onClick={navigateToDemo}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LucidePlayCircle className="h-5 w-5" />
              Try Live Demo
            </button>
          </div>

          {/* Simple Social Proof */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Simple, focused, and effective
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
