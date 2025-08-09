import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'

const dataService = new DataService()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> }
) {
  try {
    await params // We don't use spaceId but need to await the params
    const body = await request.json()
    const { sprintId, task } = body

    if (!sprintId || !task || !task.name) {
      return NextResponse.json(
        { error: 'Sprint ID and task with name are required' },
        { status: 400 }
      )
    }

    // Create task in database
    const createdTask = await dataService.createTask(sprintId, task)

    return NextResponse.json({ 
      success: true, 
      task: createdTask
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}