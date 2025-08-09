'use client'
import { useRouter } from 'next/navigation'
import { LucideArrowRight, LucidePlayCircle, LucideGrid3X3 } from 'lucide-react'

export default function Hero() {
  const router = useRouter()

  const navigateToDemo = () => {
    router.push('/demo')
  }

  const navigateToCreateSpace = () => {
    router.push('/create-space')
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      
      {/* Main Hero Content */}
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-24 sm:pb-32 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
            <LucideGrid3X3 className="mr-2 h-4 w-4" />
            Sprint-based Task Management
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Task Management{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300 sm:text-2xl">
            Transform your workflow with beautiful sprint-based task management. 
            Switch effortlessly between table, kanban, and graph views to match your team&apos;s rhythm.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              onClick={navigateToDemo}
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LucidePlayCircle className="h-5 w-5" />
              Try Live Demo
              <LucideArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={navigateToCreateSpace}
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              Get Started Free
              <LucideArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Trusted by teams at
            </p>
            <div className="mt-4 flex items-center justify-center gap-8 opacity-50 grayscale">
              <div className="text-lg font-bold text-slate-400">Company A</div>
              <div className="text-lg font-bold text-slate-400">Company B</div>
              <div className="text-lg font-bold text-slate-400">Company C</div>
              <div className="text-lg font-bold text-slate-400">Company D</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-4 hidden lg:block">
        <div className="h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"></div>
      </div>
      <div className="absolute bottom-1/4 right-4 hidden lg:block">
        <div className="h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 blur-3xl"></div>
      </div>
    </section>
  )
}