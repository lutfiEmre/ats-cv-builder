import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { CVData } from '@/types/cv'

// Ultra compact styles based on your CV design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.2,
  },
  // Header - compact like your CV
  header: {
    textAlign: 'center',
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
    textAlign: 'center',
  },
  position: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#DC2626',
    textAlign: 'center',
  },
  contactLine: {
    textAlign: 'center',
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.2,
  },
  // Section styles - very compact
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    color: '#1F2937',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  // Text styles - very small
  summaryText: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.3,
  },
  // Experience styles - ultra compact
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  experienceLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  experienceRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 60,
  },
  jobTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 1,
  },
  company: {
    fontSize: 8,
    color: '#374151',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 7,
    color: '#6B7280',
  },
  description: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.2,
    marginTop: 2,
  },
  // Education styles - compact
  educationItem: {
    marginBottom: 8,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  educationLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  educationRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 60,
  },
  degree: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 1,
  },
  institution: {
    fontSize: 8,
    color: '#374151',
    fontWeight: 'bold',
  },
  gpaText: {
    fontSize: 7,
    color: '#059669',
    fontWeight: 'bold',
  },
  // Skills styles - very compact
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  skill: {
    backgroundColor: '#F3F4F6',
    padding: '1 4',
    borderRadius: 2,
    fontSize: 7,
    color: '#374151',
  },
  // Projects styles - compact
  projectItem: {
    marginBottom: 8,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  projectDescription: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.2,
    marginBottom: 3,
  },
  technologies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginBottom: 2,
  },
  technology: {
    backgroundColor: '#F3F4F6',
    padding: '1 3',
    borderRadius: 2,
    fontSize: 6,
    color: '#6B7280',
  },
  projectUrl: {
    fontSize: 7,
    color: '#2563EB',
  },
  // Certifications styles - compact
  certificationItem: {
    marginBottom: 6,
  },
  certificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  certificationLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  certificationRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 60,
  },
  certificationName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 1,
  },
  certificationIssuer: {
    fontSize: 8,
    color: '#374151',
  },
  certificationUrl: {
    fontSize: 7,
    color: '#2563EB',
    marginTop: 1,
  },
})

interface CVPDFProps {
  data: CVData
}

export const CVPDF: React.FC<CVPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Compact Header - like your CV */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.contactInfo.fullName}</Text>
        <Text style={styles.position}>Full Stack Developer</Text>
        <Text style={styles.contactLine}>
          {[
            data.contactInfo.email,
            data.contactInfo.phone,
            data.contactInfo.address,
            data.contactInfo.linkedin,
            data.contactInfo.website
          ].filter(Boolean).join(' • ')}
        </Text>
      </View>

      {/* Professional Summary - compact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.summaryText}>{data.summary}</Text>
      </View>

      {/* Work Experience - compact */}
      {data.workExperience && data.workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.workExperience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <View style={styles.experienceLeft}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.company}>
                    {exp.company}{exp.location && ` • ${exp.location}`}
                  </Text>
                </View>
                <View style={styles.experienceRight}>
                  <Text style={styles.dateText}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education - compact */}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.educationItem}>
              <View style={styles.educationHeader}>
                <View style={styles.educationLeft}>
                  <Text style={styles.degree}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={styles.institution}>{edu.institution}</Text>
                </View>
                <View style={styles.educationRight}>
                  <Text style={styles.dateText}>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                  {edu.gpa && (
                    <Text style={styles.gpaText}>GPA: {edu.gpa}</Text>
                  )}
                </View>
              </View>
              {edu.description && (
                <Text style={styles.description}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills - very compact */}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Projects - compact */}
      {data.projects && data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                {(project.startDate || project.endDate) && (
                  <Text style={styles.dateText}>
                    {project.startDate && project.endDate 
                      ? `${project.startDate} - ${project.endDate}`
                      : project.startDate || project.endDate
                    }
                  </Text>
                )}
              </View>
              <Text style={styles.projectDescription}>{project.description}</Text>
              <View style={styles.technologies}>
                {project.technologies.map((tech, techIndex) => (
                  <Text key={techIndex} style={styles.technology}>
                    {tech}
                  </Text>
                ))}
              </View>
              {project.url && (
                <Text style={styles.projectUrl}>{project.url}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Certifications - compact */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <View style={styles.certificationHeader}>
                <View style={styles.certificationLeft}>
                  <Text style={styles.certificationName}>{cert.name}</Text>
                  <Text style={styles.certificationIssuer}>{cert.issuer}</Text>
                  {cert.url && (
                    <Text style={styles.certificationUrl}>{cert.url}</Text>
                  )}
                </View>
                <View style={styles.certificationRight}>
                  <Text style={styles.dateText}>Issued: {cert.date}</Text>
                  {cert.expiryDate && (
                    <Text style={styles.dateText}>Expires: {cert.expiryDate}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
)