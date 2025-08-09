"use client"
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(true)

  useEffect(() => {
    const ls = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const initialDark = ls ? ls === 'dark' : true
    setDark(initialDark)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = document.documentElement
    if (dark) el.classList.add('dark'); else el.classList.remove('dark')
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { }
  }, [dark])

  return (
    <button
      className="icon-btn"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
      title={dark ? 'Switch to light' : 'Switch to dark'}
    >
      {dark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
