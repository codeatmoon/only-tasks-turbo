'use client'
import { useState } from 'react'
import { LucideAppWindow } from 'lucide-react'
import IconButton from '../ui/IconButton'
import type { App } from '../../lib/types'

export default function AppDropdown({ apps, value, onChange }: { apps: App[]; value?: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <IconButton title="Switch App" onClick={() => setOpen(o => !o)}>
        <LucideAppWindow size={16} />
      </IconButton>
      {open && (
        <div className="absolute right-0 mt-2 w-64 card z-10">
          <div className="text-sm font-medium mb-2">Apps</div>
          {apps.map((a) => (
            <div
              key={a.id}
              className={
                'px-3 py-2 rounded hover:bg-gray-50 cursor-pointer ' +
                (a.id === value ? 'bg-gray-100' : '')
              }
              onClick={() => {
                onChange(a.id)
                setOpen(false)
              }}
            >
              {a.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
