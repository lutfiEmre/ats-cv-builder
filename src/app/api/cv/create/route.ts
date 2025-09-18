import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// import { cvDataSchema } from '@/lib/cv-validation' // Unused for now
import { checkATSCompliance } from '@/lib/ats-checker'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Received CV data:', JSON.stringify(body, null, 2))
    
    const { title, data, publish } = body

    // Basic validation - just check if we have contact info
    if (!data || !data.contactInfo || !data.contactInfo.fullName || !data.contactInfo.email) {
      console.error('Missing contact info:', { data: data?.contactInfo })
      return NextResponse.json(
        { error: 'Contact information is required' },
        { status: 400 }
      )
    }

    if (!data.summary || data.summary.length < 10) {
      console.error('Missing or short summary:', data.summary)
      return NextResponse.json(
        { error: 'Professional summary is required (minimum 10 characters)' },
        { status: 400 }
      )
    }

    // Generate CV text for ATS analysis
    const generateCVText = () => {
      let text = `CONTACT INFORMATION\n`
      text += `${data.contactInfo.fullName}\n`
      text += `${data.contactInfo.email}\n`
      text += `${data.contactInfo.phone}\n`
      text += `${data.contactInfo.address}\n`
      if (data.contactInfo.linkedin) text += `${data.contactInfo.linkedin}\n`
      if (data.contactInfo.website) text += `${data.contactInfo.website}\n`
      
      text += `\nSUMMARY\n${data.summary}\n`
      
      if (data.workExperience && data.workExperience.length > 0) {
        text += `\nWORK EXPERIENCE\n`
        data.workExperience.forEach((exp: { position: string; company: string; startDate: string; endDate: string; current: boolean; description: string }) => {
          text += `${exp.position} at ${exp.company}\n`
          text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`
          text += `${exp.description}\n\n`
        })
      }
      
      if (data.education && data.education.length > 0) {
        text += `\nEDUCATION\n`
        data.education.forEach((edu: { degree: string; field: string; institution: string; startDate: string; endDate: string; description?: string }) => {
          text += `${edu.degree} in ${edu.field}\n`
          text += `${edu.institution}\n`
          text += `${edu.startDate} - ${edu.endDate}\n`
          if (edu.description) text += `${edu.description}\n`
          text += '\n'
        })
      }
      
      if (data.skills && data.skills.length > 0) {
        text += `\nSKILLS\n${data.skills.join(', ')}\n`
      }
      
      if (data.projects && data.projects.length > 0) {
        text += `\nPROJECTS\n`
        data.projects.forEach((project: { title: string; description: string; technologies: string[] }) => {
          text += `${project.title}\n`
          text += `${project.description}\n`
          text += `Technologies: ${project.technologies.join(', ')}\n\n`
        })
      }
      
      if (data.certifications && data.certifications.length > 0) {
        text += `\nCERTIFICATIONS\n`
        data.certifications.forEach((cert: { name: string; issuer: string; date: string }) => {
          text += `${cert.name} - ${cert.issuer}\n`
          text += `Issued: ${cert.date}\n\n`
        })
      }
      
      return text
    }

    // Calculate ATS score
    const atsAnalysis = checkATSCompliance(generateCVText())

    // Create CV in database for authenticated user
    const cv = await prisma.cV.create({
      data: {
        userId: session.user.id,
        title: title || `${data.contactInfo.fullName}'s CV`,
        jsonData: JSON.stringify(data),
        atsScore: atsAnalysis.score
      }
    })

    return NextResponse.json({
      id: cv.id,
      title: cv.title,
      atsScore: cv.atsScore,
      message: publish ? 'CV created and published successfully!' : 'CV saved as draft successfully!'
    })
  } catch (error) {
    console.error('Error creating CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}