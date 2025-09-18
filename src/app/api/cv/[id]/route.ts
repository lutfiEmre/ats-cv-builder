import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const cv = await prisma.cV.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user!.id // Only allow access to user's own CVs
      }
    })

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    return NextResponse.json({ cv })
  } catch (error) {
    console.error('Error fetching CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, data } = body

    const resolvedParams = await params
    // Check if CV exists and belongs to user
    const existingCV = await prisma.cV.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id // Only allow editing user's own CVs
      }
    })

    if (!existingCV) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Update CV
    const updatedCV = await prisma.cV.update({
      where: { id: resolvedParams.id },
      data: {
        title: title || existingCV.title,
        jsonData: JSON.stringify(data),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      id: updatedCV.id,
      title: updatedCV.title,
      message: 'CV updated successfully!'
    })
  } catch (error) {
    console.error('Error updating CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    // Check if CV exists and belongs to user
    const existingCV = await prisma.cV.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id // Only allow deleting user's own CVs
      }
    })

    if (!existingCV) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Delete CV
    await prisma.cV.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'CV deleted successfully!' })
  } catch (error) {
    console.error('Error deleting CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}