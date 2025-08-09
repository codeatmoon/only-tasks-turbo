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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <LucidePlus size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {isPage ? 'Create Your Space' : 'Create New Space'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isPage 
              ? (spaceId ? `Set up your space "${spaceId}" and start organizing your tasks` : 'Set up your personalized workspace and start organizing your tasks')
              : `Space "${spaceId}" doesn't exist yet. Let's create it and get you started!`
            }
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg overflow-hidden">
          {/* Mode Selection Section */}
          <div className="bg-gray-50 dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Choose Your Approach</h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMode('claim')}
                className={`flex-1 px-6 py-4 rounded-xl text-sm font-medium transition-all ${
                  mode === 'claim' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Claim Space</div>
                  <div className="text-xs opacity-80 mt-1">Create a new account and claim ownership</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 px-6 py-4 rounded-xl text-sm font-medium transition-all ${
                  mode === 'login' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Already Have Account</div>
                  <div className="text-xs opacity-80 mt-1">Send me a secure login link</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">

            {/* Account Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
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
                )}
              </div>

              {mode === 'claim' && (
                <div className="mt-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 placeholder-gray-500 dark:placeholder-gray-400 pr-12"
                      placeholder="Create a secure password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {mode === 'claim' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Space Configuration</h3>
                <div className="grid md:grid-cols-2 gap-6">
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
                      placeholder="Describe your space and its purpose"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Secure Login</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      We&apos;ll send you a secure login link to access the space. No password required!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendLoginLink}
                    disabled={loading || !email.trim()}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl
                               hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors duration-200 flex items-center justify-center gap-2 mx-auto
                               font-semibold"
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
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Actions Section */}
            <div className="bg-gray-50 dark:bg-gray-800 -m-8 mt-8 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                           rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              {mode === 'claim' && (
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !email.trim() || !password}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl
                             hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors duration-200 flex items-center justify-center gap-2
                             font-semibold"
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

              {mode === 'login' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account? 
                    <button
                      type="button"
                      onClick={() => setMode('claim')}
                      className="text-blue-600 dark:text-blue-400 hover:underline ml-1 font-medium"
                    >
                      Claim this space
                    </button>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}