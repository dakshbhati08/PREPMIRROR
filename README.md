# PrepMirror

Practice interviews without the fear.

PrepMirror is an AI-powered mock interview platform that reads your resume and portfolio, asks personalized questions, and gives you actionable feedback — all in a calm, supportive space.

## Features

- **Resume-aware questions** — Upload your resume and links so the AI interviewer tailors questions to your experience.
- **Voice-based practice** — Answer questions by voice, just like a real interview, but at your own pace.
- **Readiness report** — Get a score across skills with quotes pulled from your own answers, communication analysis (speaking pace, filler words, answer structure), and a transcript replay.
- **Learning roadmap** — A prioritized week-by-week plan with free resources to close the gaps.
- **Dashboard** — Review past interview sessions and track your progress over time.
- **Private by design** — Audio is deleted after transcription. No signup required.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server and build tool
- **Tailwind CSS** — styling
- **Lucide React** — icons
- **Recharts** — data visualization (skill radar charts, session trends)
- **Supabase** — database and backend

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable UI components (Navbar, Footer, Waveform, etc.)
├── config.ts          # API endpoint configuration
├── hooks/             # Custom React hooks (useAsync, useRecorder)
├── lib/               # Utilities, API client, mock data, router
├── pages/             # Page-level views
│   ├── LandingPage.tsx
│   ├── ProfileSetupPage.tsx
│   ├── InterviewRoomPage.tsx
│   ├── ReportPage.tsx
│   └── DashboardPage.tsx
├── types.ts           # Shared TypeScript types
├── App.tsx            # Root component with routing
└── main.tsx           # App entry point
```

## How It Works

1. **Upload your resume** — Share your resume and portfolio links so the AI can tailor questions to your background.
2. **Talk to the AI interviewer** — Answer personalized questions by voice at your own pace.
3. **Get your readiness report** — See your score across skills, communication analysis, and a transcript replay.
4. **Follow your learning roadmap** — A week-by-week plan with free resources to close the gaps.

## Who It's For

- Tier-2/3 college students with limited campus placement support
- Self-taught developers building a portfolio
- Non-tech graduates switching careers

## License

This project is private and not licensed for redistribution.
