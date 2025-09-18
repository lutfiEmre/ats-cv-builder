'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workExperienceSchema } from '@/lib/cv-validation'
import { WorkExperience } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { CustomDatePicker } from '@/components/ui/date-picker'

interface WorkExperienceStepProps {
  data: WorkExperience[]
  onChange: (data: WorkExperience[]) => void
}

export function WorkExperienceStep({ data, onChange }: WorkExperienceStepProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(data.length === 0)

  const form = useForm<WorkExperience>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: ''
    }
  })

  const addExperience = () => {
    setEditingIndex(null)
    form.reset({
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: ''
    })
    setShowForm(true)
  }

  const editExperience = (index: number) => {
    setEditingIndex(index)
    form.reset(data[index])
    setShowForm(true)
  }

  const saveExperience = (formData: WorkExperience) => {
    if (editingIndex !== null) {
      // Edit existing
      const newData = [...data]
      newData[editingIndex] = formData
      onChange(newData)
    } else {
      // Add new
      onChange([...data, { ...formData, id: Date.now().toString() }])
    }
    setShowForm(false)
    setEditingIndex(null)
  }

  const deleteExperience = (index: number) => {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600">
          Add your work history starting with your most recent position. Include key achievements and responsibilities.
        </p>
      </div>

      {/* Existing Experience List */}
      <div className="space-y-4">
        {data.map((experience, index) => (
          <Card key={experience.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{experience.position}</CardTitle>
                  <p className="text-gray-600">
                    {experience.company} {experience.location && `• ${experience.location}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => editExperience(index)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{experience.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>{editingIndex !== null ? 'Edit Experience' : 'Add Experience'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveExperience)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tech Corp Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, CA" {...field} />
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
                    name="current"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Currently working here</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!form.watch('current') && (
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
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
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="• Led development of web applications using React and Node.js&#10;• Improved system performance by 40% through optimization&#10;• Mentored 3 junior developers and conducted code reviews"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-3">
                  <Button type="submit">
                    {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
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
        <Button onClick={addExperience} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Work Experience
        </Button>
      )}

      {data.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No work experience added yet. Click the button above to get started.</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 ATS Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Use bullet points to list achievements and responsibilities</li>
          <li>• Include specific metrics and results where possible</li>
          <li>• Use action verbs (Led, Managed, Developed, Improved)</li>
          <li>• List experiences in reverse chronological order</li>
          <li>• Include relevant keywords from job descriptions</li>
        </ul>
      </div>
    </div>
  )
}
