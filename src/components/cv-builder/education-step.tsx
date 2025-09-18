'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema } from '@/lib/cv-validation'
import { Education } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { CustomDatePicker } from '@/components/ui/date-picker'

interface EducationStepProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationStep({ data, onChange }: EducationStepProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(data.length === 0)

  const form = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      id: '',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }
  })

  const addEducation = () => {
    setEditingIndex(null)
    form.reset({
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    })
    setShowForm(true)
  }

  const editEducation = (index: number) => {
    setEditingIndex(index)
    form.reset(data[index])
    setShowForm(true)
  }

  const saveEducation = (formData: Education) => {
    if (editingIndex !== null) {
      const newData = [...data]
      newData[editingIndex] = formData
      onChange(newData)
    } else {
      onChange([...data, { ...formData, id: Date.now().toString() }])
    }
    setShowForm(false)
    setEditingIndex(null)
  }

  const deleteEducation = (index: number) => {
    const newData = data.filter((_, i) => i !== index)
    onChange(newData)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingIndex(null)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">
          Add your educational background, including degrees, certifications, and relevant coursework.
        </p>
      </div>

      {/* Existing Education List */}
      <div className="space-y-4">
        {data.map((education, index) => (
          <Card key={education.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{education.degree} in {education.field}</CardTitle>
                  <p className="text-gray-600">{education.institution}</p>
                  <p className="text-sm text-gray-500">
                    {education.startDate} - {education.endDate}
                    {education.gpa && ` • GPA: ${education.gpa}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => editEducation(index)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteEducation(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {education.description && (
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{education.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>{editingIndex !== null ? 'Edit Education' : 'Add Education'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveEducation)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution *</FormLabel>
                        <FormControl>
                          <Input placeholder="University of California" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree *</FormLabel>
                        <FormControl>
                          <Input placeholder="Bachelor of Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study *</FormLabel>
                        <FormControl>
                          <Input placeholder="Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="3.8/4.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <CustomDatePicker
                            selected={field.value ? new Date(field.value + '-01') : null}
                            onChange={(date) => {
                              const formattedDate = date ? 
                                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : ''
                              field.onChange(formattedDate)
                            }}
                            showMonthYearPicker
                            placeholder="Select start date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <CustomDatePicker
                            selected={field.value ? new Date(field.value + '-01') : null}
                            onChange={(date) => {
                              const formattedDate = date ? 
                                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : ''
                              field.onChange(formattedDate)
                            }}
                            showMonthYearPicker
                            placeholder="Select end date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Relevant coursework, honors, activities, etc.&#10;• Dean's List (Fall 2020, Spring 2021)&#10;• Relevant Coursework: Data Structures, Algorithms, Software Engineering&#10;• President of Computer Science Club"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-3">
                  <Button type="submit">
                    {editingIndex !== null ? 'Update Education' : 'Add Education'}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {!showForm && (
        <Button onClick={addEducation} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      )}

      {data.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No education added yet. Click the button above to get started.</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Education Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• List education in reverse chronological order (most recent first)</li>
          <li>• Include GPA only if it&apos;s 3.5 or higher</li>
          <li>• Mention relevant coursework, honors, or activities</li>
          <li>• For recent graduates, education can come before experience</li>
          <li>• Include certifications and professional development</li>
        </ul>
      </div>
    </div>
  )
}
