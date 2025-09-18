export interface ContactInfo {
  fullName: string
  email: string
  phone: string
  address: string
  linkedin?: string
  website?: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  location?: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
  expiryDate?: string
}

export interface CVData {
  contactInfo: ContactInfo
  summary: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  certifications: Certification[]
}

export const defaultCVData: CVData = {
  contactInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
}


