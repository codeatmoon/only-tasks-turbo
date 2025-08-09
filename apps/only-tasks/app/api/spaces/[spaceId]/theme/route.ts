import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'

const dataService = new DataService()

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    try {
        const { spaceId } = await params
        const theme = await dataService.getSpaceTheme(spaceId)
        return NextResponse.json({ theme })
    } catch (e) {
        console.error('GET theme error', e)
        return NextResponse.json({ error: 'Failed to load theme' }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    try {
        const body = await req.json()
        const { theme_name, mode, brand } = body as { theme_name: string; mode: 'light' | 'dark'; brand?: 'brand-a' | 'brand-b' | null }

        if (!theme_name || !mode) {
            return NextResponse.json({ error: 'theme_name and mode are required' }, { status: 400 })
        }

        const { spaceId } = await params
        const saved = await dataService.saveSpaceTheme(spaceId, { theme_name, mode, brand })
        return NextResponse.json({ theme: saved })
    } catch (e) {
        console.error('PUT theme error', e)
        return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 })
    }
}
