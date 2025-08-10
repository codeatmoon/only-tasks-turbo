"use client";
import { LucideQuote, LucideStar } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content:
      "OnlyTasks transformed how our team manages projects. The sprint-based approach and multiple views make it incredibly easy to track progress and stay organized.",
    author: {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechFlow",
      image: "/api/placeholder/avatar/sarah-chen",
    },
    rating: 5,
  },
  {
    id: 2,
    content:
      "The kanban and graph views are game-changers. We can see bottlenecks instantly and adjust our workflow accordingly. It's the best project management tool we've used.",
    author: {
      name: "Michael Rodriguez",
      role: "Engineering Lead",
      company: "DataCorp",
      image: "/api/placeholder/avatar/michael-rodriguez",
    },
    rating: 5,
  },
  {
    id: 3,
    content:
      "Simple, beautiful, and powerful. OnlyTasks helps us ship faster and with better quality. The team collaboration features are exactly what we needed.",
    author: {
      name: "Emily Johnson",
      role: "Startup Founder",
      company: "InnovateHub",
      image: "/api/placeholder/avatar/emily-johnson",
    },
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Testimonials
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Loved by Teams Worldwide
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            See how teams are transforming their productivity with OnlyTasks.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200 transition-all duration-300 hover:shadow-xl hover:scale-105 dark:bg-slate-800 dark:ring-slate-700"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg">
                  <LucideQuote className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Rating Stars */}
              <div className="mb-4 flex items-center gap-1 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <LucideStar
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-lg leading-8 text-slate-900 dark:text-white">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {testimonial.author.role} at {testimonial.author.company}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-30 dark:from-blue-950/30 dark:to-purple-950/30"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-base text-slate-600 dark:text-slate-300">
            Join hundreds of teams already using OnlyTasks
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 ring-2 ring-white dark:ring-slate-900"
                ></div>
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              500+ teams
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
