"use client"
import type React from 'react'
import { ButtonHTMLAttributes } from 'react'

export default function IconButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; children?: React.ReactNode }) {
    return (
        <button {...props} className={`icon-btn ${className}`}>
            {children}
        </button>
    )
}
