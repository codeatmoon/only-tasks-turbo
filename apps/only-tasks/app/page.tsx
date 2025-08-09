'use client'
import { useRouter } from 'next/navigation'
import { LucideArrowRight, LucideCheckCircle, LucideGrid3X3, LucideUsers, LucideZap } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function LandingPage() {
  const router = useRouter()

  const navigateToDemo = () => {
    router.push('/demo')
  }

  const navigateToCreateSpace = () => {
    router.push('/create-space')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LucideGrid3X3 size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold dark:text-gray-100">OnlyTasks</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Task Management{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Simplified
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Organize your projects with beautiful sprint-based task management. 
          Switch between table, kanban, and graph views to match your workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={navigateToDemo}
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Demo
            <LucideArrowRight size={20} />
          </button>
          <button
            onClick={navigateToCreateSpace}
            className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Claim Your Space
            <LucideArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-16">
          Everything you need to stay organized
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <LucideGrid3X3 size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Multiple Views
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Switch between table, kanban board, and graph views to visualize your tasks the way you prefer.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <LucideCheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Sprint Management
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organize tasks into sprints with clear timelines, priorities, and assignees for better project flow.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <LucideUsers size={32} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Team Collaboration
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Assign tasks to team members, track progress, and manage workloads across your entire team.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <LucideZap size={64} className="mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to get organized?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Try our demo to see how OnlyTasks can streamline your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={navigateToDemo}
              className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Start Demo
              <LucideArrowRight size={20} />
            </button>
            <button
              onClick={navigateToCreateSpace}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 shadow-lg"
            >
              Claim Your Space
              <LucideArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 OnlyTasks. A simple task management solution.</p>
        </div>
      </footer>
    </div>
  )
}
