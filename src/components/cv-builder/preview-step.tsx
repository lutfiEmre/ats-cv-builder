'use client'

import { CVData } from '@/types/cv'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar } from 'lucide-react'
import { checkATSCompliance } from '@/lib/ats-checker'
import { Progress } from '@/components/ui/progress'

interface PreviewStepProps {
  data: CVData
}

export function PreviewStep({ data }: PreviewStepProps) {
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
    
    text += `\nWORK EXPERIENCE\n`
    data.workExperience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`
      text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`
      text += `${exp.description}\n\n`
    })
    
    text += `\nEDUCATION\n`
    data.education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`
      text += `${edu.institution}\n`
      text += `${edu.startDate} - ${edu.endDate}\n`
      if (edu.description) text += `${edu.description}\n`
      text += '\n'
    })
    
    text += `\nSKILLS\n${data.skills.join(', ')}\n`
    
    if (data.projects.length > 0) {
      text += `\nPROJECTS\n`
      data.projects.forEach(project => {
        text += `${project.title}\n`
        text += `${project.description}\n`
        text += `Technologies: ${project.technologies.join(', ')}\n\n`
      })
    }
    
    if (data.certifications.length > 0) {
      text += `\nCERTIFICATIONS\n`
      data.certifications.forEach(cert => {
        text += `${cert.name} - ${cert.issuer}\n`
        text += `Issued: ${cert.date}\n\n`
      })
    }
    
    return text
  }

  const atsAnalysis = checkATSCompliance(generateCVText())

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Preview</h2>
        <p className="text-gray-600">
          Review your CV and check the ATS compatibility score before finalizing.
        </p>
      </div>

      {/* ATS Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
              <p className="text-sm text-gray-600">How well your CV will perform with ATS systems</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                atsAnalysis.score >= 80 ? 'text-green-600' : 
                atsAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {atsAnalysis.score}/100
              </div>
              <Badge variant={
                atsAnalysis.score >= 80 ? 'default' : 
                atsAnalysis.score >= 60 ? 'secondary' : 'destructive'
              }>
                {atsAnalysis.score >= 80 ? 'Excellent' : 
                 atsAnalysis.score >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </div>
          <Progress value={atsAnalysis.score} className="w-full" />
        </CardContent>
      </Card>

      {/* CV Preview */}
      <Card className="shadow-lg">
        <CardContent className="p-8 bg-white">
          {/* Clean Header */}
          <div className="text-center border-b-2 border-blue-600 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.contactInfo.fullName}
            </h1>
            <h2 className="text-lg font-bold text-red-600 mb-4">
              Full Stack Developer
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              {[
                data.contactInfo.email,
                data.contactInfo.phone,
                data.contactInfo.address,
                data.contactInfo.linkedin,
                data.contactInfo.website
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
            <p className="text-gray-700 leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Work Experience */}
          {data.workExperience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Work Experience
              </h2>
              <div className="space-y-6">
                {data.workExperience.map((exp, index) => (
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
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
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
          {data.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      {(project.startDate || project.endDate) && (
                        <div className="text-sm text-gray-600">
                          {project.startDate && project.endDate 
                            ? `${project.startDate} - ${project.endDate}`
                            : project.startDate || project.endDate
                          }
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <p className="text-blue-600 text-sm">{project.url}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Certifications
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-gray-700 text-sm">{cert.issuer}</p>
                        {cert.url && (
                          <p className="text-blue-600 text-sm">{cert.url}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        <div>Issued: {cert.date}</div>
                        {cert.expiryDate && <div>Expires: {cert.expiryDate}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Issues and Suggestions */}
      {(atsAnalysis.issues.length > 0 || atsAnalysis.suggestions.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {atsAnalysis.issues.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-red-700 mb-3">Issues to Fix</h3>
                <ul className="space-y-2">
                  {atsAnalysis.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {atsAnalysis.suggestions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-700 mb-3">Suggestions</h3>
                <ul className="space-y-2">
                  {atsAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-blue-600">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
