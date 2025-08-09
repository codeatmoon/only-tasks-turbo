'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SpaceCreation from '@/components/spaces/SpaceCreation'

export default function CreateSpacePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [spaceId, setSpaceId] = useState('')

  useEffect(() => {
    // Get space name from URL parameters
    const spaceParam = searchParams.get('space')
    if (spaceParam) {
      setSpaceId(spaceParam)
    }
  }, [searchParams])

  const handleSpaceCreated = () => {
    // Redirect to the created space
    router.push(`/${spaceId}`)
  }

  const handleCancel = () => {
    // Go back to landing page
    router.push('/')
  }

  // Wait for spaceId to be set from URL params before rendering
  const effectiveSpaceId = spaceId || searchParams.get('space') || ''

  return (
    <SpaceCreation 
      spaceId={effectiveSpaceId}
      onSpaceCreated={handleSpaceCreated}
      onCancel={handleCancel}
      isPage={true}
    />
  )
}