'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="mb-4 text-slate-600">{error.message}</p>
      <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => reset()}>
        Try again
      </button>
    </main>
  )
}
