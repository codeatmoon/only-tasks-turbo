import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'

const dataService = new DataService()

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ spaceId: string }> }
) {
  try {
    const { spaceId } = await params

    // Check if space exists
    const space = await dataService.getSpace(spaceId)
    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      )
    }

    // Get projects with full data structure
    const projects = await dataService.getProjectsWithData(spaceId)

    return NextResponse.json({ 
      success: true, 
      projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}