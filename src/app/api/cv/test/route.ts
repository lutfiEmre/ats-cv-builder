import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkATSCompliance } from '@/lib/ats-checker'

export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    // Test CV data - EmreLutfi Portfolio
    const testCVData = {
      contactInfo: {
        fullName: "EmreLutfi",
        email: "mail@emrelutfi.com",
        phone: "0555 555 55 55", // Placeholder phone number
        address: "Turkey",
        linkedin: "github.com/lutfiEmre",
        website: "emrelutfi.com"
      },
      summary: "Software engineer with 5+ years of self-taught experience in building scalable web applications and modern front-end solutions. Proficient in React, Next.js, TypeScript, and TailwindCSS, with a strong focus on creating user-centered designs and robust front-end architectures. Experienced in delivering diverse projects, from e-commerce apps and real estate platforms to Web3 solutions and prototypes. Passionate about continuous learning and innovation in software development.",
      workExperience: [
        {
          id: "1",
          company: "CodeXart Studio",
          position: "Full Stack Developer",
          startDate: "2025-05",
          endDate: "2025-08",
          current: false,
          description: "• Developed responsive front-end components using Next.js, React.js, TypeScript\n• Designed and implemented UI features focused on performance and user experience\n• Collaborated remotely on multiple freelance projects, ensuring timely delivery",
          location: "Remote, Mersin"
        },
        {
          id: "2",
          company: "Activate Earth",
          position: "Software Development Lead",
          startDate: "2024-09",
          endDate: "2025-04",
          current: false,
          description: "• Developed Activ8Earth, an interactive crypto coin platform using Next.js, React, TypeScript\n• Designed and delivered the landing page with pixel-perfect precision\n• Integrated APIs with AWS, managed authentication via Cognito\n• Implemented state management with Wagmi, optimized Web3 interactions\n• Built Web3-integrated features with Next.js, Ethers.js, RainbowKit\n• Applied TailwindCSS for responsive and scalable UI development",
          location: "Remote"
        },
        {
          id: "3",
          company: "TurkStudentCo",
          position: "Front-End Lead (Volunteer)",
          startDate: "2024-09",
          endDate: "2025-02",
          current: false,
          description: "• Led the front-end team to develop the student platform using React.js, Next.js, TypeScript, TailwindCSS\n• Mentored junior developers and maintained code quality standards\n• Collaborated cross-functionally to improve design-to-code workflow",
          location: "Hybrid, Istanbul"
        },
        {
          id: "4",
          company: "ASSA Teknoloji",
          position: "Front-End Developer",
          startDate: "2024-04",
          endDate: "2024-09",
          current: false,
          description: "• Developed responsive websites and infrastructures using React.js, TypeScript, TailwindCSS\n• Created user-friendly, fast, and maintainable web applications\n• Improved performance and code quality by applying modern front-end practices",
          location: "Remote, Istanbul"
        },
        {
          id: "5",
          company: "User Metrics",
          position: "Software Developer (Freelance)",
          startDate: "2024-01",
          endDate: "2024-04",
          current: false,
          description: "• Built front-end features with Next.js, TypeScript, TailwindCSS\n• Applied \"Pixel-to-Perfect\" T3 Stack coding approach for UI/UX accuracy\n• Delivered high-quality interfaces aligned with design requirements",
          location: "Remote, Mersin"
        },
        {
          id: "6",
          company: "inowhat",
          position: "UI & UX Designer (Part-time)",
          startDate: "2023-03",
          endDate: "2023-07",
          current: false,
          description: "• Designed animated and interactive websites using Figma\n• Delivered customer-oriented designs, incorporating feedback quickly\n• Improved client satisfaction by ensuring high-quality design implementation",
          location: "Remote, Istanbul"
        },
        {
          id: "7",
          company: "Datafex",
          position: "Front-End Developer / System Administrator",
          startDate: "2021-01",
          endDate: "2024-01",
          current: false,
          description: "• Developed and maintained applications using React.js, TailwindCSS\n• Gained experience in DevOps, system administration, and network management\n• Improved system reliability with data security and backup strategies\n• Actively participated in client relationship management and business processes",
          location: "Full-time"
        }
      ],
      education: [
        {
          id: "1",
          institution: "Toros University",
          degree: "Bachelor of Science",
          field: "Software Engineering",
          startDate: "2022-09",
          endDate: "2026-06",
          description: "Currently pursuing Software Engineering degree"
        },
        {
          id: "2",
          institution: "Turkcell Geleceği Yazanlar",
          degree: "Certificate",
          field: "Javascript.js & React.js & CSS",
          startDate: "2022-01",
          endDate: "2022-12",
          description: "Completed comprehensive web development program"
        },
        {
          id: "3",
          institution: "California Institute of the Arts",
          degree: "Certificate",
          field: "Visual Elements of User Interface Design",
          startDate: "2023-01",
          endDate: "2023-12",
          description: "Specialized in UI/UX design principles and visual design"
        }
      ],
      skills: [
        "React.js", "Next.js", "TypeScript", "TailwindCSS", "Web3", "RainbowKit",
        "Wagmi", "Ethers.js", "Figma", "Pixel-Perfect Design", "Responsive Design",
        "Three.js", "Canvas", "REST APIs", "Redux", "Zustand", "Git", "Node.js",
        "Express.js", "Firebase", "React Native", "NativeWind", "Vite", "GSAP",
        "AWS", "Cognito", "DevOps", "System Administration"
      ],
      projects: [
        {
          id: "1",
          title: "Personal Portfolio",
          description: "Built with Next.js, React, TypeScript, Three.js, and GSAP, showcasing 3D animations and interactive UI design.",
          technologies: ["Next.js", "React", "TypeScript", "Three.js", "GSAP"],
          url: "https://emrelutfi.com"
        },
        {
          id: "2",
          title: "NFT Marketplace",
          description: "An NFT marketplace application built using Next.js, TypeScript, and TailwindCSS, enabling users to browse, trade, and collect NFTs.",
          technologies: ["Next.js", "TypeScript", "TailwindCSS"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "3",
          title: "Dental Clinic Website",
          description: "A responsive landing page for a dental service platform, designed with Next.js, React, TypeScript, TailwindCSS, and Framer Motion for smooth animations.",
          technologies: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "4",
          title: "Smartwatch Store",
          description: "An e-commerce platform for smartwatches, developed with Next.js, React, and TypeScript, featuring product showcase and modern UI design.",
          technologies: ["Next.js", "React", "TypeScript"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "5",
          title: "Rick and Morty API App",
          description: "An interactive app built with Next.js, React, TypeScript, and TailwindCSS, fetching and displaying character data from the Rick and Morty API.",
          technologies: ["Next.js", "React", "TypeScript", "TailwindCSS"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "6",
          title: "Kanban Todo List",
          description: "An advanced task management app with drag-and-drop functionality, built using Next.js, TypeScript, and TailwindCSS.",
          technologies: ["Next.js", "TypeScript", "TailwindCSS"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "7",
          title: "WhisperJar",
          description: "A feedback platform where employees can send anonymous or named messages to their manager, built with Next.js 15, TypeScript, TailwindCSS, and Redis.",
          technologies: ["Next.js 15", "TypeScript", "TailwindCSS", "Redis"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "8",
          title: "Activ8e",
          description: "A Web3-based crypto engagement platform developed with Next.js, React, TypeScript, and TailwindCSS, featuring AWS integration and authentication.",
          technologies: ["Next.js", "React", "TypeScript", "TailwindCSS", "AWS"],
          url: "https://github.com/lutfiEmre"
        },
        {
          id: "9",
          title: "CryptoHub",
          description: "A cryptocurrency dashboard built with Next.js, React, TypeScript, and TailwindCSS for tracking tokens, exchanges, and market data.",
          technologies: ["Next.js", "React", "TypeScript", "TailwindCSS"],
          url: "https://github.com/lutfiEmre"
        }
      ],
      certifications: [
        {
          id: "1",
          name: "Javascript.js & React.js & CSS",
          issuer: "Turkcell Geleceği Yazanlar",
          date: "2022-12"
        },
        {
          id: "2",
          name: "Visual Elements of User Interface Design",
          issuer: "California Institute of the Arts",
          date: "2023-12"
        }
      ]
    }

    // Generate CV text for ATS analysis
    const generateCVText = () => {
      let text = `CONTACT INFORMATION\n`
      text += `${testCVData.contactInfo.fullName}\n`
      text += `${testCVData.contactInfo.email}\n`
      text += `${testCVData.contactInfo.phone}\n`
      text += `${testCVData.contactInfo.address}\n`
      text += `${testCVData.contactInfo.linkedin}\n`
      text += `${testCVData.contactInfo.website}\n`
      
      text += `\nSUMMARY\n${testCVData.summary}\n`
      
      text += `\nWORK EXPERIENCE\n`
      testCVData.workExperience.forEach((exp) => {
        text += `${exp.position} at ${exp.company}\n`
        text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`
        text += `${exp.description}\n\n`
      })
      
      text += `\nEDUCATION\n`
      testCVData.education.forEach((edu) => {
        text += `${edu.degree} in ${edu.field}\n`
        text += `${edu.institution}\n`
        text += `${edu.startDate} - ${edu.endDate}\n`
        if (edu.description) text += `${edu.description}\n`
        text += '\n'
      })
      
      text += `\nSKILLS\n${testCVData.skills.join(', ')}\n`
      
      text += `\nPROJECTS\n`
      testCVData.projects.forEach((project) => {
        text += `${project.title}\n`
        text += `${project.description}\n`
        text += `Technologies: ${project.technologies.join(', ')}\n\n`
      })
      
      text += `\nCERTIFICATIONS\n`
      testCVData.certifications.forEach((cert) => {
        text += `${cert.name} - ${cert.issuer}\n`
        text += `Issued: ${cert.date}\n\n`
      })
      
      return text
    }

    // Calculate ATS score
    const atsAnalysis = checkATSCompliance(generateCVText())

    // Create test CV for authenticated user
    const cv = await prisma.cV.create({
      data: {
        userId: session.user!.id,
        title: "Test CV - EmreLutfi Portfolio",
        jsonData: JSON.stringify(testCVData),
        atsScore: atsAnalysis.score
      }
    })

    return NextResponse.json({
      id: cv.id,
      title: cv.title,
      atsScore: cv.atsScore,
      message: 'Test CV created successfully!'
    })
  } catch (error) {
    console.error('Error creating test CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


