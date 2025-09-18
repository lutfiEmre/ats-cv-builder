import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { CVData } from '@/types/cv'

export function generateDOCX(data: CVData): Document {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header with name
          new Paragraph({
            children: [
              new TextRun({
                text: data.contactInfo.fullName,
                bold: true,
                size: 32,
                color: '1F2937',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Contact information
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  data.contactInfo.email,
                  data.contactInfo.phone,
                  data.contactInfo.address,
                  data.contactInfo.linkedin,
                  data.contactInfo.website
                ].filter(Boolean).join(' • '),
                size: 20,
                color: '6B7280',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            border: {
              bottom: {
                color: 'E5E5E5',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),

          // Professional Summary
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 24,
                color: '1F2937',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            border: {
              bottom: {
                color: 'E5E5E5',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 3,
              },
            },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.summary,
                size: 22,
                color: '374151',
              }),
            ],
            spacing: { after: 400 },
          }),

          // Work Experience
          new Paragraph({
            children: [
              new TextRun({
                text: 'WORK EXPERIENCE',
                bold: true,
                size: 24,
                color: '1F2937',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
            border: {
              bottom: {
                color: 'E5E5E5',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 3,
              },
            },
          }),

          // Experience items
          ...data.workExperience.flatMap((exp, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.position,
                  bold: true,
                  size: 24,
                  color: '1F2937',
                }),
              ],
              spacing: { before: index > 0 ? 300 : 100, after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.company}${exp.location ? ` • ${exp.location}` : ''}`,
                  size: 22,
                  color: '6B7280',
                }),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                  size: 20,
                  color: '9CA3AF',
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: 22,
                  color: '374151',
                }),
              ],
              spacing: { after: 200 },
            }),
          ]),

          // Education
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 24,
                color: '1F2937',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            border: {
              bottom: {
                color: 'E5E5E5',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 3,
              },
            },
          }),

          // Education items
          ...data.education.flatMap((edu, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree} in ${edu.field}`,
                  bold: true,
                  size: 24,
                  color: '1F2937',
                }),
              ],
              spacing: { before: index > 0 ? 250 : 100, after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.institution,
                  size: 22,
                  color: '6B7280',
                }),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.startDate} - ${edu.endDate}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`,
                  size: 20,
                  color: '9CA3AF',
                }),
              ],
              spacing: { after: edu.description ? 100 : 200 },
            }),
            ...(edu.description ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.description,
                    size: 22,
                    color: '374151',
                  }),
                ],
                spacing: { after: 200 },
              }),
            ] : []),
          ]),

          // Skills
          new Paragraph({
            children: [
              new TextRun({
                text: 'SKILLS',
                bold: true,
                size: 24,
                color: '1F2937',
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            border: {
              bottom: {
                color: 'E5E5E5',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 3,
              },
            },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.skills.join(' • '),
                size: 22,
                color: '374151',
              }),
            ],
            spacing: { after: 400 },
          }),

          // Projects (if any)
          ...(data.projects.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'PROJECTS',
                  bold: true,
                  size: 24,
                  color: '1F2937',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
              border: {
                bottom: {
                  color: 'E5E5E5',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 3,
                },
              },
            }),

            ...data.projects.flatMap((project, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.title,
                    bold: true,
                    size: 24,
                    color: '1F2937',
                  }),
                ],
                spacing: { before: index > 0 ? 250 : 100, after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.description,
                    size: 22,
                    color: '374151',
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Technologies: ${project.technologies.join(', ')}`,
                    size: 20,
                    color: '6B7280',
                  }),
                ],
                spacing: { after: project.url ? 50 : 200 },
              }),
              ...(project.url ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: project.url,
                      size: 20,
                      color: '2563EB',
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ] : []),
            ]),
          ] : []),

          // Certifications (if any)
          ...(data.certifications.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'CERTIFICATIONS',
                  bold: true,
                  size: 24,
                  color: '1F2937',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
              border: {
                bottom: {
                  color: 'E5E5E5',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 3,
                },
              },
            }),

            ...data.certifications.flatMap((cert, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cert.name,
                    bold: true,
                    size: 24,
                    color: '1F2937',
                  }),
                ],
                spacing: { before: index > 0 ? 200 : 100, after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${cert.issuer} • Issued: ${cert.date}${cert.expiryDate ? ` • Expires: ${cert.expiryDate}` : ''}`,
                    size: 20,
                    color: '6B7280',
                  }),
                ],
                spacing: { after: cert.url ? 50 : 150 },
              }),
              ...(cert.url ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cert.url,
                      size: 20,
                      color: '2563EB',
                    }),
                  ],
                  spacing: { after: 150 },
                }),
              ] : []),
            ]),
          ] : []),
        ],
      },
    ],
  })

  return doc
}


