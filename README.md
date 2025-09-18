# ATS CV Builder

A modern, user-friendly CV builder that creates ATS-optimized resumes with real-time compatibility scoring.

## Features

- **ATS Optimization**: Real-time scoring and suggestions for better ATS compatibility
- **User Authentication**: Secure login system with NextAuth.js
- **Multiple Export Formats**: Download as PDF or DOCX
- **Responsive Design**: Works on desktop and mobile devices
- **Step-by-Step Builder**: Guided CV creation process
- **Template Preview**: Live preview of your CV as you build it

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: NextAuth.js
- **PDF Generation**: @react-pdf/renderer
- **DOCX Generation**: docx library

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/ats-cv-builder.git
cd ats-cv-builder
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your NextAuth secret and database URL.

4. Set up the database
```bash
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Sign up** or **Sign in** to your account
2. **Create a new CV** using the step-by-step builder
3. **Fill in your information** across different sections
4. **Preview** your CV in real-time
5. **Check ATS score** and get optimization suggestions
6. **Export** as PDF or DOCX format

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
├── types/              # TypeScript type definitions
└── prisma/             # Database schema and migrations
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

[Add screenshots of your application here]

---

Built with ❤️ using Next.js and TypeScript