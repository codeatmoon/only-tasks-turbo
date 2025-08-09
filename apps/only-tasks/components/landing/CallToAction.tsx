'use client'
import { useRouter } from 'next/navigation'
import { LucideArrowRight, LucideZap, LucidePlayCircle, LucideCheck } from 'lucide-react'

const benefits = [
  'No credit card required',
  'Setup in 2 minutes',
  'Cancel anytime',
  'Free forever plan'
]

export default function CallToAction() {
  const router = useRouter()

  const navigateToDemo = () => {
    router.push('/demo')
  }

  const navigateToCreateSpace = () => {
    router.push('/create-space')
  }

  return (
    <section className="relative py-24 sm:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 px-6 py-24 shadow-2xl sm:px-24 xl:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
          
          {/* Content */}
          <div className="relative mx-auto max-w-4xl text-center">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg">
              <LucideZap className="h-10 w-10 text-white" />
            </div>

            {/* Headline */}
            <h2 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Ready to Get{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Organized?
              </span>
            </h2>

            {/* Subheadline */}
            <p className="mt-6 text-xl leading-8 text-slate-300 sm:text-2xl">
              Transform your team&apos;s productivity today. Start with our free demo and see the difference OnlyTasks can make.
            </p>

            {/* Benefits */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-slate-300">
                  <LucideCheck className="h-4 w-4 text-green-400" />
                  {benefit}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <button
                onClick={navigateToDemo}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <LucidePlayCircle className="h-5 w-5" />
                Try Live Demo
                <LucideArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={navigateToCreateSpace}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-100 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Get Started Free
                <LucideArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 ring-2 ring-white"
                    ></div>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-white">
                    Join 10,000+ users already using OnlyTasks
                  </p>
                  <p className="text-xs text-slate-300">
                    Rated 4.9/5 stars by our users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-8 hidden lg:block">
            <div className="h-32 w-32 rounded-full bg-blue-400/20 blur-2xl"></div>
          </div>
          <div className="absolute bottom-1/4 right-8 hidden lg:block">
            <div className="h-32 w-32 rounded-full bg-purple-400/20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}