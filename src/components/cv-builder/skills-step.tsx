'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'

interface SkillsStepProps {
  data: string[]
  onChange: (data: string[]) => void
}

const SUGGESTED_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML/CSS',
  'SQL', 'Git', 'AWS', 'Docker', 'MongoDB', 'Express.js',
  'Project Management', 'Leadership', 'Communication', 'Problem Solving',
  'Team Collaboration', 'Data Analysis', 'Agile/Scrum', 'REST APIs'
]

export function SkillsStep({ data, onChange }: SkillsStepProps) {
  const [currentSkill, setCurrentSkill] = useState('')

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !data.includes(trimmedSkill)) {
      onChange([...data, trimmedSkill])
    }
    setCurrentSkill('')
  }

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(currentSkill)
    }
  }

  const addSuggestedSkill = (skill: string) => {
    if (!data.includes(skill)) {
      onChange([...data, skill])
    }
  }

  const availableSuggestions = SUGGESTED_SKILLS.filter(skill => !data.includes(skill))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">
          Add your technical and soft skills. Include both hard skills (programming languages, tools) 
          and soft skills (leadership, communication).
        </p>
      </div>

      {/* Add Skill Input */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="skill-input">Add Skills</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              id="skill-input"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter"
              className="flex-1"
            />
            <Button 
              onClick={() => addSkill(currentSkill)}
              disabled={!currentSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Skills */}
        {data.length > 0 && (
          <div>
            <Label>Your Skills ({data.length})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.length < 3 && (
          <div className="text-sm text-red-600">
            Add at least 3 skills to continue.
          </div>
        )}

        {/* Suggested Skills */}
        {availableSuggestions.length > 0 && (
          <div>
            <Label>Suggested Skills (Click to Add)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableSuggestions.slice(0, 15).map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => addSuggestedSkill(skill)}
                >
                  {skill}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Skills Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Include both technical skills and soft skills</li>
          <li>• Use keywords that match the job description</li>
          <li>• List skills you can actually demonstrate</li>
          <li>• Group related skills (e.g., &quot;React, Vue.js, Angular&quot; for frameworks)</li>
          <li>• Include years of experience for key skills if relevant</li>
          <li>• Prioritize the most important skills first</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">✅ Skill Categories</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-green-800 mb-1">Technical Skills:</p>
            <p className="text-green-700">Programming languages, frameworks, tools, software</p>
          </div>
          <div>
            <p className="font-medium text-green-800 mb-1">Soft Skills:</p>
            <p className="text-green-700">Communication, leadership, teamwork, problem-solving</p>
          </div>
        </div>
      </div>
    </div>
  )
}


