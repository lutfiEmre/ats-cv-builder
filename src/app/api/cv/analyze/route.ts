import { NextRequest, NextResponse } from 'next/server'
import { parseDocument } from '@/lib/document-parser'
import { checkATSCompliance } from '@/lib/ats-checker'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type (be lenient: some browsers may send octet-stream)
    const name = (file as File).name as string | undefined
    const ext = name ? name.toLowerCase().split('.').pop() : undefined
    const isPdf = file.type === 'application/pdf' || ext === 'pdf'
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx'
    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    try {
      // Parse document
      const text = await parseDocument(file)
      
      if (!text || text.trim().length < 50) {
        return NextResponse.json(
          { error: 'Unable to extract text from the document or document is too short.' },
          { status: 400 }
        )
      }

      // Analyze ATS compliance
      const analysis = checkATSCompliance(text)

      return NextResponse.json({
        analysis,
        extractedText: text.substring(0, 500) + '...' // Return first 500 chars for preview
      })
    } catch (parseError) {
      return NextResponse.json(
        { error: parseError instanceof Error ? parseError.message : 'Failed to parse document' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error analyzing CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}