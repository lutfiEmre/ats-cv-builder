'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, certificationSchema } from '@/lib/cv-validation'
import { Project, Certification } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, FolderOpen, Award, X } from 'lucide-react'

interface ProjectsStepProps {
  projects: Project[]
  certifications: Certification[]
  onProjectsChange: (data: Project[]) => void
  onCertificationsChange: (data: Certification[]) => void
}

export function ProjectsStep({ projects, certifications, onProjectsChange, onCertificationsChange }: ProjectsStepProps) {
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCertForm, setShowCertForm] = useState(false)
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null)
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null)
  const [currentTech, setCurrentTech] = useState('')

  const projectForm = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: '',
      title: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    }
  })

  const certForm = useForm<Certification>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      id: '',
      name: '',
      issuer: '',
      date: '',
      url: '',
      expiryDate: ''
    }
  })

  // Project functions
  const addProject = () => {
    setEditingProjectIndex(null)
    projectForm.reset({
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    })
    setShowProjectForm(true)
  }

  const editProject = (index: number) => {
    setEditingProjectIndex(index)
    projectForm.reset(projects[index])
    setShowProjectForm(true)
  }

  const saveProject = (formData: Project) => {
    if (editingProjectIndex !== null) {
      const newData = [...projects]
      newData[editingProjectIndex] = formData
      onProjectsChange(newData)
    } else {
      onProjectsChange([...projects, { ...formData, id: Date.now().toString() }])
    }
    setShowProjectForm(false)
    setEditingProjectIndex(null)
  }

  const deleteProject = (index: number) => {
    onProjectsChange(projects.filter((_, i) => i !== index))
  }

  // Certification functions
  const addCertification = () => {
    setEditingCertIndex(null)
    certForm.reset({
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      url: '',
      expiryDate: ''
    })
    setShowCertForm(true)
  }

  const editCertification = (index: number) => {
    setEditingCertIndex(index)
    certForm.reset(certifications[index])
    setShowCertForm(true)
  }

  const saveCertification = (formData: Certification) => {
    if (editingCertIndex !== null) {
      const newData = [...certifications]
      newData[editingCertIndex] = formData
      onCertificationsChange(newData)
    } else {
      onCertificationsChange([...certifications, { ...formData, id: Date.now().toString() }])
    }
    setShowCertForm(false)
    setEditingCertIndex(null)
  }

  const deleteCertification = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index))
  }

  // Technology management
  const addTechnology = () => {
    const tech = currentTech.trim()
    if (tech) {
      const currentTechs = projectForm.getValues('technologies')
      if (!currentTechs.includes(tech)) {
        projectForm.setValue('technologies', [...currentTechs, tech])
      }
      setCurrentTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    const currentTechs = projectForm.getValues('technologies')
    projectForm.setValue('technologies', currentTechs.filter(t => t !== tech))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects & Certifications</h2>
        <p className="text-gray-600">
          Add your notable projects and professional certifications. This section is optional but can help showcase your skills and achievements.
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {/* Existing Projects */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {project.url}
                        </a>
                      )}
                      {(project.startDate || project.endDate) && (
                        <p className="text-sm text-gray-500">
                          {project.startDate && project.endDate 
                            ? `${project.startDate} - ${project.endDate}`
                            : project.startDate || project.endDate
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editProject(index)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteProject(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3 whitespace-pre-line">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Form */}
          {showProjectForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5" />
                  <span>{editingProjectIndex !== null ? 'Edit Project' : 'Add Project'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...projectForm}>
                  <form onSubmit={projectForm.handleSubmit(saveProject)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={projectForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="E-commerce Website" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={projectForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/username/project" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={projectForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={projectForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={projectForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Built a full-stack e-commerce platform with user authentication, shopping cart, and payment integration. Implemented responsive design and optimized for performance."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Technologies */}
                    <div className="space-y-2">
                      <FormLabel>Technologies *</FormLabel>
                      <div className="flex space-x-2">
                        <Input
                          value={currentTech}
                          onChange={(e) => setCurrentTech(e.target.value)}
                          placeholder="Add technology"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                        />
                        <Button type="button" onClick={addTechnology}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projectForm.watch('technologies').map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(tech)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit">
                        {editingProjectIndex !== null ? 'Update Project' : 'Add Project'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowProjectForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {!showProjectForm && (
            <Button onClick={addProject} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          {/* Existing Certifications */}
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <Card key={cert.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      <p className="text-gray-600">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">
                        Issued: {cert.date}
                        {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                      </p>
                      {cert.url && (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editCertification(index)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteCertification(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Certification Form */}
          {showCertForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>{editingCertIndex !== null ? 'Edit Certification' : 'Add Certification'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...certForm}>
                  <form onSubmit={certForm.handleSubmit(saveCertification)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={certForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certification Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="AWS Certified Solutions Architect" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={certForm.control}
                        name="issuer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuing Organization *</FormLabel>
                            <FormControl>
                              <Input placeholder="Amazon Web Services" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={certForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Date *</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={certForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={certForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://credly.com/badges/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-3">
                      <Button type="submit">
                        {editingCertIndex !== null ? 'Update Certification' : 'Add Certification'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCertForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {!showCertForm && (
            <Button onClick={addCertification} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Projects & Certifications Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Include 2-4 of your best projects that demonstrate relevant skills</li>
          <li>• Focus on projects that align with your target job</li>
          <li>• Include links to live demos or GitHub repositories</li>
          <li>• List current and relevant certifications</li>
          <li>• Include expiry dates for certifications that expire</li>
        </ul>
      </div>
    </div>
  )
}


