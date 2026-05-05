# ResumeMatch

An AI-powered resume analyzer that tells you how well you match a job description — and whether you should apply.

Upload your resume as a PDF, paste a job description, and get instant feedback on your fit score, matching skills, gaps, and actionable resume improvements.

## Tech Stack

- **Next.js** — full-stack React framework
- **TypeScript** — type-safe JavaScript
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — component library
- **Google Gemini API** — AI analysis
- **pdf-parse** — PDF text extraction
- **react-dropzone** — drag and drop file uploads

## Features

- Upload resume as PDF with drag and drop
- Paste any job description
- AI-powered fit score (0-100%)
- Clear verdict: Yes, Maybe, or No — should you apply?
- Matching and missing skills breakdown
- Key strengths analysis
- Actionable resume improvement suggestions
- Areas to address for the specific role
- Skeleton loading state while analysis runs
- Resume persists across multiple job analyses

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A Google Gemini API key from [aistudio.google.com](https://aistudio.google.com) — only needed for local development, not required to use the live demo

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kknguye/resume-analyzer.git
cd resume-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root of the project:

```
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
resume-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # API route — PDF parsing and Gemini call
│   ├── page.tsx              # Main page
│   └── layout.tsx            # Root layout
├── components/
│   ├── resume-form.tsx       # File upload and job description form
│   ├── analysis-results.tsx  # Results display and skeleton loader
│   └── ui/                   # shadcn/ui components
└── .env.local                # API keys (not committed)
```