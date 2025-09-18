'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

interface ATSResult {
  score: number
  issues: string[]
  suggestions: string[]
  sections: {
    contact: boolean
    summary: boolean
    experience: boolean
    education: boolean
    skills: boolean
  }
}

export default function UploadCVPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<ATSResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return // Still loading session
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file only.')
        return
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.')
        return
      }
      
      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/cv/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze CV')
      }

      const data = await response.json()
      setResult(data.analysis)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload & Analyze Your CV
          </h1>
          <p className="text-gray-600">
            Upload your existing CV to get an instant ATS compliance analysis and improvement suggestions.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Your CV</CardTitle>
            <CardDescription>
              Supported formats: PDF, DOCX (Max size: 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    {file ? file.name : 'Choose a file to upload'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF or DOCX up to 10MB'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" type="button" asChild>
                      <span>
                        <FileText className="h-4 w-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {file && !result && (
                <Button onClick={handleUpload} disabled={uploading} className="w-full">
                  {uploading ? 'Analyzing...' : 'Analyze CV'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* ATS Score */}
            <Card>
              <CardHeader>
                <CardTitle>ATS Compliance Score</CardTitle>
                <CardDescription>
                  How well your CV will perform with Applicant Tracking Systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </div>
                    <div className="text-lg text-gray-600">{getScoreLabel(result.score)}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={result.score >= 80 ? 'default' : result.score >= 60 ? 'secondary' : 'destructive'}>
                      {getScoreLabel(result.score)}
                    </Badge>
                  </div>
                </div>
                <Progress value={result.score} className="w-full" />
              </CardContent>
            </Card>

            {/* Section Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Section Analysis</CardTitle>
                <CardDescription>
                  Required sections detected in your CV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(result.sections).map(([section, found]) => (
                    <div key={section} className="flex items-center space-x-3">
                      {found ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`capitalize ${found ? 'text-green-700' : 'text-red-700'}`}>
                        {section}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issues */}
            {result.issues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Issues Found</span>
                  </CardTitle>
                  <CardDescription>
                    Problems that may prevent ATS systems from reading your CV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.issues.map((issue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Improvement Suggestions</span>
                  </CardTitle>
                  <CardDescription>
                    Recommendations to improve your CV&apos;s ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cv/create" className="flex-1">
                <Button className="w-full">
                  Create ATS-Optimized CV
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null)
                  setResult(null)
                  setError('')
                }}
                className="flex-1"
              >
                Analyze Another CV
              </Button>
            </div>
          </div>
        )}

        {/* Error state with helpful message */}
        {error && !result && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">Upload Failed</h3>
                <p className="text-red-600 mb-6">{error}</p>
                
                {error.includes('image-based') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Recommendation</h4>
                    <p className="text-blue-800 text-sm mb-4">
                      Your PDF appears to be a scanned document or image-based. For best ATS results, 
                      we recommend creating a new CV using our builder with proper text formatting.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/cv/create" className="flex-1">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New ATS-Optimized CV
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFile(null)
                      setResult(null)
                      setError('')
                    }}
                    className="flex-1"
                  >
                    Try Another File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
