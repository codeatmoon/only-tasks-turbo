'use client'

import { useState, useEffect } from 'react'
import { LucideLoader, LucidePlus } from 'lucide-react'

interface SpaceCreationProps {
  spaceId: string
  onSpaceCreated: () => void
  onCancel: () => void
  isPage?: boolean
}

export default function SpaceCreation({ spaceId, onSpaceCreated, onCancel, isPage = false }: SpaceCreationProps) {
  const [name, setName] = useState(spaceId || '')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'claim' | 'login'>('claim')

  // Update name when spaceId changes (for prefilling from URL)
  useEffect(() => {
    if (spaceId && !name) {
      setName(spaceId)
    }
  }, [spaceId, name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Space name is required')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (mode === 'claim' && !password) {
      setError('Password is required to claim a space')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: spaceId || name.trim(),
          name: name.trim(),
          description: description.trim() || undefined,
          email: email.trim(),
          password: mode === 'claim' ? password : undefined,
          ownerName: ownerName.trim() || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create space')
      }

      onSpaceCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create space')
    } finally {
      setLoading(false)
    }
  }

  const handleSendLoginLink = async () => {
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          spaceId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send login link')
      }

      setError('')
      alert('Login link sent to your email!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send login link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <LucidePlus size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isPage ? 'Create Your Space' : 'Create New Space'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isPage 
              ? (spaceId ? `Set up your space "${spaceId}"` : 'Set up your personalized workspace')
              : `Space "${spaceId}" doesn't exist yet. Let's create it!`
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setMode('claim')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'claim' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Claim Space
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'login' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Already Have Account
            </button>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your@email.com"
              disabled={loading}
              autoFocus
            />
          </div>

          {mode === 'claim' && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Space Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter space name"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder-gray-500 dark:placeholder-gray-400 pr-12"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Describe your space"
                  disabled={loading}
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We&apos;ll send you a secure login link to access the space.
              </p>
              <button
                type="button"
                onClick={handleSendLoginLink}
                disabled={loading || !email.trim()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg
                           hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <LucideLoader size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Login Link'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              Cancel
            </button>
            {mode === 'claim' && (
              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim() || !password}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg
                           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LucideLoader size={20} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Claim Space'
                )}
              </button>
            )}
          </div>

          {mode === 'login' && (
            <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account? 
                <button
                  type="button"
                  onClick={() => setMode('claim')}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Claim this space
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}