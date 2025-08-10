"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateSpacePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect users to home page since we no longer allow space creation
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Space Creation Disabled
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Space creation is no longer available. Please contact your administrator.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
