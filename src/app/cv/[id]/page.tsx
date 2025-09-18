'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Download, Edit, Mail, Phone, MapPin, Linkedin, Globe, Calendar, FileText } from 'lucide-react'
import { CVData } from '@/types/cv'

interface CV {
  id: string
  title: string
  atsScore: number | null
  jsonData: string
  createdAt: string
  updatedAt: string
}

export default function ViewCVPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [cv, setCv] = useState<CV | null>(null)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return // Still loading session
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (status === 'authenticated') {
      fetchCV()
    }
  }, [status, params.id])

  const fetchCV = async () => {
    try {
      const response = await fetch(`/api/cv/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCv(data.cv)
        setCvData(JSON.parse(data.cv.jsonData))
      } else if (response.status === 404) {
        setError('CV not found')
      } else if (response.status === 401) {
        router.push('/auth/signin')
        return
      } else {
        setError('Failed to load CV')
      }
    } catch (error) {
      setError('Error loading CV')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const response = await fetch(`/api/cv/${params.id}/export?format=pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${cv?.title || 'CV'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const downloadDOCX = async () => {
    try {
      const response = await fetch(`/api/cv/${params.id}/export?format=docx`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${cv?.title || 'CV'}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading DOCX:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl text-gray-900">ATS CV Maker</span>
                  </div>
                  <span className="text-gray-400">by</span>
                  <a 
                    href="https://emrelutfi.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    emrelutfi.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading CV...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !cv || !cvData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl text-gray-900">ATS CV Maker</span>
                  </div>
                  <span className="text-gray-400">by</span>
                  <a 
                    href="https://emrelutfi.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    emrelutfi.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'CV not found'}
            </h1>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">ATS CV Maker</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{cv.title}</h1>
              <p className="text-gray-600">
                Created: {new Date(cv.createdAt).toLocaleDateString()} • 
                Updated: {new Date(cv.updatedAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Link href={`/cv/edit/${cv.id}`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
              </Link>
              <Button onClick={downloadPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={downloadDOCX}>
                <Download className="h-4 w-4 mr-2" />
                Download DOCX
              </Button>
            </div>
          </div>

          {/* ATS Score */}
          {cv.atsScore && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
                    <p className="text-sm text-gray-600">This CV&apos;s compatibility with ATS systems</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      cv.atsScore >= 80 ? 'text-green-600' : 
                      cv.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {cv.atsScore}/100
                    </div>
                    <Badge variant={
                      cv.atsScore >= 80 ? 'default' : 
                      cv.atsScore >= 60 ? 'secondary' : 'destructive'
                    }>
                      {cv.atsScore >= 80 ? 'Excellent' : 
                       cv.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
                <Progress value={cv.atsScore} className="w-full" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* CV Preview */}
        <Card>
          <CardContent className="p-8 bg-white">
          {/* Clean Header */}
          <div className="text-center border-b-2 border-blue-600 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {cvData.contactInfo.fullName}
            </h1>
            <h2 className="text-lg font-bold text-red-600 mb-4">
              Full Stack Developer
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              {[
                cvData.contactInfo.email,
                cvData.contactInfo.phone,
                cvData.contactInfo.address,
                cvData.contactInfo.linkedin,
                cvData.contactInfo.website
              ].filter(Boolean).map((item, index, array) => (
                <span key={index}>
                  {item}
                  {index < array.length - 1 && <span className="mx-3">•</span>}
                </span>
              ))}
            </div>
          </div>

            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
            </div>

            {/* Work Experience */}
            {cvData.workExperience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {cvData.workExperience.map((exp, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-700 font-medium">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-gray-700 font-medium">{edu.institution}</p>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <div>{edu.startDate} - {edu.endDate}</div>
                          {edu.gpa && <div className="text-green-600 font-medium">GPA: {edu.gpa}</div>}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <span key={index} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cvData.projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Projects
                </h2>
                <div className="space-y-3">
                  {cvData.projects.map((project, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <div className="text-sm text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {project.startDate && project.endDate 
                              ? `${project.startDate} - ${project.endDate}`
                              : project.startDate || project.endDate
                            }
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.url && (
                        <p className="text-blue-600 text-sm mt-1">{project.url}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cvData.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Certifications
                </h2>
                <div className="space-y-2">
                  {cvData.certifications.map((cert, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-gray-700 text-sm">{cert.issuer}</p>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <div>Issued: {cert.date}</div>
                          {cert.expiryDate && <div>Expires: {cert.expiryDate}</div>}
                        </div>
                      </div>
                      {cert.url && (
                        <p className="text-blue-600 text-sm">{cert.url}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
