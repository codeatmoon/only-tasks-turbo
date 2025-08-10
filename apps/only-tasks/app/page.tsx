"use client";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import SocialProof from "@/components/landing/SocialProof";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";
import TasksPage from "./tasks";

export default function HomePage() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the tasks page
  if (user) {
    return <TasksPage />;
  }

  // If user is not authenticated, show the landing page
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <SocialProof />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
