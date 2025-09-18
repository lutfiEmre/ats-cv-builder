export interface ATSCheckResult {
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

export function checkATSCompliance(text: string): ATSCheckResult {
  const result: ATSCheckResult = {
    score: 0,
    issues: [],
    suggestions: [],
    sections: {
      contact: false,
      summary: false,
      experience: false,
      education: false,
      skills: false
    }
  }

  const lowerText = text.toLowerCase()
  let score = 0

  // Enhanced section detection (25 points total - 5 per section)
  const sectionChecks = [
    { 
      key: 'contact' as const, 
      patterns: ['contact', 'email', 'phone', 'address', '@', '+', 'linkedin', 'github', 'portfolio'], 
      weight: 5 
    },
    { 
      key: 'summary' as const, 
      patterns: ['summary', 'profile', 'objective', 'about', 'overview', 'professional'], 
      weight: 5 
    },
    { 
      key: 'experience' as const, 
      patterns: ['experience', 'employment', 'work', 'career', 'position', 'role', 'job', 'developer', 'engineer'], 
      weight: 5 
    },
    { 
      key: 'education' as const, 
      patterns: ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'academic'], 
      weight: 5 
    },
    { 
      key: 'skills' as const, 
      patterns: ['skills', 'technologies', 'tools', 'languages', 'frameworks', 'competencies', 'abilities'], 
      weight: 5 
    }
  ]

  sectionChecks.forEach(({ key, patterns, weight }) => {
    const found = patterns.some(pattern => lowerText.includes(pattern))
    result.sections[key] = found
    if (found) {
      score += weight
    } else {
      result.issues.push(`Missing ${key.charAt(0).toUpperCase() + key.slice(1)} section`)
      result.suggestions.push(`Add a clear ${key.charAt(0).toUpperCase() + key.slice(1)} section with appropriate heading`)
    }
  })

  // Technical skills detection (15 points)
  const techSkills = [
    'javascript', 'typescript', 'react', 'nextjs', 'next.js', 'nodejs', 'node.js',
    'python', 'java', 'html', 'css', 'tailwind', 'bootstrap', 'git', 'github',
    'aws', 'docker', 'kubernetes', 'mongodb', 'sql', 'mysql', 'postgresql',
    'angular', 'vue', 'express', 'api', 'rest', 'graphql', 'firebase', 'redux'
  ]
  const foundTechSkills = techSkills.filter(skill => lowerText.includes(skill))
  if (foundTechSkills.length >= 5) {
    score += 15
  } else if (foundTechSkills.length >= 3) {
    score += 10
  } else if (foundTechSkills.length >= 1) {
    score += 5
  } else {
    result.suggestions.push('Include more technical skills and technologies')
  }

  // Professional keywords (10 points)
  const professionalKeywords = [
    'developed', 'built', 'created', 'designed', 'implemented', 'managed', 'led',
    'improved', 'optimized', 'maintained', 'collaborated', 'delivered', 'achieved'
  ]
  const foundKeywords = professionalKeywords.filter(keyword => lowerText.includes(keyword))
  if (foundKeywords.length >= 5) {
    score += 10
  } else if (foundKeywords.length >= 3) {
    score += 7
  } else {
    result.suggestions.push('Use more action verbs and professional keywords')
  }

  // Contact information completeness (10 points)
  const hasEmail = /@/.test(text)
  const hasPhone = /[\+\d\-\(\)\s]{10,}/.test(text)
  const hasLinkedIn = /linkedin/i.test(text)
  const hasGitHub = /github/i.test(text)
  
  let contactScore = 0
  if (hasEmail) contactScore += 3
  if (hasPhone) contactScore += 3
  if (hasLinkedIn) contactScore += 2
  if (hasGitHub) contactScore += 2
  
  score += contactScore
  
  if (!hasEmail) result.suggestions.push('Add email address')
  if (!hasPhone) result.suggestions.push('Add phone number')
  if (!hasLinkedIn) result.suggestions.push('Add LinkedIn profile')

  // Experience details (15 points)
  const hasCompanyNames = /\b[A-Z][a-zA-Z\s]+(?:Inc|LLC|Corp|Ltd|Studio|Co|Company|Technologies|Tech|Systems)\b/g.test(text)
  const hasDates = /\d{4}|\d{1,2}\/\d{4}|20\d{2}|19\d{2}/g.test(text)
  const hasJobTitles = /(developer|engineer|designer|manager|lead|senior|junior|analyst|specialist|coordinator)/i.test(text)
  const hasDescriptions = text.length > 800 // Detailed descriptions
  
  if (hasCompanyNames) score += 4
  if (hasDates) score += 4
  if (hasJobTitles) score += 4
  if (hasDescriptions) score += 3
  
  if (!hasCompanyNames) result.suggestions.push('Include company names in experience section')
  if (!hasDates) result.suggestions.push('Add employment dates')
  if (!hasJobTitles) result.suggestions.push('Include specific job titles')

  // Education details (10 points)
  const hasUniversity = /(university|college|institute|school)/i.test(text)
  const hasDegree = /(bachelor|master|phd|degree|diploma|certificate)/i.test(text)
  const hasFieldOfStudy = /(engineering|science|computer|software|business|arts|design)/i.test(text)
  
  if (hasUniversity) score += 4
  if (hasDegree) score += 3
  if (hasFieldOfStudy) score += 3
  
  if (!hasUniversity) result.suggestions.push('Include educational institution')
  if (!hasDegree) result.suggestions.push('Specify degree type')

  // Content quality (10 points)
  const wordCount = text.trim().split(/\s+/).length
  if (wordCount >= 300) {
    score += 10
  } else if (wordCount >= 200) {
    score += 7
  } else if (wordCount >= 100) {
    score += 4
  } else {
    result.suggestions.push('Add more detailed content to your CV')
  }

  // ATS-friendly formatting bonus (5 points)
  const hasProperSections = /^[A-Z\s]{3,}$/gm.test(text)
  const hasMinimalSpecialChars = (text.match(/[^\w\s\-.,;:()\[\]@+\/]/g) || []).length < 10
  
  if (hasProperSections) score += 3
  if (hasMinimalSpecialChars) score += 2
  
  if (!hasProperSections) result.suggestions.push('Use clear section headers (EXPERIENCE, EDUCATION, etc.)')
  if (!hasMinimalSpecialChars) {
    result.issues.push('Too many special characters detected')
    result.suggestions.push('Remove unnecessary special characters and symbols')
  }

  // Quantifiable achievements bonus (5 points)
  const hasNumbers = /\d+[%+]|\d+\s*(years?|months?|projects?|people|users|clients|revenue|growth)/i.test(text)
  if (hasNumbers) {
    score += 5
  } else {
    result.suggestions.push('Include quantifiable achievements (numbers, percentages, metrics)')
  }

  // Ensure score is between 0 and 100
  result.score = Math.max(0, Math.min(100, score))

  // Add specific improvement suggestions based on score
  if (result.score < 60) {
    result.suggestions.push('Your CV needs significant improvements for ATS compatibility')
    result.suggestions.push('Consider using our CV builder to create an ATS-optimized version')
  } else if (result.score < 80) {
    result.suggestions.push('Good foundation, but some improvements needed for optimal ATS performance')
  } else if (result.score >= 90) {
    result.suggestions.push('Excellent ATS compatibility! Your CV should perform well with most ATS systems')
  }

  return result
}

export function extractContactInfo(text: string) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi

  return {
    emails: text.match(emailRegex) || [],
    phones: text.match(phoneRegex) || [],
    linkedin: text.match(linkedinRegex) || []
  }
}
