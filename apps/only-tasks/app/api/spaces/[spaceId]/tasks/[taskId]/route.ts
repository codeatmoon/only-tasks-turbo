import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'

const dataService = new DataService()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    const updates = await request.json()

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Update task in database
    const updatedTask = await dataService.updateTask(taskId, updates)

    return NextResponse.json({ 
      success: true, 
      task: updatedTask
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}