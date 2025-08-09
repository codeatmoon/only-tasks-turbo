'use client'
import { LucideGrid3X3, LucideCheckCircle, LucideUsers, LucideBarChart3, LucideCalendar, LucideZap } from 'lucide-react'

const features = [
  {
    icon: LucideGrid3X3,
    title: 'Multiple Views',
    description: 'Switch seamlessly between table, kanban board, and graph views to visualize your tasks exactly how you prefer.',
    color: 'blue'
  },
  {
    icon: LucideCheckCircle,
    title: 'Sprint Management',
    description: 'Organize tasks into focused sprints with clear timelines, priorities, and assignees for optimal project flow.',
    color: 'green'
  },
  {
    icon: LucideUsers,
    title: 'Team Collaboration',
    description: 'Assign tasks, track progress, and manage workloads across your entire team with powerful collaboration tools.',
    color: 'purple'
  },
  {
    icon: LucideBarChart3,
    title: 'Analytics & Insights',
    description: 'Get detailed insights into team performance, sprint velocity, and project progress with beautiful charts.',
    color: 'orange'
  },
  {
    icon: LucideCalendar,
    title: 'Timeline Planning',
    description: 'Plan and visualize project timelines with drag-and-drop scheduling and dependency management.',
    color: 'pink'
  },
  {
    icon: LucideZap,
    title: 'Lightning Fast',
    description: 'Built for speed with instant updates, real-time collaboration, and blazing-fast performance.',
    color: 'yellow'
  }
]

const colorClasses = {
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    icon: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800'
  },
  purple: {
    icon: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800'
  },
  orange: {
    icon: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800'
  },
  pink: {
    icon: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    border: 'border-pink-200 dark:border-pink-800'
  },
  yellow: {
    icon: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-800'
  }
}

export default function Features() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Everything You Need
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Built for Modern Teams
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Powerful features designed to streamline your workflow and boost productivity across every project.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              const colors = colorClasses[feature.color as keyof typeof colorClasses]
              
              return (
                <div 
                  key={feature.title} 
                  className="group relative flex flex-col items-start p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {/* Icon */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <dt className="mt-6 text-xl font-semibold leading-7 text-slate-900 dark:text-white">
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </dd>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-50 dark:from-blue-950/50 dark:to-purple-950/50"></div>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}