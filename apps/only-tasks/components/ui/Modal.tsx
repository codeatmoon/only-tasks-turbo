"use client"
import type React from 'react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: React.ReactNode; children?: React.ReactNode }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onClose])

    if (!open) return null
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute inset-0 grid place-items-center p-4">
                <div className="card w-full max-w-3xl">
                    {title && <div className="mb-3 text-lg font-semibold">{title}</div>}
                    {children}
                </div>
            </div>
        </div>
    )
}
