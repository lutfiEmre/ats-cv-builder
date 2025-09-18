import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import { Packer } from 'docx'
import { CVPDF } from '@/lib/pdf-generator'
import { generateDOCX } from '@/lib/docx-generator'
import { CVData } from '@/types/cv'

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

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'pdf'

    const resolvedParams = await params
    // Fetch CV - only user's own CV
    const cv = await prisma.cV.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user!.id // Only allow exporting user's own CVs
      }
    })

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    const cvData: CVData = JSON.parse(cv.jsonData)

    if (format === 'pdf') {
      // Generate PDF
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PDFDocument = React.createElement(CVPDF, { data: cvData }) as any
      const pdfBuffer = await renderToBuffer(PDFDocument)
      
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${cv.title}.pdf"`,
        },
      })
    } else if (format === 'docx') {
      // Generate DOCX
      const doc = generateDOCX(cvData)
      const docxBuffer = await Packer.toBuffer(doc)
      
      return new NextResponse(new Uint8Array(docxBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${cv.title}.docx"`,
        },
      })
    } else {
      return NextResponse.json({ error: 'Invalid format. Use pdf or docx' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error exporting CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}