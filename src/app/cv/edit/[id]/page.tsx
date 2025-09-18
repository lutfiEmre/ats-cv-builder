'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Save, Eye, FileText } from 'lucide-react'
import { CVData, defaultCVData } from '@/types/cv'
import { ContactInfoStep } from '@/components/cv-builder/contact-info-step'
import { SummaryStep } from '@/components/cv-builder/summary-step'
import { WorkExperienceStep } from '@/components/cv-builder/work-experience-step'
import { EducationStep } from '@/components/cv-builder/education-step'
import { SkillsStep } from '@/components/cv-builder/skills-step'
import { ProjectsStep } from '@/components/cv-builder/projects-step'
import { PreviewStep } from '@/components/cv-builder/preview-step'

const STEPS = [
  { id: 1, title: 'Contact Info', description: 'Basic information and contact details' },
  { id: 2, title: 'Summary', description: 'Professional summary or objective' },
  { id: 3, title: 'Experience', description: 'Work history and achievements' },
  { id: 4, title: 'Education', description: 'Educational background' },
  { id: 5, title: 'Skills', description: 'Technical and soft skills' },
  { id: 6, title: 'Projects', description: 'Projects and certifications (optional)' },
  { id: 7, title: 'Preview', description: 'Review and finalize your CV' }
]

export default function EditCVPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cvData, setCvData] = useState<CVData>(defaultCVData)
  const [saving, setSaving] = useState(false)
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
        setCvData(JSON.parse(data.cv.jsonData))
      } else if (response.status === 401) {
        router.push('/auth/signin')
        return
      } else {
        setError('CV not found')
      }
    } catch (error) {
      setError('Error loading CV')
    } finally {
      setLoading(false)
    }
  }

  const updateCVData = (updates: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveCV = async (publish = false) => {
    // Basic validation before sending
    if (!cvData.contactInfo.fullName || !cvData.contactInfo.email || !cvData.contactInfo.phone || !cvData.contactInfo.address) {
      alert('Please fill in all required contact information (Name, Email, Phone, Address)')
      return
    }

    if (!cvData.summary || cvData.summary.length < 10) {
      alert('Please add a professional summary (minimum 10 characters)')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/cv/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${cvData.contactInfo.fullName}'s CV`,
          data: cvData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (publish) {
          router.push(`/cv/${params.id}`)
        } else {
          alert('CV updated successfully!')
        }
      } else {
        const errorData = await response.json()
        console.error('Save error:', errorData)
        alert(`Failed to update CV: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert('Error updating CV. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactInfoStep data={cvData.contactInfo} onChange={(contactInfo) => updateCVData({ contactInfo })} />
      case 2:
        return <SummaryStep data={cvData.summary} onChange={(summary) => updateCVData({ summary })} />
      case 3:
        return <WorkExperienceStep data={cvData.workExperience} onChange={(workExperience) => updateCVData({ workExperience })} />
      case 4:
        return <EducationStep data={cvData.education} onChange={(education) => updateCVData({ education })} />
      case 5:
        return <SkillsStep data={cvData.skills} onChange={(skills) => updateCVData({ skills })} />
      case 6:
        return <ProjectsStep 
          projects={cvData.projects} 
          certifications={cvData.certifications}
          onProjectsChange={(projects) => updateCVData({ projects })}
          onCertificationsChange={(certifications) => updateCVData({ certifications })}
        />
      case 7:
        return <PreviewStep data={cvData} />
      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return cvData.contactInfo.fullName && cvData.contactInfo.email && cvData.contactInfo.phone && cvData.contactInfo.address
      case 2:
        return cvData.summary.length >= 10
      case 3:
        return true // Work experience is optional now
      case 4:
        return true // Education is optional now
      case 5:
        return true // Skills are optional now
      case 6:
        return true // Projects and certifications are optional
      case 7:
        return true
      default:
        return false
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

  if (error) {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
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

  const progressPercentage = (currentStep / STEPS.length) * 100

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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Your CV</h1>
              <p className="text-gray-600">Update your ATS-optimized CV</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep} of {STEPS.length}</div>
              <div className="text-lg font-semibold text-gray-900">{STEPS[currentStep - 1].title}</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="w-full mb-2" />
          <p className="text-sm text-gray-600">{STEPS[currentStep - 1].description}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === step.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : currentStep > step.id
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === step.id
                            ? 'bg-blue-600 text-white'
                            : currentStep > step.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {step.id}
                      </div>
                      <span className={`font-medium ${
                        currentStep === step.id ? 'text-blue-900' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Test Button */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/cv/test', { method: 'POST' })
                        if (response.ok) {
                          const result = await response.json()
                          router.push(`/cv/${result.id}`)
                        } else if (response.status === 401) {
                          alert('Please sign in to create a test CV')
                          router.push('/auth/signin')
                        } else {
                          const error = await response.json()
                          alert(`Failed to create test CV: ${error.error || 'Unknown error'}`)
                        }
                      } catch (error) {
                        alert('Error creating test CV')
                        console.error('Test CV creation error:', error)
                      }
                    }}
                  >
                    🧪 Create Test CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {renderStep()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => saveCV(false)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Update CV'}
                </Button>

                {currentStep === STEPS.length ? (
                  <Button
                    onClick={() => saveCV(true)}
                    disabled={!isStepValid() || saving}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Save & View CV
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
