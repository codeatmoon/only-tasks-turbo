'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  showStrengthIndicator?: boolean
  'aria-describedby'?: string
}

export default function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = "Enter password",
  disabled = false,
  required = false,
  showStrengthIndicator = false,
  'aria-describedby': ariaDescribedBy
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const calculateStrength = (password: string): number => {
    let score = 0
    if (!password) return 0
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[\W_]/.test(password)) score += 1
    return score // 0..4
  }

  const getStrengthColor = (score: number): string => {
    if (score <= 1) return 'bg-gradient-to-r from-red-400 to-red-500'
    if (score === 2) return 'bg-gradient-to-r from-amber-400 to-amber-500'
    if (score === 3) return 'bg-gradient-to-r from-lime-400 to-green-500'
    return 'bg-gradient-to-r from-green-400 to-emerald-500'
  }

  const strength = calculateStrength(value)
  const strengthPercent = (strength / 4) * 100

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl 
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-slate-500 dark:placeholder-slate-400
                   transition-colors duration-200"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-describedby={ariaDescribedBy}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                   w-7 h-7 rounded-md flex items-center justify-center
                   text-slate-500 dark:text-slate-400 
                   hover:text-slate-700 dark:hover:text-slate-300
                   hover:bg-slate-100 dark:hover:bg-slate-700
                   transition-colors duration-200"
        aria-pressed={showPassword}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      
      {showStrengthIndicator && value && (
        <div className="mt-2">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}