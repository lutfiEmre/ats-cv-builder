import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const count = await prisma.cV.count()
    return NextResponse.json({ 
      message: 'Database connection successful', 
      cvCount: count 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Database connection failed', details: error },
      { status: 500 }
    )
  }
}


