'use client'

import { useState, useEffect, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface SummaryStepProps {
  data: string
  onChange: (data: string) => void
}

export function SummaryStep({ data, onChange }: SummaryStepProps) {
  const [summary, setSummary] = useState(data)

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setSummary(value)
    onChange(value)
  }

  const characterCount = summary.length
  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
        <p className="text-gray-600">
          Write a compelling summary that highlights your key qualifications, experience, and career objectives. 
          This should be 2-4 sentences that grab the employer&apos;s attention.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="summary">Professional Summary *</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={handleSummaryChange}
            placeholder="Experienced software engineer with 5+ years in full-stack development. Proven track record of building scalable web applications using React, Node.js, and cloud technologies. Passionate about creating efficient solutions and mentoring junior developers."
            className="min-h-[120px] mt-2"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{wordCount} words</span>
            <span className={characterCount < 50 ? 'text-red-500' : characterCount > 500 ? 'text-yellow-500' : 'text-green-600'}>
              {characterCount}/500 characters
            </span>
          </div>
        </div>

        {characterCount < 50 && (
          <div className="text-sm text-red-600">
            Summary should be at least 50 characters long.
          </div>
        )}

        {characterCount > 500 && (
          <div className="text-sm text-yellow-600">
            Summary should not exceed 500 characters for optimal ATS parsing.
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Writing Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Start with your job title or area of expertise</li>
          <li>• Include years of experience and key skills</li>
          <li>• Mention 1-2 major achievements or specializations</li>
          <li>• Use keywords relevant to your target job</li>
          <li>• Keep it concise but impactful (50-500 characters)</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">✅ Good Example</h3>
        <p className="text-green-800 text-sm italic">
          &quot;Results-driven Marketing Manager with 7+ years of experience in digital marketing and brand management. 
          Led campaigns that increased revenue by 40% and managed teams of up to 12 people. Expert in SEO, 
          content strategy, and data analytics.&quot;
        </p>
      </div>
    </div>
  )
}
