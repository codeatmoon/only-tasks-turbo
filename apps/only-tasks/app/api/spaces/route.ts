import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'
import { initializeSchema } from '@/lib/database/init'
import { generateUserId, hashPassword } from '@/lib/auth'

const dataService = new DataService()

export async function POST(request: NextRequest) {
  try {
    // Initialize schema on first API call
    try {
      await initializeSchema()
    } catch (schemaError) {
      console.warn('Schema initialization warning:', schemaError)
      // Continue even if schema initialization fails (might already exist)
    }

    const body = await request.json()
    const { id, name, description, email, password, ownerName } = body

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Space ID and name are required' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required to claim a space' },
        { status: 400 }
      )
    }

    // Check if space already exists
    const existingSpace = await dataService.getSpace(id)
    if (existingSpace) {
      return NextResponse.json(
        { error: 'Space already exists' },
        { status: 409 }
      )
    }

    // Get or create user
    let user = await dataService.getGlobalUserByEmail(email)
    if (!user) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for new users' },
          { status: 400 }
        )
      }

      // Create new user
      const userId = generateUserId()
      const passwordHash = await hashPassword(password)
      
      user = await dataService.createGlobalUser({
        id: userId,
        email,
        password_hash: passwordHash,
        name: ownerName || name
      })
    }

    // Create the space with owner
    const space = await dataService.createSpace({
      id,
      name,
      description,
      owner_id: user.id
    })
    
    // Add user to space as owner
    await dataService.addUserToSpace({
      id: `spaceuser-${Date.now()}`,
      space_id: space.id,
      user_id: user.id,
      name: user.name || ownerName || 'Owner',
      role: 'owner'
    })
    
    // Create default project structure
    await dataService.createDefaultProject(id)

    return NextResponse.json({ 
      success: true, 
      space: {
        id: space.id,
        name: space.name,
        description: space.description,
        owner_id: space.owner_id
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Error creating space:', error)
    return NextResponse.json(
      { error: 'Failed to create space' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spaceId = searchParams.get('id')

    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      )
    }

    const space = await dataService.getSpace(spaceId)
    
    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      space: {
        id: space.id,
        name: space.name,
        description: space.description
      }
    })
  } catch (error) {
    console.error('Error fetching space:', error)
    return NextResponse.json(
      { error: 'Failed to fetch space' },
      { status: 500 }
    )
  }
}