'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Upload, FileText, Calendar, Edit } from 'lucide-react'

interface CV {
  id: string
  title: string
  atsScore: number | null
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      const response = await fetch('/api/cvs')
      if (response.ok) {
        const data = await response.json()
        setCvs(data.cvs)
      }
    } catch (error) {
      console.error('Error fetching CVs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ATS CV Maker Dashboard
          </h1>
          <p className="text-gray-600">
            Create and manage your ATS-optimized CVs.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/cv/create">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Create New CV</CardTitle>
                    <CardDescription>
                      Build a new ATS-optimized CV from scratch
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/cv/upload">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Upload & Check CV</CardTitle>
                    <CardDescription>
                      Upload your existing CV for ATS analysis
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Your CVs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your CVs</h2>
            {cvs.length > 0 && (
              <Button 
                onClick={() => {
                  if (status === 'authenticated') {
                    router.push('/cv/create')
                  } else {
                    router.push('/auth/signin')
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New CV
              </Button>
            )}
          </div>

          {cvs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No CVs yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first ATS-optimized CV or uploading an existing one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => {
                      if (status === 'authenticated') {
                        router.push('/cv/create')
                      } else {
                        router.push('/auth/signin')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New CV
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (status === 'authenticated') {
                        router.push('/cv/upload')
                      } else {
                        router.push('/auth/signin')
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cv.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>Updated {new Date(cv.updatedAt).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      {cv.atsScore && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {cv.atsScore}/100
                          </div>
                          <div className="text-xs text-gray-500">ATS Score</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Link href={`/cv/${cv.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/cv/edit/${cv.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}