import { z } from 'zod'

export const contactInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  linkedin: z.string().optional(),
  website: z.string().optional()
})

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  location: z.string().optional().or(z.literal(''))
})

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  gpa: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal(''))
})

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  url: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal(''))
})

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  url: z.string().optional().or(z.literal('')),
  expiryDate: z.string().optional().or(z.literal(''))
})

export const cvDataSchema = z.object({
  contactInfo: contactInfoSchema,
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(1000, 'Summary must not exceed 1000 characters'),
  workExperience: z.array(workExperienceSchema).min(0, 'Work experience is optional'),
  education: z.array(educationSchema).min(0, 'Education is optional'),
  skills: z.array(z.string()).min(0, 'Skills are optional'),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema)
})
