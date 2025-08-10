"use client";
import {
  LucideUsers,
  LucideCheckCircle,
  LucideBarChart3,
  LucideGlobe,
} from "lucide-react";

const stats = [
  {
    icon: LucideUsers,
    value: "10,000+",
    label: "Active Users",
    description: "Teams worldwide trust OnlyTasks",
  },
  {
    icon: LucideCheckCircle,
    value: "1M+",
    label: "Tasks Completed",
    description: "Projects delivered successfully",
  },
  {
    icon: LucideBarChart3,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable and always available",
  },
  {
    icon: LucideGlobe,
    value: "50+",
    label: "Countries",
    description: "Global teams using OnlyTasks",
  },
];

export default function SocialProof() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Trusted by Teams Worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join thousands of teams who have transformed their productivity with
            OnlyTasks.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Value */}
                <div className="mt-6 text-4xl font-bold text-white lg:text-5xl">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="mt-2 text-lg font-semibold text-blue-100">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="mt-1 text-sm text-blue-200">
                  {stat.description}
                </div>

                {/* Connecting Line (except for last item) */}
                {index < stats.length - 1 && (
                  <div className="absolute top-8 left-full hidden h-px w-8 bg-gradient-to-r from-white/30 to-transparent lg:block"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white">
              Ready to Transform Your Workflow?
            </h3>
            <p className="mt-4 text-blue-100">
              Join the growing community of teams who have streamlined their
              project management with OnlyTasks.
            </p>

            {/* Company Logos Placeholder */}
            <div className="mt-8">
              <p className="text-sm font-medium text-blue-200 mb-4">
                Trusted by teams at
              </p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="text-lg font-bold text-white">TechFlow</div>
                <div className="text-lg font-bold text-white">DataCorp</div>
                <div className="text-lg font-bold text-white">InnovateHub</div>
                <div className="text-lg font-bold text-white">DevTeam</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-4 hidden lg:block">
        <div className="h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      </div>
      <div className="absolute bottom-1/4 right-4 hidden lg:block">
        <div className="h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      </div>
    </section>
  );
}
